// WIP: Fetch and statically cache the result to repo.

import { rm, rmdir } from 'fs/promises'
import { delay } from './delay'
import { deleteFile, read, write } from './file'
import { black, reset } from './ansii'

// --- types ---
type StaticCacheResult =
  | { data: string, status: "hit" }
  | { data: string, status: "miss", reason: "not found", writeErr?: unknown }
  | { data: string, status: "miss", reason: "read error", readErr: unknown, writeErr?: unknown }

// --- constants ---
const getCachePath = (filepathname: `${ string }`) => `./src/data/cache/${ filepathname }`



export async function removeCache(
  filepathname: `${ string }`
) {
  // --- init ---
  const cachePath = getCachePath(filepathname)
  // --- run ---
  return await deleteFile(cachePath)
}


export async function writeCache(
  filepathname: `${ string }`,
  data: string,
) {
  // --- init ---
  const cachePath = getCachePath(filepathname)
  // --- run ---
  const wres = await write(cachePath, data)
  if (wres.status === "error")
    return { status: "error" as const, error: wres.error }
  return { status: "ok" as const }
}

export async function checkCache(
  filepathname: `${ string }`,
) {
  // --- init ---
  const cachePath = getCachePath(filepathname)
  // --- run ---
  const res = await read(cachePath)
  if (res.status === "ok")
    return { status: "hit" as const, data: res.data }
  return {
    status: "miss" as const, miss: res.status === "enoent" ?
      { reason: "not found" as const } :
      { reason: "read error" as const, readErr: res.error }
  }
}


export async function getOrComputeDiskValue(
  filepathname: `${ string }`,
  getData: () => Promise<string>,
): Promise<StaticCacheResult> {
  const checkRes = await checkCache(filepathname)
  if (checkRes.status === "hit")
    return checkRes
  const data = await getData()
  const writeRes = await writeCache(filepathname, data)
  if (writeRes.status === "error")
    return { data, status: "miss" as const, ...checkRes.miss, writeErr: writeRes.error }
  return { data, status: "miss" as const, ...checkRes.miss }
}





export async function test_1000StaticCache() {
  // Tests the static cache function.
  // 1. runs 1000 times each with random key and value.
  // 2. resolve at same time to test concurrency.
  // 3. re-fetch and check if the value is cached. (also time to compare the difference)
  // 4. clean up the cache files.
  const length = 1000
  const values = Array
    .from({ length }, (_, i) => i)
    .map(i => {
      const path = `test/key-${ i }`
      const value = `value-${ Math.random() }`
      return { path, value }
    })

  console.time("writeToCache")
  await Promise.all(values.map(({ path, value }) => getOrComputeDiskValue(path, async () => value)))
  console.timeEnd("writeToCache")

  console.time("readFromCache")
  const res = await Promise.all(values.map(({ path, value }) => getOrComputeDiskValue(path, async () => { throw new Error("Should not fetch") })))
  console.timeEnd("readFromCache")

  // Checking if all values are cached correctly.
  res.forEach((r, i) => {
    if (r.status !== "hit") {
      console.error(`Value for ${ values[ i ].path } is not cached.`, r)
    } else if (r.data !== values[ i ].value) {
      console.error(`Value for ${ values[ i ].path } is incorrect. Expected: ${ values[ i ].value }, Got: ${ r.data }`)
    }
  })

  await Promise.all(values.map(({ path }) => removeCache(path)))
}




// ---------
type Duration = `${ number }ms` | `${ number }s` | `${ number }m` | `${ number }h` | `${ number }d`
function durationToMs(duration: Duration): number {
  const match = duration.match(/^(\d+)(ms|s|m|h|d)$/)
  if (!match) throw new Error(`Invalid duration format: ${ duration }`)
  const value = parseInt(match[ 1 ])
  const unit = match[ 2 ]
  switch (unit) {
    case "ms": return value
    case "s": return value * 1000
    case "m": return value * 60 * 1000
    case "h": return value * 60 * 60 * 1000
    case "d": return value * 24 * 60 * 60 * 1000
    default: throw new Error(`Invalid duration unit: ${ unit }`)
  }
}
function durationToEpoch(duration: Duration, now: number): number {
  return now + durationToMs(duration)
}

type fileCacheReturn<I> =
  | { data: I, status: "hit", meta: TimingMeta }
  | { data: I, status: "stale", meta: TimingMeta }
  | { data: I, status: "miss", meta: TimingMeta, reason: "not found", writeErr?: unknown }
  | { data: I, status: "miss", meta: TimingMeta, reason: "read error", readErr: unknown, writeErr?: unknown }
  | { data: I, status: "miss", meta: TimingMeta, reason: "parse error", parseErr: unknown, writeErr?: unknown }
  | { data: I, status: "miss", meta: TimingMeta, reason: "expired", writeErr?: unknown }
  | { data: I, status: "error", meta: TimingMeta, reason: "expired and failed fetch", err: unknown }

