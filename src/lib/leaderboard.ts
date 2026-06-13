/**
 * Shared leaderboard scoring used by both the Staff Hub leaderboard tab
 * and the Gamification page.
 *
 * Score breakdown (max 100):
 *  - Volume   40 pts  — services completed relative to top performer
 *  - Earnings 20 pts  — total commission earned, capped at 50 000 RWF
 *  - Rating   40 pts  — average review rating out of 5 (0 if no reviews)
 */

export interface LeaderboardInput {
    id: string;
    fullName: string;
    branchName: string;
    category: string;
    serviceCount: number;
    totalEarned: number;       // sum of CommissionLog.amount
    averageRating: number;     // 0 if no reviews
    reviewCount: number;
}

export interface LeaderboardEntry extends LeaderboardInput {
    score: number;
}

export function computeLeaderboard(inputs: LeaderboardInput[]): LeaderboardEntry[] {
    const maxServices = Math.max(...inputs.map(e => e.serviceCount), 1);

    return inputs
        .map(emp => {
            const volumeScore   = (emp.serviceCount / maxServices) * 40;
            const earningsBonus = Math.min(emp.totalEarned / 50_000, 1) * 20;
            const ratingBonus   = emp.averageRating > 0 ? (emp.averageRating / 5) * 40 : 0;
            const score         = Math.round(Math.min(10 + volumeScore + earningsBonus + ratingBonus, 100));
            return { ...emp, score };
        })
        .sort((a, b) => b.score - a.score);
}
