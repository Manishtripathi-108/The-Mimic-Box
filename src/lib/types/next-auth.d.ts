import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    interface User {
        spotifyAccessToken?: string;
        spotifyRefreshToken?: string;
        spotifyExpiresAt?: number;
        emailVerified?: Date;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        linkedAccounts?: ['spotify', 'anilist'];
        spotifyAccessToken?: string;
        spotifyRefreshToken?: string;
        spotifyExpiresAt?: number;
    }
}
