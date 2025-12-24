import Card from '../components/atoms/Card';
import Icon from '../components/atoms/Icon';

export default function SocietyImpactPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold dark:text-white">Society Impact</h1>
                <p className="text-gray-500">Aggregation of all resident scores and environmental data.</p>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'CO2 Footprint', val: '124', unit: 'Tons', desc: '12% lower than avg', color: 'bg-green-100 text-green-700' },
                    { label: 'Water Saved', val: '4.5', unit: 'Million L', desc: '+5% vs last year', color: 'bg-blue-100 text-blue-700' },
                    { label: 'Waste Diverted', val: '68%', unit: 'Recycled', desc: 'Target: 80%', color: 'bg-orange-100 text-orange-700' },
                ].map((stat, i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow">
                        <div className="flex flex-col gap-4">
                            <div className={`self-start p-3 rounded-xl ${stat.color} dark:bg-opacity-20`}>
                                <Icon name="bar_chart" />
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-4xl font-black dark:text-white">{stat.val} <span className="text-lg font-bold text-gray-400">{stat.unit}</span></p>
                                <p className="text-sm font-bold text-primary mt-1">{stat.desc}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="min-h-[300px] flex items-center justify-center bg-gray-50 dark:bg-white/5">
                    <div className="text-center text-gray-400">
                        <Icon name="show_chart" size={48} className="mx-auto mb-2" />
                        <p>Consumption Trends Chart Area</p>
                    </div>
                </Card>
                <Card className="min-h-[300px] flex items-center justify-center bg-gray-50 dark:bg-white/5">
                    <div className="text-center text-gray-400">
                        <Icon name="pie_chart" size={48} className="mx-auto mb-2" />
                        <p>Category Breakdown Chart Area</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
