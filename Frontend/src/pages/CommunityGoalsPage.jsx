import { useState, useEffect } from 'react';
import Card from '../components/atoms/Card';
import Icon from '../components/atoms/Icon';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';

// Services
import goalsService from '../services/goalsService';
import pointsService from '../services/pointsService';

// =============================================================================
// COMPONENTS
// =============================================================================

const LoadingSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
);

const ErrorDisplay = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
        <Icon name="error" className="text-red-500" size={32} />
        <p className="text-gray-500 mt-2">{message}</p>
        <Button variant="ghost" size="sm" onClick={onRetry} className="mt-2">
            <Icon name="refresh" size={16} className="mr-1" /> Retry
        </Button>
    </div>
);

// =============================================================================
// FALLBACK DATA
// =============================================================================

const FALLBACK_GOALS = {
    priorityGoal: {
        title: 'Reduce Peak Hour Usage',
        description: 'Target: Reduce community electricity consumption by 15% between 6PM and 9PM this month.',
        completionPercentage: 75,
        currentValue: 1240,
        targetUnit: 'kWh',
        daysRemaining: 12,
    },
    activeGoals: [
        { id: '1', title: 'Community Garden', participantCount: 24, targetValue: 30, completionPercentage: 80, description: 'Volunteer 2 hours this weekend for planting new saplings.' },
        { id: '2', title: 'No Plastic Week', participantCount: 85, targetValue: 100, completionPercentage: 85, description: 'Commit to zero single-use plastic usage for 7 days.' },
        { id: '3', title: 'E-Waste Drive', participantCount: 12, targetValue: 50, completionPercentage: 24, description: 'Collect and recycle old electronics at the clubhouse.' },
    ],
};

const FALLBACK_LEADERBOARD = [
    { name: 'Sharma Family', score: 450, rank: 1 },
    { name: 'Block A, 302', score: 420, rank: 2 },
    { name: 'Villa 12', score: 390, rank: 3 },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function CommunityGoalsPage() {
    // State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [goalsData, setGoalsData] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [joiningGoal, setJoiningGoal] = useState(null);

    /**
     * Fetch goals and leaderboard data
     */
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [goals, leaderboardData] = await Promise.all([
                goalsService.getActiveGoals().catch(() => null),
                // Get leaderboard - need society ID from user
                pointsService.getLeaderboard('default', { limit: 5 }).catch(() => null),
            ]);

            setGoalsData(goals);
            setLeaderboard(leaderboardData?.leaderboard || []);

        } catch (err) {
            console.error('Fetch goals error:', err);
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /**
     * Handle join goal
     */
    const handleJoinGoal = async (goalId) => {
        setJoiningGoal(goalId);
        try {
            await goalsService.joinGoal(goalId);
            fetchData(); // Refresh
        } catch (err) {
            console.error('Join goal error:', err);
        } finally {
            setJoiningGoal(null);
        }
    };

    // Use data or fallbacks
    const priorityGoal = goalsData?.priorityGoal || FALLBACK_GOALS.priorityGoal;
    const activeGoals = goalsData?.activeGoals?.length > 0 ? goalsData.activeGoals : FALLBACK_GOALS.activeGoals;
    const leaderboardData = leaderboard.length > 0 ? leaderboard : FALLBACK_LEADERBOARD;
    const useFallback = !goalsData;

    return (
        <div className="flex flex-col gap-8">
            {/* Fallback warning banner */}
            {useFallback && !loading && (
                <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-3">
                    <Icon name="info" className="text-yellow-600" />
                    <span className="text-sm text-yellow-800 dark:text-yellow-200">
                        Showing sample data. Connect to see your community's actual goals.
                    </span>
                </div>
            )}

            <div>
                <h1 className="text-3xl font-bold dark:text-white">Community Goals</h1>
                <p className="text-gray-500">Collective challenges to improve our neighborhood score.</p>
            </div>

            {error && !goalsData ? (
                <Card>
                    <ErrorDisplay message={error} onRetry={fetchData} />
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Featured Goal */}
                        <div className="lg:col-span-2">
                            {loading ? (
                                <Card><LoadingSkeleton /></Card>
                            ) : (
                                <Card className="h-full bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="relative size-48 flex-shrink-0">
                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                <circle className="text-white/50 stroke-current" cx="50" cy="50" fill="none" r="45" strokeWidth="10" />
                                                <circle
                                                    className="text-primary stroke-current transition-all duration-1000"
                                                    cx="50" cy="50" fill="none" r="45" strokeWidth="10"
                                                    strokeDasharray="282.7"
                                                    strokeDashoffset={282.7 - (282.7 * priorityGoal.completionPercentage) / 100}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-4xl font-black text-primary">
                                                    {priorityGoal.completionPercentage}%
                                                </span>
                                                <span className="text-xs font-bold uppercase text-gray-500">Completed</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <Badge variant="primary" className="mb-2">Priority Goal</Badge>
                                            <h2 className="text-2xl font-bold mb-2 dark:text-white">{priorityGoal.title}</h2>
                                            <p className="text-gray-600 dark:text-gray-300 mb-6">{priorityGoal.description}</p>
                                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                                <div className="text-center md:text-left">
                                                    <p className="text-2xl font-bold dark:text-white">
                                                        {priorityGoal.currentValue?.toLocaleString() || 0}{' '}
                                                        <span className="text-sm font-normal text-gray-500">{priorityGoal.targetUnit}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 uppercase font-bold">Saved so far</p>
                                                </div>
                                                <div className="w-px h-10 bg-gray-300 dark:bg-gray-700 hidden md:block" />
                                                <div className="text-center md:text-left">
                                                    <p className="text-2xl font-bold dark:text-white">
                                                        {priorityGoal.daysRemaining}{' '}
                                                        <span className="text-sm font-normal text-gray-500">days</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 uppercase font-bold">Remaining</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>

                        {/* Leaderboard */}
                        <Card>
                            <h3 className="font-bold flex items-center gap-2 mb-4 dark:text-white">
                                <Icon name="leaderboard" className="text-yellow-500" /> Top Challengers
                            </h3>
                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="animate-pulse flex items-center gap-3">
                                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                            <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {leaderboardData.map((row, i) => (
                                        <div key={row.userId || i} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                    {row.rank || i + 1}
                                                </div>
                                                <span className="font-medium dark:text-white">{row.name}</span>
                                            </div>
                                            <span className="font-bold text-primary">{row.score} pts</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>

                    <h2 className="text-xl font-bold mt-4 dark:text-white">Active Challenges</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <Card key={i}><LoadingSkeleton /></Card>
                            ))
                        ) : (
                            activeGoals.map((item) => (
                                <Card key={item.id} className="flex flex-col justify-between hover:border-primary/50 transition-colors">
                                    <div>
                                        <h3 className="text-lg font-bold mb-1 dark:text-white">{item.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4 min-h-[40px]">{item.description}</p>

                                        <div className="flex justify-between text-xs font-medium mb-1 dark:text-gray-300">
                                            <span>{item.participantCount} Participants</span>
                                            <span>Target: {item.targetValue}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-1000"
                                                style={{ width: `${item.completionPercentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        variant={item.isJoined ? "secondary" : "secondary"}
                                        className="w-full"
                                        onClick={() => handleJoinGoal(item.id)}
                                        disabled={joiningGoal === item.id}
                                    >
                                        {joiningGoal === item.id ? 'Joining...' : item.isJoined ? 'Joined ✓' : 'Join Event'}
                                    </Button>
                                </Card>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
