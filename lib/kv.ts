// Upstash Redis client setup
import { Redis } from "@upstash/redis"

let redis: Redis | null = null

// Initialize Upstash Redis client
function getRedisClient(): Redis | null {
  if (redis) return redis

  // Only initialize on server side
  if (typeof window !== "undefined") {
    return null
  }

  try {
    const url = process.env.KV_REST_API_URL || process.env.KV_URL
    const token = process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN

    if (!url || !token) {
      console.log("Upstash Redis credentials not found")
      return null
    }

    redis = new Redis({
      url,
      token,
    })

    console.log("✅ Upstash Redis client initialized")
    return redis
  } catch (error) {
    console.error("❌ Failed to initialize Upstash Redis:", error)
    return null
  }
}

// Enhanced in-memory cache as fallback
const memoryCache: Record<string, { value: any; expiry: number; accessCount: number; lastAccess: number }> = {}
const DEFAULT_TTL = 3600 // 1 hour
const MAX_MEMORY_CACHE_SIZE = 200

function getFromMemoryCache<T>(key: string): T | null {
  const item = memoryCache[key]
  if (!item) return null

  if (item.expiry < Date.now()) {
    delete memoryCache[key]
    return null
  }

  item.accessCount++
  item.lastAccess = Date.now()
  return item.value as T
}

function setMemoryCache<T>(key: string, value: T, ttl = DEFAULT_TTL): void {
  const expiry = Date.now() + ttl * 1000

  // LRU eviction if cache is full
  if (Object.keys(memoryCache).length >= MAX_MEMORY_CACHE_SIZE) {
    const entries = Object.entries(memoryCache)
    entries.sort((a, b) => {
      const aScore = a[1].lastAccess + a[1].accessCount * 1000
      const bScore = b[1].lastAccess + b[1].accessCount * 1000
      return aScore - bScore
    })

    const toRemove = Math.floor(entries.length * 0.25)
    for (let i = 0; i < toRemove; i++) {
      delete memoryCache[entries[i][0]]
    }
  }

  memoryCache[key] = {
    value,
    expiry,
    accessCount: 1,
    lastAccess: Date.now(),
  }
}

export async function getFromCache<T>(key: string): Promise<T | null> {
  // Try memory cache first (fastest)
  const memValue = getFromMemoryCache<T>(key)
  if (memValue !== null) {
    return memValue
  }

  // Try Upstash Redis (server-side only)
  if (typeof window === "undefined") {
    const redisClient = getRedisClient()
    if (redisClient) {
      try {
        const redisValue = await redisClient.get<T>(key)
        if (redisValue !== null) {
          // Update memory cache for faster subsequent access
          setMemoryCache(key, redisValue, DEFAULT_TTL)
          return redisValue
        }
      } catch (error) {
        console.error("Upstash Redis get error:", error)
      }
    }
  }

  return null
}

export async function setCache<T>(key: string, value: T, ttl = DEFAULT_TTL): Promise<void> {
  // Always set in memory cache first
  setMemoryCache(key, value, ttl)

  // Set in Upstash Redis (server-side only)
  if (typeof window === "undefined") {
    const redisClient = getRedisClient()
    if (redisClient) {
      try {
        await redisClient.setex(key, ttl, JSON.stringify(value))
      } catch (error) {
        console.error("Upstash Redis set error:", error)
      }
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
    if (!forceRefresh) {
      const cachedData = await getFromCache<T>(key)
      if (cachedData) {
        console.log(`✅ Cache hit for key: ${key}`)
        return cachedData
      }
      console.log(`❌ Cache miss for key: ${key}`)
    }

    console.log(`🔄 Fetching fresh data for key: ${key}`)
    const freshData = await fetchFn()

    await setCache(key, freshData, ttl)
    console.log(`💾 Cached data for key: ${key}`)

    return freshData
  } catch (error) {
    console.error(`❌ Error in getCachedData for key ${key}:`, error)

    // Try to return stale cache data
    const staleData = await getFromCache<T>(key)
    if (staleData) {
      console.log(`⚠️ Returning stale cache data for key: ${key}`)
      return staleData
    }

    return await fetchFn()
  }
}

export async function invalidateCache(key: string): Promise<void> {
  // Remove from memory cache
  delete memoryCache[key]

  // Remove from Upstash Redis (server-side only)
  if (typeof window === "undefined") {
    const redisClient = getRedisClient()
    if (redisClient) {
      try {
        await redisClient.del(key)
      } catch (error) {
        console.error("Error invalidating Upstash Redis cache:", error)
      }
    }
  }
}

export function getCacheStats() {
  const memoryEntries = Object.keys(memoryCache).length
  const totalAccesses = Object.values(memoryCache).reduce((sum, item) => sum + item.accessCount, 0)

  let redisAvailable = false
  if (typeof window === "undefined") {
    const redisClient = getRedisClient()
    redisAvailable = !!redisClient
  }

  return {
    memoryEntries,
    totalAccesses,
    redisAvailable,
    maxSize: MAX_MEMORY_CACHE_SIZE,
    provider: "Upstash Redis",
  }
}
