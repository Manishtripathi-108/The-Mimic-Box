import { auth } from '@/auth';
import { HomePageView, LandingPageView } from '@/components/views';

const Page = async () => {
    const session = await auth();

    // Show landing page for unauthenticated users
    if (!session) {
        return <LandingPageView />;
    }

    // Show home dashboard for authenticated users
    return <HomePageView session={session} />;
};

export default Page;
