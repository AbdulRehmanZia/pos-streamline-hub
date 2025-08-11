import React, { useState } from "react";
import SalesTable from "../components/SaleTable";
import SaleForm from "../components/SaleForm";
import { PlusCircle, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import toast from "react-hot-toast";

export default function Sale() {
  const [refresh, setRefresh] = useState(false);

  const handleSaleAdded = () => {
    setRefresh((prev) => !prev);
    toast.success("Sale completed successfully!");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500 text-white">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Sales Management</h1>
              <p className="text-gray-600">Track and manage your sales transactions</p>
            </div>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <button className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-400 hover:bg-blue-600  transition-colors">
                <PlusCircle className="mr-2 h-5 w-5" />
                New Sale
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500 text-white">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  <SheetTitle className="text-xl font-bold text-gray-800">
                    New Sale
                  </SheetTitle>
                </div>
              </SheetHeader>
              <SaleForm onSaleAdded={handleSaleAdded} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
              
            </div>
            <SalesTable refresh={refresh} />
          </div>
        </div>
      </div>
    </div>
  );
}