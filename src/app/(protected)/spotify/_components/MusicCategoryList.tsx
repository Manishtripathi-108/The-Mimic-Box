'use client';

import MusicCategoryCard from '@/app/(protected)/spotify/_components/MusicCategoryCard';

type Category = {
    title: string;
    imageUrl: string;
    musicCount: number;
};

const baseCategories: Omit<Category, 'imageUrl'>[] = [
    { title: 'Mood', musicCount: 300 },
    { title: 'Kids', musicCount: 300 },
    { title: 'Classic', musicCount: 300 },
    { title: 'Rock', musicCount: 300 },
    { title: 'Pop', musicCount: 300 },
    { title: 'Jazz', musicCount: 300 },
    { title: 'Indie', musicCount: 300 },
];

const categories: Category[] = baseCategories.map((cat, i) => ({
    ...cat,
    imageUrl: `https://picsum.photos/300/200?random=${i + 1}`,
}));

const MusicCategoryList = () => (
    <section className="relative">
        <div className="from-primary pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l to-transparent" />
        <div className="from-primary pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r to-transparent" />

        <div className="flex gap-2 overflow-x-auto px-4 sm:gap-4 sm:px-6 sm:[scrollbar-width:none]">
            {categories.map((category, idx) => (
                <MusicCategoryCard key={`${category.title}-${idx}`} {...category} />
            ))}
        </div>
    </section>
);

export default MusicCategoryList;
