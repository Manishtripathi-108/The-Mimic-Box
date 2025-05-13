export type T_DownloadLink = {
    quality: '12kbps' | '48kbps' | '96kbps' | '160kbps' | '320kbps';
    url: string;
};

export type T_ImageLink = { quality: '50x50' | '150x150' | '500x500'; url: string };

export type T_SearchSection<T> = {
    results: T[];
    position: number;
};

export type T_SearchAPIResponseSection<T> = {
    data: T[];
    position: number;
};

export type T_EntityBase = {
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

export type T_NormalizedEntityBase = {
    id: string;
    title: string;
    image: T_ImageLink[];
    type: string;
    description: string;
};
