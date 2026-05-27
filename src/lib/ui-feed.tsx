import type { Projects } from "@/content-utils"
import Link from "next/link"
import type { ComponentProps } from "react"
import { formatDate } from "react-tweet"

export function FeedInfo(props: {
  date: string,
  platform: string,
  projectid?: Projects
}) {
  const createdAt = new Date(props.date)
  const formattedCreatedAtDate = formatDate(createdAt)

  return (
    <div className="flex flex-col">
      <div className="text-foreground4">
        <div className="text-sm text-foreground4">
          <span className="lowercase">
            {formattedCreatedAtDate}{' '}
          </span>
          from <span className="font-medium">{props.platform}</span>
          {props.projectid && <>
            {' '}about{' '}
            <Link href={`/project/${ props.projectid }`} className="font-medium hover:brightness-125">
              /{props.projectid}
            </Link>
          </>}
        </div>
      </div>
    </div>
  )
}


export function FeedMedia(props: ComponentProps<"div">) {
  
}