import type { ComponentProps } from "react"
import { analytics_config } from "./config"
import { cn } from "@/lib/ui"

export default async function AnalyticsHomePage() {

  const projects = analytics_config.projects

  return (
    <div className="p-12 py-10 font-kode-mono leading-relaxed">
      <p># Analytics</p>
      <br />

      <Card>
        <Card_Label>Projects:</Card_Label>
        <div className="">
          {Object.keys(projects).map((project_key) => {
            return <p key={project_key} className="-mx-2 px-2 hover:bg-foreground4/25 cursor-pointer">
              <span className="text-foreground4">{'>'}</span> {project_key}
            </p>
          })}
        </div>
      </Card>

      <br />

      <Card className="max-w-xl min-h-80">
        <Card_Label>Raw:</Card_Label>
        <table className="w-full">
          <thead className="">
            <tr>
              {Object.keys(analytics_config.rawEvents.columns).map((col) => {
                return <th key={col} className="text-left text-foreground4/75 font-normal not-first:pl-2">{col}</th>
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.keys(analytics_config.rawEvents.columns).map((col) => {
                return <td key={col} className="text-left text-foreground3/75 font-normal not-first:pl-2">-</td>
              })}
            </tr>
          </tbody>

        </table>
      </Card>

    </div>
  )
}


function Card(props: ComponentProps<"div">) {
  return (
    <div {...props} className={cn(
      "p-4 py-3 border max-w-md border-foreground4",
      props.className
    )} />
  )
}
function Card_Label(props: ComponentProps<"p">) {
  return (
    <p {...props} className={cn(
      "text-foreground3 text-sm pb-1",
      props.className
    )} />
  )
}