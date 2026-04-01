import { data } from "@/content"
import { date, range } from "@/lib/date"
import { cn, PageHeader, PageInner, PageOuter } from "@/lib/ui"
import Link from "next/link"
import Script from "next/script"
import type { ComponentProps } from "react"

export default function Home() {

  return (
    <PageOuter>
      <PageInner>

        <PageHeader className="pt-28">
          <div className="text-5xl tracking-tighter font-medium">{data.title}</div>
          <div className="font-light text-foreground2 tracking-normal flex gap-x-4 flex-wrap">
            <span className="text-lg">{data.fullName} · <span className="text-foreground3">he/him</span></span>
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
        </PageHeader>

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
      </PageInner>
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
    </PageOuter>
  )
}


function SectionHeader(props: ComponentProps<"header">) {
  return <header {...props} className={cn("pb-1", props.className)} />
}
function SectionTitle(props: ComponentProps<"h2">) {
  return <div {...props} className={cn("text-foreground2", props.className)} />
}
function SectionDesc(props: ComponentProps<"h2">) {
  return <div {...props} className={cn("text-foreground3 font-light pb-2 max-w-80 text-sm leading-tight", props.className)} />
}
function Section(props: ComponentProps<"section">) {
  return <section {...props} className={cn("pt-16", props.className)} />
}
function InlineExternalLink(props: ComponentProps<"a">) {
  return <a {...props} className={cn("text-foreground4/75 hover:text-foreground3 underline-offset-4 decoration-foreground4/25", props.className)} target="_blank" />
}
function ExternalLinkRow(props: ComponentProps<"div">) {
  return <div {...props} className={cn("text-foreground2 text-sm flex gap-3 lowercase", props.className)} />
}
function ListBlock(props: ComponentProps<"div">) {
  return <div {...props} className={cn("flex flex-col bg-background2 p-4 px-5 rounded-2xl -mx-5", props.className)} />
}


function ProjectSection() {
  return (<Section>
    <SectionHeader>
      <SectionTitle>projects</SectionTitle>
      <SectionDesc>
        I like to build stuff, especially open source libraries and tools.
        Here are some of my projects:
      </SectionDesc>
    </SectionHeader>
    <ListBlock>
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
            <Link href={`/project/${ p.name.replaceAll(' ', '-') }`}  key={i} className="flex flex-col group relative hover:brightness-125">
              <div className="text-foreground2 items-baseline lowercase flex flex-col gap-x-2 sm:flex-row leading-snug">
                <div className="hover:brightness-125 leading-tight flex gap-2">
                  {p.name}
                  <span className="text-foreground4 text-sm">
                    {p.type}
                  </span>
                  <span className="text-foreground4 text-sm">{p.timeFrame
                    ? '(' + range(p.timeFrame.start, p.timeFrame.end, 'year') + ')'
                    : null}
                  </span>
                </div>
              </div>
              {/* <div className="text-foreground3 text-sm lowercase leading-tight">
                {p.description}
              </div> */}
            </Link>
          )
        })}
    </ListBlock>
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
    <ListBlock className="gap-0">
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
    </ListBlock>
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
      <ListBlock className="gap-0 text-sm">
        {data.articles.map((a, i) => {
          return (
            <a key={i} href={a.url} className="hover:brightness-125">
              <span className="text-foreground2">{a.title}</span>{' '}
              <span className="text-foreground4 lowercase">{date(a.published_at, 'month-year')}</span>
            </a>
          )
        })
        }
      </ListBlock>

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
      <ListBlock className="gap-0 text-sm">
        {
          [
            { url: "https://cautious-palm-tree-ebon.vercel.app", description: "React drag and drop canvas control demo" },
            { url: "https://art-findr.vercel.app", description: "Demo app to find household assistants (Devscale final assignment)" },
            { url: "https://devscale-eventmaker-alfonsusac.vercel.app", description: "Devscale 5th assignment" },
            { url: "https://devscale-alfonsus-assignment-4.vercel.app", description: "Devscale 4th assignment" },
            { url: "https://assignment-3-devscale.vercel.app", description: "Devscale 3rd assignment" },
          ].map((a, i) => {
            return (
              <a key={i} href={a.url} target="_blank" className="hover:brightness-125">
                <span className="text-foreground2 hover:text-foreground">{a.url.replace('https://', '')}</span>{' '}
                <span className="text-foreground4">{a.description}</span>
              </a>
            )
          })
        }
      </ListBlock>
    </Section>
  )
}