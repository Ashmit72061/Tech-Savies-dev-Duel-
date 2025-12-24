import Card from '../components/atoms/Card';
import Icon from '../components/atoms/Icon';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';

// Mock Component for the Progress Ring (Hardcoded SVG)
const GreenScoreRing = ({ score }) => (
    <div className="relative w-48 h-48 mx-auto my-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle className="text-gray-100 dark:text-gray-700 stroke-current" cx="50" cy="50" fill="none" r="45" strokeWidth="8"></circle>
            <circle
                className="text-primary stroke-current transition-all duration-1000 ease-out"
                cx="50" cy="50" fill="none" r="45" strokeWidth="8"
                strokeDasharray="282.7"
                strokeDashoffset={282.7 - (282.7 * score) / 100}
                strokeLinecap="round"
            ></circle>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{score}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">out of 100</span>
        </div>
    </div>
);

export default function ResidentDashboard() {
    return (
        <div className="flex flex-col gap-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Welcome back, Alex</h1>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                        <Icon name="trending_up" className="text-primary" size={20} />
                        You're in the top 15% of improvers this month!
                    </p>
                </div>
                <div className="bg-white dark:bg-card-dark px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">Current Period:</span>
                    <span className="font-bold dark:text-white">October 2023</span>
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
                            <Badge variant="success" className="flex items-center">
                                <Icon name="arrow_upward" size={16} /> 5%
                            </Badge>
                        </div>

                        <GreenScoreRing score={82} />

                        <div className="text-center z-10">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status: Sustainability Champion</p>
                            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-primary w-[82%] rounded-full"></div>
                            </div>
                            <p className="text-xs text-gray-500">Keep it up! You are in the <span className="text-primary font-bold">Green Zone</span>.</p>
                        </div>
                    </Card>
                </div>

                {/* Stats Grid */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Energy', value: '240', unit: 'kWh', icon: 'bolt', color: 'text-yellow-500', bg: 'bg-yellow-100', progress: 45 },
                            { label: 'Water', value: '3k', unit: 'Gal', icon: 'water_drop', color: 'text-blue-500', bg: 'bg-blue-100', progress: 75 },
                            { label: 'Waste', value: '2', unit: 'Bags', icon: 'recycling', color: 'text-green-600', bg: 'bg-green-100', progress: 20 },
                        ].map((stat, i) => (
                            <Card key={i} className="hover:border-primary/50 transition-colors flex flex-col justify-between h-40">
                                <div className="flex justify-between items-start">
                                    <div className={`p-2 rounded-full ${stat.bg} ${stat.color} dark:bg-opacity-20`}>
                                        <Icon name={stat.icon} />
                                    </div>
                                    <Badge variant="neutral">Track</Badge>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">{stat.label}</p>
                                    <p className="text-2xl font-bold dark:text-white">{stat.value} <span className="text-sm text-gray-400 font-medium">{stat.unit}</span></p>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                                    <div className={`h-1.5 rounded-full ${stat.color.replace('text', 'bg')}`} style={{ width: `${stat.progress}%` }}></div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Tips / Actions Area */}
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-primary/20 p-1.5 rounded"><Icon name="tips_and_updates" className="text-primary-dark" size={20} /></div>
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
