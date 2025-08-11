import React, { useEffect, useState } from "react";
import { api } from "../Instance/api";
import { Trash2, CreditCard, HandCoins, Loader, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function SalesTable({ refresh }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/sales");
      setSales(res.data.data);
    } catch (error) {
      console.error("Error fetching sales", error);
      setError("Failed to load sales data");
      toast.error("Failed to load sales data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      await api.delete(`/sales/delete-sale/${id}`);
      toast.success("Sale deleted successfully");
      fetchSales();
    } catch (error) {
      toast.error("Failed to delete sale");
      console.error("Error deleting sale", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [refresh]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-700">
        <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
        <p className="text-lg font-medium">{error}</p>
        <button
          onClick={fetchSales}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sale.customerName || "Walk-in"}</p>
                    {sale.customerEmail && (
                      <p className="text-xs text-gray-500">{sale.customerEmail}</p>
                    )}
                    {sale.customerPhone && (
                      <p className="text-xs text-gray-500">{sale.customerPhone}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${sale.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {sale.paymentType === "CARD" ? (
                      <CreditCard className="h-4 w-4 text-blue-500" />
                    ) : (
                      <HandCoins className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm text-gray-900">{sale.paymentType}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {sale.saleItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{item.product.name}</span>
                        <span className="text-xs text-gray-500">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(sale.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                    title="Delete sale"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sales.length === 0 && !loading && (
        <div className="text-center py-10">
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
            <CreditCard className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-base font-medium text-gray-900">No sales yet</h3>
          <p className="text-gray-500 text-sm">Create your first sale</p>
        </div>
      )}
    </div>
  );
}