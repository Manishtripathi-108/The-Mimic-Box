import A_Header from '@/app/(protected)/anilist/_components/A_Header';
import { auth } from '@/auth';
import AccountLinkCTA from '@/components/layout/AccountLinkCTA';

const AnilistLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    const anilist = session?.user?.linkedAccounts?.anilist;

    if (!anilist) {
        return (
            <main className="h-calc-full-height grid place-items-center">
                <AccountLinkCTA account="anilist" message="Link your Anilist account to view and manage your anime collection." />
            </main>
        );
    }

    return (
        <>
            <A_Header bannerUrl={anilist.bannerUrl} displayName={anilist.displayName || 'Anilist User'} imageUrl={anilist.imageUrl} />
            {children}
        </>
    );
};

export default AnilistLayout;
