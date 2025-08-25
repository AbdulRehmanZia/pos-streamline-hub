import React, { useContext, useState } from "react";
import CategoryTable from "../components/CategoryTable";
import { PlusCircle, Tag } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import { UserContext } from "../context/UserContext";
import CategoryForm from "../components/CategoryForm";

export default function Category() {
  const { user } = useContext(UserContext);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleCategoryAdded = () => {
    setRefreshKey(prev => prev + 1);
    setIsSheetOpen(false); 
  };

  return (
    <div className="min-h-screen bg-[#F4F9F9] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#2F4F4F] text-white">
              <Tag className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2F4F4F]">Categories Management</h1>
              <p className="text-[#2F4F4F]/80">Organize your products into categories</p>
            </div>
          </div>

          {user?.role === "admin" && (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <button className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#2F4F4F] hover:bg-[#2F4F4F]/90 transition-colors">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  New Category
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md bg-[#F4F9F9]">
                <SheetHeader className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#2F4F4F] text-white">
                      <Tag className="h-6 w-6" />
                    </div>
                    <SheetTitle className="text-xl font-bold text-[#2F4F4F]">
                      New Category
                    </SheetTitle>
                  </div>
                </SheetHeader>
                <CategoryForm 
                  onCategoryAdded={handleCategoryAdded}
                  onClose={() => setIsSheetOpen(false)}
                />
              </SheetContent>
            </Sheet>
          )}
        </div>

        <div className="bg-white rounded-lg border border-[#2F4F4F]/20 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#2F4F4F]">All Categories</h2>
            </div>
            <CategoryTable refreshKey={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}



//  <div className="bg-white p-6 rounded-lg shadow-md mt-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Activity from 15 minutes ago</h2>
            
//             </div>

//             <div className="divide-y divide-gray-100">
//               {(() => {
//                 const allActivities = [
//                   ...(users || []).map((u) => ({
//                     id: `user-${u.id || u.email}`,
//                     type: "user",
//                     name: u.fullname,
//                     email: u.email,
//                     badge: u.role,
//                     time: u.createdAt,
//                   })),
//                   ...(category || []).map((c) => ({
//                     id: `cat-${c.id}`,
//                     type: "category",
//                     name: c.name,
//                     email: "New category added",
//                     badge: null, 
//                     time: c.createdAt,
//                   })),
//                   ...(sales || []).map((s) => ({
//                     id: `sale-${s.id}`,
//                     type: "sale",
//                     name: `Sale #${s.id}`,
//                     email: `Customer: ${s.customerName || "N/A"} | Amount: $${s.totalAmount}`,
//                     badge: s.paymentType, // 
//                     items: s.saleItems || [],
//                     time: s.createdAt,
//                   })),
//                 ];

//                 if (allActivities.length === 0) {
//                   return (
//                     <p className="text-gray-500 text-sm py-4">
//                       No recent activity ...
//                     </p>
//                   );
//                 }

//                 return allActivities
//                   .sort((a, b) => new Date(b.time) - new Date(a.time))
//                   .map((activity) => {
//                     let color;
//                     switch (activity.type) {
//                       case "user":
//                         color = "bg-blue-100 text-blue-600";
//                         break;
//                       case "category":
//                         color = "bg-pink-100 text-pink-600";
//                         break;
//                       case "sale":
//                         color = "bg-green-100 text-green-600";
//                         break;
//                       default:
//                         color = "bg-gray-100 text-gray-600";
//                     }

//                     return (
//                       <div
//                         key={activity.id}
//                         className="flex flex-col py-3 border-b last:border-0"
//                       >
//                         <div className="flex items-center justify-between relative">
//                           {/* Left Section */}
//                           <div className="flex items-center">
//                             <div
//                               className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 ${color}`}
//                             >
//                               {activity.name
//                                 ? activity.name.charAt(0).toUpperCase()
//                                 : "?"}
//                             </div>
//                             <div>
//                               <p className="font-medium text-gray-800">
//                                 {activity.name}
//                               </p>
//                               <p className="text-sm text-gray-500">
//                                 {activity.email}
//                               </p>
//                             </div>
//                           </div>

//                           {/* Center Badge (Only for sales & users) */}
//                           {activity.badge && (
//                             <div className="absolute left-1/2 transform -translate-x-1/2">
//                               <p
//                                 className={`text-sm px-3 py-1 rounded-2xl text-center ${
//                                   activity.type === "sale"
//                                     ? "bg-green-100 text-green-800"
//                                     : "bg-blue-100 text-blue-600"
//                                 }`}
//                               >
//                                 {activity.badge}
//                               </p>
//                             </div>
//                           )}

//                           {/* Right Time */}
//                           <div className="text-xs text-gray-400 whitespace-nowrap">
//                             {moment(activity.time).fromNow()}
//                           </div>
//                         </div>

//                         {/* Sale Items */}
//                         {activity.type === "sale" &&
//                           activity.items.length > 0 && (
//                             <div className="ml-12 mt-2">
//                               <p className="text-xs text-gray-500 mb-1">
//                                 Items Sold:
//                               </p>
//                               <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
//                                 {activity.items.map((item, idx) => (
//                                   <li key={idx}>
//                                     {item.product?.name} (x{item.quantity}) = $
//                                     {item.product?.price * item.quantity}
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           )}
//                       </div>
//                     );
//                   });
//               })()}
//             </div>
//           </div>