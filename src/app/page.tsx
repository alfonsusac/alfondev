export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center px-3 font-sans pb-10"
      style={{
        // @ts-expect-error custom css variable
        "--p-container": "0.75rem"
      }}
    >
      <div className="w-full max-w-screen-sm min-h-screen"
        style={{
          // @ts-expect-error custom css variable
          "--w-content": "640px"
        }}
      >
        <header className="pt-28 tracking-tight">
          <div className="text-3xl tracking-tighter">alfon</div>
          <div className="font-light text-foreground2 font-mono flex gap-4">
            <div>
              alfonsus ardani -
            </div>
            {
              [
                { url: "https://x.com/alfonsusac", description: "X" },
                { url: "https://github.com/alfonsusac", description: "github" },
                { url: "https://www.linkedin.com/in/alfonsusac/", description: "linkedin" },
                { url: "https://bsky.app/profile/alfonsus.bsky.social", description: "bsky" },
                { url: "https://discord.gg/c8MYbXtfvG", description: "discord" },
              ].map((a, i) => {
                return (
                  <div key={i} className="">
                    <a href={a.url} target="_blank" className="text-foreground2 hover:text-foreground">{a.description}</a>{' '}
                  </div>
                );
              })
            }
          </div>
        </header>

        <section className="pt-3">
          <div className="font-light text-foreground font-mono text-sm">I am a frontend developer  and a designer that build tools and helps community that empower developers.</div>
        </section>


        <section className="pt-20">
          <div className="font-mono text-lg tracking-tight text-foreground2 font-light pb-4">
            directories
          </div>
          {
            [
              { url: "react-flip-array.alfon.dev", description: "Array reorder animation using FLIP & Code animation" },
              { url: "react-learn.alfon.dev", description: "Learn React via Animation" },
              { url: "dishook.alfon.dev", description: "Discord webhook generator" },
              { url: "advent-of-ui.vercel.app", description: "Advent of UI - 24 days of UI challenges" },
              { url: "nu-auth.vercel.app", description: "Type-safe stateless Next.js Authentication" },
              { url: "vtuberlogos.alfon.dev", description: "VTuber Logo Compilations" },
              { url: "mermaid-ssr.alfon.dev", description: "Server side render mermaid diagrams" },
              { url: "github.com/alfonsusac/nextjs-better-unstable-cache", description: "Next.js cache function wrapper" },

            ].map((a, i) => {
              return (
                <div key={i} className="-indent-4 pl-4">
                  <a href={a.url} target="_blank" className="text-foreground3 hover:text-foreground">{a.url}</a>{' '}
                  <span className="text-foreground2">{a.description}</span>
                </div>
              );
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
                <div key={i} className="-indent-4 pl-4">
                  <a href={a.url} target="_blank" className="text-foreground3 hover:text-foreground">{a.title}</a>{' '}
                  <span className="text-foreground2">{a.description}</span>
                </div>
              );
            })
          }
        </section>

        <section className="pt-20">
          <div className="font-mono text-lg tracking-tight text-foreground2 font-light pb-4">
            demo
          </div>
          {
            [
              { url: "cautious-palm-tree-ebon.vercel.app", description: "React drag and drop canvas control demo" },
              { url: "art-findr.vercel.app", description: "Demo app to find household assistants (Devscale final assignment)" },
              { url: "devscale-eventmaker-alfonsusac.vercel.app", description: "Devscale 5th assignment" },
              { url: "devscale-alfonsus-assignment-4.vercel.app", description: "Devscale 4th assignment" },
              { url: "assignment-3-devscale.vercel.app/", description: "Devscale 3rd assignment" },
            ].map((a, i) => {
              return (
                <div key={i} className="-indent-4 pl-4">
                  <a href={a.url} target="_blank" className="text-foreground3 hover:text-foreground">{a.url}</a>{' '}
                  <span className="text-foreground2">{a.description}</span>
                </div>
              );
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
    </div>
  );
}
