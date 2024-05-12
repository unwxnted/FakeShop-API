/*
  Warnings:

  - Added the required column `admin` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `jwt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `admin` BOOLEAN NOT NULL,
    MODIFY `jwt` VARCHAR(191) NOT NULL;
