'use client';

import { createContext, useContext, useState } from 'react';

import { T_DownloadFile } from '@/lib/types/client.types';

type DownloadContextType = {
    downloads: T_DownloadFile[];
    addDownload: (file: Omit<T_DownloadFile, 'status'>) => void;
    updateDownload: (id: string, updates: Partial<T_DownloadFile>) => void;
};

const DownloadContext = createContext<DownloadContextType | null>(null);

export const useDownload = () => {
    const context = useContext(DownloadContext);
    if (!context) {
        throw new Error('useDownload must be used within a DownloadProvider');
    }
    return context;
};

export const DownloadProvider = ({ children }: { children: React.ReactNode }) => {
    const [downloads, setDownloads] = useState<T_DownloadFile[]>([]);

    const addDownload = (file: Omit<T_DownloadFile, 'status'>) => {
        setDownloads((prev) => [...prev, { ...file, status: 'pending' }]);
    };

    const updateDownload = (id: string, updates: Partial<T_DownloadFile>) => {
        setDownloads((prev) => prev.map((file) => (file.id === id ? { ...file, ...updates } : file)));
    };

    return <DownloadContext.Provider value={{ downloads, addDownload, updateDownload }}>{children}</DownloadContext.Provider>;
};
