// POST /api/vehicles/register - Register a new vehicle
import { type NextRequest, NextResponse } from "next/server"
import { registerVehicle } from "@/lib/vehicles"
import { registerVehicleOnChain } from "@/lib/blockchain"
import crypto from "crypto"
import { validateSession, getUserById, getUserByWallet } from "@/lib/auth"
import { ethers } from "ethers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vin, make, model, year, signature, signerAddress } = body

    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    let user

    if (token) {
      const userId = await validateSession(token)
      if (!userId) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      }

      user = await getUserById(userId)
      if (!user) {
        return NextResponse.json({ error: "Invalid user" }, { status: 401 })
      }
    } else if (signature && signerAddress) {
      // Verify signature of the minimal payload
      const message = JSON.stringify({ vin, make, model, year })
      try {
        // ethers v6: verifyMessage is a top-level function
        const recovered = ethers.verifyMessage(message, signature)
        if (recovered.toLowerCase() !== signerAddress.toLowerCase()) {
          return NextResponse.json({ error: "Signature mismatch" }, { status: 401 })
        }
      } catch (err) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
      }

      user = await getUserByWallet(signerAddress)
      if (!user) {
        return NextResponse.json({ error: "Unknown wallet address" }, { status: 401 })
      }
    } else {
      return NextResponse.json({ error: "Missing authorization token or wallet signature" }, { status: 401 })
    }

    if (!vin || !make || !model || !year) {
      return NextResponse.json({ error: "Missing required fields: vin, make, model, year" }, { status: 400 })
    }

    // If client already submitted an on-chain transaction, use the provided onChainVin and txHash
    let blockchainMeta: { hash: string; txHash: string } | null = null
    const { txHash, onChainVin } = body as any

    if (txHash && onChainVin) {
      // Verify the transaction on-chain: ensure it's mined, successful, from the expected contract
      const rpcUrl = process.env.BLOCKCHAIN_RPC_URL
      const contractAddress = process.env.CAR_REGISTRY_ADDRESS || process.env.NEXT_PUBLIC_CAR_REGISTRY_ADDRESS

      if (!rpcUrl || !contractAddress) {
        return NextResponse.json(
          { error: "Server misconfigured: BLOCKCHAIN_RPC_URL and CAR_REGISTRY_ADDRESS are required to verify transactions" },
          { status: 500 },
        )
      }

  // ethers v6: JsonRpcProvider is a top-level export
  const provider = new ethers.JsonRpcProvider(rpcUrl)

      // normalize txHash
      const txHashNorm = txHash.startsWith("0x") ? txHash : `0x${txHash}`
      const receipt = await provider.getTransactionReceipt(txHashNorm)
      if (!receipt) {
        return NextResponse.json({ error: "Transaction not found or not yet mined" }, { status: 400 })
      }
      if (receipt.status !== 1) {
        return NextResponse.json({ error: "Transaction failed" }, { status: 400 })
      }

      // Parse logs for CarRegistered event emitted by the contract
      // ethers v6: Interface is a top-level export
      const iface = new ethers.Interface([
        "event CarRegistered(uint256 indexed carId, string vin, address indexed manufacturer)",
      ])

  const matchedLog = receipt.logs.find((log: any) => log.address.toLowerCase() === contractAddress.toLowerCase())
      let found = false
      if (matchedLog) {
        try {
          const parsed = iface.parseLog(matchedLog)
          if (parsed && parsed.name === "CarRegistered") {
            const emittedVin: string = parsed.args[1]
            const emittedManufacturer: string = parsed.args[2]

            // Normalize expected digest to 0x-prefixed sha256 using ethers v6
            const expectedDigest = ethers.sha256(new TextEncoder().encode(JSON.stringify({ vin, make, model, year })))

            if (emittedVin !== onChainVin && emittedVin !== expectedDigest) {
              return NextResponse.json({ error: "On-chain VIN does not match expected digest" }, { status: 400 })
            }

            if (emittedManufacturer.toLowerCase() !== user.walletAddress.toLowerCase()) {
              return NextResponse.json({ error: "Manufacturer address in tx does not match registered manufacturer" }, { status: 400 })
            }

            found = true
            blockchainMeta = { hash: onChainVin, txHash: txHashNorm }
          }
        } catch (err) {
          // If parse failed, continue to fallback
        }
      }

      if (!found) {
        return NextResponse.json({ error: "No valid CarRegistered event found in transaction logs" }, { status: 400 })
      }
    } else {
      // Compute a privacy-preserving hash of the minimal vehicle data to store on-chain
      // We avoid storing raw VIN or personally-identifying data on-chain.
      const payloadToHash = JSON.stringify({ vin, make, model, year })
      const hash = crypto.createHash("sha256").update(payloadToHash).digest("hex")

      // Register the hash on-chain (stubbed helper). Replace with real contract interaction.
      const onChain = await registerVehicleOnChain(hash, user.walletAddress)

      blockchainMeta = { hash: onChain.blockchainHash, txHash: onChain.txHash }
    }

    const vehicle = registerVehicle(vin, make, model, year, user.walletAddress, {
      blockchain: blockchainMeta,
    })

    return NextResponse.json(
      {
        success: true,
        vehicle: {
          id: vehicle.id,
          vin: vehicle.vin,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          status: vehicle.status,
          createdAt: vehicle.createdAt,
          blockchain: vehicle.metadata?.blockchain ?? null,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Vehicle registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
