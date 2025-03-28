// This function returns the current season based on the current month.
export const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month <= 3) return 'WINTER';
    if (month <= 6) return 'SPRING';
    if (month <= 9) return 'SUMMER';
    return 'FALL';
};

// This function returns the next season based on the current month and year.
export const getNextSeason = (): { season: 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER'; year: number } => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    if (month <= 3) return { season: 'SPRING', year };
    if (month <= 6) return { season: 'SUMMER', year };
    if (month <= 9) return { season: 'FALL', year };
    return { season: 'WINTER', year: year + 1 };
};
