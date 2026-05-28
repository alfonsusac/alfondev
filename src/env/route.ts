export function GET() {
  return new Response(`

# Node

NODE_ENV=${ process.env.NODE_ENV }


# Vercel 

VERCEL=${ process.env.VERCEL }
CI=${ process.env.CI }
VERCEL_ENV=${ process.env.VERCEL_ENV }
VERCEL_TARGET_ENV=${ process.env.VERCEL_TARGET_ENV }
VERCEL_URL=${ process.env.VERCEL_URL }
VERCEL_BRANCH_URL=${ process.env.VERCEL_BRANCH_URL }
VERCEL_PROJECT_PRODUCTION_URL=${ process.env.VERCEL_PROJECT_PRODUCTION_URL }

    `.trim())
}