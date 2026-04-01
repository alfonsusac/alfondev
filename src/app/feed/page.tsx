import { feed } from "@/content-feed"
import { AppTweet } from "@/lib/twitter"
import { PageHeader, PageInner, PageOuter, SiteHeader } from "@/lib/ui"
import { Suspense } from "react"

export default async function FeedPage() {
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