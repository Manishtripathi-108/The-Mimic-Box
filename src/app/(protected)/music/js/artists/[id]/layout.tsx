const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col gap-6">
            {children}
            {/* {popularTracks}
            {albums} */}
        </div>
    );
};

export default Layout;
