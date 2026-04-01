import { data } from "@/content"
import { LinkButton, MaterialSymbolsGlobe, MaterialSymbolsHideImage, MaterialSymbolsPackage2, MaterialSymbolsStarRateRounded, MdiGithub, PageHeader, PageInner, PageOuter, SiteHeader } from "@/lib/ui"
import { Suspense } from "react"

export default async function ProjectPage(props: {
  params: Promise<{ project_id: string }>
}) {
  const { project_id } = await props.params

  const project = data.projects.find(p => p.name.replaceAll(' ', '-') === project_id)
  if (!project) return (
    <PageOuter>
      <SiteHeader />
      <PageInner>
        <PageHeader className="gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl">Project "{project_id}"" not found!</h1>
            <p className="text-foreground3 max-w-80">This project may been removed, deleted or never existed in the first place...</p>
          </div>
          <LinkButton href="/"> Back to Home</LinkButton>
        </PageHeader>
      </PageInner>
    </PageOuter>
  )

  return (
    <PageOuter>
      <SiteHeader />
      <PageInner className="flex flex-col gap-6">
        <PageHeader className="gap-2">
          <div className="text-foreground4">/project</div>
          <h1 className="text-4xl font-semibold tracking-tight">{project.name}</h1>
          <div className="text-foreground2 max-w-120 leading-snug">{project.description}</div>
        </PageHeader>
        <section className='flex flex-col gap-2'>
          <div className="flex flex-col gap-1">
            {project.url.github &&
              <div className="text-foreground3 max-w-120 flex gap-2 items-center">
                <MdiGithub className="w-5 h-5" />
                <a target="_blank" href={`https://github.com/${ project.url.github }`} className="hover:brightness-150">
                  {project.url.github}
                </a>
              </div>
            }
            {project.url.site &&
              <div className="text-foreground3 max-w-120 flex gap-2 items-center">
                <MaterialSymbolsGlobe className="w-5 h-5" />
                <a target="_blank" href={project.url.site} className="hover:brightness-150">
                  {new URL(project.url.site).host}
                </a>
              </div>
            }
            {project.url.package &&
              <div className="text-foreground3 max-w-120 flex gap-2 items-center">
                <MaterialSymbolsPackage2 className="w-5 h-5" />
                <a target="_blank" href={`https://npmx.dev/${ project.url.package }`} className="hover:brightness-150">
                  {project.url.package}
                </a>
              </div>
            }
          </div>
        </section>
        {project.thumbnail &&
          <section className="my-2">
            <div className="aspect-[1200/630] bg-foreground4/5 rounded-xl outline-8 outline-foreground4/10 relative overflow-hidden flex items-center justify-center">
              <img
                width="1200"
                height="630"
                className="rounded-xl absolute inset-0"
                src={project.thumbnail}
              />
              <div className="text-foreground4 flex gap-2 items-center justify-center">
                <MaterialSymbolsHideImage />
                Image Failed to Load
              </div>
            </div>
          </section>
        }
        <section className="flex gap-2">
          {project.url.github &&
            <div className="p-2 px-5 rounded-xl flex items-center gap-1 bg-foreground4/5 text-sm font-semibold">
              <MaterialSymbolsStarRateRounded className="-ml-1 w-5 h-5" />
              Stars
              <div className="text-xs font-semibold rounded-full bg-foreground4/25 min-w-6 h-6 px-2 flex items-center justify-center">
                <Suspense fallback="...">
                  <GHStars repo_id={project.url.github} errorFallback="?" />
                </Suspense>
              </div>
            </div>
          }
        </section>
      </PageInner>
    </PageOuter>
  )
}

async function GHStars(props: {
  repo_id: string,
  errorFallback?: string,
}) {
  try {
    const repo = await (await fetch(`https://api.github.com/repos/${ props.repo_id }`, {
      next: {
        revalidate: 60
      }
    })).json() as unknown
    if (typeof repo === "object"
      && repo !== null
      && "stargazers_count" in repo
      && typeof repo.stargazers_count === "number"
    ) {
      return repo.stargazers_count
    }
    return props.errorFallback
  } catch (error) {
    return props.errorFallback
  }
}

