import Link from 'next/link';

import Icon from '@/components/ui/Icon';

const HorizontalScrollSection = ({
    title,
    children,
    href,
    className,
}: {
    title: string;
    children: React.ReactNode;
    href?: string;
    className?: string;
}) => {
    return (
        <section className={className}>
            <div className="mb-2 flex items-center justify-between px-4 sm:px-6">
                <h2 className="text-highlight font-alegreya text-2xl font-semibold tracking-wide">{title}</h2>
                {href && (
                    <Link
                        href={href}
                        title="Show All"
                        aria-label="Show All"
                        className="text-text-secondary hover:text-text-primary size-7 rotate-90 transition-colors">
                        <Icon icon="moreDots" className="size-full" />
                    </Link>
                )}
            </div>
            <div className="relative">
                <div className="from-primary pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l to-transparent" />
                <div className="from-primary pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r to-transparent" />
                <div className="flex gap-2 overflow-x-auto px-4 sm:gap-4 sm:px-6 sm:[scrollbar-width:none]">{children}</div>
            </div>
        </section>
    );
};

export default HorizontalScrollSection;
