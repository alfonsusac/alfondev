"use client"

import type Link from "next/link"
import type { ComponentProps } from "react"
import { LinkButton } from "./ui"
import { usePathname } from "next/navigation"

export function SiteHeaderNavButtonClient(props: ComponentProps<typeof Link>) {
  const pathname = usePathname()
  return (
    <LinkButton
      {...props}
      data-active={pathname === props.href ? "" : undefined}
    />
  )
}
