export const data = {
  title: "alfon",
  fullName: "alfonsus ardani",
  socials: [
    { url: "https://x.com/alfonsusac", description: "X" },
    { url: "https://github.com/alfonsusac", description: "github" },
    { url: "https://www.linkedin.com/in/alfonsusac/", description: "linkedin" },
    { url: "https://bsky.app/profile/alfon.dev", description: "bsky" },
    { url: "https://discord.gg/c8MYbXtfvG", description: "discord" },
  ],
  projects: [
    project({
      name: "check-site-meta",
      description: "Check site metadata locally via npx before deployment",
      url: {
        package: "check-site-meta",
        github: "alfonsusac/check-site-meta",
      },
      timeFrame: {
        start: new Date('2023-03-01'),
      }
    }),
    project({
      name: "react-flip-children",
      description: "FLIP animation for React components",
      url: {
        package: "react-flip-children",
        github: "alfonsusac/react-flip-children",
        site: "https://react-flip-children.alfon.dev/",
      }
    }),
    project({
      name: "advent-event",
      description: "Simple TS library to create advent events",
      url: {
        package: "advent-event",
        github: "alfonsusac/advent-event",
        site: "https://advent-event.alfon.dev/",
      }
    }),
    project({
      name: "mermaid-ssr",
      description: "Server side render mermaid diagrams via http (fetch-only)",
      url: {
        github: "alfonsusac/mermaid-ssr",
        site: "https://mermaid-ssr.alfon.dev/"
      }
    }),
    project({
      name: "nextjs-better-unstable-cache",
      description: "Next.js cache function wrapper with better logging and options",
      url: {
        package: "nextjs-better-unstable-cache",
        github: "alfonsusac/nextjs-better-unstable-cache",
      }
    })
  ]
}

// Helpers

function project(opts: {
  name: string,
  description: string,
  url: {
    package?: string,
    site?: string,
    github?: string,
  },
  timeFrame?: {
    start: Date,
    end?: Date,
  }
}) {
  return opts
}