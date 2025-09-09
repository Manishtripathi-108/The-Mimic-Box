/*
  Warnings:

  - You are about to drop the column `artist_id` on the `albums` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `albums` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `artists` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `genres` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `playlists` table. All the data in the column will be lost.
  - You are about to drop the column `artist_id` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `image_id` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `tracks` table. All the data in the column will be lost.
  - The primary key for the `user_followed_albums` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_followed_albums` table. All the data in the column will be lost.
  - The primary key for the `user_followed_artists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_followed_artists` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."albums" DROP CONSTRAINT "albums_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tracks" DROP CONSTRAINT "tracks_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tracks" DROP CONSTRAINT "tracks_image_id_fkey";

-- DropIndex
DROP INDEX "public"."albums_artist_id_idx";

-- DropIndex
DROP INDEX "public"."albums_slug_key";

-- DropIndex
DROP INDEX "public"."artists_slug_key";

-- DropIndex
DROP INDEX "public"."genres_slug_key";

-- DropIndex
DROP INDEX "public"."playlists_slug_key";

-- DropIndex
DROP INDEX "public"."tracks_artist_id_idx";

-- DropIndex
DROP INDEX "public"."tracks_image_id_key";

-- DropIndex
DROP INDEX "public"."tracks_slug_key";

-- DropIndex
DROP INDEX "public"."user_followed_albums_user_id_album_id_key";

-- DropIndex
DROP INDEX "public"."user_followed_artists_user_id_artist_id_key";

-- AlterTable
ALTER TABLE "public"."albums" DROP COLUMN "artist_id",
DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "public"."artists" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "public"."genres" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "public"."playlists" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "public"."tracks" DROP COLUMN "artist_id",
DROP COLUMN "image_id",
DROP COLUMN "slug";

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

-- CreateTable
CREATE TABLE "public"."_ArtistToTrack" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArtistToTrack_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AlbumToArtist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AlbumToArtist_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_urls_track_id_key" ON "public"."track_urls"("track_id");

-- CreateIndex
CREATE INDEX "_ArtistToTrack_B_index" ON "public"."_ArtistToTrack"("B");

-- CreateIndex
CREATE INDEX "_AlbumToArtist_B_index" ON "public"."_AlbumToArtist"("B");

-- AddForeignKey
ALTER TABLE "public"."track_urls" ADD CONSTRAINT "track_urls_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ArtistToTrack" ADD CONSTRAINT "_ArtistToTrack_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ArtistToTrack" ADD CONSTRAINT "_ArtistToTrack_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AlbumToArtist" ADD CONSTRAINT "_AlbumToArtist_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AlbumToArtist" ADD CONSTRAINT "_AlbumToArtist_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
