import type { data } from "./content"

export function project(
  type: "tool" | "app" | "ui" | "lib" | "edu",
  name: string,
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