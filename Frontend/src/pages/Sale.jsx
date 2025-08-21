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



  return (
    <div className="min-h-screen bg-[#F4F9F9] p-6">
      <div className="max-w-7xl mx-auto">
        

        <div className="bg-white rounded-lg border border-[#1C3333]/20 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#1C3333]">Recent Transactions</h2>
            </div>
            <SalesTable refresh={refresh} />
          </div>
        </div>
      </div>
    </div>
  );
}