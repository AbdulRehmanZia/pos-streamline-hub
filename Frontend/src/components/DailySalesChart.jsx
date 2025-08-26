import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DailySalesChart = ({ data }) => {
  const chartData = Object.keys(data || {}).map(date => ({
    date,
    sales: data[date],
  }));

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">Daily Sales</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#00A896"
            activeDot={{ r: 8 }}
            name="Daily Sales"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySalesChart;