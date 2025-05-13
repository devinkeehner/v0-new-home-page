import { kv } from "@vercel/kv"

// Cache TTL in seconds
const DEFAULT_TTL = 300 // 5 minutes

// In-memory cache as fallback when KV is not available
const memoryCache: Record<string, { value: any; expiry: number }> = {}

// Check if Vercel KV is available
const isKVAvailable = () => {
  try {
    return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  } catch (e) {
    return false
  }
}

// Get from memory cache
function getFromMemoryCache<T>(key: string): T | null {
  const item = memoryCache[key]
  if (!item) return null

  // Check if expired
  if (item.expiry < Date.now()) {
    delete memoryCache[key]
    return null
  }

  return item.value as T
}

// Set to memory cache
function setMemoryCache<T>(key: string, value: T, ttl = DEFAULT_TTL): void {
  const expiry = Date.now() + ttl * 1000
  memoryCache[key] = { value, expiry }

  // Clean up old entries occasionally
  if (Math.random() < 0.1) {
    // 10% chance to clean up
    const now = Date.now()
    Object.keys(memoryCache).forEach((k) => {
      if (memoryCache[k].expiry < now) {
        delete memoryCache[k]
      }
    })
  }
}

// Get from browser localStorage (client-side only)
function getFromLocalStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null

  try {
    const item = localStorage.getItem(`cache:${key}`)
    if (!item) return null

    const parsed = JSON.parse(item)

    // Check if expired
    if (parsed.expiry < Date.now()) {
      localStorage.removeItem(`cache:${key}`)
      return null
    }

    return parsed.value as T
  } catch (e) {
    console.error("Error reading from localStorage:", e)
    return null
  }
}

// Set to browser localStorage (client-side only)
function setLocalStorage<T>(key: string, value: T, ttl = DEFAULT_TTL): void {
  if (typeof window === "undefined") return

  try {
    const item = {
      value,
      expiry: Date.now() + ttl * 1000,
    }
    localStorage.setItem(`cache:${key}`, JSON.stringify(item))
  } catch (e) {
    console.error("Error writing to localStorage:", e)
  }
}

export async function getFromCache<T>(key: string): Promise<T | null> {
  // Try Vercel KV first if available
  if (isKVAvailable()) {
    try {
      return await kv.get<T>(key)
    } catch (error) {
      console.error("Error getting from KV cache:", error)
      // Fall through to fallbacks
    }
  }

  // Try memory cache next
  const memValue = getFromMemoryCache<T>(key)
  if (memValue !== null) {
    return memValue
  }

  // Try localStorage last (client-side only)
  return getFromLocalStorage<T>(key)
}

export async function setCache<T>(key: string, value: T, ttl = DEFAULT_TTL): Promise<void> {
  // Try Vercel KV first if available
  if (isKVAvailable()) {
    try {
      await kv.set(key, value, { ex: ttl })
      return
    } catch (error) {
      console.error("Error setting KV cache:", error)
      // Fall through to fallbacks
    }
  }

  // Set in memory cache
  setMemoryCache(key, value, ttl)

  // Also set in localStorage (client-side only)
  setLocalStorage(key, value, ttl)
}

export async function getCachedData<T>(key: string, fetchFn: () => Promise<T>, ttl = DEFAULT_TTL): Promise<T> {
  try {
    // Try to get data from cache first
    const cachedData = await getFromCache<T>(key)

    if (cachedData) {
      console.log(`Cache hit for key: ${key}`)
      return cachedData
    }

    // If not in cache, fetch fresh data
    console.log(`Cache miss for key: ${key}, fetching fresh data`)
    const freshData = await fetchFn()

    // Store in cache for next time
    await setCache(key, freshData, ttl)

    return freshData
  } catch (error) {
    console.error(`Error in getCachedData for key ${key}:`, error)
    // If cache operations fail, just return the fresh data
    return await fetchFn()
  }
}
