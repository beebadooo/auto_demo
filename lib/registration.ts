import crypto from "crypto"

export interface RegistrationIntent {
  id: string
  salt: string
  vin: string
  make: string
  model: string
  year: number
  signerAddress: string
  createdAt: Date
}

const intents = new Map<string, RegistrationIntent>()

export function createRegistrationIntent(payload: {
  vin: string
  make: string
  model: string
  year: number
  signerAddress: string
}): RegistrationIntent {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const salt = crypto.randomBytes(16).toString("hex")
  const intent: RegistrationIntent = {
    id,
    salt,
    vin: payload.vin,
    make: payload.make,
    model: payload.model,
    year: payload.year,
    signerAddress: payload.signerAddress,
    createdAt: new Date(),
  }

  intents.set(id, intent)
  return intent
}

export function consumeRegistrationIntent(id: string): RegistrationIntent | undefined {
  const intent = intents.get(id)
  if (!intent) return undefined
  intents.delete(id)
  return intent
}
