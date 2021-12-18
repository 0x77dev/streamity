/*
  Warnings:

  - Added the required column `cameraId` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "cameraId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "cameras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
