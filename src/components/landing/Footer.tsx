import Link from 'next/link';

import Icon from '@/components/ui/Icon';
import APP_ROUTES from '@/constants/routes/app.routes';

const footerLinks = {
    product: [
        { name: 'Music', href: APP_ROUTES.MUSIC.DASHBOARD },
        { name: 'AniList', href: APP_ROUTES.ANILIST.USER.ANIME },
        { name: 'Games', href: APP_ROUTES.GAMES.TIC_TAC_TOE.ROOT },
        { name: 'Audio Tools', href: APP_ROUTES.AUDIO.CONVERTER },
    ],
    resources: [
        { name: 'Tune Sync', href: APP_ROUTES.TUNE_SYNC.ROOT },
        { name: 'Search Lyrics', href: APP_ROUTES.AUDIO.SEARCH_LYRICS },
        { name: 'Tags Editor', href: APP_ROUTES.AUDIO.TAGS_EDITOR },
    ],
    account: [
        { name: 'Sign In', href: APP_ROUTES.AUTH.LOGIN },
        { name: 'Register', href: APP_ROUTES.AUTH.REGISTER },
        { name: 'Profile', href: APP_ROUTES.USER.PROFILE },
    ],
};

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-tertiary border-border border-t px-4 py-12 sm:px-6">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="text-text-primary inline-flex items-center gap-2">
                            <Icon icon="appLogo" className="size-10" />
                            <span className="font-alegreya text-xl font-bold">Mimic Box</span>
                        </Link>
                        <p className="text-text-secondary mt-4 max-w-xs text-sm leading-relaxed">
                            Your ultimate entertainment hub for music streaming, anime tracking, gaming, and media tools.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-text-primary mb-4 font-semibold">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-text-secondary hover:text-highlight text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="text-text-primary mb-4 font-semibold">Resources</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-text-secondary hover:text-highlight text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div>
                        <h3 className="text-text-primary mb-4 font-semibold">Account</h3>
                        <ul className="space-y-3">
                            {footerLinks.account.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-text-secondary hover:text-highlight text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
                    <p className="text-text-secondary text-sm">© {currentYear} Mimic Box. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link
                            href="https://github.com/Manishtripathi-108/The-Mimic-Box"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-highlight transition-colors"
                            aria-label="GitHub Repository">
                            <Icon icon="github" className="size-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
