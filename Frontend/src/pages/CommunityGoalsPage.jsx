import Card from '../components/atoms/Card';
import Icon from '../components/atoms/Icon';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';

export default function CommunityGoalsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold dark:text-white">Community Goals</h1>
                <p className="text-gray-500">Collective challenges to improve our neighborhood score.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Featured Goal */}
                <div className="lg:col-span-2">
                    <Card className="h-full bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative size-48 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle className="text-white/50 stroke-current" cx="50" cy="50" fill="none" r="45" strokeWidth="10"></circle>
                                    <circle className="text-primary stroke-current" cx="50" cy="50" fill="none" r="45" strokeWidth="10" strokeDasharray="282.7" strokeDashoffset="70" strokeLinecap="round"></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-primary">75%</span>
                                    <span className="text-xs font-bold uppercase text-gray-500">Completed</span>
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <Badge variant="primary" className="mb-2">Priority Goal</Badge>
                                <h2 className="text-2xl font-bold mb-2 dark:text-white">Reduce Peak Hour Usage</h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">Target: Reduce community electricity consumption by 15% between 6PM and 9PM this month.</p>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <div className="text-center md:text-left">
                                        <p className="text-2xl font-bold dark:text-white">1,240 <span className="text-sm font-normal text-gray-500">kWh</span></p>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Saved so far</p>
                                    </div>
                                    <div className="w-px h-10 bg-gray-300 dark:bg-gray-700 hidden md:block"></div>
                                    <div className="text-center md:text-left">
                                        <p className="text-2xl font-bold dark:text-white">12 <span className="text-sm font-normal text-gray-500">days</span></p>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Remaining</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Leaderboard Small */}
                <Card>
                    <h3 className="font-bold flex items-center gap-2 mb-4 dark:text-white">
                        <Icon name="leaderboard" className="text-yellow-500" /> Top Challengers
                    </h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Sharma Family', pts: 450, rank: 1 },
                            { name: 'Block A, 302', pts: 420, rank: 2 },
                            { name: 'Villa 12', pts: 390, rank: 3 },
                        ].map((row, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`size-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {row.rank}
                                    </div>
                                    <span className="font-medium dark:text-white">{row.name}</span>
                                </div>
                                <span className="font-bold text-primary">{row.pts} pts</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <h2 className="text-xl font-bold mt-4 dark:text-white">Active Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: 'Community Garden', users: 24, target: 30, prog: 80, desc: 'Volunteer 2 hours this weekend for planting new saplings.' },
                    { title: 'No Plastic Week', users: 85, target: 100, prog: 85, desc: 'Commit to zero single-use plastic usage for 7 days.' },
                    { title: 'E-Waste Drive', users: 12, target: 50, prog: 24, desc: 'Collect and recycle old electronics at the clubhouse.' },
                ].map((item, i) => (
                    <Card key={i} className="flex flex-col justify-between hover:border-primary/50 transition-colors">
                        <div>
                            <h3 className="text-lg font-bold mb-1 dark:text-white">{item.title}</h3>
                            <p className="text-sm text-gray-500 mb-4 min-h-[40px]">{item.desc}</p>

                            <div className="flex justify-between text-xs font-medium mb-1 dark:text-gray-300">
                                <span>{item.users} Participants</span>
                                <span>Target: {item.target}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
                                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${item.prog}%` }}></div>
                            </div>
                        </div>
                        <Button variant="secondary" className="w-full">Join Event</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
