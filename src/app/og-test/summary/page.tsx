import type { Metadata } from "next"

export const metadata: Metadata = {
  twitter: {
    card: "summary",
    title: "TITLE",
    description: "DESCRIPTION",
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/1/18/20240809_Blackpink_Pink_Carpet_09.png",
        alt: "blackpink img",
        secureUrl: "https://upload.wikimedia.org/wikipedia/commons/1/18/20240809_Blackpink_Pink_Carpet_09.png",
        type: "image/png",
        width: 1920,
        height: 1080
      }
    ],
    site: "@alfonsusac",
    creator: "@EmailThing_",
  }
}


export default function Summary() {
  return (
    <>
      Summary OG Image Test
    </>
  )
}