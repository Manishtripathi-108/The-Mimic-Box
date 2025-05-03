const Layout = ({ header, popularTracks, albums }: { header: React.ReactNode; popularTracks: React.ReactNode; albums: React.ReactNode }) => {
    return (
        <main className="min-h-calc-full-height flex flex-col gap-6 p-2 sm:p-6">
            {header}
            {popularTracks}
            {albums}
        </main>
    );
};

export default Layout;
