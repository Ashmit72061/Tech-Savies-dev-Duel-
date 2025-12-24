import { Link } from 'react-router-dom';
import Card from '../components/atoms/Card';
import Icon from '../components/atoms/Icon';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';

export default function AdminDashboard() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
                    <p className="text-gray-500 mt-1">12 pending approvals require your attention today.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/admin/societies/new">
                        <Button><Icon name="add" size={20} className="mr-2" /> New Society</Button>
                    </Link>
                    <Button variant="secondary"><Icon name="lock_clock" size={20} className="mr-2" /> Lock Cycle</Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Societies', value: '12', change: '2%', icon: 'apartment', color: 'text-primary' },
                    { label: 'Pending Approvals', value: '45', change: '+5', icon: 'pending_actions', color: 'text-yellow-500' },
                    { label: 'Active Cycle', value: 'Oct 23', change: 'Open', icon: 'calendar_month', color: 'text-blue-500' },
                    { label: 'Avg Score', value: '78', change: '1.5%', icon: 'eco', color: 'text-green-600' },
                ].map((stat, i) => (
                    <Card key={i} className="p-5 flex flex-col justify-between group">
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <Icon name={stat.icon} className={`${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`} size={28} />
                        </div>
                        <div className="mt-4 flex items-end gap-2">
                            <span className="text-3xl font-bold dark:text-white">{stat.value}</span>
                            <Badge variant="success" className="mb-1">{stat.change}</Badge>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Society Table */}
                <div className="xl:col-span-2">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                        <Icon name="apartment" className="text-primary" /> Society Directory
                    </h3>
                    <Card padding="p-0" className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800">
                                    <tr>
                                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Society Name</th>
                                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Flats</th>
                                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {[
                                        { name: 'Green Residency', loc: 'Mumbai, IN', flats: 124, status: 'Submitting', score: 85, color: 'bg-primary' },
                                        { name: 'Eco Palms', loc: 'Pune, IN', flats: 86, status: 'Audit Pending', score: 72, color: 'bg-yellow-500' },
                                        { name: 'Solar Valley', loc: 'Bangalore, IN', flats: 210, status: 'Submitting', score: 91, color: 'bg-primary' },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-xs">
                                                        {row.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm dark:text-white">{row.name}</p>
                                                        <p className="text-xs text-gray-500">{row.loc}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">{row.flats}</td>
                                            <td className="py-4 px-6"><Badge variant={row.status === 'Submitting' ? 'success' : 'warning'}>{row.status}</Badge></td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold dark:text-white">{row.score}</span>
                                                    <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                                                        <div className={`h-1.5 rounded-full ${row.color}`} style={{ width: `${row.score}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-3 text-center border-t border-gray-100 dark:border-gray-800">
                            <button className="text-xs font-bold text-primary hover:underline">View All Societies</button>
                        </div>
                    </Card>
                </div>

                {/* Approvals List */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                        <Icon name="notifications_active" className="text-yellow-500" /> Needs Review
                    </h3>
                    <div className="flex flex-col gap-3">
                        {[
                            { title: 'Electricity Usage', desc: 'Flat 4B • Green Res', val: '340 kWh', time: '2m ago', icon: 'bolt', color: 'bg-blue-100 text-blue-600' },
                            { title: 'Water Consumption', desc: 'Flat 12A • Eco Palms', val: '12.5 kL', time: '15m ago', icon: 'water_drop', color: 'bg-cyan-100 text-cyan-600' },
                            { title: 'Waste Separation', desc: 'Flat 302 • Solar Val', val: 'Verified', time: '1h ago', icon: 'recycling', color: 'bg-orange-100 text-orange-600' },
                        ].map((item, i) => (
                            <Card key={i} className="p-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                                <div className={`p-2 rounded-lg ${item.color} dark:bg-opacity-20`}>
                                    <Icon name={item.icon} size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.title}</p>
                                        <span className="text-[10px] text-gray-400">{item.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                                    <p className="text-xs font-medium mt-1 dark:text-gray-300">Value: {item.val}</p>
                                </div>
                                <div className="hidden group-hover:flex flex-col gap-1">
                                    <button className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"><Icon name="check" size={16} /></button>
                                    <button className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200"><Icon name="close" size={16} /></button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
