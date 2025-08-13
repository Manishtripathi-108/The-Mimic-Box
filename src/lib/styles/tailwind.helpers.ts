// Common SVG styling utility
export const SVG_UTILS = '[&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-5 [&_svg]:shrink-0';

// Universal focus ring styling
export const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring/50 focus-visible:ring-offset-1';

// Focus ring when error/invalid
export const FOCUS_RING_ERROR = 'focus-visible:ring-0 focus-visible:ring-red-500 focus-visible:ring-offset-1';

// Disabled styles
export const DISABLED = 'disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed';

// Data invalid styles
export const DATA_INVALID =
    'invalid:border invalid:border-red-500 invalid:text-red-500 invalid:ring-red-300 data-[invalid=true]:border data-[invalid=true]:border-red-500 data-[invalid=true]:text-red-500 data-[invalid=true]:ring-red-300 aria-[invalid=true]:border aria-[invalid=true]:border-red-500 aria-[invalid=true]:text-red-500 aria-[invalid=true]:ring-red-300';
