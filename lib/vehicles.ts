export interface Vehicle {
  id: string
  vin: string
  make: string
  model: string
  year: number
  ownerWallet: string
  manufacturerWallet: string
  currentOwner: string
  status: "manufactured" | "in_transit" | "sold" | "in_service" | "retired"
  createdAt: Date
  updatedAt: Date
  metadata: Record<string, any>
}

export interface VehicleRecord {
  id: string
  vehicleId: string
  recordType: "damage" | "service" | "ownership_transfer" | "inspection" | "insurance_claim"
  recordedBy: string
  timestamp: Date
  details: Record<string, any>
  blockchainHash?: string
}

// In-memory storage (replace with database in production)
const vehicles = new Map<string, Vehicle>()
const vehicleRecords = new Map<string, VehicleRecord[]>()

export function registerVehicle(
  vin: string,
  make: string,
  model: string,
  year: number,
  manufacturerWallet: string,
  metadata: Record<string, any> = {},
): Vehicle {
  const vehicle: Vehicle = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    vin,
    make,
    model,
    year,
    ownerWallet: manufacturerWallet.toLowerCase(),
    manufacturerWallet: manufacturerWallet.toLowerCase(),
    currentOwner: manufacturerWallet.toLowerCase(),
    status: "manufactured",
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata,
  }
  vehicles.set(vehicle.id, vehicle)
  vehicleRecords.set(vehicle.id, [])
  return vehicle
}

export function getVehicle(vehicleId: string): Vehicle | undefined {
  return vehicles.get(vehicleId)
}

export function getVehicleByVIN(vin: string): Vehicle | undefined {
  return Array.from(vehicles.values()).find((v) => v.vin === vin)
}

export function getVehiclesByOwner(ownerWallet: string): Vehicle[] {
  return Array.from(vehicles.values()).filter((v) => (v.currentOwner || "").toLowerCase() === ownerWallet.toLowerCase())
}

// Seed demo vehicles when the in-memory store is empty (developer convenience)
;(function seedDemoVehiclesIfEmpty() {
  try {
    if (vehicles.size > 0) return

    const demoManufacturers = [
      "0xDEMO000000000000000000000000000000000001",
      "0xDEMO000000000000000000000000000000000002",
      "0xDEMO000000000000000000000000000000000003",
    ]

    const sampleMakes = ["Tesla", "BMW", "Audi", "Toyota", "Ford"]
    const sampleModels = ["Model 3", "X5", "A4", "Corolla", "F-150"]

    function randomVIN() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let out = ''
      for (let i = 0; i < 17; i++) out += chars[Math.floor(Math.random() * chars.length)]
      return out
    }

    const now = Date.now()
    for (let i = 0; i < 6; i++) {
      const make = sampleMakes[i % sampleMakes.length]
      const model = sampleModels[i % sampleModels.length]
      const vin = `${make.substring(0,3).toUpperCase()}-${randomVIN().slice(0,8)}-${i}`
      const year = 2023 + (i % 3)
      const manuf = demoManufacturers[i % demoManufacturers.length]
      const v = registerVehicle(vin, make, model, year, manuf, { demo: true })
      // backdate a little for display variety
      v.createdAt = new Date(now - i * 24 * 60 * 60 * 1000)
      v.updatedAt = new Date(now - i * 24 * 60 * 60 * 1000)
      vehicles.set(v.id, v)
    }
  } catch (err) {
    // non-fatal; seeding is best-effort
    console.warn('Demo vehicle seeding failed:', err)
  }
})()

export function transferVehicleOwnership(
  vehicleId: string,
  newOwnerWallet: string,
  transferredBy: string,
): Vehicle | null {
  const vehicle = vehicles.get(vehicleId)
  if (!vehicle) return null

  vehicle.ownerWallet = newOwnerWallet.toLowerCase()
  vehicle.currentOwner = newOwnerWallet.toLowerCase()
  vehicle.updatedAt = new Date()
  vehicles.set(vehicleId, vehicle)

  addVehicleRecord(vehicleId, "ownership_transfer", transferredBy, {
    previousOwner: vehicle.ownerWallet,
    newOwner: newOwnerWallet.toLowerCase(),
  })

  return vehicle
}

export function updateVehicleStatus(vehicleId: string, status: Vehicle["status"], updatedBy: string): Vehicle | null {
  const vehicle = vehicles.get(vehicleId)
  if (!vehicle) return null

  vehicle.status = status
  vehicle.updatedAt = new Date()
  vehicles.set(vehicleId, vehicle)

  addVehicleRecord(vehicleId, "inspection", updatedBy, { newStatus: status })

  return vehicle
}

export function addVehicleRecord(
  vehicleId: string,
  recordType: VehicleRecord["recordType"],
  recordedBy: string,
  details: Record<string, any>,
): VehicleRecord {
  const record: VehicleRecord = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    vehicleId,
    recordType,
    recordedBy,
    timestamp: new Date(),
    details,
  }

  const records = vehicleRecords.get(vehicleId) || []
  records.push(record)
  vehicleRecords.set(vehicleId, records)

  return record
}

export function getVehicleHistory(vehicleId: string): VehicleRecord[] {
  return vehicleRecords.get(vehicleId) || []
}
