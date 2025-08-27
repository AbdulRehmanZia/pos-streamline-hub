import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { api } from "../Instance/api";
import StatCards from "../components/StateCards";
import CategoryWiseProducts from "../components/CategoryWiseProducts";
import DailySalesChart from "../components/DailySalesChart";
import RecentActivity from "../components/RecentActivity";

export default function Dashboard() {
  const [analyst, setAnalyst] = useState(null);
  const [users, setUsers] = useState([]);
  const [category, setCategory] = useState([]);
  const [sales, setSales] = useState([]);

  const { user } = useContext(UserContext);

  useEffect(() => {
    api
      .get("analyst")
      .then((res) => {
        setAnalyst(res.data.data);
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome back, {user.fullname}
      </h1>

      {user.role === "admin" ? (
        <>
          {/* Stat Cards Component */}
          <StatCards analyst={analyst} />

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Category Wise Products Chart Component */}
            <CategoryWiseProducts data={categoryData} />

            {/* Daily Sales Chart Component */}
            <DailySalesChart data={analyst?.dailySales} />
          </div>

          {/* Recent Activity Component */}
          <RecentActivity users={users} categories={category} sales={sales} />
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
