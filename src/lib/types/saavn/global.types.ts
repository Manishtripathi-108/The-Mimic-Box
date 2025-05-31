export type T_SaavnDownloadLink = {
    quality: '12kbps' | '48kbps' | '96kbps' | '160kbps' | '320kbps';
    url: string;
};

export type T_SaavnImageLink = { quality: '50x50' | '150x150' | '500x500'; url: string };

export type T_SaavnSearchSection<T> = {
    results: T[];
    position: number;
};

export type T_SaavnSearchAPIResponseSection<T> = {
    data: T[];
    position: number;
};

export type T_SaavnEntityBase = {
    id: string;
    title: string;
    type: string;
    image: string;
    description: string;
    mini_obj: boolean;
    perma_url: string;
    subtitle: string;
    explicit_content?: string;
};

export type T_SaavnNormalizedEntityBase = {
    id: string;
    title: string;
    image: T_SaavnImageLink[];
    type: string;
    description: string;
};

export type T_SaavnLyrics = {
    lyrics: string;
    script_tracking_url: string;
    lyrics_copyright: string;
    snippet: string;
};
