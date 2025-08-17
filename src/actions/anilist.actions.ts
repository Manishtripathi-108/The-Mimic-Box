'use server';

import {
    AnilistMedia,
    AnilistMediaCollection,
    AnilistMediaIds,
    AnilistMediaListStatus,
    AnilistMediaType,
    AnilistMediaWithRecommendations,
    AnilistPageInfo,
    AnilistQuery,
    AnilistSaveMediaListEntry,
    AnilistUser,
    AnilistUserFavourites,
} from '@/lib/types/anilist.types';
import { createAniListError, createSuccess } from '@/lib/utils/createResponse.utils';
import { fetchAniListData } from '@/lib/utils/server.utils';

const mediaQuery = (additional = '') => `{
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
                }
                bannerImage
                coverImage {
                    extraLarge
                }
                startDate {
                    day
                    month
                    year
                }
                ${additional}
            }`;

/* ------------------------- Media Search & Details ------------------------- */
export const getFilteredMediaList = async ({ search, type = 'ANIME', page, perPage, season, year, sort, genres, format, status }: AnilistQuery) => {
    const query = `
    query ($search: String, $type: MediaType, $season: MediaSeason, $seasonYear: Int, $sort: [MediaSort], $page: Int = 1, $perPage: Int = 6, $genres: [String], $status: MediaStatus, $format: MediaFormat) {
        Page(page: $page, perPage: $perPage) {
        pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
        }
            media(search: $search, type: $type, season: $season, seasonYear: $seasonYear, sort: $sort, genre_in: $genres, status: $status, format: $format) ${mediaQuery()}
        }
    }
`;

    const [error, response] = await fetchAniListData<{
        Page: {
            pageInfo: AnilistPageInfo;
            media: AnilistMedia[];
        };
    }>(null, query, {
        search: search || undefined,
        type,
        season: season === 'ALL' ? undefined : season,
        seasonYear: year,
        sort,
        page,
        perPage,
        genres: genres || undefined,
        format,
        status,
    });

    if (error || !response) return createAniListError('Error fetching search results', { error });

    return createSuccess('Search results fetched successfully', response.Page);
};

export const getMediaDetailsWithRecommendations = async (type: AnilistMediaType, id: number) => {
    const query = `
        query Query($mediaId: Int, $type: MediaType) {
            Media(id: $mediaId, type: $type) ${mediaQuery(
                `recommendations {
                    nodes {
                        mediaRecommendation ${mediaQuery()}
                    }
                }`
            )}
            
        }
    `;

    const [error, response] = await fetchAniListData<{ Media: AnilistMediaWithRecommendations }>(null, query, { mediaId: id, type });
    if (error || !response) return createAniListError('Error fetching media data', { error });
    return createSuccess('Media data fetched successfully', response.Media);
};

/* ------------------------- User Profile & Media ------------------------- */
export const getUserProfile = async (token: string): Promise<AnilistUser | null> => {
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

    if (error || !response) return null;

    return response;
};

/**
 * Fetches a user's media list from Anilist.
 */
export const getUserMediaCollections = async (token: string, userId: string, mediaType: AnilistMediaType) => {
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
                        media ${mediaQuery()}
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
        sort: 'UPDATED_TIME_DESC',
    });

    if (error || !mediaListCollection) {
        return createAniListError(`Failed to load ${mediaType.toLowerCase()}. Try again later!`, { error });
    }

    return createSuccess('User media fetched successfully', mediaListCollection.MediaListCollection.lists);
};

export const getUserMediaEntry = async (token: string, userId: string, mediaId: number, mediaType: AnilistMediaType) => {
    const query = `query ($mediaId: Int, $type: MediaType,  $userId: Int) {
                        MediaList(mediaId: $mediaId, type: $type, userId: $userId) {
                            id
                            status
                            progress
                            score
                        }
                    }`;

    const [error, response] = await fetchAniListData<{ MediaList: { id: number; status: AnilistMediaListStatus; progress: number; score: number } }>(
        token,
        query,
        { mediaId, type: mediaType, userId }
    );

    if (error || !response) {
        return createAniListError('Error fetching user data', { error });
    }

    return createSuccess('User data fetched successfully', response.MediaList);
};

/**
 * Fetches a user's favourite anime & manga from Anilist.
 */
export const getUserFavourites = async (token: string, userId: string) => {
    const query = `
        query ($userId: Int) {
            User(id: $userId) {
                favourites {
                    anime {
                        nodes ${mediaQuery()}
                    }
                    manga {
                        nodes ${mediaQuery()}
                    }
                }
            }
        }
    `;

    const [error, response] = await fetchAniListData<AnilistUserFavourites>(token, query, { userId });

    if (error || !response) {
        return createAniListError('Error fetching user favourites', { error });
    }

    return createSuccess('User favourites fetched successfully', response.User.favourites);
};

/* ------------------------- Media Actions ------------------------- */
/**
 * Saves or updates a media entry on Anilist.
 */
export const updateMediaProgress = async (
    token: string,
    type: AnilistMediaType,
    mediaId: number,
    status: AnilistMediaListStatus,
    progress: number
) => {
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
        return createAniListError('Error saving media entry', { error });
    }

    return createSuccess('Media entry saved successfully', response.SaveMediaListEntry);
};

/**
 * Toggles the favourite status of a media item (anime or manga).
 */
export const toggleMediaFavouriteStatus = async (token: string, mediaId: number, mediaType: AnilistMediaType) => {
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
        return createAniListError('Error toggling favourite status', { error });
    }

    const favouriteNodes = response.ToggleFavourite[mediaType.toLowerCase()]?.nodes || [];
    const isFavouriteNow = favouriteNodes.some((node) => node.id === mediaId);

    return createSuccess(isFavouriteNow ? 'Favourite added successfully' : 'Favourite remove successfully', { isFavourite: isFavouriteNow });
};

/**
 * Deletes a media entry from the user's list.
 */
export const removeMediaFromList = async (token: string, entryId: number) => {
    const mutation = `
        mutation DeleteMediaListEntry($entryId: Int) {
            DeleteMediaListEntry(id: $entryId) {
                deleted
            }
        }
    `;

    const [error, response] = await fetchAniListData<{ DeleteMediaListEntry: { deleted: boolean } }>(token, mutation, { entryId });

    if (error || !response) {
        return createAniListError('Error deleting media entry', { error });
    }

    return createSuccess('Media entry deleted successfully', { deleted: response.DeleteMediaListEntry.deleted });
};

/* --------------------------- External ID Mapping -------------------------- */
/**
 * Fetches Anilist IDs for a list of MyAnimeList (MAL) IDs.
 */
export const getAniListIdsByMalIds = async (token: string, malIds: number[], mediaType: AnilistMediaType) => {
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
        return createAniListError('Error fetching Anilist IDs', { error });
    }

    return createSuccess('Anilist IDs fetched successfully', response.Page.media);
};
