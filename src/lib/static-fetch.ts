// WIP: Fetch and statically cache the result to repo.

import { readFile, writeFile } from 'fs/promises'
import { cache } from 'react'

export async function staticFetch(url: string, options?: RequestInit) {

  // 1. check if cache exists in src/content-cache.json
  const file = await readFile('./src/content-cache.json', 'utf-8')
  const cacheData = JSON.parse(file) as Record<string, any>
  const cacheKey = url
  if (cacheKey in cacheData) {
    return cacheData[cacheKey]
  }

  // 2. if not, fetch and cache it
  const res = await fetch(url, options)
  const json = await res.json()
  const newCacheData = {
    ...cacheData,
    [cacheKey]: json,
  }
  await writeFile('./src/content-cache.json', JSON.stringify(newCacheData, null, 2), 'utf-8')

}