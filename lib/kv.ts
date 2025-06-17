// In-memory cache as fallback when KV is not available
const memoryCache: Record<string, { value: any; expiry: number }> = {}

// Cache TTL in seconds
const DEFAULT_TTL = 1800 // 30 minutes

// Check if we're running on the client side
const isClient = typeof window !== "undefined"

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

// Safe import of Vercel KV
let kv: any = null
try {
  // Only import KV in server context to avoid client-side errors
  if (typeof window === "undefined") {
    const vercelKV = require("@vercel/kv")
    kv = vercelKV.kv
  }
} catch (e) {
  console.log("Vercel KV not available, using fallback caching only")
}

// Check if Vercel KV is available and properly configured
const isKVAvailable = () => {
  if (!kv) return false

  try {
    return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN && typeof kv.get === "function")
  } catch (e) {
    return false
  }
}

export async function getFromCache<T>(key: string): Promise<T | null> {
  // Try memory cache first (fastest)
  const memValue = getFromMemoryCache<T>(key)
  if (memValue !== null) {
    return memValue
  }

  // Try Vercel KV if available
  if (isKVAvailable()) {
    try {
      const kvValue = await kv.get<T>(key)
      if (kvValue !== null) {
        // Update memory cache for faster subsequent access
        setMemoryCache(key, kvValue, DEFAULT_TTL)
        return kvValue
      }
    } catch (error) {
      console.error("Error getting from KV cache:", error)
      // Fall through to return null
    }
  }

  return null
}

export async function setCache<T>(key: string, value: T, ttl = DEFAULT_TTL): Promise<void> {
  // Always set in memory cache first (fastest)
  setMemoryCache(key, value, ttl)

  // Try Vercel KV if available
  if (isKVAvailable()) {
    try {
      await kv.set(key, value, { ex: ttl })
    } catch (error) {
      // Just log the error but don't throw - we already have the value in memory cache
      console.error("Error setting KV cache:", error)
    }
  }
}

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl = DEFAULT_TTL,
  forceRefresh = false,
): Promise<T> {
  try {
    // Skip cache if forceRefresh is true
    if (!forceRefresh) {
      // Try to get data from cache first
      const cachedData = await getFromCache<T>(key)

      if (cachedData) {
        console.log(`Cache hit for key: ${key}`)
      } else {
        console.log(`Cache miss for key: ${key}`)
      }

      if (cachedData) {
        return cachedData
      }
    }

    // If not in cache or forceRefresh is true, fetch fresh data
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

// Function to manually invalidate a cache entry
export async function invalidateCache(key: string): Promise<void> {
  // Remove from memory cache
  delete memoryCache[key]

  // Remove from KV if available
  if (isKVAvailable()) {
    try {
      await kv.del(key)
    } catch (error) {
      console.error("Error invalidating KV cache:", error)
    }
  }
}
