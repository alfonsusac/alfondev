import type { data } from "./content"

export function project<
  T extends "tool" | "app" | "ui" | "lib" | "edu",
  N extends string
>(
  type: T,
  name: N,
  opts: {
    description: string,
    url: {
      package?: string,
      site?: string,
      github?: string,
    },
    timeFrame?: {
      start: Date,
      end?: Date,
    },
    icon?: string,
    thumbnail: string | undefined,
  }) {
  return { ...opts, name, type }
}

export function directory(name: string, desc: string) {
  return { name, description: desc }
}

export function article(title: string, url: string, published_at: Date) {
  return { title, url, published_at }
}

export function art() {

}

export type Socials = typeof data[ 'socials' ][ number ][ 'type' ]
export type Projects = typeof data[ 'projects' ][ number ][ 'name' ]

export function feedpost(
  platform: "twitter" | "bsky",
  url: string,
  project?: Projects
) {
  if (!url.startsWith("https://x.com/"))
    throw new Error("Invalid Twitter Link")
  return { platform, url, project }
}