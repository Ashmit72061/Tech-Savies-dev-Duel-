import { useState, useEffect } from 'react';
import Card from '../components/atoms/Card';
import Icon from '../components/atoms/Icon';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';

// Services
import userService from '../services/userService';
import pointsService from '../services/pointsService';
import consumptionService from '../services/consumptionService';

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * Loading skeleton for dashboard cards
 */
const LoadingSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
);

/**
 * Error display with retry button
 */
const ErrorDisplay = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-4">
            <Icon name="error" className="text-red-500" size={32} />
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
        <Button onClick={onRetry} variant="secondary">
            <Icon name="refresh" size={18} className="mr-2" />
            Retry
        </Button>
    </div>
);

/**
 * Empty state with CTA
 */
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
            <Icon name="eco" className="text-primary" size={32} />
        </div>
        <h3 className="text-lg font-bold mb-2 dark:text-white">No Data Yet</h3>
        <p className="text-gray-500 mb-4">Record your first consumption to see your score!</p>
        <Button as="a" href="/resident/input">
            <Icon name="add" size={18} className="mr-2" />
            Enter Data
        </Button>
    </div>
);

/**
 * Progress Ring for Green Score
 */
const GreenScoreRing = ({ score, loading }) => {
    const [animatedScore, setAnimatedScore] = useState(0);

    // Animate score from 0 to actual value
    useEffect(() => {
        if (loading) return;

        const timer = setTimeout(() => {
            setAnimatedScore(score);
        }, 100);

        return () => clearTimeout(timer);
    }, [score, loading]);

    const displayScore = loading ? 0 : animatedScore;

    return (
        <div className="relative w-48 h-48 mx-auto my-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                    className="text-gray-100 dark:text-gray-700 stroke-current"
                    cx="50" cy="50" fill="none" r="45" strokeWidth="8"
                />
                <circle
                    className="text-primary stroke-current transition-all duration-1000 ease-out"
                    cx="50" cy="50" fill="none" r="45" strokeWidth="8"
                    strokeDasharray="282.7"
                    strokeDashoffset={282.7 - (282.7 * displayScore) / 100}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {loading ? (
                    <div className="animate-pulse">
                        <div className="h-12 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                ) : (
                    <>
                        <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                            {displayScore}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
                            out of 100
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

// =============================================================================
// FALLBACK DATA (for offline/error scenarios)
// =============================================================================

const FALLBACK_DATA = {
    user: { name: 'User' },
    points: { currentScore: 0, zone: 'improving', breakdown: { electricity: 0, water: 0, waste: 0 } },
    consumption: { electricity: 0, water: 0, wasteSegregation: 'yes' },
    billingPeriod: 'Current Period',
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ResidentDashboard() {
    // State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [pointsData, setPointsData] = useState(null);
    const [consumptionData, setConsumptionData] = useState(null);

    /**
     * Fetch all dashboard data
     */
    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch data in parallel
            const [user, points, consumption] = await Promise.all([
                userService.getProfile().catch(() => null),
                pointsService.getCurrentPoints().catch(() => null),
                consumptionService.getLatest().catch(() => null),
            ]);

            setUserData(user);
            setPointsData(points);
            setConsumptionData(consumption);

        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError(err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Derived values with fallbacks
    const userName = userData?.name?.split(' ')[0] || FALLBACK_DATA.user.name;
    const score = pointsData?.currentScore ?? FALLBACK_DATA.points.currentScore;
    const zone = pointsData?.zone || FALLBACK_DATA.points.zone;
    const zoneInfo = pointsService.getZoneInfo(zone);
    const billingPeriod = pointsData?.billingPeriod
        ? pointsService.formatBillingPeriod(pointsData.billingPeriod)
        : FALLBACK_DATA.billingPeriod;

    // Stats cards data
    const statsData = [
        {
            label: 'Energy',
            value: consumptionData?.electricity ?? FALLBACK_DATA.consumption.electricity,
            unit: 'kWh',
            icon: 'bolt',
            color: 'text-yellow-500',
            bg: 'bg-yellow-100',
            progress: pointsData?.breakdown?.electricity ? (pointsData.breakdown.electricity / 40) * 100 : 0
        },
        {
            label: 'Water',
            value: consumptionData?.water ? `${(consumptionData.water / 1000).toFixed(1)}k` : '0',
            unit: 'L',
            icon: 'water_drop',
            color: 'text-blue-500',
            bg: 'bg-blue-100',
            progress: pointsData?.breakdown?.water ? (pointsData.breakdown.water / 40) * 100 : 0
        },
        {
            label: 'Waste',
            value: consumptionData?.wasteSegregation === 'yes' ? 'Compliant' : 'Partial',
            unit: '',
            icon: 'recycling',
            color: 'text-green-600',
            bg: 'bg-green-100',
            progress: pointsData?.breakdown?.waste ? (pointsData.breakdown.waste / 20) * 100 : 0
        },
    ];

    // Error state
    if (error && !userData && !pointsData) {
        return (
            <div className="flex flex-col gap-8">
                <Card>
                    <ErrorDisplay message={error} onRetry={fetchDashboardData} />
                </Card>
            </div>
        );
    }

    // Empty state (no data yet)
    if (!loading && !pointsData && !consumptionData) {
        return (
            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                            Welcome, {userName}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Get started by recording your first consumption data!
                        </p>
                    </div>
                </div>
                <Card>
                    <EmptyState />
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                        Welcome back, {loading ? '...' : userName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                        <Icon name="trending_up" className="text-primary" size={20} />
                        {zone === 'green'
                            ? "You're in the Green Zone! Keep it up!"
                            : "You're making progress! Keep improving!"}
                    </p>
                </div>
                <div className="bg-white dark:bg-card-dark px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">Current Period:</span>
                    <span className="font-bold dark:text-white">
                        {loading ? '...' : billingPeriod}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Score Card */}
                <div className="lg:col-span-4">
                    <Card className="h-full relative overflow-hidden flex flex-col justify-between">
                        <div className="flex justify-between items-start z-10">
                            <div>
                                <h3 className="text-lg font-bold dark:text-white">Green Score</h3>
                                <p className="text-sm text-gray-500">Monthly Sustainability Rating</p>
                            </div>
                            {pointsData?.improvementBonus > 0 && (
                                <Badge variant="success" className="flex items-center">
                                    <Icon name="arrow_upward" size={16} />
                                    +{pointsData.improvementBonus}
                                </Badge>
                            )}
                        </div>

                        <GreenScoreRing score={score} loading={loading} />

                        <div className="text-center z-10">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Status: {zoneInfo.label}
                            </p>
                            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-1000"
                                    style={{ width: `${score}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                {zoneInfo.description}
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Stats Grid */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {statsData.map((stat, i) => (
                            <Card key={i} className="hover:border-primary/50 transition-colors flex flex-col justify-between h-40">
                                {loading ? (
                                    <div className="animate-pulse h-full">
                                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start">
                                            <div className={`p-2 rounded-full ${stat.bg} ${stat.color} dark:bg-opacity-20`}>
                                                <Icon name={stat.icon} />
                                            </div>
                                            <Badge variant="neutral">Track</Badge>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">{stat.label}</p>
                                            <p className="text-2xl font-bold dark:text-white">
                                                {stat.value} <span className="text-sm text-gray-400 font-medium">{stat.unit}</span>
                                            </p>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full ${stat.color.replace('text', 'bg')} transition-all duration-1000`}
                                                style={{ width: `${stat.progress}%` }}
                                            />
                                        </div>
                                    </>
                                )}
                            </Card>
                        ))}
                    </div>

                    {/* Tips / Actions Area */}
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-primary/20 p-1.5 rounded">
                                    <Icon name="tips_and_updates" className="text-primary-dark" size={20} />
                                </div>
                                <h3 className="text-lg font-bold dark:text-white">Boost Your Score</h3>
                            </div>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                { title: 'Install a low-flow showerhead', desc: 'Reduce water usage by 20%', pts: '+10 pts' },
                                { title: 'Compost kitchen scraps', desc: 'Divert waste from landfill', pts: '+5 pts' },
                            ].map((tip, i) => (
                                <div key={i} className="flex items-start gap-4 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors group">
                                    <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm group-hover:text-primary transition-colors dark:text-white">{tip.title}</p>
                                        <p className="text-xs text-gray-500">{tip.desc}</p>
                                    </div>
                                    <Badge variant="primary">{tip.pts}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
