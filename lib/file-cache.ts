import { promises as fs } from "fs"
import path from "path"

// File-based cache as a more persistent fallback
const CACHE_DIR = path.join(process.cwd(), ".cache")

// Ensure cache directory exists
async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true })
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

export async function getFromFileCache<T>(key: string): Promise<T | null> {
  try {
    await ensureCacheDir()
    const filePath = path.join(CACHE_DIR, `${key.replace(/[^a-zA-Z0-9]/g, "_")}.json`)
    const data = await fs.readFile(filePath, "utf-8")
    const parsed = JSON.parse(data)

    // Check if expired
    if (parsed.expiry < Date.now()) {
      await fs.unlink(filePath).catch(() => {}) // Clean up expired file
      return null
    }

    return parsed.value as T
  } catch (error) {
    return null
  }
}

export async function setFileCache<T>(key: string, value: T, ttl: number): Promise<void> {
  try {
    await ensureCacheDir()
    const filePath = path.join(CACHE_DIR, `${key.replace(/[^a-zA-Z0-9]/g, "_")}.json`)
    const data = {
      value,
      expiry: Date.now() + ttl * 1000,
    }
    await fs.writeFile(filePath, JSON.stringify(data))
  } catch (error) {
    console.error("Error writing to file cache:", error)
  }
}
