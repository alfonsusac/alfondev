import {
  enrichTweet,
  formatDate,
  formatNumber,
  getMediaUrl,
  getMp4Video,
  type EnrichedQuotedTweet,
  type EnrichedTweet,
} from "react-tweet"

import {
  fetchTweet,
  type MediaAnimatedGif,
  type MediaDetails,
  type MediaVideo,
  type TweetUser,
} from "react-tweet/api"
import { cn, IconamoonCommentFill, TablerExternalLink } from "./ui"
import { Fragment, type ComponentProps, type ReactNode } from "react"
import { fileCache } from "./static-cache"


const REVALIDATE = 60 // 60 seconds

export async function getTweet(id: string) {
  const res = await fileCache(
    `tweet/post-${ id }.json`,
    async () => {
      if (process.env.NODE_ENV !== "development")
        throw new Error("Tweet data not found! Please run the app in development mode to fetch and cache the tweet data.")
      try {
        const res = await fetchTweet(id, {
          next: {
            revalidate: REVALIDATE
          }
        })
        return { fetchStatus: "ok" as const, data: res }
      } catch (error) {
        return { fetchStatus: "error" as const, error }
      }
    }, {
    serialize: (data) => JSON.stringify(data),
    deserialize: (data) => JSON.parse(data),
  })()
  return res
}



export async function AppTweet(props: {
  id: string,
}) {
  const res = await getTweet(props.id)
  if (res.status === "error")
    return <TweetError error={res.err} />
  if (res.data.fetchStatus === "error")
    return <TweetError error={res.data.error} />
  if (res.data.data.notFound || res.data.data.data === undefined)
    return <TweetNotFound />
  if (res.data.data.tombstone)
    return <TweetTombstoned />
  const tweet = enrichTweet(res.data.data.data)

  return (
    <TweetContainer>
      <TweetInfo tweet={tweet} />
      {/* <TweetHeader tweet={tweet} /> */}
      {tweet.in_reply_to_status_id_str && <TweetInReplyTo tweet={tweet} />}
      <TweetBody tweet={tweet} />
      {tweet.mediaDetails?.length ? (
        <TweetMedia tweet={tweet} />
      ) : null}
      {/* {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />} */}
      <TweetActions tweet={tweet} />
    </TweetContainer>
  )
}


function TweetNotFound() {
  return <TweetContainer>
    <div className={""}>
      <h3>Tweet not found</h3>
      <p>The embedded tweet could not be found…</p>
    </div>
  </TweetContainer>
}
function TweetTombstoned() {
  return <TweetContainer>
    <div className={""}>
      <h3>Tweet unavailable</h3>
      <p>The embedded tweet is unavailable.</p>
    </div>
  </TweetContainer>
}
function TweetError(props: { error: any }) {
  return <TweetContainer>
    <div className={""}>
      <h3>Failed to load tweet</h3>
      <p>There was an error loading the embedded tweet.</p>
      <pre className={cn("text-sm text-foreground4")}>{String(props.error)}</pre>
    </div>
  </TweetContainer>
}

function Skeleton({ className }: ComponentProps<"span">) {
  return <span className={cn(
    "block w-full rounded-md",
    "bg-(image:--tweet-skeleton-gradient)",
    "animate-[loading_8s_ease-in-out_infinite]",
    "motion-safe:animate-none",
    className
  )} />
}

export function TweetSkeleton() {
  return <TweetContainer className="pointer-events-none pb-1">
    <Skeleton className="h-12 mb-3" />
    <Skeleton className="h-24 my-2 mx-0" />
    <div className="border-t border-t-(--tweet-border) my-2 mx-0" />
    <Skeleton className="h-8" />
    <Skeleton className="h-8 founded-full mt-2" />
  </TweetContainer>
}


function TweetContainer(props: { children: React.ReactNode, className?: string }) {
  return <div className={cn(
    "w-full min-w-[250px] max-w-[550px]",
    "overflow-hidden",
    // base font styles
    "text-(--tweet-font-color)",
    "font-(family-name:--tweet-font-family)",
    "font-normal",
    "box-border",
    "border-(--tweet-border)",
    "rounded-[12px]",
    "m-(--tweet-container-margin)",
    "bg-(--tweet-bg-color)",
    "transition-[bacground-color,box-shadow]",
    "duration-200",
    "hover:bg-(--tweet-bg-color-hover)",
    props.className
  )}>
    <article className={cn(
      "relative [box-sizing:inherit]",
      // " py-3 px-4",
    )}>{props.children}</article>
  </div>
}

