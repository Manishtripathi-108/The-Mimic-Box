/*
  Warnings:

  - The values [youtube_music,amazon_music,itunes,apple_music] on the enum `LinkedAccountProvider` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `currentEmail` on the `ChangeEmailToken` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `ForgotPasswordToken` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `VerificationToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `ChangeEmailToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `ForgotPasswordToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `ChangeEmailToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ForgotPasswordToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."LinkedAccountProvider_new" AS ENUM ('spotify', 'jiosaavn', 'anilist', 'myanimelist');
ALTER TABLE "public"."LinkedAccount" ALTER COLUMN "provider" TYPE "public"."LinkedAccountProvider_new" USING ("provider"::text::"public"."LinkedAccountProvider_new");
ALTER TYPE "public"."LinkedAccountProvider" RENAME TO "LinkedAccountProvider_old";
ALTER TYPE "public"."LinkedAccountProvider_new" RENAME TO "LinkedAccountProvider";
DROP TYPE "public"."LinkedAccountProvider_old";
COMMIT;

-- DropIndex
DROP INDEX "public"."ChangeEmailToken_currentEmail_key";

-- DropIndex
DROP INDEX "public"."ForgotPasswordToken_email_key";

-- DropIndex
DROP INDEX "public"."VerificationToken_email_key";

-- AlterTable
ALTER TABLE "public"."ChangeEmailToken" DROP COLUMN "currentEmail",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ForgotPasswordToken" DROP COLUMN "email",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."VerificationToken" DROP COLUMN "email",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChangeEmailToken_userId_key" ON "public"."ChangeEmailToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPasswordToken_userId_key" ON "public"."ForgotPasswordToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_userId_key" ON "public"."VerificationToken"("userId");

-- AddForeignKey
ALTER TABLE "public"."VerificationToken" ADD CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForgotPasswordToken" ADD CONSTRAINT "ForgotPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChangeEmailToken" ADD CONSTRAINT "ChangeEmailToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
