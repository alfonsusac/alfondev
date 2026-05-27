import { cache, type ComponentProps } from "react"
import { deleteFile, fileExists, read, write } from "./file"
import { black, green, magenta, red, reset, yellow } from "./ansii"
import { rm, stat } from "fs/promises"
import { getErrorMessage } from "./error"

export async function StaticImage({ cacheKey, ...props }: ComponentProps<"img"> & {
  cacheKey?: string,
}) {
  const res = await resolveMediaProps({
    cacheKey: cacheKey,
    src: props.src as string
  })
  logLocalMediaSize(res)
  return (<img {...props} {...res.props} />)
}

export async function StaticVideoSource({ cacheKey, ...props }: ComponentProps<"source"> & {
  cacheKey?: string,
}) {
  const res = await resolveMediaProps({
    cacheKey: cacheKey,
    src: props.src as string
  })
  logLocalMediaSize(res)
  return (<source {...props} {...res.props} />)
}


type ResolveImagePropsResult =
  | { props: { src: string, "data-image-status": "hit" } }
  | { props: { src: string, "data-image-status": "miss:not found" } }
  | { props: { src: string, "data-image-status": "miss:fetch error" }, fetchError: unknown }
  | { props: { src: string, "data-image-status": "miss:read error" }, readError: unknown }
  | { props: { src: string, "data-image-status": "miss:write error" }, writeError: unknown }
  | { props: { src: string, "data-image-status": "no-cache" } }

async function resolveMediaProps({ cacheKey, src }: { cacheKey?: string, src: string }): Promise<ResolveImagePropsResult> {

  // if cacheKey is provided,
  // 1. check if cache exists in /public/cache/${cacheKey}
  // 2. if exists, use that as src
  // 3. if not, fetch the image from props.src, save it to /public/cache/${cacheKey}, and use that as src

  if (!cacheKey)
    return { props: { src, "data-image-status": "no-cache" } }

  const cachePath = `./public/__static/${ cacheKey }`
  const cachedSrcPath = (cacheKey: string) => `/__static/${ cacheKey }`

  const file = await fileExists(cachePath)
  if (file.status === "error")
    return { props: { src, "data-image-status": "miss:read error" }, readError: file.error }

  if (file.status === "not_found") {
    try {
      const res = await fetch(src as string)
      const size = res.headers.get("content-length")
      if (!size) return { props: { src, "data-image-status": "miss:fetch error" }, fetchError: "Content-Length header is missing. Can't determine size." }
      if (Number(size) > 5 * 1024 * 1024) {
        console.log(yellow, `Large media size: (${ size } bytes)  (>5MB)`, reset)
      }
      if (Number(size) > 10 * 1024 * 1024) {
        return { props: { src, "data-image-status": "miss:fetch error" }, fetchError: `Media size (${ size } bytes) exceeds 10MB limit.` }
      }
      const buffer = Buffer.from(await res.arrayBuffer())
      await write(cachePath, buffer, "binary")
      return { props: { src: cachedSrcPath(cacheKey), "data-image-status": "miss:not found" } }
    } catch (e) {
      return { props: { src, "data-image-status": "miss:write error" }, writeError: e }
    }
  }

  if (file.status === "exists")
    return { props: { src: cachedSrcPath(cacheKey), "data-image-status": "hit" } }

  throw 'unreachable'
}

async function logLocalMediaSize(props: ResolveImagePropsResult) {
  if (!props.props.src.startsWith('/__static')) {
    console.log(reset + black, `└ asset:`, 'local', props.props.src, reset)
    return
  }
  try {
    const localPath = `./public/${ props.props.src }`
    const file = await stat(localPath)
    console.log(reset + black, `└ asset: ${ file.size.toString() } KB ${ reset + props.props[ "data-image-status" ].toUpperCase() + black } ${ props.props.src }`, reset)
  } catch (e) {
    console.log(reset + black, `└ asset:`, red, 'error', props.props.src, getErrorMessage(e), reset)
  }
}


export async function test_resolveImageProps() {
  // 1. Test with no cacheKey
  // 2. Test with cache miss (not found)
  // 3. Test with cache hit
  // 4. Test with cache miss (fetch error)
  // 5. Test with cache miss (read error)
  // 6. Test with cache miss (write error)

  const src = "https://raw.githubusercontent.com/alfonsusac/check-site-meta/refs/heads/main/src/app/icon.png"

  function printTest(i: number, r: ResolveImagePropsResult, desc: string, ...conditions: boolean[]) {
    console.log(
      `${ i }.  `,
      ...conditions.map(c => c ? `${ green }✓${ reset }` : `${ red }✗${ reset }`),
      desc,
      `${ magenta }${ r.props[ "data-image-status" ] }`,
      `${ black }src ${ r.props.src }${ reset }`,
      (r as any).fetchError && (r as any).fetchError,
      reset
    )
  }

  const t1 = await resolveMediaProps({ src })
  printTest(1, t1, "should be no-cache", t1.props[ "data-image-status" ] === "no-cache")
  const t2 = await resolveMediaProps({ src, cacheKey: "cache/test.png" })
  printTest(2, t2, "should be miss:not found", t2.props[ "data-image-status" ] === "miss:not found", t2.props.src === "/__static/cache/test.png")
  const t3 = await resolveMediaProps({ src, cacheKey: "cache/test.png" })
  printTest(3, t3, "should be hit", t3.props[ "data-image-status" ] === "hit", t3.props.src === "/__static/cache/test.png")
  const t4 = await resolveMediaProps({ src: "https://invalid-url", cacheKey: "cache/test2.png" })
  printTest(4, t4, "should be miss:write error", t4.props[ "data-image-status" ] === "miss:write error")

  await deleteFile("./public/__static/cache/test.png")
  await rm("./public/__static/cache", { recursive: true, force: true })
}