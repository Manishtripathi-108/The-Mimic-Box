export type SpotifyUserProfile = {
    id: string;
    display_name: string | null;
    href: string;
    type: string;
    uri: string;
    email?: string;
    product?: string;
    country?: string;
    images: {
        url: string;
        height: number;
        width: number;
    }[];
    explicit_content?: {
        filter_enabled: boolean;
        filter_locked: boolean;
    };
    external_urls?: {
        spotify: string;
    };
    followers?: {
        total: number;
    };
};

export type SpotifyUserProfileErrors = {
    error: {
        status: 400;
        message: 'string';
    };
};