type TimingMeta = {
  createdAt: Date, staleAt: Date, expiryAt: Date, now: Date,
}
type CacheData = {
  data: string, createdAt: number, staleAt: number, expiryAt: number
}
type GetterData<T> = {
  data: T, createdAt: number, staleAt: number, expiryAt: number
}
function isCacheData(data: any): data is CacheData {
  return typeof data === "object" && data !== null &&
    "data" in data && typeof data.data === "string" &&
    "createdAt" in data && typeof data.createdAt === "number" &&
    "staleAt" in data && typeof data.staleAt === "number" &&
    "expiryAt" in data && typeof data.expiryAt === "number"
}


export function fileCache<I>(
  filepathname: `${ string }`,
  getData: () => Promise<I>,
  opts: {
    stale?: Duration,
    expiry?: Duration,
    serialize: (data: I) => string,
    deserialize: (data: string) => I,
    log?: boolean,
  }
) {
  // --- init ---
  const staleDuration = opts.stale ?? (process.env.NODE_ENV === "development" ? "5m" : "1d")
  const expiryDuration = opts.expiry ?? (process.env.NODE_ENV === "development" ? "10m" : "7d")
  const usingLog = opts.log ?? true
  const createdAt = Date.now()
  const staleAt = durationToEpoch(staleDuration, createdAt)
  const expiryAt = durationToEpoch(expiryDuration, createdAt)
  if (staleAt >= expiryAt) throw new Error(`Stale duration must be less than expiry duration. Got stale: ${ staleDuration }, expiry: ${ expiryDuration }`)

  async function getter() {
    const res = await getData()
    const createdAt = Date.now()
    const staleAt = durationToEpoch(staleDuration, createdAt)
    const expiryAt = durationToEpoch(expiryDuration, createdAt)
    const getterData = { data: res, createdAt, staleAt, expiryAt }
    const writeRes = await writeCache(filepathname, JSON.stringify({
      data: opts.serialize(getterData.data),
      createdAt: getterData.createdAt,
      staleAt: getterData.staleAt,
      expiryAt: getterData.expiryAt,
    } satisfies CacheData))
    const meta = {
      createdAt: new Date(getterData.createdAt),
      staleAt: new Date(getterData.staleAt),
      expiryAt: new Date(getterData.expiryAt),
      now: new Date(),
    }
    return {
      // ...getterData,
      data: getterData.data,
      meta: meta,
      ...writeRes.status === "error" ? { writeErr: writeRes.error } : {}
    }
  }

  const runFileCache = async (): Promise<fileCacheReturn<I>> => {
    // --- run ---
    const checkRes = await checkCache(filepathname)
    // console.log(checkRes)

    if (checkRes.status === "miss") {
      const getterData = await getter()
      return {
        status: "miss" as const,
        ...getterData, // data, createdAt, staleAt, expiryAt, writeErr?
        ...checkRes.miss, // reason: "not found" | "read error"
      }
    }

    // Parse and validate cache data.
    const parseRes = (() => {
      try { return { status: "ok", parsed: JSON.parse(checkRes.data) } }
      catch (error) { return { status: "error", error } }
    })()
    if (parseRes.status === "error") {
      const getterData = await getter()
      return {
        status: "miss" as const, reason: "parse error" as const, parseErr: parseRes.error,
        ...getterData, // data, createdAt, staleAt, expiryAt, writeErr?
      }
    }
    if (!isCacheData(parseRes.parsed)) {
      const getterData = await getter()
      return {
        status: "miss" as const, reason: "parse error" as const, parseErr: new Error("Parsed data is not in expected format"),
        ...getterData, // data, createdAt, staleAt, expiryAt, writeErr?
      }
    }

    // console.log("expiry", new Date(parseRes.parsed.expiryAt), "stale", new Date(parseRes.parsed.staleAt), "now", new Date(Date.now()))
    const meta = {
      createdAt: new Date(parseRes.parsed.createdAt),
      staleAt: new Date(parseRes.parsed.staleAt),
      expiryAt: new Date(parseRes.parsed.expiryAt),
      now: new Date(),
    }

    // Check stale and expiry times
    const isExpired = Date.now() >= parseRes.parsed.expiryAt
    const isStale = Date.now() >= parseRes.parsed.staleAt

    if (isExpired) {
      // Return data if fetching new data fails, even if it's expired, to avoid complete failure.
      try {
        const getterData = await getter()
        return {
          status: "miss" as const, reason: "expired" as const,
          ...getterData, // data, createdAt, staleAt, expiryAt, writeErr?
        }
      } catch (error) {
        return { data: opts.deserialize(parseRes.parsed.data), status: "error" as const, reason: "expired and failed fetch" as const, meta, err: error }
      }
    }
    if (isStale) {
      // Fetch new data in background but return stale data immediately.
      getter().catch((error) => {
        console.error(`Failed to refresh cache for ${ filepathname }. Error: ${ error }`)
        // Ignore errors in background refresh.
      })
      return { data: opts.deserialize(parseRes.parsed.data), status: "stale" as const, meta }
    }

    // Finally.
    return { data: opts.deserialize(parseRes.parsed.data), status: "hit" as const, meta }
  }

  return async () => {
    const res = await runFileCache()
    if (usingLog) {
      console.log(`${ black } └ file: ${ res.status.toUpperCase() } ${ filepathname }   reason: ${ (res as any).reason ?? "none" }${ reset }`)
    }
    return res
  }
}


