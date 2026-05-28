-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Thing" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,
    "project" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "referer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Thing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Thing_project_event_location_referer_key" ON "Thing"("project", "event", "location", "referer");

