import { data } from "@/content"
import { date, range } from "@/lib/date"
import { cn } from "@/lib/ui"
import Script from "next/script"
import type { ComponentProps } from "react"

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col items-center px-10 font-sans pb-10">
      <div className="w-full max-w-screen-sm min-h-screen">

        <header className="pt-28">
          <div className="text-4xl tracking-tighter font-medium">{data.title}</div>
          <div className="font-light text-foreground2 tracking-normal flex gap-x-4 flex-wrap">
            <div className="w-full sm:w-auto capitalize">{data.fullName}</div>
          </div>
          <ExternalLinkRow>
            {data.socials
              .map((a, i) => {
                return (
                  <InlineExternalLink href={a.url} key={i}>
                    {a.type}
                  </InlineExternalLink>
                )
              })}
          </ExternalLinkRow>
        </header>

        <ProjectSection />
        <DirectoriesSection />
        <ArticlesSection />
        <RandomDemos />

        <footer>
          <div className="pt-20 text-center text-foreground2 pb-20">
            <div className="text-sm">
              © {new Date().getFullYear()} alfon
            </div>
          </div>
        </footer>
      </div>
      {process.env.NODE_ENV === 'production' && (
        <Script id="analytics" crossOrigin="anonymous" defer
          dangerouslySetInnerHTML={{
            __html: `try { fetch('${ process.env.NODE_ENV === 'production' ? `https://alfon.dev` : '' }/api/public/analytics', {
    method: 'POST',
    headers: { 
    'Content-Type': 'application/json'
     },
    body: JSON.stringify({
      p: 'alfon.dev',
      e: 'visit',
      m: { referer: document.referrer || 'direct' }
    })
        })
          console.log("analytics sent!")
        } catch (error) {
        console.log(error)  
        }
          `}}
        >

        </Script>
      )}
    </div>
  )
}


function SectionHeader(props: ComponentProps<"header">) {
  return <header {...props} className={cn("pb-1", props.className)} />
}
function SectionTitle(props: ComponentProps<"h2">) {
  return <div {...props} className={cn("text-foreground2 text-sm", props.className)} />
}
function SectionDesc(props: ComponentProps<"h2">) {
  return <div {...props} className={cn("text-foreground3 font-light pb-2 max-w-80 text-xs", props.className)} />
}
function Section(props: ComponentProps<"section">) {
  return <section {...props} className={cn("pt-16", props.className)} />
}
function InlineExternalLink(props: ComponentProps<"a">) {
  return <a {...props} className={cn("text-foreground4/50 hover:text-foreground3 underline-offset-4 decoration-foreground4/25", props.className)} target="_blank" />
}
function ExternalLinkRow(props: ComponentProps<"div">) {
  return <div {...props} className={cn("text-foreground2 text-sm flex gap-3 lowercase", props.className)} />
}


function ProjectSection() {
  return (<Section>
    <SectionHeader>
      <SectionTitle>projects</SectionTitle>
      <SectionDesc>
        I like to build stuff, especially open source libraries and tools.
        Here are some of my projects, sorted by most recent activity
        (last commit or update).
      </SectionDesc>
    </SectionHeader>
    <div className="flex flex-col gap-2">
      {data.projects
        .toSorted((a, b) => {
          if (!a.timeFrame && !b.timeFrame) return 0
          if (!a.timeFrame) return 1
          if (!b.timeFrame) return -1
          const dateA = a.timeFrame.end ?? a.timeFrame.start
          const dateB = b.timeFrame.end ?? b.timeFrame.start
          return dateB.getTime() - dateA.getTime()
        })
        .map((p, i) => {
          return (
            <div key={i} className="flex flex-col group">
              <div className="text-foreground2 items-baseline lowercase flex flex-col gap-x-2 sm:flex-row leading-snug">
                <span className="font">
                  {p.name}
                </span>
                <div className="flex gap-2">
                  <span className="text-foreground4 text-xs">
                    {p.type}
                  </span>
                  <span className="text-foreground4 text-xs">{p.timeFrame
                    ? '(' + range(p.timeFrame.start, p.timeFrame.end, 'year') + ')'
                    : null}
                  </span>
                  <ExternalLinkRow className="inline-flex gap-1 transition-all text-xs">
                    {p.url.package && (<InlineExternalLink href={`https://www.npmx.dev/package/${ p.url.package }`}>package</InlineExternalLink>)}
                    {p.url.github && (<InlineExternalLink href={`https://github.com/${ p.url.github }`}>repo</InlineExternalLink>)}
                    {p.url.site && (<InlineExternalLink href={`${ p.url.site }`}>homepage</InlineExternalLink>)}
                  </ExternalLinkRow>
                </div>
              </div>
              <div className="text-foreground3 text-sm">
                {p.description}
              </div>
            </div>
          )
        })}
    </div>
  </Section>)
}

function DirectoriesSection() {
  return <Section>
    <SectionHeader>
      <SectionTitle>directories</SectionTitle>
      <SectionDesc>
        Here are all the subdomains that is present under alfon.dev.
      </SectionDesc>
    </SectionHeader>
    <div className="flex flex-col">
      {data.directories
        .toSorted((a, b) => a.name.localeCompare(b.name))
        .map((a, i) => {
          return (
            <a href={'https://' + a.name + '.alfon.dev'} target="_blank" key={i} className="text-sm text-nowrap truncate hover:brightness-125">
              <span className="text-foreground2 hover:text-foreground">
                {a.name}<span className="text-foreground4">.alfon.dev</span>
              </span>{' '}
              <span className="text-foreground3 lowercase"> - {a.description}</span>
            </a>
          )
        })
      }
    </div>
  </Section>
}

function ArticlesSection() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>articles</SectionTitle>
        <SectionDesc>
          A list of articles I've written, mostly about programming and technology.
        </SectionDesc>
      </SectionHeader>
      <div className="flex flex-col text-sm">
        {
          data.articles.map((a, i) => {
            return (
              <a key={i} href={a.url} className="hover:brightness-125">
                <span className="text-foreground2">{a.title}</span>{' '}
                <span className="text-foreground4 lowercase">{date(a.published_at, 'month-year')}</span>
              </a>
            )
          })
        }
      </div>

    </Section>
  )
}

function RandomDemos() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>random demos</SectionTitle>
        <SectionDesc>
          Just some random demos that I made for learning and experimentation purposes. Some of them are pretty old and not really maintained, but I still want to share them here.
        </SectionDesc>
      </SectionHeader>
      <div className="text-sm flex flex-col">
        {
          [
            { url: "https://cautious-palm-tree-ebon.vercel.app", description: "React drag and drop canvas control demo" },
            { url: "https://art-findr.vercel.app", description: "Demo app to find household assistants (Devscale final assignment)" },
            { url: "https://devscale-eventmaker-alfonsusac.vercel.app", description: "Devscale 5th assignment" },
            { url: "https://devscale-alfonsus-assignment-4.vercel.app", description: "Devscale 4th assignment" },
            { url: "https://assignment-3-devscale.vercel.app", description: "Devscale 3rd assignment" },
          ].map((a, i) => {
            return (
              <a key={i}>
                <a href={a.url} target="_blank" className="text-foreground2 hover:text-foreground">{a.url.replace('https://', '')}</a>{' '}
                <span className="text-foreground4">{a.description}</span>
              </a>
            )
          })
        }
      </div>
    </Section>
  )
}