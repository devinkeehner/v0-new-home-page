import { getFromFileCache, setFileCache } from "./file-cache"

// Enhanced in-memory cache with better management
const memoryCache: Record<string, { value: any; expiry: number; accessCount: number; lastAccess: number }> = {}

// Cache TTL in seconds
const DEFAULT_TTL = 3600 // 1 hour

// Enhanced memory cache with LRU-like behavior
const MAX_MEMORY_CACHE_SIZE = 200 // Increased cache size

function getFromMemoryCache<T>(key: string): T | null {
  const item = memoryCache[key]
  if (!item) return null

  // Check if expired
  if (item.expiry < Date.now()) {
    delete memoryCache[key]
    return null
  }

  // Update access statistics for LRU
  item.accessCount++
  item.lastAccess = Date.now()

  return item.value as T
}

function setMemoryCache<T>(key: string, value: T, ttl = DEFAULT_TTL): void {
  const expiry = Date.now() + ttl * 1000

  // If cache is getting too large, remove least recently used entries
  if (Object.keys(memoryCache).length >= MAX_MEMORY_CACHE_SIZE) {
    const entries = Object.entries(memoryCache)
    // Sort by last access time (oldest first) and access count (least used first)
    entries.sort((a, b) => {
      const aScore = a[1].lastAccess + a[1].accessCount * 1000
      const bScore = b[1].lastAccess + b[1].accessCount * 1000
      return aScore - bScore
    })

    // Remove oldest 25% of entries
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

// Safe import of Vercel KV - but we'll make it optional
let kv: any = null
let kvAvailable = false

try {
  if (typeof window === "undefined") {
    const vercelKV = require("@vercel/kv")
    kv = vercelKV.kv

    // Test KV availability
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      kvAvailable = true
      console.log("KV Redis is available")
    } else {
      console.log("KV Redis environment variables not found")
    }
  }
} catch (e) {
  console.log("Vercel KV not available, using enhanced fallback caching")
}

export async function getFromCache<T>(key: string): Promise<T | null> {
  // Try memory cache first (fastest)
  const memValue = getFromMemoryCache<T>(key)
  if (memValue !== null) {
    return memValue
  }

  // Try Vercel KV if available
  if (kvAvailable && kv) {
    try {
      const kvValue = await kv.get<T>(key)
      if (kvValue !== null) {
        // Update memory cache for faster subsequent access
        setMemoryCache(key, kvValue, DEFAULT_TTL)
        return kvValue
      }
    } catch (error) {
      console.error("KV cache error, falling back:", error)
      kvAvailable = false // Disable KV for this session
    }
  }

  // Try file cache as final fallback
  const fileValue = await getFromFileCache<T>(key)
  if (fileValue !== null) {
    // Update memory cache for faster subsequent access
    setMemoryCache(key, fileValue, DEFAULT_TTL)
    return fileValue
  }

  return null
}

export async function setCache<T>(key: string, value: T, ttl = DEFAULT_TTL): Promise<void> {
  // Always set in memory cache first (fastest)
  setMemoryCache(key, value, ttl)

  // Try Vercel KV if available
  if (kvAvailable && kv) {
    try {
      await kv.set(key, value, { ex: ttl })
    } catch (error) {
      console.error("Error setting KV cache, disabling for session:", error)
      kvAvailable = false
    }
  }

  // Always set file cache as backup
  await setFileCache(key, value, ttl)
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
      const cachedData = await getFromCache<T>(key)

      if (cachedData) {
        console.log(`✅ Cache hit for key: ${key}`)
        return cachedData
      } else {
        console.log(`❌ Cache miss for key: ${key}`)
      }
    }

    // Fetch fresh data
    console.log(`🔄 Fetching fresh data for key: ${key}`)
    const freshData = await fetchFn()

    // Store in all available caches
    await setCache(key, freshData, ttl)
    console.log(`💾 Cached data for key: ${key}`)

    return freshData
  } catch (error) {
    console.error(`❌ Error in getCachedData for key ${key}:`, error)

    // Try to return stale cache data if available
    const staleData = await getFromCache<T>(key)
    if (staleData) {
      console.log(`⚠️ Returning stale cache data for key: ${key}`)
      return staleData
    }

    // If all else fails, try the fetch function one more time
    return await fetchFn()
  }
}

// Function to manually invalidate a cache entry
export async function invalidateCache(key: string): Promise<void> {
  // Remove from memory cache
  delete memoryCache[key]

  // Remove from KV if available
  if (kvAvailable && kv) {
    try {
      await kv.del(key)
    } catch (error) {
      console.error("Error invalidating KV cache:", error)
    }
  }

  // Remove from file cache
  try {
    const fs = require("fs").promises
    const path = require("path")
    const filePath = path.join(process.cwd(), ".cache", `${key.replace(/[^a-zA-Z0-9]/g, "_")}.json`)
    await fs.unlink(filePath)
  } catch (error) {
    // File might not exist, ignore error
  }
}

// Get cache statistics
export function getCacheStats() {
  const memoryEntries = Object.keys(memoryCache).length
  const totalAccesses = Object.values(memoryCache).reduce((sum, item) => sum + item.accessCount, 0)

  return {
    memoryEntries,
    totalAccesses,
    kvAvailable,
    maxSize: MAX_MEMORY_CACHE_SIZE,
  }
}
