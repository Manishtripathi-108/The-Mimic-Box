const parseBool = (value: string | undefined, defaultValue: boolean): boolean => {
    if (value === undefined) return defaultValue;
    return value.toLowerCase() === 'true';
};

const premiumMemberEnabled = parseBool(process.env.SPOTIFY_PREMIUM_MEMBER, false);
const enforcePremiumRequirement = parseBool(process.env.SPOTIFY_ENFORCE_PREMIUM_REQUIREMENT, true);
const showPolicyNotice = parseBool(process.env.SPOTIFY_SHOW_POLICY_NOTICE, true);
const disableRemovedFeatures = parseBool(process.env.SPOTIFY_DISABLE_REMOVED_ENDPOINTS, true);

export const spotifyPolicyConfig = {
    premiumMemberEnabled,
    enforcePremiumRequirement,
    disableRemovedFeatures,
    showPolicyNotice,
    isSpotifyAccessEnabled: !enforcePremiumRequirement || premiumMemberEnabled,
    policyChangeDate: '2026-02-11',
} as const;

export const spotifyPolicyNotice = {
    title: 'Spotify policy update in effect',
    description:
        'Spotify Development Mode now requires a Premium account and deprecated multiple endpoints. Spotify features are deactivated in this app until Premium mode is explicitly enabled.',
} as const;

export const getSpotifyPolicyBannerState = () => ({
    show: spotifyPolicyConfig.showPolicyNotice && !spotifyPolicyConfig.isSpotifyAccessEnabled,
    ...spotifyPolicyNotice,
});
