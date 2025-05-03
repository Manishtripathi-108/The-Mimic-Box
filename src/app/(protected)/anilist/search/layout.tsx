import A_Navbar from '@/app/(protected)/anilist/_components/A_Navbar';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="container mx-auto">
            <A_Navbar />

            <main className="p-2 sm:p-6">{children}</main>
        </div>
    );
};

export default Layout;
