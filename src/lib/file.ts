import type { Abortable } from "events"
import type { Mode, ObjectEncodingOptions, OpenMode } from "fs"
import { mkdir, readFile, rename, rm, writeFile } from "fs/promises"
import { getErrorCode, getErrorMessage } from "./error"
import lockfile from 'proper-lockfile'
import { dirname } from "path"



/**
 * 
 * @param path Path relative to process.cwd()
 */
export async function read(path: string, encoding: BufferEncoding = "utf-8", opts?: {
  flag?: OpenMode | undefined,
} & Abortable) {
  try {
    const data = await readFile(path, { encoding: encoding, ...opts, })
    return { status: "ok" as const, data }
  } catch (error) {
    // console.log(getErrorCode(error))
    // console.log(getErrorMessage(error))
    if (getErrorMessage(error).includes("ENOENT")) {
      return { status: "enoent" as const, message: `File not found: ${ path }` }
    }
    return { status: "error" as const, error }
  }
}

export async function write(path: string, data: string, encoding: BufferEncoding = "utf-8", opts?: {
  mode?: Mode | undefined
  flag?: OpenMode | undefined
  flush?: boolean | undefined
} & Abortable) {
  try {
    const rng = Math.random().toString(16).slice(2)
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path + `.${ rng }.tmp`, data, { encoding, ...opts })
    await rename(path + `.${ rng }.tmp`, path)
    return { status: "ok" as const }
  } catch (error) {
    return { status: "error" as const, error }
  }
}

export async function deleteFile(path: string) {
  if (path.includes('..')) throw new Error("Path traversal is not allowed")
  if (!path.startsWith("./src/data/cache/")) throw new Error("Only files in ./src/data/cache/ can be deleted")
  try {
    await rm(path, { force: true })
    return { status: "ok" as const }
  } catch (error) {
    return { status: "error" as const, error }
  }
}


// JSON.db read/write

export async function updateJSON<T>(
  path: string,
  updater: (prev: T) => T,
) {
  const release = await lockfile.lock(path, {
    retries: {
      maxRetryTime: 2500, // maximum time to retry acquiring the lock,
      retries: 10, // number of retry attempts
      minTimeout: 10, // minimum time to wait between retries
    },
  })

  try {
    const content = await readFile(path, 'utf-8')
    const data = JSON.parse(content)
    const newData = updater(data)
    const newContent = JSON.stringify(newData, null, 2)
    await writeFile(path, newContent)
  } finally {
    await release() // release lock
  }
}











