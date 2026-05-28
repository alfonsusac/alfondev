-- CreateTable
CREATE TABLE "RawEvents" (
    "id" BIGSERIAL NOT NULL,
    "project_id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "event_payload" JSONB NOT NULL,
    "schema_version" INTEGER NOT NULL DEFAULT 1,
    "env" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectCountry" (
    "id" SERIAL NOT NULL,
    "project_id" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectHour" (
    "id" SERIAL NOT NULL,
    "project_id" TEXT NOT NULL,
    "hour" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectDayReferer" (
    "id" SERIAL NOT NULL,
    "project_id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "referer" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectDayReferer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectEvent" (
    "id" SERIAL NOT NULL,
    "project_id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyDistribution" (
    "id" SERIAL NOT NULL,
    "project_id" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "dimension" TEXT NOT NULL,
    "dimension_value" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonthlyDistribution_pkey" PRIMARY KEY ("id")
);
