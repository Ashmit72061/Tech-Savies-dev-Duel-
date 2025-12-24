import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Jan', consumption: 400 },
  { month: 'Feb', consumption: 300 },
  { month: 'Mar', consumption: 500 },
  { month: 'Apr', consumption: 450 },
  { month: 'May', consumption: 600 },
  { month: 'Jun', consumption: 550 },
];

export default function ConsumptionTrendChart() {
  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
      <h2 className="text-lg font-semibold mb-4">
        Consumption Trends
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="consumption"
              stroke="#16a34a"
              fillOpacity={1}
              fill="url(#colorConsumption)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
