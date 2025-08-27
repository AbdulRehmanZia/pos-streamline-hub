import React from "react";
import { CreditCard, Package, ShoppingCart, Users } from "lucide-react";

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-full flex-shrink-0 w-10 h-10 flex items-center justify-center">{icon}</div>
      </div>
    </div>
  );
}

const StatCards = ({ analyst }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
        title="Total Sales Amount"
        value={`$${analyst?.totalSalesAmount?.toLocaleString("en-US") ?? 0}`}
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
  );
};

export default StatCards;