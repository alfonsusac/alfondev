import type { AnalyticsConfig } from "./config.lib"

export const analytics_config = {

  rawEvents: {
    columns: {
      "project_id": true,
      "event_name": true,
      "event_payload": true,
      "env": true,
      "timestamp": true,
    },
    events: {
      "pagevisit": {
        "referer": true,
        "country": true,
        "browser": true,
        "os": true,
        "lang": true,
      },
    },
    warnOnCapacity: [ '50%', '75%' ]
  },

  aggregates: {
    "project_country": {
      label: "Project Visitor by Country",
      hint: "to know how far your website has reached",
      columns: { project_id: true, country: true },
      view_cache_duration: "5s",
    },
    "project_hour": {
      label: "Project Visitor by Hour",
      hint: "to know when to post stuff or make updates",
      columns: { project_id: true, hour: true },
      view_cache_duration: "5s",
    },
    "project_day_referrer": {
      label: "Project Visitor by Date and Referer",
      hint: "to correlate with marketing posts and to know impact of marketing strategy between platforms",
      columns: { project_id: true, exact_day: true, referer: true },
      view_cache_duration: "5s",
    },
    "project_event": {
      label: "Project Events",
      hint: "to know if people used a certain feature or visited a path",
      columns: { project_id: true, event_name: true },
      view_cache_duration: "5s",
    },
    "monthly_distribution": {
      label: "Monthly Aggregates",
      hint: "to preserve long-term trends because raw events are expensive",
      columns: { project_id: true, month: true, dimension: true, dimension_value: true },
      view_cache_duration: "5s",
    },
  },

  projects: {
    "alfondev": {
      valid_domains: {
        "alfon.dev": true,
      },
      valid_event_names: {
        "pagevisit": true,
        "click": { type: "exact" },
      },
      require_api_key: false,
    }
  },

  routes: {
    '/analytics': {
      GET: {
        hint: "Displays the main analytics dashboard of alfon.dev.",
        return: "page"
      }
    },
    '/analytics/[project-id]': {
      GET: {
        hint: "Displays the analytics dashboard for a specific project, identified by [project-id].",
        return: "page"
      }
    },
    '/analytics/[project-id]/events': {
      GET: {
        hint: "Returns hints on how to send events for the project identified by [project-id].",
        return: "text"
      },
      POST: {
        hint: "Endpoint for sending analytics events for the project identified by [project-id].",
        body: {
          "e": {
            type: "$valid_event_names",
            hint: "Name of the event. Is it a page visit, click, or custom event?"
          },
          "n": {
            type: "'prod' | 'preview' | 'dev'",
            hint: "Environment of the event. Is it production, staging, or development?"
          },
          "p": {
            type: "object",
            hint: "Event payload. What data does the event carry? For example, for a page visit, it must include the URL, referrer, and user agent."
          }
        }
      }
    },
    '/analytics/[project-id]/stats': {
      GET: {
        return: "text",
        hint: "Prints out the available pre-aggregated statistics for the project identified by [project-id], along with hints on how to use them."
      }
    },
    '/analytics/[project-id]/stats/views': {
      GET: {
        hint: "Returns pre-aggregated statistics for the project identified by [project-id].",
        return: {
          "views": {
            type: "number",
            hint: "Total number of page visits recorded for the project.",
          }
        }
      }
    },
    '/analytics/[project-id]/stats/views/by-path/[exact-path-match]': {
      GET: {
        hint: "Returns pre-aggregated statistics for the project identified by [project-id] filtered by exact path match.",
        return: {
          "views": {
            type: "number",
            hint: "Total number of page visits recorded for the project with exact path match.",
          }
        }
      }
    },
  }
} satisfies AnalyticsConfig