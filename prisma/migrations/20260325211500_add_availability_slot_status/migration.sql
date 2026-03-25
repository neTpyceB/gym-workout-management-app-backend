-- CreateEnum
CREATE TYPE "AvailabilitySlotStatus" AS ENUM ('OPEN', 'BUSY');

-- AlterTable
ALTER TABLE "AvailabilitySlot"
ADD COLUMN "status" "AvailabilitySlotStatus" NOT NULL DEFAULT 'OPEN';
