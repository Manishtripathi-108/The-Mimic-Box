/*
  Warnings:

  - You are about to drop the column `expires` on the `ChangeEmailToken` table. All the data in the column will be lost.
  - You are about to drop the column `expires` on the `ForgotPasswordToken` table. All the data in the column will be lost.
  - You are about to drop the column `expires` on the `VerificationToken` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `ChangeEmailToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `ForgotPasswordToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ChangeEmailToken" DROP COLUMN "expires",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."ForgotPasswordToken" DROP COLUMN "expires",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."VerificationToken" DROP COLUMN "expires",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;
