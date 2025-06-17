// Upstash Redis client setup
import { Redis } from "@upstash/redis"

let redis: Redis | null = null
let initializationAttempted = false

// Initialize Upstash Redis client
function getRedisClient(): Redis | null {
  if (redis) return redis
  if (initializationAttempted) return null

  // Only initialize on server side
  if (typeof window !== "undefined") {
    return null
  }

  initializationAttempted = true

  try {
    // Check multiple possible environment variable names
    const url =
      process.env.KV_REST_API_URL || process.env.KV_REST_API_URL || process.env.KV_URL || process.env.REDIS_URL

    const token =
      process.env.KV_REST_API_TOKEN ||
      process.env.KV_REST_API_TOKEN ||
      process.env.KV_REST_API_READ_ONLY_TOKEN ||
      process.env.REDIS_TOKEN

    console.log("🔍 Checking Redis environment variables:")
    console.log("URL found:", !!url)
    console.log("Token found:", !!token)
    console.log(
      "Available env vars:",
      Object.keys(process.env).filter((key) => key.includes("KV") || key.includes("REDIS") || key.includes("UPSTASH")),
    )

    if (!url || !token) {
      console.log("❌ Upstash Redis credentials not found")
      console.log("Expected: KV_REST_API_URL and KV_REST_API_TOKEN")
      return null
    }

    redis = new Redis({
      url,
      token,
    })

    console.log("✅ Upstash Redis client initialized successfully")
    console.log("URL:", url.substring(0, 30) + "...")
    return redis
  } catch (error) {
    console.error("❌ Failed to initialize Upstash Redis:", error)
    return null
  }
}

// Test Redis connection
async function testRedisConnection(): Promise<boolean> {
  const client = getRedisClient()
  if (!client) return false

  try {
    await client.ping()
    console.log("✅ Redis connection test successful")
    return true
  } catch (error) {
    console.error("❌ Redis connection test failed:", error)
    return false
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
    console.log(`🎯 Memory cache hit for: ${key}`)
    return memValue
  }

  // Try Upstash Redis
  const redisClient = getRedisClient()
  if (redisClient) {
    try {
      const redisValue = await redisClient.get<T>(key)
      if (redisValue !== null) {
        console.log(`🎯 Redis cache hit for: ${key}`)
        // Update memory cache for faster subsequent access
        setMemoryCache(key, redisValue, DEFAULT_TTL)
        return redisValue
      }
    } catch (error) {
      console.error(`❌ Redis get error for key ${key}:`, error)
    }
  }

  return null
}

export async function setCache<T>(key: string, value: T, ttl = DEFAULT_TTL): Promise<void> {
  // Always set in memory cache first
  setMemoryCache(key, value, ttl)
  console.log(`💾 Set memory cache for: ${key}`)

  // Set in Upstash Redis
  const redisClient = getRedisClient()
  if (redisClient) {
    try {
      await redisClient.setex(key, ttl, JSON.stringify(value))
      console.log(`💾 Set Redis cache for: ${key}`)
    } catch (error) {
      console.error(`❌ Redis set error for key ${key}:`, error)
    }
  } else {
    console.log(`⚠️ Redis not available, using memory cache only for: ${key}`)
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

  // Remove from Upstash Redis
  const redisClient = getRedisClient()
  if (redisClient) {
    try {
      await redisClient.del(key)
      console.log(`🗑️ Invalidated Redis cache for: ${key}`)
    } catch (error) {
      console.error("Error invalidating Upstash Redis cache:", error)
    }
  }
}

export async function getCacheStats() {
  const memoryEntries = Object.keys(memoryCache).length
  const totalAccesses = Object.values(memoryCache).reduce((sum, item) => sum + item.accessCount, 0)
  const redisClient = getRedisClient()
  const redisAvailable = !!redisClient

  // Test Redis connection
  let redisConnected = false
  if (redisClient) {
    redisConnected = await testRedisConnection()
  }

  return {
    memoryEntries,
    totalAccesses,
    redisAvailable,
    redisConnected,
    maxSize: MAX_MEMORY_CACHE_SIZE,
    provider: "Upstash Redis",
    environmentVariables: {
      KV_REST_API_URL: !!process.env.KV_REST_API_URL,
      KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
      KV_URL: !!process.env.KV_URL,
      UPSTASH_REDIS_REST_URL: !!process.env.KV_REST_API_URL,
      UPSTASH_REDIS_REST_TOKEN: !!process.env.KV_REST_API_TOKEN,
    },
  }
}
