/*
  Warnings:

  - The primary key for the `user_followed_albums` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_followed_albums` table. All the data in the column will be lost.
  - The primary key for the `user_followed_artists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_followed_artists` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."user_followed_albums_user_id_album_id_key";

-- DropIndex
DROP INDEX "public"."user_followed_artists_user_id_artist_id_key";

-- AlterTable
ALTER TABLE "public"."user_followed_albums" DROP CONSTRAINT "user_followed_albums_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "user_followed_albums_pkey" PRIMARY KEY ("user_id", "album_id");

-- AlterTable
ALTER TABLE "public"."user_followed_artists" DROP CONSTRAINT "user_followed_artists_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "user_followed_artists_pkey" PRIMARY KEY ("user_id", "artist_id");

-- CreateTable
CREATE TABLE "public"."track_urls" (
    "id" TEXT NOT NULL,
    "track_id" TEXT NOT NULL,
    "low" TEXT,
    "mid" TEXT,
    "high" TEXT,
    "lossless" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "track_urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_urls_track_id_key" ON "public"."track_urls"("track_id");

-- AddForeignKey
ALTER TABLE "public"."track_urls" ADD CONSTRAINT "track_urls_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
