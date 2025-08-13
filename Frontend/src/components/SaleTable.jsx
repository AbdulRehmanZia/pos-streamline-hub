import React, { useEffect, useState } from "react";
import { api } from "../Instance/api";
import { Trash2, CreditCard, HandCoins, Loader, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

export default function SalesTable({ refresh }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0
  });

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/sales?page=${pagination.page}&limit=${pagination.limit}`);
      setSales(res.data.data);
      setPagination(prev => ({
        ...prev,
        totalPages: res.data.meta?.totalPages || 1,
        totalItems: res.data.meta?.totalItems || res.data.data.length
      }));
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
      // If we're on the last page and this was the only item, go back a page
      if (sales.length === 1 && pagination.page > 1) {
        setPagination(prev => ({ ...prev, page: prev.page - 1 }));
      } else {
        fetchSales();
      }
    } catch (error) {
      toast.error("Failed to delete sale");
      console.error("Error deleting sale", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  useEffect(() => {
    fetchSales();
  }, [refresh, pagination.page, pagination.limit]);

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
      {/* Pagination Controls - Top */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.totalItems)}
            </span>{" "}
            of <span className="font-medium">{pagination.totalItems}</span> results
          </span>
          <select
            value={pagination.limit}
            onChange={handleLimitChange}
            className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    pagination.page === pageNum
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
              <span className="px-2">...</span>
            )}
            {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  pagination.page === pagination.totalPages
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pagination.totalPages}
              </button>
            )}
          </div>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table Content */}
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

      {/* Empty state */}
      {sales.length === 0 && !loading && (
        <div className="text-center py-10">
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
            <CreditCard className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-base font-medium text-gray-900">No sales yet</h3>
          <p className="text-gray-500 text-sm">Create your first sale</p>
        </div>
      )}

      {/* Pagination Controls - Bottom */}
      {sales.length > 0 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{pagination.page}</span> of{" "}
                <span className="font-medium">{pagination.totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}