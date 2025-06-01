const Layout = ({ children, popularTracks, albums }: { children: React.ReactNode; popularTracks: React.ReactNode; albums: React.ReactNode }) => {
    return (
        <div className="flex flex-col gap-6">
            {children}
            {popularTracks}
            {albums}
        </div>
    );
};

export default Layout;
