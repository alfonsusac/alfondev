import type { NextRequest } from "next/server";

export async function POST(r: NextRequest) {
  // get title, meta from searchParams  
  const body = await r.json()
  console.log(body)
  const app = body.a
  const event = body.e
  if (!app || !event) return new Response(null, { status: 500 })

  const meta = body.m
  console.log(meta)

  const dataset_name = "main-app-dataset";
  await fetch(`https://api.axiom.co/v1/datasets/${ dataset_name }/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ process.env.AXIOM_API_KEY }`
    },
    body: JSON.stringify([{
      level: 'info',
      appname: app,
      event: event,
      meta: meta,
      source: "alfon-dev/api/analytics (public)",
    }])
  })
  return new Response()
}

export { POST as GET }