import React, { useContext, useState, useEffect } from "react";
import loader from "../../dist/loader.svg";
import { UserContext } from "../context/UserContext";
import {
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  Activity,
} from "lucide-react";
import { api } from "../Instance/api";
import {
  PieChart,
  Pie,
  Cell,
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
} from "recharts";

export default function Dashboard() {
  const [analyst, setAnalyst] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    api
      .get("analyst")
      .then((res) => {
        console.log("API Response:", res.data.data);
        setAnalyst(res.data.data);
      })
      .catch((err) => {
        console.error("API Error:", err);
      });
  }, []);

  if (!analyst) {
    return (
      <div className="p-6">
        {/* 🔹 Header */}
        <h1 className="text-2xl font-bold mb-6 text-left">
          Welcome , {user.fullname}
        </h1>

        {/* 🔹 Loader Centered */}
        <div className="flex justify-center items-center h-[70vh]">
          <img src={loader} alt="Loading..." className="h-20" />
        </div>
      </div>
    );
  }

  //  Graph data
  const COLORS = ["#2D6964", "#343965", "#478985", "#02323D"];

  // Category wise products (Bar Chart)
  const categoryData = analyst.categoryWiseProductCount.map((d) => ({
    name: d.name,
    products: d._count.products,
  }));

  // Sales Data for Line & Pie Chart
  const salesData = [
    { name: "Total Sales", value: analyst.totalSalesAmount },
    { name: "Products", value: analyst.totalProducts },
    { name: "Sale Items", value: analyst.totalSaleItems },
    { name: "Members", value: analyst.totalMembers },
  ];

  const recentActivities = [
    { id: 1, action: "New order #1234", time: "2 mins ago" },
    { id: 2, action: 'Category "Electronics" added', time: "15 mins ago" },
    { id: 3, action: 'User "john@example.com" registered', time: "1 hour ago" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user.fullname}</h1>

      {user.role === "admin" ? (
        <>
          {/* 🔹 Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<ShoppingCart className="h-6 w-6" />}
              title="Total Sales Amount"
              value={analyst?.totalSalesAmount ?? 0}
              change="+12% from last month"
            />
            <StatCard
              icon={<Package className="h-6 w-6" />}
              title="Total Sale Items"
              value={analyst?.totalSaleItems ?? 0}
              change="+5 from yesterday"
            />
            <StatCard
              icon={<CreditCard className="h-6 w-6" />}
              title="Products"
              value={analyst?.totalProducts ?? 0}
              change="+3 new this week"
            />
            <StatCard
              icon={<Users className="h-6 w-6" />}
              title="Customers"
              value={analyst?.totalMembers ?? 0}
              change="+8 this month"
            />
          </div>

          {/* 🔹 Charts & Activity Section */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Wise Products (Bar Chart) */}
            <div className="bg-white shadow-lg rounded-2xl p-4">
              <h2 className="text-lg font-bold mb-4">
                {" "}
                Category Wise Products
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="products" fill="#2D4E43" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Sales Summary (Line Chart) */}
            <div className="bg-white shadow-lg rounded-2xl p-4">
              <h2 className="text-lg font-bold mb-4"> Sales Summary</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#1c3333" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sales Distribution (Pie Chart) */}
            <div className="bg-white shadow-lg rounded-2xl p-4 col-span-1 md:col-span-2">
              <h2 className="text-lg font-bold mb-4"> Sales Distribution</h2>

              {analyst?.totalProducts > 0 || analyst?.totalSaleItems > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Products", value: analyst.totalProducts },
                        { name: "Sale Items", value: analyst.totalSaleItems },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={130}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      <Cell fill="#2D6964" />
                      <Cell fill="#343965" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">
                  No distribution data available
                </p>
              )}
            </div>
          </div>

          {/* 🔹 Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Activity className="h-5 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 🔹 Regular User Dashboard */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Your Recent Orders</h2>
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              <p className="text-gray-500">Order history would appear here</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 🔹 Reusable Stat Card
function StatCard({ icon, title, value, change }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">{icon}</div>
      </div>
      <p className="text-sm text-green-600 mt-2">{change}</p>
    </div>
  );
}
