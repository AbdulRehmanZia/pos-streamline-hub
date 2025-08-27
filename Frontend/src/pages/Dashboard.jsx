import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { api } from "../Instance/api";
import {
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  LabelList,
} from "recharts";
import { CreditCard, Package, ShoppingCart, Users } from "lucide-react";
import moment from "moment";

export default function Dashboard() {
  const [analyst, setAnalyst] = useState(null);
  const [users, setUsers] = useState([]);
  const [category, setCategory] = useState([]);
  const [sales, setSales] = useState([]); // New state for sales data

  const { user } = useContext(UserContext);

  // Fetch main dashboard analytics
  useEffect(() => {
    api
      .get("analyst")
      .then((res) => {
        setAnalyst(res.data.data);
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  // Fetch recent activity
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const res = await api.get("analyst/recent-activity");
        const { categories = [], users = [], sales = [] } = res.data.data || {};
        setCategory(Array.isArray(categories) ? categories : []);
        setUsers(Array.isArray(users) ? users : []);
        setSales(Array.isArray(sales) ? sales : []);
      } catch (err) {
        console.error("Error fetching recent activity:", err);
      }
    };
    fetchRecentActivity();
  }, []);

  if (!analyst) {
    return (
      <div className="p-6 flex justify-center items-center h-[70vh]">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user.fullname}
        </h1>
      </div>
    );
  }

  const categoryData = analyst?.categoryWiseProductCount?.map((d) => ({
    name: d.name,
    products: d._count.products,
  }));

  const getSalesChartData = () => {
    if (analyst?.totalSalesAmount) {
      return [{ name: "Total Sales", amount: analyst.totalSalesAmount }];
    }
    return [{ name: "No Data", amount: 0 }];
  };

  const salesChartData = getSalesChartData();

  const totalProducts = categoryData?.reduce(
    (acc, item) => acc + item.products,
    0
  );

  const updatedCategoryData = categoryData?.map((item) => ({
    ...item,
    percentage: ((item.products / totalProducts) * 100).toFixed(1),
  }));

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const maxProducts = Math.max(...categoryData.map((d) => d.products), 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome back, {user.fullname}
      </h1>

      <>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
            title="Total Sales Amount"
            value={`$${
              analyst?.totalSalesAmount?.toLocaleString("en-US") ?? 0
            }`}
          />
          <StatCard
            icon={<Package className="h-5 w-5 text-green-600" />}
            title="Total Sale Items"
            value={analyst?.totalSaleItems?.toLocaleString("en-US") ?? 0}
          />
          <StatCard
            icon={<CreditCard className="h-5 w-5 text-purple-600" />}
            title="Products"
            value={analyst?.totalProducts?.toLocaleString("en-US") ?? 0}
          />
          <StatCard
            icon={<Users className="h-5 w-5 text-orange-600" />}
            title="Members"
            value={analyst?.totalMembers?.toLocaleString("en-US") ?? 0}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Wise Products */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Category Wise Products</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={updatedCategoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  tick={{ angle: -25, textAnchor: "end", fontSize: 12 }}
                  height={80}
                />
                <YAxis domain={[0, maxProducts + maxProducts * 0.2]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="products" fill="#4B5563">
                  <LabelList
                    dataKey="percentage"
                    position="top"
                    formatter={(val) => `${val}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sales Summary Line Chart */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Sales Summary</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={salesChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#00A896"
                  activeDot={{ r: 8 }}
                  name="Sales Amount"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </>
    </div>
  );
}

function StatCard({ icon, title, value, change }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-full flex-shrink-0 w-10 h-10 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-sm text-green-600 mt-2">{change}</p>
    </div>
  );
}
