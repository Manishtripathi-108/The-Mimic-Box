import { Metadata } from 'next';

import AudioFileConverter from '@/app/(protected)/audio/_components/AudioFileConverter';

export const metadata: Metadata = {
    title: 'Audio File Converter',
    description: 'Convert and edit audio files easily with our online audio converter.',
};

const Page = () => {
    return <AudioFileConverter />;
};

export default Page;