// function TweetHeader(props: { tweet: EnrichedTweet }) {
//   const { user } = props.tweet
//   return <div className={cn(
//     "s.header",
//     "flex pb-3",
//     "leading-(--tweet-header-line-height)",
//     "text-(size:--tweet-header-font-size)",
//     "whitespace-nowrap wrap-break-word overflow-hidden",
//   )}>
//     <a
//       href={props.tweet.url}
//       className={cn("s.avatar", "relative h-12 w-12")}
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       <div
//         className={cn(
//           "s.avatarOverflow",
//           "h-full w-full absolute overflow-hidden rounded-full",
//           user.profile_image_shape === 'Square' && "rounded-sm",
//         )}
//       >
//         <img
//           src={user.profile_image_url_https}
//           alt={user.name}
//           width={48}
//           height={48}
//         />
//       </div>
//       <div className={cn("s.avatarOverflow",
//         "h-full w-full absolute overflow-hidden rounded-full",
//       )}>
//         <div className={cn("s.avatarShadow",
//           "w-full h-full transition-[background-color] duration-200",
//           "shadow-[rgb(0_0_0_/_3%)_0px_0px_2px_inset]",
//           "hover:bg-[rgba(26,_26,_26,_0.15)]"
//         )}></div>
//       </div>
//     </a>
//     <div className={"s.author"}>
//       <a
//         href={props.tweet.url}
//         className={"s.authorLink"}
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <div className={"s.authorLinkText"}>
//           <span title={user.name}>{user.name}</span>
//         </div>
//         <VerifiedBadge user={user} className={"s.authorVerified"} />
//         <HighlightedLabel user={user} />
//       </a>
//       <div className={"s.authorMeta"}>
//         <a
//           href={props.tweet.url}
//           className={"s.username"}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <span title={`@${ user.screen_name }`}>@{user.screen_name}</span>
//         </a>
//         <div className={"s.authorFollow"}>
//           <span className={"s.separator"}>·</span>
//           <a
//             href={user.follow_url}
//             className={"s.follow"}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Follow
//           </a>
//         </div>
//       </div>
//     </div>
//     <a
//       href={props.tweet.url}
//       className={"s.brand"}
//       target="_blank"
//       rel="noopener noreferrer"
//       aria-label="View on Twitter"
//     >
//       <svg viewBox="0 0 24 24" aria-hidden="true" className={"s.twitterIcon"}>
//         <g>
//           <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
//         </g>
//       </svg>
//     </a>
//   </div>
// }


function TweetInReplyTo(props: { tweet: EnrichedTweet }) {
  return <a
    href={props.tweet.in_reply_to_url}
    className={"s.root"}
    target="_blank"
    rel="noopener noreferrer"
  >
    Replying to @{props.tweet.in_reply_to_screen_name}
  </a>
}


