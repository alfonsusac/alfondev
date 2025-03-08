import type { Metadata } from "next"

export const metadata: Metadata = {
  twitter: {
    card: "app",
    app: {
      id: {
        ipad: 'id1330451888',
        iphone: 'id1330451888',
        googleplay: 'com.codebrewgames.pocketcitygame'
      },
      name: "App OG Image Test",
      url: {
        iphone: "https://apps.apple.com/us/app/pocket-city/id1330451888",
        ipad: "https://apps.apple.com/us/app/pocket-city/id1330451888",
        googleplay: "https://play.google.com/store/apps/details?id=com.codebrewgames.pocketcitygame&hl=en_US",
      }
    }
  }
}


export default function App() {
  return (
    <>
      App OG Image Test
    </>
  )
}