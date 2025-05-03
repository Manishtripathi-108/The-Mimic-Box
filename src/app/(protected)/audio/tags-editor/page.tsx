import { Metadata } from 'next';

import AudioMetaExtractor from '@/app/(protected)/audio/_components/AudioMetaExtractor';

export const metadata: Metadata = {
    title: 'Edit Audio MetaTags',
    description: 'Extract and edit audio metadata easily with our online audio meta extractor.',
};

const Page = () => {
    return <AudioMetaExtractor />;
};

export default Page;
