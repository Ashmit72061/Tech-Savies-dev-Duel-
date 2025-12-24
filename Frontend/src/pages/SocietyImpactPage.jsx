import Card from '../components/atoms/Card';
import Icon from '../components/atoms/Icon';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

/* ---------------- MOCK DATA ---------------- */

const consumptionData = [
    { month: 'Jan', energy: 420 },
    { month: 'Feb', energy: 380 },
    { month: 'Mar', energy: 460 },
    { month: 'Apr', energy: 440 },
    { month: 'May', energy: 520 },
    { month: 'Jun', energy: 500 },
];

const categoryData = [
    { name: 'Energy', value: 45 },
    { name: 'Water', value: 30 },
    { name: 'Waste', value: 25 },
];

const COLORS = ['#22c55e', '#3b82f6', '#f97316'];

export default function SocietyImpactPage() {
    return (
        <div className="flex flex-col gap-8">

            {/* ================= HEADER ================= */}
            <div>
                <h1 className="text-3xl font-bold dark:text-white">
                    Society Impact
                </h1>
                <p className="text-gray-500">
                    Aggregation of all resident scores and environmental data.
                </p>
            </div>

            {/* ================= HERO STATS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        label: 'CO2 Footprint',
                        val: '124',
                        unit: 'Tons',
                        desc: '12% lower than avg',
                        color: 'bg-green-100 text-green-700',
                    },
                    {
                        label: 'Water Saved',
                        val: '4.5',
                        unit: 'Million L',
                        desc: '+5% vs last year',
                        color: 'bg-blue-100 text-blue-700',
                    },
                    {
                        label: 'Waste Diverted',
                        val: '68%',
                        unit: 'Recycled',
                        desc: 'Target: 80%',
                        color: 'bg-orange-100 text-orange-700',
                    },
                ].map((stat, i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow">
                        <div className="flex flex-col gap-4">
                            <div
                                className={`self-start p-3 rounded-xl ${stat.color} dark:bg-opacity-20`}
                            >
                                <Icon name="bar_chart" />
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">
                                    {stat.label}
                                </p>
                                <p className="text-4xl font-black dark:text-white">
                                    {stat.val}{' '}
                                    <span className="text-lg font-bold text-gray-400">
                                        {stat.unit}
                                    </span>
                                </p>
                                <p className="text-sm font-bold text-primary mt-1">
                                    {stat.desc}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* ================= CHARTS ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* --------- CONSUMPTION TRENDS --------- */}
                <Card>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold dark:text-white">
                            Consumption Trends
                        </h3>
                        <p className="text-sm text-gray-500">
                            Monthly society-wide energy usage
                        </p>
                    </div>

                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={consumptionData}>
                                <defs>
                                    <linearGradient
                                        id="energyGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="energy"
                                    stroke="#22c55e"
                                    fill="url(#energyGradient)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* --------- CATEGORY BREAKDOWN --------- */}
                <Card>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold dark:text-white">
                            Category Breakdown
                        </h3>
                        <p className="text-sm text-gray-500">
                            Contribution by resource type
                        </p>
                    </div>

                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={4}
                                >
                                    {categoryData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

            </div>
        </div>
    );
}
