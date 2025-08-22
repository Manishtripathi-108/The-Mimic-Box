-- CreateEnum
CREATE TYPE "public"."LinkedAccountProvider" AS ENUM ('spotify', 'jiosaavn', 'youtube_music', 'amazon_music', 'itunes', 'apple_music', 'anilist', 'myanimelist');

-- CreateEnum
CREATE TYPE "public"."PlaylistVisibility" AS ENUM ('public', 'private', 'unlisted');

-- CreateEnum
CREATE TYPE "public"."TrackQuality" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "public"."AlbumType" AS ENUM ('album', 'single', 'ep', 'compilation');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dra73suxl/image/upload/v1742410227/profile_nes8vp.png',
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LinkedAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" "public"."LinkedAccountProvider" NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "expires_at" INTEGER NOT NULL,
    "token_type" TEXT,
    "scope" TEXT,
    "displayName" TEXT,
    "username" TEXT,
    "imageUrl" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dra73suxl/image/upload/v1742410227/profile_nes8vp.png',
    "bannerUrl" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dra73suxl/image/upload/v1742811780/scene-night-tree_raa1zn.jpg',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkedAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ForgotPasswordToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForgotPasswordToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChangeEmailToken" (
    "id" TEXT NOT NULL,
    "currentEmail" TEXT NOT NULL,
    "newEmail" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChangeEmailToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "sm" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dra73suxl/image/upload/w_50,h_50,c_fill/v1744229654/no_cover_image_fallback_jhsdj.png',
    "md" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dra73suxl/image/upload/w_150,h_150,c_fill/v1744229654/no_cover_image_fallback_jhsdj.png',
    "lg" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dra73suxl/image/upload/w_500,h_500,c_fill/v1744229654/no_cover_image_fallback_jhsdj.png',

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "spotifyId" TEXT,
    "jiosaavnId" TEXT,
    "itunesId" TEXT,
    "youtubeId" TEXT,
    "imageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Album" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3),
    "albumType" "public"."AlbumType" NOT NULL DEFAULT 'album',
    "description" TEXT,
    "totalTracks" INTEGER NOT NULL DEFAULT 0,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "spotifyId" TEXT,
    "jiosaavnId" TEXT,
    "itunesId" TEXT,
    "youtubeId" TEXT,
    "artistId" TEXT NOT NULL,
    "imageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Track" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "duration_ms" INTEGER,
    "trackNumber" INTEGER,
    "discNumber" INTEGER NOT NULL DEFAULT 1,
    "explicit" BOOLEAN NOT NULL DEFAULT false,
    "previewUrl" TEXT,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "isrc" TEXT,
    "spotifyId" TEXT,
    "jiosaavnId" TEXT,
    "itunesId" TEXT,
    "youtubeId" TEXT,
    "artistId" TEXT NOT NULL,
    "albumId" TEXT,
    "imageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Playlist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "public"."PlaylistVisibility" NOT NULL DEFAULT 'private',
    "collaborative" BOOLEAN NOT NULL DEFAULT false,
    "totalTracks" INTEGER NOT NULL DEFAULT 0,
    "totalDurationMs" INTEGER NOT NULL DEFAULT 0,
    "spotifyId" TEXT,
    "jiosaavnId" TEXT,
    "userId" TEXT NOT NULL,
    "imageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaylistTrack" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "PlaylistTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserLikedTrack" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLikedTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserFollowedArtist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollowedArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserFollowedAlbum" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollowedAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArtistGenre" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "ArtistGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AlbumGenre" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "AlbumGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrackGenre" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "TrackGenre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkedAccount_userId_provider_key" ON "public"."LinkedAccount"("userId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_email_key" ON "public"."VerificationToken"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPasswordToken_email_key" ON "public"."ForgotPasswordToken"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPasswordToken_token_key" ON "public"."ForgotPasswordToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ChangeEmailToken_currentEmail_key" ON "public"."ChangeEmailToken"("currentEmail");

-- CreateIndex
CREATE UNIQUE INDEX "ChangeEmailToken_newEmail_key" ON "public"."ChangeEmailToken"("newEmail");

-- CreateIndex
CREATE UNIQUE INDEX "ChangeEmailToken_token_key" ON "public"."ChangeEmailToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_slug_key" ON "public"."Artist"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_spotifyId_key" ON "public"."Artist"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_jiosaavnId_key" ON "public"."Artist"("jiosaavnId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_itunesId_key" ON "public"."Artist"("itunesId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_youtubeId_key" ON "public"."Artist"("youtubeId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_imageId_key" ON "public"."Artist"("imageId");

-- CreateIndex
CREATE INDEX "Artist_name_idx" ON "public"."Artist"("name");

-- CreateIndex
CREATE INDEX "Artist_popularity_idx" ON "public"."Artist"("popularity");

-- CreateIndex
CREATE UNIQUE INDEX "Album_slug_key" ON "public"."Album"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Album_spotifyId_key" ON "public"."Album"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_jiosaavnId_key" ON "public"."Album"("jiosaavnId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_itunesId_key" ON "public"."Album"("itunesId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_youtubeId_key" ON "public"."Album"("youtubeId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_imageId_key" ON "public"."Album"("imageId");

-- CreateIndex
CREATE INDEX "Album_title_idx" ON "public"."Album"("title");

-- CreateIndex
CREATE INDEX "Album_releaseDate_idx" ON "public"."Album"("releaseDate");

-- CreateIndex
CREATE INDEX "Album_artistId_idx" ON "public"."Album"("artistId");

-- CreateIndex
CREATE INDEX "Album_popularity_idx" ON "public"."Album"("popularity");

-- CreateIndex
CREATE UNIQUE INDEX "Track_slug_key" ON "public"."Track"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Track_isrc_key" ON "public"."Track"("isrc");

-- CreateIndex
CREATE UNIQUE INDEX "Track_spotifyId_key" ON "public"."Track"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Track_jiosaavnId_key" ON "public"."Track"("jiosaavnId");

-- CreateIndex
CREATE UNIQUE INDEX "Track_itunesId_key" ON "public"."Track"("itunesId");

-- CreateIndex
CREATE UNIQUE INDEX "Track_youtubeId_key" ON "public"."Track"("youtubeId");

-- CreateIndex
CREATE UNIQUE INDEX "Track_imageId_key" ON "public"."Track"("imageId");

-- CreateIndex
CREATE INDEX "Track_title_idx" ON "public"."Track"("title");

-- CreateIndex
CREATE INDEX "Track_artistId_idx" ON "public"."Track"("artistId");

-- CreateIndex
CREATE INDEX "Track_albumId_idx" ON "public"."Track"("albumId");

-- CreateIndex
CREATE INDEX "Track_popularity_idx" ON "public"."Track"("popularity");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_spotifyId_key" ON "public"."Playlist"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_jiosaavnId_key" ON "public"."Playlist"("jiosaavnId");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_imageId_key" ON "public"."Playlist"("imageId");

-- CreateIndex
CREATE INDEX "Playlist_userId_idx" ON "public"."Playlist"("userId");

-- CreateIndex
CREATE INDEX "Playlist_visibility_idx" ON "public"."Playlist"("visibility");

-- CreateIndex
CREATE INDEX "Playlist_name_idx" ON "public"."Playlist"("name");

-- CreateIndex
CREATE INDEX "PlaylistTrack_playlistId_position_idx" ON "public"."PlaylistTrack"("playlistId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistTrack_playlistId_trackId_key" ON "public"."PlaylistTrack"("playlistId", "trackId");

-- CreateIndex
CREATE INDEX "UserLikedTrack_userId_idx" ON "public"."UserLikedTrack"("userId");

-- CreateIndex
CREATE INDEX "UserLikedTrack_likedAt_idx" ON "public"."UserLikedTrack"("likedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserLikedTrack_userId_trackId_key" ON "public"."UserLikedTrack"("userId", "trackId");

-- CreateIndex
CREATE INDEX "UserFollowedArtist_userId_idx" ON "public"."UserFollowedArtist"("userId");

-- CreateIndex
CREATE INDEX "UserFollowedArtist_followedAt_idx" ON "public"."UserFollowedArtist"("followedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserFollowedArtist_userId_artistId_key" ON "public"."UserFollowedArtist"("userId", "artistId");

-- CreateIndex
CREATE INDEX "UserFollowedAlbum_userId_idx" ON "public"."UserFollowedAlbum"("userId");

-- CreateIndex
CREATE INDEX "UserFollowedAlbum_followedAt_idx" ON "public"."UserFollowedAlbum"("followedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserFollowedAlbum_userId_albumId_key" ON "public"."UserFollowedAlbum"("userId", "albumId");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "public"."Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_slug_key" ON "public"."Genre"("slug");

-- CreateIndex
CREATE INDEX "Genre_name_idx" ON "public"."Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistGenre_artistId_genreId_key" ON "public"."ArtistGenre"("artistId", "genreId");

-- CreateIndex
CREATE UNIQUE INDEX "AlbumGenre_albumId_genreId_key" ON "public"."AlbumGenre"("albumId", "genreId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackGenre_trackId_genreId_key" ON "public"."TrackGenre"("trackId", "genreId");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LinkedAccount" ADD CONSTRAINT "LinkedAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Artist" ADD CONSTRAINT "Artist_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Album" ADD CONSTRAINT "Album_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Track" ADD CONSTRAINT "Track_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Track" ADD CONSTRAINT "Track_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Playlist" ADD CONSTRAINT "Playlist_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistTrack" ADD CONSTRAINT "PlaylistTrack_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistTrack" ADD CONSTRAINT "PlaylistTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLikedTrack" ADD CONSTRAINT "UserLikedTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLikedTrack" ADD CONSTRAINT "UserLikedTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFollowedArtist" ADD CONSTRAINT "UserFollowedArtist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFollowedArtist" ADD CONSTRAINT "UserFollowedArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFollowedAlbum" ADD CONSTRAINT "UserFollowedAlbum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFollowedAlbum" ADD CONSTRAINT "UserFollowedAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistGenre" ADD CONSTRAINT "ArtistGenre_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistGenre" ADD CONSTRAINT "ArtistGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "public"."Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AlbumGenre" ADD CONSTRAINT "AlbumGenre_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AlbumGenre" ADD CONSTRAINT "AlbumGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "public"."Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackGenre" ADD CONSTRAINT "TrackGenre_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackGenre" ADD CONSTRAINT "TrackGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "public"."Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
