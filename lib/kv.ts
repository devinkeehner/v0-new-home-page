import { kv } from "@vercel/kv"

// Cache TTL in seconds
const DEFAULT_TTL = 300 // 5 minutes

export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    return await kv.get<T>(key)
  } catch (error) {
    console.error("Error getting from cache:", error)
    return null
  }
}

export async function setCache<T>(key: string, value: T, ttl = DEFAULT_TTL): Promise<void> {
  try {
    await kv.set(key, value, { ex: ttl })
  } catch (error) {
    console.error("Error setting cache:", error)
  }
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
