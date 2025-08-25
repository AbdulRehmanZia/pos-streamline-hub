import React, { useContext, useState, useEffect } from "react";
import { Users, Package, ShoppingCart, CreditCard } from "lucide-react";
import moment from "moment";
import loader from "../img/loader.svg";
import { UserContext } from "../context/UserContext";
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
  const [users, setUsers] = useState([]);
  const [category, setCategory] = useState([]);
  const [sales, setSales] = useState([]);

  const { user } = useContext(UserContext);

  useEffect(() => {
    api
      .get("analyst")
      .then((res) => setAnalyst(res.data.data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const res = await api.get("analyst/recent-activity");
        const { categories = [], sales = [], users = [] } = res.data.data || {};
        setCategory(Array.isArray(categories) ? categories : []);
        setSales(Array.isArray(sales) ? sales : []);
        setUsers(Array.isArray(users) ? users : []);
      } catch (err) {
        console.error("Error fetching recent activity:", err);
      }
    };
    fetchRecentActivity();
  }, []);

  if (!analyst) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-left">
          Welcome , {user.fullname}
        </h1>
        <div className="flex justify-center items-center h-[70vh]">
          <img src={loader} className="h-20 " />
        </div>
      </div>
    );
  }

  const categoryData = analyst?.categoryWiseProductCount?.map((d) => ({
    name: d.name,
    products: d._count.products,
  }));

  // Prepare sales chart data
  const getSalesChartData = () => {
    if (sales && sales.length > 0) {
      const today = moment().startOf("day");
      const todaySales = sales.filter((sale) =>
        moment(sale.createdAt).isSame(today, "day")
      );

      if (todaySales.length > 0) {
        const hourlyData = {};
        for (let hour = 0; hour < 24; hour++) {
          const timeLabel = moment().hour(hour).format("HH:mm");
          hourlyData[timeLabel] = {
            name: timeLabel,
            amount: 0,
            count: 0,
            hour: hour,
          };
        }

        todaySales.forEach((sale) => {
          const saleTime = moment(sale.createdAt);
          const hourKey = saleTime.startOf("hour").format("HH:mm");
          if (hourlyData[hourKey]) {
            hourlyData[hourKey].amount += parseFloat(sale.totalAmount) || 0;
            hourlyData[hourKey].count += 1;
          }
        });

        return Object.values(hourlyData)
          .filter(
            (item) => item.amount > 0 || (item.hour >= 8 && item.hour <= 22)
          )
          .sort((a, b) => a.hour - b.hour);
      }

      // Otherwise, group by day
      const groupedSales = sales.reduce((acc, sale) => {
        const date = moment(sale.createdAt).format("MMM DD");
        if (!acc[date]) {
          acc[date] = { name: date, amount: 0, count: 0 };
        }
        acc[date].amount += parseFloat(sale.totalAmount) || 0;
        acc[date].count += 1;
        return acc;
      }, {});

      return Object.values(groupedSales).sort(
        (a, b) =>
          moment(a.name, "MMM DD").valueOf() -
          moment(b.name, "MMM DD").valueOf()
      );
    }

    // Fallback
    const totalAmount = analyst?.totalSalesAmount || 0;
    if (totalAmount > 0) {
      return [
        { name: "Week 1", amount: Math.round(totalAmount * 0.15), count: 0 },
        { name: "Week 2", amount: Math.round(totalAmount * 0.25), count: 0 },
        { name: "Week 3", amount: Math.round(totalAmount * 0.35), count: 0 },
        { name: "Week 4", amount: Math.round(totalAmount * 0.25), count: 0 },
      ];
    }
    return [{ name: "No Data", amount: 0, count: 0 }];
  };

  const salesChartData = getSalesChartData();

  // Pie chart data for sales
  const salesPieData = [
    { name: "Total Sales Amount", value: analyst?.totalSalesAmount || 0 },
    { name: "Total Sale Items", value: analyst?.totalSaleItems || 0 },
  ];

  // Pie chart data for products and categories
  const productAndCategoryPieData = [
    { name: "Total Products", value: analyst?.totalProducts || 0 },
    { name: "Total Categories", value: category?.length || 0 },
  ];

  const COLORS = ["#2D6964", "#343965", "#FF9F43", "#A52A2A"];

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user.fullname}</h1>

      {user.role === "admin" ? (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<ShoppingCart className="h-6 w-6" />}
              title="Total Sales Amount"
              value={analyst?.totalSalesAmount?.toLocaleString("en-US") ?? 0}
              change="+12% from last month"
            />
            <StatCard
              icon={<Package className="h-6 w-6" />}
              title="Total Sale Items"
              value={analyst?.totalSaleItems?.toLocaleString("en-US") ?? 0}
              change="+5 from yesterday"
            />
            <StatCard
              icon={<CreditCard className="h-6 w-6" />}
              title="Products"
              value={analyst?.totalProducts?.toLocaleString("en-US") ?? 0}
              change="+3 new this week"
            />
            <StatCard
              icon={<Users className="h-6 w-6" />}
              title="Members"
              value={analyst?.totalMembers?.toLocaleString("en-US") ?? 0}
              change="+8 this month"
            />
          </div>

          {/* Category Wise Products */}
          <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Category Wise Products</h2>
            <ResponsiveContainer width="100%" height={400}>
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

          {/* Sales Summary */}
          <div className="bg-white shadow-xl rounded-3xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Sales Summary
              </h2>
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                Total: $
                {analyst?.totalSalesAmount?.toLocaleString("en-US") || 0}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl">
              <ResponsiveContainer width="100%" height={450}>
                <LineChart
                  data={salesChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e0e7ff"
                    opacity={0.7}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickFormatter={(value) =>
                      `${value.toLocaleString("en-US")}`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      fontSize: "14px",
                    }}
                    formatter={(value, name) => [
                      value.toLocaleString("en-US"),
                      name === "Sales Amount",
                    ]}
                    labelStyle={{
                      color: "#374151",
                      fontWeight: "600",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#2563eb" }}
                    activeDot={{ r: 8, fill: "#1d4ed8" }}
                    name="Sales Amount"
                  />
                  {/* <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#16a34a" }}
                    activeDot={{ r: 6, fill: "#15803d" }}
                    name="Sales Count"
                  /> */}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New: Sales and Products Distribution Charts */}
  
          

                       {/*Recent Activity Here  */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md mt-6 w-100% ">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Activity from 15 minutes ago
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {(() => {
                    const allActivities = [
                      ...(users || []).map((u) => ({
                        id: `user-${u.id || u.email}`,
                        type: "user",
                        name: u.fullname,
                        email: u.email,
                        badge: u.role,
                        time: u.createdAt,
                      })),
                      ...(category || []).map((c) => ({
                        id: `cat-${c.id}`,
                        type: "category",
                        name: c.name,
                        email: "New category added",
                        badge: null,
                        time: c.createdAt,
                      })),
                      ...(sales || []).map((s) => ({
                        id: `sale-${s.id}`,
                        type: "sale",
                        name: `Sale #${s.id}`,
                        email: `Customer: ${
                          s.customerName || "N/A"
                        } | Amount: $${s.totalAmount}`,
                        badge: s.paymentType,
                        items: s.saleItems || [],
                        time: s.createdAt,
                      })),
                    ];

                    if (allActivities.length === 0) {
                      return (
                        <p className="text-gray-500 text-sm py-4">
                          No recent activity ...
                        </p>
                      );
                    }

                    return allActivities
                      .sort((a, b) => new Date(b.time) - new Date(a.time))
                      .map((activity) => {
                        let color;
                        switch (activity.type) {
                          case "user":
                            color = "bg-blue-100 text-blue-600";
                            break;
                          case "category":
                            color = "bg-pink-100 text-pink-600";
                            break;
                          case "sale":
                            color = "bg-green-100 text-green-600";
                            break;
                          default:
                            color = "bg-gray-100 text-gray-600";
                        }

                        return (
                          <div
                            key={activity.id}
                            className="flex flex-col py-3 border-b last:border-0 w-full"
                          >
                            <div className="flex items-center justify-between relative w-full">
                              {/* Left Section */}
                              <div className="flex items-center">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 ${color}`}
                                >
                                  {activity.name
                                    ? activity.name.charAt(0).toUpperCase()
                                    : "?"}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {activity.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {activity.email}
                                  </p>
                                </div>
                              </div>

                              {/* Center Badge */}
                              {activity.badge && (
                                <div className="absolute left-1/2 transform -translate-x-1/2">
                                  <p
                                    className={`text-sm px-3 py-1 rounded-2xl text-center ${
                                      activity.type === "sale"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-600"
                                    }`}
                                  >
                                    {activity.badge}
                                  </p>
                                </div>
                              )}

                              {/* Right Time */}
                              <div className="text-xs text-gray-400 whitespace-nowrap">
                                {moment(activity.time).fromNow()}
                              </div>
                            </div>

                            {/* Sale Items */}
                            {activity.type === "sale" &&
                              activity.items.length > 0 && (
                                <div className="ml-12 mt-2 w-full">
                                  <p className="text-xs text-gray-500 mb-1">
                                    Items Sold:
                                  </p>
                                  <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                                    {activity.items.map((item, idx) => (
                                      <li key={idx}>
                                        {item.product?.name} (x{item.quantity})
                                        = ${item.product?.price * item.quantity}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                          </div>
                        );
                      });
                  })()}
                </div>
              </div>
            </div>
        
        </>
      ) : (
        <>
          {/* Regular User Dashboard */}
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

// Reusable Stat Card
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
