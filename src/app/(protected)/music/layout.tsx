import MusicMiniPlayer from '@/app/(protected)/music/_components/MusicMiniPlayer';
import MusicSearch from '@/app/(protected)/music/_components/MusicSearch';
import { auth } from '@/auth';
import AccountLinkCTA from '@/components/layout/AccountLinkCTA';
import DownloadModal from '@/components/layout/DownloadModal';
import { AudioDownloadProvider } from '@/contexts/AudioDownload.context';
import { AudioPlayerProvider } from '@/contexts/AudioPlayer.context';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    const spotify = session?.user?.linkedAccounts?.spotify;

    if (!spotify) {
        return (
            <main className="h-calc-full-height grid place-items-center">
                <AccountLinkCTA account="spotify" message="Link your Spotify account to view and manage your music library." />
            </main>
        );
    }

    return (
        <div className="min-h-calc-full-height flex w-full flex-col p-2 sm:p-6">
            <AudioPlayerProvider>
                <AudioDownloadProvider>
                    <DownloadModal />
                    <MusicSearch />
                    <main className="mt-4 w-full pb-16">{children}</main>
                    <MusicMiniPlayer />
                </AudioDownloadProvider>
            </AudioPlayerProvider>
        </div>
    );
};

export default Layout;
