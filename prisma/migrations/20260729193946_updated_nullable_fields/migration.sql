/*
  Warnings:

  - Made the column `caption` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `metaData` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "caption" SET NOT NULL,
ALTER COLUMN "metaData" SET NOT NULL;
