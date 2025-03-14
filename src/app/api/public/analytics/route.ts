import { after, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(r: NextRequest) {
  const location = r.headers.get('x-vercel-ip-country') ?? 'unknown'
  const referer = r.headers.get('referer') ?? 'unknown'

  const body = await r.json()
  const project = body.p
  const event = body.e
  if (!project || !event) return new Response(null, { status: 500 })
  const meta = body.m

  const data = {
    location,
    referer,
    project,
    event,
    meta,
    source: "alfon-dev/api/analytics (public)",
  }

  const dataset_name = "main-app-dataset";

  after(async () => {
    // Axiom
    await fetch(`https://api.axiom.co/v1/datasets/${ dataset_name }/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ process.env.AXIOM_API_KEY }`
      },
      body: JSON.stringify([{
        level: 'info',
        ...data,
      }])
    })
    // console.log("Logged to Axiom")
  })


  // // Umami
  // const ures = await fetch('https://analytics.arinji.com/api/send', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${ process.env.UMAMI_TOKEN }`,
  //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  //   },
  //   body: JSON.stringify({
  //     type: 'event',
  //     payload: {
  //       // // hostname: '',
  //       // // language: 'en-US',
  //       // // referer,
  //       // // screen: '1920x1080',
  //       // // title: project,
  //       // // url: '',
  //       // "hostname": "your-hostname",
  //       // "language": "en-US",
  //       // "referrer": "",
  //       // "screen": "1920x1080",
  //       // "title": "dashboard",
  //       // "url": "/",
  //       website: process.env.UMAMI_WEBSITE_ID,
  //       // "name": "event-name",
  //       // "data": {
  //       //   "foo": "bar"
  //       // }
  //       // name: event,
  //       // data: {
  //       //   location,
  //       //   meta,
  //       // }
  //     }
  //   })
  // })
  // console.log(ures)
  // console.log(await ures.text())
  // console.log("Logged to Umami")

  after(async () => {
    const pres = await prisma.thing.upsert({
      where: {
        id: project,
        referer,
        location,
        event,
      },
      create: {
        id: project,
        referer,
        location,
        event,
        count: 1,
      },
      update: {
        count: { increment: 1 }
      }
    })
    // console.log(pres)
    // console.log("Logged to DB")
  })


  return new Response(null, {
    status: 204, // No Content
  })
}

export { POST as GET }

export async function OPTIONS() {
  return new Response(null, {
    status: 204, // No Content
  });
}