export async function test_fileCache() {
  console.clear()
  console.log('\n')
  console.log("Running fileCache() test...")
  let now = Date.now()
  function secondsSinceStart() {
    return ((Date.now() - now) / 1000).toFixed(2) + "s"
  }

  const getData = fileCache("test/fileCache1", async () => {
    const newValue = `value-${ Math.random().toFixed(3) }`
    // console.log("generated new value:", newValue)
    return newValue
  }, {
    stale: "500ms", expiry: "1s",
    serialize: (data) => data,
    deserialize: (data) => data,
  })

  function logTimingMeta(res: fileCacheReturn<any>) {
    return [ `    status ${ res.status }   reason ${ (res as any).reason }   created ${ res.meta.createdAt.getTime() - now }ms`, `stale ${ res.meta.staleAt.getTime() - now }ms`, `expiry ${ res.meta.expiryAt.getTime() - now }ms`, `now ${ res.meta.now.getTime() - now }ms` ]
  }

  const res1 = await getData()
  console.log("1. ", secondsSinceStart(), res1.data, res1.status === "miss" && res1.reason === "not found", "should be miss")
  // console.log(...logTimingMeta(res1))

  const res2 = await getData()
  console.log("2. ", secondsSinceStart(), res2.data, res2.status === "hit", res2.data === res1.data, "should be hit")
  // console.log(...logTimingMeta(res2))

  await delay(600)

  const res3 = await getData()
  console.log("3. ", secondsSinceStart(), res3.data, res3.status === "stale", res3.data === res2.data, "should be stale")
  // console.log(...logTimingMeta(res3))
  await delay(100)
  const res3a = await getData()
  console.log("3a.", secondsSinceStart(), res3a.data, res3a.status === "hit", res3a.data !== res3.data, "should be hit (after stale bg refresh)")

  await delay(1100)

  const res4 = await getData()
  console.log("4. ", secondsSinceStart(), res4.data, res4.status === "miss" && res4.reason === "expired", "should be miss due to expiry")
  const res4a = await getData()
  console.log("4a.", secondsSinceStart(), res4a.data, res4a.status === "hit", res4a.data !== res3.data, "should be hit (after expiry hard refresh)")

  // console.log(...logTimingMeta(res4))

  // Clean up
  await delay(100)
  await removeCache("test/fileCache1")

  // Test parse error
  const cachePath = getCachePath("test/fileCache1")
  await write(cachePath, "invalid json")
  const res5 = await getData()
  console.log('5. ', secondsSinceStart(), res5.data, res5.status === "miss" && res5.reason === "parse error", "should be miss due to parse error")

  // console.log(...logTimingMeta(res5))
  await delay(100)
  await removeCache("test/fileCache1")

  // Test expired and failed fetch error
  await write(cachePath, JSON.stringify({
    data: "some old value",
    createdAt: Date.now() - 300,
    staleAt: Date.now() - 200,
    expiryAt: Date.now() - 100,
  }))
  const getDataWithError = fileCache("test/fileCache1", async () => {
    throw new Error("Fetch failed")
    return ''
  }, {
    stale: "100ms", expiry: "200ms",
    serialize: (data) => data,
    deserialize: (data) => data,
  })
  const res6 = await getDataWithError()
  console.log('6. ', secondsSinceStart(), res6.data, res6.status === "error" && res6.reason === "expired and failed fetch", res6.data === "some old value", "should be error due to expired cache and failed fetch")
  console.log(...logTimingMeta(res6))
  await delay(100)
  await removeCache("test/fileCache1")

  // Test serialization
  const getDataWithSerialization = fileCache("test/fileCache1", async () => {
    return { value: `value-${ Math.random().toFixed(3) }`, time: new Date() }
  }, {
    stale: "500ms", expiry: "1s",
    serialize: (data) => JSON.stringify(data),
    deserialize: (data) => JSON.parse(data),
  })
  const res7 = await getDataWithSerialization()
  console.log('7. ', secondsSinceStart(), res7.data, typeof res7.data === "object" && 'value' in res7.data && typeof res7.data.value === 'string' && 'time' in res7.data && res7.data.time instanceof Date, "should be object type with correct value")
  const res7a = await getDataWithSerialization()
  console.log('7a. ', secondsSinceStart(), res7a.data, typeof res7a.data === "object" && 'value' in res7a.data && typeof res7a.data.value === 'string' && 'time' in res7a.data && typeof res7a.data.time === "string", "should be object type with correct value")

  await delay(100)
  await removeCache("test/fileCache1")

  await rm(getCachePath("test"), { recursive: true })
}

// --------
