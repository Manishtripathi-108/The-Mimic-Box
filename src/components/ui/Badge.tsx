import Slot from '@/components/Slot';
import { DATA_INVALID, FOCUS_RING, SVG_UTILS } from '@/lib/styles/tailwind.helpers';
import cn from '@/lib/utils/cn';

type BadgeVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'success';

type BadgeProps = {
    variant?: BadgeVariant;
    asChild?: boolean;
} & React.ComponentProps<'span'>;

const baseBadgeClasses =
    'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-[color,box-shadow] gap-1 overflow-hidden';

const variantClasses: Record<BadgeVariant, string> = {
    primary: 'border-transparent bg-primary text-text-primary hover:bg-primary/90',
    secondary: 'border-transparent bg-secondary text-text-secondary hover:bg-secondary/90',
    danger: 'border-transparent bg-red-100 text-danger hover:bg-red-200 focus-visible:ring-danger/300',
    outline: 'text-text-secondary',
    success: 'border-transparent bg-green-100 text-success hover:bg-green-200 focus-visible:ring-success/20',
};

const Badge = ({ className, variant = 'primary', asChild = false, children, ...props }: BadgeProps) => {
    const combinedClassName = cn(baseBadgeClasses, SVG_UTILS, DATA_INVALID, FOCUS_RING, variantClasses[variant], className);
    const Comp = asChild ? Slot : 'span';

    return (
        <Comp className={combinedClassName} {...props}>
            {children}
        </Comp>
    );
};

export default Badge;
