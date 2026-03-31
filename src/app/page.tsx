import { data } from "@/content"
import Script from "next/script"

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col items-center px-3 font-sans pb-10">
      <div className="w-full max-w-screen-sm min-h-screen">
        <header className="pt-28 tracking-tight">
          <div className="text-4xl tracking-tighter font-medium">{data.title}</div>
          <div className="font-light text-foreground2 tracking-normal flex gap-x-4 flex-wrap">
            <div className="w-full sm:w-auto capitalize">{data.fullName}</div>
            <div className="hidden sm:block">
              -
            </div>
            {data.socials.map((a, i) => {
              return (
                <div key={i} className="">
                  <a href={a.url} target="_blank" className="text-foreground2 hover:text-foreground">{a.description}</a>{' '}
                </div>
              )
            })}
          </div>
        </header>

        <section className="pt-12">
          <div className="font-mono text-lg tracking-tight text-foreground2 font-light pb-4">
            packages
          </div>
          <div className="flex flex-col gap-2">
            {
              data.projects.map((p, i) => {
                return (
                  <div key={i} className="flex flex-col">
                    <div className="text-foreground3 hover:text-foreground">
                      {p.name}
                    </div>
                    <div className="text-foreground2 text-xs">{p.description}</div>
                  </div>
                )
              })
            }
          </div>
        </section>

        <section className="pt-12">
          <div className="font-mono text-lg tracking-tight text-foreground2 font-light pb-4">
            directories
          </div>
          {
            [
              { url: "https://advent-event.alfon.dev", description: "Simple TS library to create advent events." },
              { url: "https://react-flip-array.alfon.dev", description: "Array reorder animation using FLIP & Code animation" },
              { url: "https://react-lava.alfon.dev", description: "Learn React via Animation" },
              { url: "https://dishook.alfon.dev", description: "Discord webhook generator" },
              { url: "https://advent-of-ui.vercel.app", description: "Advent of UI - 24 days of UI challenges" },
              { url: "https://nu-auth.vercel.app", description: "Type-safe stateless Next.js Authentication" },
              { url: "https://vtuberlogos.alfon.dev", description: "VTuber Logo Compilations" },
              { url: "https://mermaid-ssr.alfon.dev", description: "Server side render mermaid diagrams" },

            ].map((a, i) => {
              return (
                <div key={i}>
                  <a href={a.url} target="_blank" className="text-foreground3 hover:text-foreground">{a.url.replace('https://', '')}</a>{' '}
                  <span className="text-foreground2">{a.description}</span>
                </div>
              )
            })
          }
        </section>

        <section className="pt-20">
          <div className="font-mono text-lg tracking-tight text-foreground2 font-light pb-4">
            articles
          </div>
          {
            [
              { title: "Git Concepts: Crash Course For Beginners", url: "https://alfonsusardani.notion.site/Git-Concepts-Crash-Course-For-Beginners-fa16256c65624048a115e2faa208cf31", description: "alfonsusardani.notion.site - 2024-03-11" },
              { title: "Next.js Data Cache Behavior", url: "https://alfonsusardani.notion.site/Next-js-Data-Cache-Behavior-44f1a579c6d74f25bc55d301786e94ab", description: "alfonsusardani.notion.site - 2024-02-07" },
            ].map((a, i) => {
              return (
                <div key={i}>
                  <a href={a.url} target="_blank" className="text-foreground3 hover:text-foreground">{a.title}</a>{' '}
                  <span className="text-foreground2">{a.description}</span>
                </div>
              )
            })
          }
        </section>

        <section className="pt-20">
          <div className="font-mono text-lg tracking-tight text-foreground2 font-light pb-4">
            demo
          </div>
          {
            [
              { url: "https://cautious-palm-tree-ebon.vercel.app", description: "React drag and drop canvas control demo" },
              { url: "https://art-findr.vercel.app", description: "Demo app to find household assistants (Devscale final assignment)" },
              { url: "https://devscale-eventmaker-alfonsusac.vercel.app", description: "Devscale 5th assignment" },
              { url: "https://devscale-alfonsus-assignment-4.vercel.app", description: "Devscale 4th assignment" },
              { url: "https://assignment-3-devscale.vercel.app/", description: "Devscale 3rd assignment" },
            ].map((a, i) => {
              return (
                <div key={i}>
                  <a href={a.url} target="_blank" className="text-foreground3 hover:text-foreground">{a.url.replace('https://', '')}</a>{' '}
                  <span className="text-foreground2">{a.description}</span>
                </div>
              )
            })
          }
        </section>
        <footer>
          <div className="pt-20 text-center text-foreground2 pb-20">
            <div className="text-sm">
              © {new Date().getFullYear()} alfon
            </div>
          </div>
        </footer>
      </div>
      <Script id="analytics" crossOrigin="anonymous">
        {`try { fetch('${ process.env.NODE_ENV === 'production' ? `https://alfon.dev` : '' }/api/public/analytics', {
    method: 'POST',
    headers: { 
    'Content-Type': 'application/json'
     },
    body: JSON.stringify({
      p: 'alfon.dev',
      e: 'visit',
      m: { referer: document.referrer || 'direct' }
    })
        }) } catch {}`}
      </Script>
    </div>
  )
}

