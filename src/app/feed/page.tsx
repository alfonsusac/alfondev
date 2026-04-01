import { fetchRawTweet, getTweet, AppTweet } from "@/lib/twitter"
import { PageHeader, PageInner, PageOuter, SiteHeader } from "@/lib/ui"
import { Suspense } from "react"
import { TweetSkeleton, EmbeddedTweet, TweetNotFound, enrichTweet, TweetContainer, TweetHeader, TweetBody, TweetMedia, QuotedTweet, TweetInfo, TweetActions, TweetInReplyTo, Tweet } from 'react-tweet'

export default async function FeedPage() {


  return (
    <PageOuter>
      <SiteHeader />
      <PageInner className="flex flex-col gap-6">
        <PageHeader className="gap-2">
          <div className="text-foreground4">/feed</div>
          <h1 className="text-4xl font-semibold tracking-tight">Feeds</h1>
        </PageHeader>
        <section>
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
    <AppTweet id="1866873433776328792" />
    {/* <Tweet id="1866873433776328792" /> */}
  </>)

  // const post = await getTweet('1866873433776328792')
  // if (!post.data) return "Post not found"

  // const tweet = enrichTweet(post.data)
  // return (
  //   <TweetContainer>
  //     <TweetHeader tweet={tweet} />
  //     {tweet.in_reply_to_status_id_str && <TweetInReplyTo tweet={tweet} />}
  //     <TweetBody tweet={tweet} />
  //     {tweet.mediaDetails?.length ? (
  //       <TweetMedia tweet={tweet} />
  //     ) : null}
  //     {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
  //     <TweetInfo tweet={tweet} />
  //     <TweetActions tweet={tweet} />
  //     {/* We're not including the `TweetReplies` component that adds the reply button */}
  //   </TweetContainer>
  // )
  //   return (
  //   <pre className="text-sm leading-tight">
  //   </pre>
  // )
}