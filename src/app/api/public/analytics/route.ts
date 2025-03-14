import type { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

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
  console.log("Logged to Axiom")

  // Umami
  await fetch('https://analytics.arinji.com/api/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ process.env.UMAMI_API_KEY }`
    },
    body: JSON.stringify({
      type: 'event',
      payload: {
        referer,
        title: project,
        name: event,
        websiteId: process.env.UMAMI_WEBSITE_ID,
        data: {
          location,
          meta,
        }
      }
    })
  })
  console.log("Logged to Umami")

  const prisma = new PrismaClient()
  prisma.thing.upsert({
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
  console.log("Logged to DB")

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