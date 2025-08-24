-- CreateEnum
CREATE TYPE "public"."LinkedAccountProvider" AS ENUM ('spotify', 'jiosaavn', 'anilist', 'myanimelist');

-- CreateEnum
CREATE TYPE "public"."PlaylistVisibility" AS ENUM ('public', 'private', 'unlisted');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "image" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dra73suxl/image/upload/v1742410227/profile_nes8vp.png',
    "email_verified" TIMESTAMP(3),
    "email_changed_on" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "scope" TEXT,
    "token_type" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("provider","provider_account_id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."linked_accounts" (
    "user_id" TEXT NOT NULL,
    "display_name" TEXT,
    "user_name" TEXT,
    "type" TEXT NOT NULL,
    "provider" "public"."LinkedAccountProvider" NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "scope" TEXT,
    "expires" TIMESTAMP(3) NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "token_type" TEXT,
    "image" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dra73suxl/image/upload/v1742410227/profile_nes8vp.png',
    "banner" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dra73suxl/image/upload/v1742811780/scene-night-tree_raa1zn.jpg',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "linked_accounts_pkey" PRIMARY KEY ("user_id","provider")
);

-- CreateTable
CREATE TABLE "public"."verification_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."forgot_password_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forgot_password_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."change_email_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "new_email" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "change_email_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."playlists" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "public"."PlaylistVisibility" NOT NULL DEFAULT 'public',
    "collaborative" BOOLEAN NOT NULL DEFAULT false,
    "last_synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "spotify_id" TEXT,
    "image" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dra73suxl/image/upload/w_500,h_500,c_fill/v1744229654/no_cover_image_fallback_jhsdj.png',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."playlist_tracks" (
    "id" TEXT NOT NULL,
    "playlist_id" TEXT NOT NULL,
    "track_id" TEXT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."playlist_followers" (
    "id" TEXT NOT NULL,
    "playlist_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "followed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_followers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tracks" (
    "id" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,
    "album_id" TEXT,
    "image_id" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isrc" TEXT,
    "duration_ms" INTEGER,
    "track_number" INTEGER,
    "disc_number" INTEGER NOT NULL DEFAULT 1,
    "explicit" BOOLEAN NOT NULL DEFAULT false,
    "preview_url" TEXT,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "spotify_id" TEXT,
    "jiosaavn_id" TEXT,
    "itunes_id" TEXT,
    "youtube_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."artists" (
    "id" TEXT NOT NULL,
    "image_id" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "spotify_id" TEXT,
    "jiosaavn_id" TEXT,
    "itunes_id" TEXT,
    "youtube_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."albums" (
    "id" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,
    "image_id" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "release_date" TIMESTAMP(3),
    "total_tracks" INTEGER,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "spotify_id" TEXT,
    "jiosaavn_id" TEXT,
    "itunes_id" TEXT,
    "youtube_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."images" (
    "id" TEXT NOT NULL,
    "sm" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dra73suxl/image/upload/w_50,h_50,c_fill/v1744229654/no_cover_image_fallback_jhsdj.png',
    "md" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dra73suxl/image/upload/w_150,h_150,c_fill/v1744229654/no_cover_image_fallback_jhsdj.png',
    "lg" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dra73suxl/image/upload/w_500,h_500,c_fill/v1744229654/no_cover_image_fallback_jhsdj.png',

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."genres" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_liked_tracks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "track_id" TEXT NOT NULL,
    "liked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_liked_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_followed_artists" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,
    "followed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_followed_artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_followed_albums" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "album_id" TEXT NOT NULL,
    "followed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_followed_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ArtistToGenre" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArtistToGenre_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AlbumToGenre" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AlbumToGenre_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_GenreToTrack" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GenreToTrack_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "public"."sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_user_id_key" ON "public"."verification_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "public"."verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "forgot_password_tokens_user_id_key" ON "public"."forgot_password_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "forgot_password_tokens_token_key" ON "public"."forgot_password_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "change_email_tokens_user_id_key" ON "public"."change_email_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "change_email_tokens_token_key" ON "public"."change_email_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "change_email_tokens_new_email_key" ON "public"."change_email_tokens"("new_email");

-- CreateIndex
CREATE UNIQUE INDEX "playlists_slug_key" ON "public"."playlists"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "playlists_spotify_id_key" ON "public"."playlists"("spotify_id");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_tracks_playlist_id_track_id_key" ON "public"."playlist_tracks"("playlist_id", "track_id");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_followers_playlist_id_user_id_key" ON "public"."playlist_followers"("playlist_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_image_id_key" ON "public"."tracks"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_slug_key" ON "public"."tracks"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_isrc_key" ON "public"."tracks"("isrc");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_spotify_id_key" ON "public"."tracks"("spotify_id");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_jiosaavn_id_key" ON "public"."tracks"("jiosaavn_id");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_itunes_id_key" ON "public"."tracks"("itunes_id");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_youtube_id_key" ON "public"."tracks"("youtube_id");

-- CreateIndex
CREATE INDEX "tracks_title_idx" ON "public"."tracks"("title");

-- CreateIndex
CREATE INDEX "tracks_artist_id_idx" ON "public"."tracks"("artist_id");

-- CreateIndex
CREATE INDEX "tracks_album_id_idx" ON "public"."tracks"("album_id");

-- CreateIndex
CREATE INDEX "tracks_popularity_idx" ON "public"."tracks"("popularity");

-- CreateIndex
CREATE UNIQUE INDEX "artists_image_id_key" ON "public"."artists"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "artists_slug_key" ON "public"."artists"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "artists_spotify_id_key" ON "public"."artists"("spotify_id");

-- CreateIndex
CREATE UNIQUE INDEX "artists_jiosaavn_id_key" ON "public"."artists"("jiosaavn_id");

-- CreateIndex
CREATE UNIQUE INDEX "artists_itunes_id_key" ON "public"."artists"("itunes_id");

-- CreateIndex
CREATE UNIQUE INDEX "artists_youtube_id_key" ON "public"."artists"("youtube_id");

-- CreateIndex
CREATE INDEX "artists_name_idx" ON "public"."artists"("name");

-- CreateIndex
CREATE INDEX "artists_popularity_idx" ON "public"."artists"("popularity");

-- CreateIndex
CREATE UNIQUE INDEX "albums_image_id_key" ON "public"."albums"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "albums_slug_key" ON "public"."albums"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "albums_spotify_id_key" ON "public"."albums"("spotify_id");

-- CreateIndex
CREATE UNIQUE INDEX "albums_jiosaavn_id_key" ON "public"."albums"("jiosaavn_id");

-- CreateIndex
CREATE UNIQUE INDEX "albums_itunes_id_key" ON "public"."albums"("itunes_id");

-- CreateIndex
CREATE UNIQUE INDEX "albums_youtube_id_key" ON "public"."albums"("youtube_id");

-- CreateIndex
CREATE INDEX "albums_title_idx" ON "public"."albums"("title");

-- CreateIndex
CREATE INDEX "albums_artist_id_idx" ON "public"."albums"("artist_id");

-- CreateIndex
CREATE INDEX "albums_popularity_idx" ON "public"."albums"("popularity");

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "public"."genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genres_slug_key" ON "public"."genres"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_liked_tracks_user_id_track_id_key" ON "public"."user_liked_tracks"("user_id", "track_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_followed_artists_user_id_artist_id_key" ON "public"."user_followed_artists"("user_id", "artist_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_followed_albums_user_id_album_id_key" ON "public"."user_followed_albums"("user_id", "album_id");

-- CreateIndex
CREATE INDEX "_ArtistToGenre_B_index" ON "public"."_ArtistToGenre"("B");

-- CreateIndex
CREATE INDEX "_AlbumToGenre_B_index" ON "public"."_AlbumToGenre"("B");

-- CreateIndex
CREATE INDEX "_GenreToTrack_B_index" ON "public"."_GenreToTrack"("B");

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."linked_accounts" ADD CONSTRAINT "linked_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."forgot_password_tokens" ADD CONSTRAINT "forgot_password_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."change_email_tokens" ADD CONSTRAINT "change_email_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlists" ADD CONSTRAINT "playlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_tracks" ADD CONSTRAINT "playlist_tracks_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_tracks" ADD CONSTRAINT "playlist_tracks_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_followers" ADD CONSTRAINT "playlist_followers_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_followers" ADD CONSTRAINT "playlist_followers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tracks" ADD CONSTRAINT "tracks_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tracks" ADD CONSTRAINT "tracks_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tracks" ADD CONSTRAINT "tracks_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."artists" ADD CONSTRAINT "artists_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."albums" ADD CONSTRAINT "albums_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."albums" ADD CONSTRAINT "albums_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_liked_tracks" ADD CONSTRAINT "user_liked_tracks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_liked_tracks" ADD CONSTRAINT "user_liked_tracks_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_followed_artists" ADD CONSTRAINT "user_followed_artists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_followed_artists" ADD CONSTRAINT "user_followed_artists_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_followed_albums" ADD CONSTRAINT "user_followed_albums_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_followed_albums" ADD CONSTRAINT "user_followed_albums_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ArtistToGenre" ADD CONSTRAINT "_ArtistToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ArtistToGenre" ADD CONSTRAINT "_ArtistToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AlbumToGenre" ADD CONSTRAINT "_AlbumToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AlbumToGenre" ADD CONSTRAINT "_AlbumToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GenreToTrack" ADD CONSTRAINT "_GenreToTrack_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GenreToTrack" ADD CONSTRAINT "_GenreToTrack_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
