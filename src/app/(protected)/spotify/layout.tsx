import MusicMiniPlayer from '@/app/(protected)/spotify/_components/MusicMiniPlayer';
import { auth } from '@/auth';
import AccountLinkCTA from '@/components/layout/AccountLinkCTA';

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
        <div className="min-h-calc-full-height p-2 sm:p-6">
            <main className="mb-16">{children}</main>
            <MusicMiniPlayer />
        </div>
    );
};

export default Layout;
