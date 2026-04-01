import { data } from "@/content"
import { LinkButton, MaterialSymbolsGlobe, MaterialSymbolsHideImage, MaterialSymbolsPackage2, MdiGithub, PageHeader, PageInner, PageOuter } from "@/lib/ui"
import Link from "next/link"

export default async function ProjectPage(props: {
  params: Promise<{ project_id: string }>
}) {
  const { project_id } = await props.params

  const header = <header className="h-18 self-stretch -mx-10 px-10 flex items-center justify-center">
    <div className="w-full max-w-3xl flex items-center justify-between">
      <div className="flex gap-8 items-center">
        <div className="text-2xl tracking-tight">alfon</div>
        <div className="flex gap-2">
          <LinkButton href="/" className="text-sm text-foreground3 hover:brightness-125">home</LinkButton>
        </div>
      </div>
      <div>

      </div>
    </div>
  </header>

  const project = data.projects.find(p => p.name.replaceAll(' ', '-') === project_id)
  if (!project) return (
    <PageOuter>
      {header}
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
      {header}
      <PageInner className="flex flex-col gap-8">
        <PageHeader className="gap-2">
          <div className="text-foreground4">/project</div>
          <h1 className="text-4xl font-semibold tracking-tight">{project.name}</h1>
          <div className="text-foreground2 max-w-120 leading-snug">{project.description}</div>
          <section className='flex flex-col gap-2 pt-2'>
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
        </PageHeader>
        {project.thumbnail &&
          <section>
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
              {/* <div className="absolute rounded-xl inset-0 shadow-[inset_-0.05rem_0.05rem_0.2rem_#fff5,_inset_0.05rem_-0.05rem_0.2rem_#000]" /> */}
            </div>
          </section>
        }
      </PageInner>
    </PageOuter>
  )
}