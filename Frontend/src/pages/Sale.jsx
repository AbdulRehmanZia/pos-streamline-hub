import React, { useState } from "react";
import SalesTable from "../components/SaleTable";
import { ShoppingCart } from "lucide-react";

export default function Sale() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F9F9] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading with icon similar to Products page */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#2F4F4F] text-white">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2F4F4F]">Sales</h1>
              <p className="text-[#2F4F4F]/80">View your sales transactions</p>
            </div>
          </div>
        </div>
        
        <SalesTable refresh={refresh} />
      </div>
    </div>
  );
}