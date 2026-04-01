import { article, directory, project } from "./content-utils"

export const data = {
  title: "alfon",
  fullName: "alfonsus ardani",
  socials: [
    { url: "https://x.com/alfonsusac", type: "X" },
    { url: "https://github.com/alfonsusac", type: "github" },
    { url: "https://www.linkedin.com/in/alfonsusac/", type: "linkedin" },
    { url: "https://bsky.app/profile/alfon.dev", type: "bsky" },
    { url: "https://discord.gg/c8MYbXtfvG", type: "discord" },
    { url: "https://www.npmjs.com/~alfonsusac", type: "npmjs" },
    { url: "https://npmx.dev/~alfonsusac", type: "npmx" },
  ],
  projects: [
    project("app", "diffy", {
      description: "Compare two text files and see the differences side by side powered by @pierre/diffs",
      url: {
        github: "alfonsusac/diffy",
        site: "https://diffy.alfon.dev/",
      },
      timeFrame: { start: new Date('Mar 21, 2026') },
      icon: "https://diffy.alfon.dev/icon.png",
      thumbnail: "https://diffy.alfon.dev/opengraph-image.png",
    }),
    project("tool", "check-site-meta", {
      description: "Check site metadata locally via npx before deployment",
      url: {
        package: "check-site-meta",
        github: "alfonsusac/check-site-meta",
        site: "https://checksitemeta.alfon.dev/",
      },
      timeFrame: { start: new Date('Mar 9, 2025'), end: new Date('Jun 7, 2025') },
      icon: "https://checksitemeta.alfon.dev/icon.png",
      thumbnail: undefined
    }),
    project("ui", "react-flip-children", {
      description: "FLIP animation for React components",
      url: {
        package: "react-flip-children",
        github: "alfonsusac/react-flip-children",
        site: "https://react-flip-children.alfon.dev/",
      },
      timeFrame: { start: new Date('Dec 21, 2024'), end: new Date('Feb 19, 2025'), },
      icon: "https://react-flip-children.alfon.dev/icon.png",
      thumbnail: "https://react-flip-children.alfon.dev/opengraph-image.png",
    }),
    project("lib", "advent-event", {
      description: "Simple TS library to create advent events",
      url: {
        package: "advent-event",
        github: "alfonsusac/advent-event",
        site: "https://advent-event.alfon.dev/",
      },
      timeFrame: { start: new Date('Jan 6, 2025'), end: new Date('Jan 7, 2025'), },
      thumbnail: undefined,
    }),
    project("edu", "react-lava", {
      description: "Learn React via Animation",
      url: {
        github: "alfonsusac/react-lava",
        site: "https://react-lava.alfon.dev/",
      },
      timeFrame: { start: new Date('Dec 20, 2024'), end: new Date('Jan 2, 2025'), },
      thumbnail: "https://react-lava.alfon.dev/opengraph-image.png",
    }),
    project("app", "Dishook", {
      description: "Discord webhook generator",
      url: {
        github: "alfonsusac/dishook",
        site: "https://dishook.alfon.dev/",
      },
      timeFrame: { start: new Date('Dec 5, 2024'), end: new Date('Dec 18, 2024'), },
      icon: "https://dishook.alfon.dev/icon.png",
      thumbnail: undefined,
    }),
    project("app", "advent-of-ui", {
      description: "Advent of UI - 24 days of UI challenges",
      url: {
        github: "alfonsusac/advent-of-ui",
        site: "https://advent-of-ui.vercel.app/",
      },
      timeFrame: { start: new Date('Dec 1, 2024'), end: new Date('Dec 4, 2024'), },
      thumbnail: "https://advent-of-ui.vercel.app/opengraph-image.png",
    }),
    project("app", "VTuber Logo Collections", {
      description: "A collection of service logos with the VTuber style.",
      url: {
        github: "alfonsusac/vtuberlogos",
        site: "https://vtuberlogos.alfon.dev/",
      },
      timeFrame: { start: new Date('Apr 23, 2024'), end: new Date('May 27, 2024'), },
      icon: "https://vtuberlogos.alfon.dev/icon.png",
      thumbnail: "https://vtuberlogos.alfon.dev/opengraph-image.png",
    }),
    project("tool", "mermaid-ssr", {
      description: "Server side render mermaid diagrams via http (fetch-only)",
      url: {
        github: "alfonsusac/mermaid-ssr",
        site: "https://mermaid-ssr.alfon.dev/"
      },
      timeFrame: { start: new Date('Mar 30, 2024'), end: new Date('May 24, 2024'), },
      icon: "https://mermaid-ssr.alfon.dev/icon.png",
      thumbnail: "https://mermaid-ssr.alfon.dev/opengraph-image.png",
    }),
    project("lib", "nextjs-better-unstable-cache", {
      description: "Next.js cache function wrapper with better logging and options",
      url: {
        package: "nextjs-better-unstable-cache",
        github: "alfonsusac/nextjs-better-unstable-cache",
      },
      timeFrame: { start: new Date('Sep 12, 2023'), end: new Date('Apr 5, 2024'), },
      thumbnail: undefined
    }),

  ],
  directories: [
    directory("advent-event", "Simple TS library to create advent events."),
    directory("advent-of-ui", "24 days of UI challenges"),
    directory("auth", "Authentication playgrounds and experiments"),
    directory("checksitemeta", "Check site metadata locally"),
    directory("diffy", "compare two text files"),
    directory("dishook", "Discord webhook generator"),
    directory("mermaid-ssr", "render mermaid diagrams server side"),
    directory("nu-auth", "Type-safe stateless Next.js Authentication"),
    directory("react-flip-array", "Array reorder animation using FLIP"),
    directory("react-lava", "Learn React via Animation"),
    directory("ui", "A collection of small UI components that I use in my projects."),
    directory("util", "A collection of small utilities that I use in my projects."),
    directory("vtuberlogos", "VTuber Logo Compilations"),
  ],
  articles: [
    article("Git Concepts: Crash Course For Beginners", "https://alfonsusardani.notion.site/Git-Concepts-Crash-Course-For-Beginners-fa16256c65624048a115e2faa208cf31", new Date('Mar 11, 2024')),
    article("Next.js Data Cache Behavior", "https://alfonsusardani.notion.site/Next-js-Data-Cache-Behavior-44f1a579c6d74f25bc55d301786e94ab", new Date('Feb 7, 2024')),
  ]
} as const

// Helpers
