import { writeFileSync } from "fs"
import { join } from "path"

const DEBUG_LOG_PATH = join(import.meta.dir, "..", "debug.log")

export function logToFile(message: string): void {
  const logEntry = `${message}\n`
  try {
    writeFileSync(DEBUG_LOG_PATH, logEntry, { flag: "a" })
  } catch (error) {
    console.error("Failed to write to debug log:", error)
  }
}
