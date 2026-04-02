import { feed } from "@/content-feed"
import { getOrComputeDiskValue, test_1000StaticCache, test_fileCache } from "@/lib/static-cache"
import { AppTweet } from "@/lib/twitter"
import { PageHeader, PageInner, PageOuter, SiteHeader } from "@/lib/ui"
import { readdir } from "fs/promises"
import { Suspense } from "react"

export default async function FeedPage() {

  // await test_1000StaticCache()
  // await test_fileCache()

  await getOrComputeDiskValue("mykey", async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return JSON.stringify({ hello: "world", time: new Date().toISOString() })
  })

  // throw new Error("Henlo")

  return (
    <PageOuter>
      <SiteHeader />
      <PageInner className="flex flex-col gap-6">
        <PageHeader className="gap-2">
          <div className="text-foreground4">/feed</div>
          <h1 className="text-4xl font-semibold tracking-tight">Feeds</h1>
        </PageHeader>
        <section className="mt-8 flex flex-col gap-24">
          <Suspense fallback="Loading feed..">
            <FeedList />
          </Suspense>
        </section>
      </PageInner>
    </PageOuter>
  )
}

async function FeedList() {
  return (<>
    {feed.map((post, i) => {
      if (post.platform === "twitter") {
        const id = post.url.split("/").slice(-1)[0]
        return <AppTweet key={i} id={id} />
      }
    })}
    {/* <AppTweet id="1866873433776328792" /> */}
  </>)
}