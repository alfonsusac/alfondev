import type { Duration } from "@/lib/duration"

export type ColumnSchema = {
  [ ColumnKey: string ]: true
}

export type AnalyticsConfig = {
  rawEvents: {
    columns: ColumnSchema,
    warnOnCapacity: `${ number }%`[],
    events: {
      [ EventName: string ]: ColumnSchema
    }
  }
  aggregates: {
    [ AggregateKey: string ]: {
      label: string,
      hint: string,
      columns: ColumnSchema,
      view_cache_duration: Duration
    }
  },
  projects: {
    [ ProjectKey: string ]: {
      valid_domains: { [ Domain: string ]: true | { path: "/*" | `/${ string }/*` } },
      valid_event_names: {
        "pagevisit"?: true,
        [ TypeKey: string ]: { type: "exact" | "prefix" | "path" } | true | undefined,
      },
      require_api_key: false | string,
    }
  },

  routes: {
    [ RouteKey: `/${ string }` ]: {
      GET?: {
        hint: string,
        query?: {
          [ QueryKey: string ]: true
        },
        return: "page" | "text" | {
          [ ReturnKey: string ]: {
            type: "string" | "number" | "boolean",
            hint: string,
          }
        }
      },
      POST?: {
        hint: string,
        body?: {
          [ BodyKey: string ]: {
            type: string,
            hint: string,
          }
        }
      }
    }
  }
}