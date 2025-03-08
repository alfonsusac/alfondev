import type { Metadata } from "next"

export const metadata: Metadata = {
  twitter: {
    card: "player",
    players: [
      {
        width: 1280,
        height: 720,
        playerUrl: "https://x.com/SpotifyKpop/status/1895655398000226624",
        streamUrl: "https://x.com/SpotifyKpop/status/1895655398000226624",
      }
    ]
  }
}


export default function Player() {
  return (
    <>
      Player OG Image Test
    </>
  )
}