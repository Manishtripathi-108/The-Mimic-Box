import { fetchUserFavourites } from '@/actions/anilist.actions';
import { auth } from '@/auth';
import AnilistMain from '@/components/layout/anilist/AnilistMain';

const AnilistFavourites = async () => {
    const session = await auth();
    const anilist = session?.user?.linkedAccounts?.anilist;
    if (!anilist) {
        return null;
    }
    const response = await fetchUserFavourites(anilist.accessToken, anilist.id);
    if (response.success) {
        return response.payload ? <AnilistMain mediaLists={response.payload} type="favourites" /> : null;
    } else {
        return response.error;
    }
};

export default AnilistFavourites;