function TweetBody(props: { tweet: EnrichedTweet }) {
  return <p className={cn(
    "my-3 mb-5 leading-snug",
    "s.root",
    "wrap-break-word",
    "whitespace-pre-wrap",
  )} lang={props.tweet.lang} dir="auto">
    {props.tweet.entities.map((item, i) => {
      switch (item.type) {
        case 'hashtag':
        case 'mention':
        case 'url':
        case 'symbol':
          return (
            <TweetLink key={i} href={item.href}>
              {item.text}
            </TweetLink>
          )
        case 'media':
          // Media text is currently never displayed, some tweets however might have indices
          // that do match `display_text_range` so for those cases we ignore the content.
          return
        default:
          // We use `dangerouslySetInnerHTML` to preserve the text encoding.
          // https://github.com/vercel/react-tweet/issues/29
          return (
            <span key={i} dangerouslySetInnerHTML={{ __html: item.text }} />
          )
      }
    })}
    {props.tweet.note_tweet ? <ShowMore tweet={props.tweet} /> : null}
  </p>
}
function TweetMedia(props: {
  tweet: EnrichedTweet, quoted?: boolean
}) {
  const length = props.tweet.mediaDetails?.length ?? 0

  return (
    <div className={cn(
      "overflow-hidden relative mt-3",
      !props.quoted && "rounded-xl border-(--tweet-border)",
    )}>
      <div
        className={cn(
          // "s.mediaWrapper",
          "grid grid-rows-[1fr]",
          "gap-1 h-full w-full",
          length > 1 && "grid-cols-[repeat(2,_1fr)]",
          length === 3 && "[&>a:first-child]:row-span-2",
          length > 4 && "grid-cols-[repeat(2,_1fr)]"
        )}
      >
        {props.tweet.mediaDetails?.map((media) => (
          <Fragment key={media.media_url_https}>
            {media.type === 'photo' ? (
              <a
                key={media.media_url_https}
                href={props.tweet.url}
                className={cn(
                  "relative w-full h-full flex items-center justify-center",
                  "no-underlin outline-none")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  className={cn(
                    "pb-[56.25%] w-full block",
                  )}
                  style={getSkeletonStyle(media, length)}
                />
                <img
                  src={getMediaUrl(media, 'small')}
                  alt={media.ext_alt_text || 'Image'}
                  className={cn(
                    "absolute inset-0 w-full h-full m-0 object-cover object-center",
                  )}
                  draggable
                />
              </a>
            ) : (
              <div key={media.media_url_https} className={cn(
                // "s.mediaContainer"
                "relative",
                "h-full w-full flex items-center justify-center",
              )}>
                <div
                  className={cn(
                    "pb-[56.25%] w-full block",
                  )}
                  style={getSkeletonStyle(media, length)}
                />
                <TweetMediaVideo tweet={props.tweet} media={media} />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
function TweetMediaVideo({ tweet, media }: {
  tweet: EnrichedTweet | EnrichedQuotedTweet
  media: MediaAnimatedGif | MediaVideo
}) {
  // const [ playButton, setPlayButton ] = useState(true)
  // const [ isPlaying, setIsPlaying ] = useState(false)
  // const [ ended, setEnded ] = useState(false)
  const mp4Video = getMp4Video(media)
  let timeout = 0

  // console.log(mp4Video)

  return (
    <>
      <video
        controls={true}
        // className={mediaStyles.image}
        poster={getMediaUrl(media, 'small')}
        // controls={!playButton}
        playsInline
        preload="none"
      // tabIndex={playButton ? -1 : 0}
      // onPlay={() => {
      //   if (timeout) window.clearTimeout(timeout)
      //   if (!isPlaying) setIsPlaying(true)
      //   if (ended) setEnded(false)
      // }}
      // onPause={() => {
      //   // When the video is seeked (moved to a different timestamp), it will pause for a moment
      //   // before resuming. We don't want to show the message in that case so we wait a bit.
      //   if (timeout) window.clearTimeout(timeout)
      //   timeout = window.setTimeout(() => {
      //     if (isPlaying) setIsPlaying(false)
      //     timeout = 0
      //   }, 100)
      // }}
      // onEnded={() => {
      //   setEnded(true)
      // }}
      >
        <source src={mp4Video.url.replace('?tag=12', '')} type={mp4Video.content_type} />
      </video>

      {/* {playButton && (
        <button
          type="button"
          className={s.videoButton}
          aria-label="View video on X"
          onClick={(e) => {
            const video = e.currentTarget.previousSibling as HTMLMediaElement

            e.preventDefault()
            setPlayButton(false)
            video.load()
            video
              .play()
              .then(() => {
                setIsPlaying(true)
                video.focus()
              })
              .catch((error) => {
                console.error('Error playing video:', error)
                setPlayButton(true)
                setIsPlaying(false)
              })
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className={s.videoButtonIcon}
            aria-hidden="true"
          >
            <g>
              <path d="M21 12L4 2v20l17-10z"></path>
            </g>
          </svg>
        </button>
      )} */}

      {/* {!isPlaying && !ended && (
        <div className={s.watchOnTwitter}>
          <a
            href={tweet.url}
            className={s.anchor}
            target="_blank"
            rel="noopener noreferrer"
          >
            {playButton ? 'Watch on X' : 'Continue watching on X'}
          </a>
        </div>
      )} */}

      {/* {ended && (
        <a
          href={tweet.url}
          className={clsx(s.anchor, s.viewReplies)}
          target="_blank"
          rel="noopener noreferrer"
        >
          View replies
        </a>
      )} */}
    </>
  )
}
// function QuotedTweet(props: { tweet: EnrichedQuotedTweet }) {
//   return <></>
// }
function TweetInfo(props: { tweet: EnrichedTweet }) {
  const createdAt = new Date(props.tweet.created_at)
  const formattedCreatedAtDate = formatDate(createdAt)

  return (
    <div className={cn("text-foreground3")}>
      <a
        href={props.tweet.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={formattedCreatedAtDate}
      >
        <time dateTime={createdAt.toISOString()}>{formattedCreatedAtDate}</time>
      </a>{' '}
      from X:
    </div>
  )
}

function TweetActions(props: { tweet: EnrichedTweet }) {
  const favoriteCount = formatNumber(props.tweet.favorite_count)
  const replyCount = formatNumber(props.tweet.conversation_count)

  return (
    <div
      className={cn(
        "s.actions",
        "flex items-center justify-end",
        "text-foreground4",
        // "text-(--tweet-font-color-secondary)",
        "pt-1 border-t-(--tweet-border)",
        "wrap-break-word",
        "whitespace-nowrap",
        "text-ellipsis",

      )}
    >
      <a
        className={cn(
          "s.reply",
          "p-1 px-3 pr-4 rounded-xl hover:bg-foreground4/25",
          "no-underline text-inherit",
          "flex items-center",
          "group",
        )}
        href={props.tweet.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Reply to this Tweet on Twitter"
      >
        <div
          className={cn(
            "w-8 h-8 rounded-full -ml-1",
            "flex items-center justify-center",
          )}
        >
          <TablerExternalLink
            className={cn(
              "h-4.5 fill-current select-none",
              "group-hover:text-foreground",
            )}
            aria-hidden="true"
          />
        </div>
        <span
          className={cn(
            "s.replyText",
            "text-sm font-medium leading-snug ml-1",
            "group-hover:text-foreground",
          )}
        >Open</span>
      </a>
      <a
        className={cn(
          "s.like",
          "p-1 px-3 pr-4 rounded-xl hover:bg-foreground4/25",
          "no-underline text-inherit",
          "flex items-center mr-1",
          "group",
        )}
        href={props.tweet.like_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Like. This Tweet has ${ favoriteCount } likes`}
      >
        <div
          className={cn(
            "s.likeIconWrapper",
            "w-8 h-8 rounded-full -ml-1",
            "flex items-center justify-center",
          )}
        >
          <svg viewBox="0 0 24 24"
            className={cn(
              "s.likeIcon",
              "h-4.5 fill-current select-none",
              "group-hover:text-red-400",
            )}
            aria-hidden="true">
            <g>
              <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
            </g>
          </svg>
        </div>
        <span
          className={cn(
            "s.likeCount",
            "text-sm font-medium leading-snug ml-1",
            "group-hover:text-red-400",
          )}
        >{favoriteCount}</span>
      </a>
      <a
        className={cn(
          "s.reply",
          "p-1 px-3 pr-4 rounded-xl hover:bg-foreground4/25",
          "no-underline text-inherit",
          "flex items-center",
          "group",
        )}
        href={props.tweet.reply_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Reply to this Tweet on Twitter"
      >
        <div
          className={cn(
            "s.replyIconWrapper",
            "w-8 h-8 rounded-full -ml-1",
            "flex items-center justify-center",
          )}
        >
          <IconamoonCommentFill
            className={cn(
              "s.replyIcon",
              "h-4.5 fill-current select-none",
              "group-hover:text-blue-500",
            )}
            aria-hidden="true"
          />
        </div>
        <span
          className={cn(
            "s.replyText",
            "text-sm font-medium leading-snug ml-1",
            "group-hover:text-blue-400",
          )}
        >{replyCount}</span>
      </a>
      {/* <TweetActionsCopy tweet={props.tweet} /> */}
    </div>
  )
}
function TweetReplies(props: { tweet: EnrichedTweet }) {
  return <div
  // className={s.replies}
  >
    <a
      // className={s.link}
      href={props.tweet.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span
      // className={s.text}
      >
        {props.tweet.conversation_count === 0
          ? 'Read more on X'
          : props.tweet.conversation_count === 1
            ? `Read ${ formatNumber(props.tweet.conversation_count) } reply`
            : `Read ${ formatNumber(props.tweet.conversation_count) } replies`}
      </span>
    </a>
  </div>
}





export function HighlightedLabel(props: {
  user: TweetUser
  className?: string
}) {
  const label = props.user.highlighted_label
  if (!label) return null

  const url = label.badge?.url
  if (!url) return null

  return (
    <div className={cn(
      "flex h-[1.0625em] w-[1.0625em] ",
      "max-w-[17px] max-h-[17px] ml-1 mr-0.5",
      "border-(--tweet-border)",
      "rounded-xs",
      "styles.label",
      props.className
    )}>
      <img className="w-full h-full" src={url} alt={label.description} />
    </div>
  )
}

export function VerifiedBadge(props: {
  user: TweetUser
  className?: string
}) {
  return <></>
}

function ShowMore({ tweet }: { tweet: EnrichedTweet }) {
  return (
    <>
      <span>&nbsp;</span>
      <TweetLink href={tweet.url}>
        Show more
      </TweetLink>
    </>
  )
}

export function TweetLink({ href, children }: {
  children: ReactNode
  href: string
}) {
  return (
    <a href={href} className={cn(
      "s.root",
      // "text-blue-500",
      "text-foreground3 hover:text-foreground",
      "hover:underline",
      "decoration-1",
      "underline-offset-4",
      "cursor-pointer",
    )} target="_blank" rel="noopener noreferrer nofollow">
      {children}
    </a>
  )
}


// Media

const getSkeletonStyle = (media: MediaDetails, itemCount: number) => {
  let paddingBottom = 56.25 // default of 16x9

  // if we only have 1 item, show at original ratio
  if (itemCount === 1)
    paddingBottom =
      (100 / media.original_info.width) * media.original_info.height

  // if we have 2 items, double the default to be 16x9 total
  if (itemCount === 2) paddingBottom = paddingBottom * 2

  return {
    width: media.type === 'photo' ? undefined : 'unset',
    paddingBottom: `${ paddingBottom }%`,
  }
}