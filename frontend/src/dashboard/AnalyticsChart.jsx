import {
  ResponsiveContainer,
  BarChart,
  PieChart,
  Pie,
  Cell,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#3B82F6", "#F59E0B", "#22C55E"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="font-semibold dark:text-white">{payload[0].name}</p>
        <p className="text-gray-600 dark:text-gray-300">
          Total: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ name, percent }) => {
  return `${name} (${(percent * 100).toFixed(0)}%)`;
};

function AnalyticsChart({ chartData }) {
  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">
            📊 Analytics Overview
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Overall recruitment statistics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donut Chart */}
        <div className="h-96">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">
            Applications Status
          </h3>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                label={renderCustomLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="h-96">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">
            Applications Overview
          </h3>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />

              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsChart;
