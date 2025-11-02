import { createClient } from "@supabase/supabase-js"

export interface User {
  id: string
  walletAddress: string
  email?: string
  role: "customer" | "manufacturer" | "dealer" | "insurance" | "service" | "rto"
  createdAt: Date
  lastLogin?: Date
}

export interface AuthToken {
  token: string
  expiresAt: Date
}

// Create Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "⚠️  Missing Supabase environment variables!\n" +
      "Please create a .env.local file with:\n" +
      "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url\n" +
      "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key\n" +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
  )
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function createUser(walletAddress: string, role: User["role"], email?: string): Promise<User> {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file"
    )
  }

  const now = new Date()

  const { data, error } = await supabase
    .from("users")
    .insert({
      wallet_address: walletAddress.toLowerCase(),
      email,
      role,
      is_active: true,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  if (error) {
    console.error("Supabase error creating user:", error)
    throw new Error(`Failed to create user: ${error.message}`)
  }

  return {
    id: data.id,
    walletAddress: data.wallet_address,
    email: data.email,
    role: data.role,
    createdAt: new Date(data.created_at),
    lastLogin: data.last_login ? new Date(data.last_login) : undefined,
  }
}

export async function getUserByWallet(walletAddress: string): Promise<User | undefined> {
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase is not configured")
    return undefined
  }

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("wallet_address", walletAddress.toLowerCase())
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user:", error)
    return undefined
  }

  if (!data) return undefined

  return {
    id: data.id,
    walletAddress: data.wallet_address,
    email: data.email,
    role: data.role,
    createdAt: new Date(data.created_at),
    lastLogin: data.last_login ? new Date(data.last_login) : undefined,
  }
}

export async function getUserById(userId: string): Promise<User | undefined> {
  const { data, error } = await supabase.from("users").select().eq("id", userId).single()

  if (error) {
    console.error("Error fetching user by ID:", error)
    return undefined
  }

  return {
    id: data.id,
    walletAddress: data.wallet_address,
    email: data.email,
    role: data.role,
    createdAt: new Date(data.created_at),
    lastLogin: data.last_login ? new Date(data.last_login) : undefined,
  }
}

export async function createSession(
  userId: string,
  token: string,
  expiresIn: number = 7 * 24 * 60 * 60 * 1000,
): Promise<AuthToken> {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file"
    )
  }

  const expiresAt = new Date(Date.now() + expiresIn)

  const { error } = await supabase.from("sessions").insert({
    token,
    user_id: userId,
    expires_at: expiresAt,
    created_at: new Date(),
  })

  if (error) {
    console.error("Supabase error creating session:", error)
    throw new Error(`Failed to create session: ${error.message}`)
  }

  return { token, expiresAt }
}

export async function validateSession(token: string): Promise<string | null> {
  const { data, error } = await supabase.from("sessions").select("user_id, expires_at").eq("token", token).single()

  if (error || !data) return null

  const expiresAt = new Date(data.expires_at)
  if (expiresAt < new Date()) {
    // Token expired, delete it
    await supabase.from("sessions").delete().eq("token", token)
    return null
  }

  return data.user_id
}

export async function revokeSession(token: string): Promise<void> {
  await supabase.from("sessions").delete().eq("token", token)
}
