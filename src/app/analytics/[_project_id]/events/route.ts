import type { NextRequest } from "next/server"
import { analytics_config } from "../../config"

export async function GET(request: NextRequest, ctx: RouteContext<'/analytics/[_project_id]/events'>) {

  const { _project_id } = await ctx.params
  if (_project_id in analytics_config.projects === false) {
    return new Response(`
Project with id "${ _project_id }" not found in analytics configuration.

Valid projects:
${ Object.keys(analytics_config.projects).map(pid => `- ${ pid }`).join('\n') }
`.trim(), {
      status: 404,
    })
  }
  
  
  
  
  const project_id = _project_id as keyof typeof analytics_config.projects
  const postRouteInfo = analytics_config.routes[ "/analytics/[project-id]/events" ].POST
  const payloadInfo = postRouteInfo.body
  const validEvents = analytics_config.projects[ project_id ].valid_event_names

  return new Response(`
To send events for this project, make a POST request to this endpoint with 
the following JSON body:

\`\`\`ts
type EventPayload = {
${ Object.entries(payloadInfo).map(([ key, info ]) => {
    return [
      `  // ${ info.hint }`,
      `  ${ key }: ${ info.type }`,
      ''
    ].join('\n')
  }).join('\n') }
}
\`\`\`

The server will then process the event and store it for analytics purposes.
Make sure to replace the example values with actual data relevant to the
event you want to track.
    `
    .trim()
    .replace('$valid_event_names', Object
      .keys(validEvents)
      .map(ev => `"${ev}"`)
      .join(' | ')))
}

export function POST() {

}