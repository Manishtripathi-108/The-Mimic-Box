'use server';

import {
    AnilistMedia,
    AnilistMediaCollection,
    AnilistMediaIds,
    AnilistMediaType,
    AnilistQuery,
    AnilistSaveMediaListEntry,
    AnilistUser,
    AnilistUserFavourites,
} from '@/lib/types/anilist.types';
import { createAniListErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { fetchAniListData } from '@/lib/utils/server.utils';

export const searchAnilistMedia = async ({ search, type = 'ANIME', page, perPage, season, year, sort, genres, format, status }: AnilistQuery) => {
    const ANIME_QUERY = `
    query ($search: String, $type: MediaType, $season: MediaSeason, $seasonYear: Int, $sort: [MediaSort], $page: Int = 1, $perPage: Int = 6, $genre: String, $status: MediaStatus) {
        Page(page: $page, perPage: $perPage) {
            media(search: $search, type: $type, season: $season, seasonYear: $seasonYear, sort: $sort, genre: $genre, status: $status) {
                id
                type
                format
                status
                description
                duration
                chapters
                episodes
                genres
                season
                averageScore
                popularity
                favourites
                isFavourite
                title {
                    romaji
                    english
                    native
                    userPreferred
                }
                bannerImage
                coverImage {
                    large
                }
                startDate {
                    day
                    month
                    year
                }
            }
        }
    }
`;

    const [error, response] = await fetchAniListData<{ Page: { media: AnilistMedia[] } }>(null, ANIME_QUERY, {
        search,
        type,
        season,
        seasonYear: year,
        sort,
        page,
        perPage,
        genres,
        format,
        status,
    });

    if (error || !response) return createAniListErrorReturn('Error fetching search results', error);

    return createSuccessReturn('Search results fetched successfully', response.Page.media);
};

export const getAnilistUserProfile = async (token: string): Promise<AnilistUser | null> => {
    const query = `
        query {
            Viewer {
                id
                name
                avatar { large }
                bannerImage
            }
        }
    `;

    const [error, response] = await fetchAniListData<AnilistUser>(token, query);

    if (error || !response) {
        console.error('Error fetching user data:', error);
        return null;
    }

    return response;
};

/**
 * Fetches a user's media list from Anilist.
 */
export const getAnilistUserMedia = async (token: string, userId: string, mediaType: AnilistMediaType) => {
    const query = `
        query ($userId: Int, $type: MediaType, $sort: [MediaListSort]) {
            MediaListCollection(userId: $userId, type: $type, sort: $sort) {
                lists {
                    name
                    status
                    entries {
                        id
                        progress
                        status
                        updatedAt
                        createdAt
                        media {
                            id
                            type
                            format
                            status
                            season
                            description
                            duration
                            chapters
                            episodes
                            genres
                            averageScore
                            popularity
                            favourites
                            isFavourite
                            title {
                                romaji
                                english
                                native
                                userPreferred
                            }
                            bannerImage
                            coverImage {
                                large
                            }
                            startDate {
                                day
                                month
                                year
                            }
                        }
                    }
                }
            }
        }
    `;

    // const onlyIdsQuery = `
    //     query ($userId: Int, $type: MediaType) {
    //         MediaListCollection(userId: $userId, type: $type) {
    //             lists {
    //                 name
    //                 entries {
    //                     media {
    //                         id
    //                         idMal
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // `;

    const [error, mediaListCollection] = await fetchAniListData<AnilistMediaCollection>(token, query, {
        userId,
        type: mediaType,
        sort: 'UPDATED_TIME',
    });

    if (error || !mediaListCollection) {
        return createAniListErrorReturn(`Failed to load ${mediaType.toLowerCase()}. Try again later!`, error);
    }

    return createSuccessReturn('User media fetched successfully', mediaListCollection.MediaListCollection.lists);
};

/**
 * Fetches a user's favourite anime & manga from Anilist.
 */
export const fetchUserFavourites = async (token: string, userId: string) => {
    const query = `
        query ($userId: Int) {
            User(id: $userId) {
                favourites {
                    anime {
                        nodes {
                            id
                            type
                            format
                            status
                            season
                            description
                            duration
                            chapters
                            episodes
                            genres
                            averageScore
                            popularity
                            favourites
                            isFavourite
                            title {
                                romaji
                                english
                                native
                                userPreferred
                            }
                            bannerImage
                            coverImage {
                                large
                            }
                            startDate {
                                day
                                month
                                year
                            }
                        }
                    }
                    manga {
                        nodes {
                            id
                            type
                            format
                            status
                            season
                            description
                            duration
                            chapters
                            episodes
                            genres
                            averageScore
                            popularity
                            favourites
                            isFavourite
                            title {
                                romaji
                                english
                                native
                                userPreferred
                            }
                            bannerImage
                            coverImage {
                                large
                            }
                            startDate {
                                day
                                month
                                year
                            }
                        }
                    }
                }
            }
        }
    `;

    const [error, response] = await fetchAniListData<AnilistUserFavourites>(token, query, { userId });

    if (error || !response) {
        return createAniListErrorReturn('Error fetching user favourites', error);
    }

    return createSuccessReturn('User favourites fetched successfully', response.User.favourites);
};

/**
 * Fetches Anilist IDs for a list of MyAnimeList (MAL) IDs.
 */
export const fetchAniListIdsOfMAL = async (token: string, malIds: number[], mediaType: AnilistMediaType) => {
    const query = `
        query ($idMals: [Int], $type: MediaType) {
            Page {
                media(idMal_in: $idMals, type: $type) {
                    id
                    idMal
                }
            }
        }
    `;

    const [error, response] = await fetchAniListData<AnilistMediaIds>(token, query, { idMals: malIds, type: mediaType });

    if (error || !response) {
        return createAniListErrorReturn('Error fetching Anilist IDs', error);
    }

    return createSuccessReturn('Anilist IDs fetched successfully', response.Page.media);
};

/**
 * Saves or updates a media entry on Anilist.
 */
export const saveMediaEntry = async (token: string, mediaId: number, status: string, progress: number) => {
    const mutation = `
        mutation ($mediaId: Int, $status: MediaListStatus, $progress: Int) {
            SaveMediaListEntry(mediaId: $mediaId, status: $status, progress: $progress) {
                id
                status
                progress
            }
        }
    `;

    const [error, response] = await fetchAniListData<{ SaveMediaListEntry: AnilistSaveMediaListEntry }>(token, mutation, {
        mediaId,
        status,
        progress,
    });

    if (error || !response) {
        return createAniListErrorReturn('Error saving media entry', error);
    }

    return createSuccessReturn('Media entry saved successfully', response.SaveMediaListEntry);
};

/**
 * Toggles the favourite status of a media item (anime or manga).
 */
export const toggleFavourite = async (token: string, mediaId: number, mediaType: AnilistMediaType) => {
    const mutation = `
        mutation ToggleFavourite($mediaId: Int) {
            ToggleFavourite(${mediaType.toLowerCase()}Id: $mediaId) {
                ${mediaType.toLowerCase()} {
                    nodes {
                        id
                    }
                }
            }
        }
    `;

    const [error, response] = await fetchAniListData<{ ToggleFavourite: { [key: string]: { nodes: { id: number }[] } } }>(token, mutation, {
        mediaId,
    });

    if (error || !response) {
        return createAniListErrorReturn('Error toggling favourite status', error);
    }

    const favouriteNodes = response.ToggleFavourite[mediaType.toLowerCase()]?.nodes || [];
    const isFavouriteNow = favouriteNodes.some((node) => node.id === mediaId);

    return createSuccessReturn(isFavouriteNow ? 'Favourite added successfully' : 'Favourite remove successfully', { isFavourite: isFavouriteNow });
};

/**
 * Deletes a media entry from the user's list.
 */
export const deleteMediaEntry = async (token: string, entryId: number) => {
    const mutation = `
        mutation DeleteMediaListEntry($entryId: Int) {
            DeleteMediaListEntry(id: $entryId) {
                deleted
            }
        }
    `;

    const [error, response] = await fetchAniListData<{ DeleteMediaListEntry: { deleted: boolean } }>(token, mutation, { entryId });

    if (error || !response) {
        return createAniListErrorReturn('Error deleting media entry', error);
    }

    return createSuccessReturn('Media entry deleted successfully', { deleted: response.DeleteMediaListEntry.deleted });
};
