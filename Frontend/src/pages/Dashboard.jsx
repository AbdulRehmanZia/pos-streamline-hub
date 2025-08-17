import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ShoppingCart, Package, Users, CreditCard, Activity } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(UserContext);
  
  // Mock data - replace with actual API calls
  const stats = {
    totalSales: 1245,
    newOrders: 12,
    products: 56,
    customers: 89
  };

  const recentActivities = [
    { id: 1, action: 'New order #1234', time: '2 mins ago' },
    { id: 2, action: 'Category "Electronics" added', time: '15 mins ago' },
    { id: 3, action: 'User "john@example.com" registered', time: '1 hour ago' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user.fullname }</h1>
      
      {user.role === 'admin' ? (
        <>
          {/* Admin Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={<ShoppingCart className="h-6 w-6" />} 
              title="Total Sales" 
              value={`$${stats.totalSales.toLocaleString()}`} 
              change="+12% from last month" 
            />
            <StatCard 
              icon={<Package className="h-6 w-6" />} 
              title="New Orders" 
              value={stats.newOrders} 
              change="+5 from yesterday" 
            />
            <StatCard 
              icon={<CreditCard className="h-6 w-6" />} 
              title="Products" 
              value={stats.products} 
              change="+3 new this week" 
            />
            <StatCard 
              icon={<Users className="h-6 w-6" />} 
              title="Customers" 
              value={stats.customers} 
              change="+8 this month" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
              {/* Sales chart or table would go here */}
              <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                <p className="text-gray-500">Sales chart visualization</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
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

// Reusable stat card component
function StatCard({ icon, title, value, change }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          {icon}
        </div>
      </div>
      <p className="text-sm text-green-600 mt-2">{change}</p>
    </div>
  );
}