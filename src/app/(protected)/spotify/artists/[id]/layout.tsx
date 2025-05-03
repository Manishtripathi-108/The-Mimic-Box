const Layout = ({ header, popularTracks, albums }: { header: React.ReactNode; popularTracks: React.ReactNode; albums: React.ReactNode }) => {
    return (
        <div className="flex flex-col gap-6">
            {header}
            {popularTracks}
            {albums}
        </div>
    );
};

export default Layout;
