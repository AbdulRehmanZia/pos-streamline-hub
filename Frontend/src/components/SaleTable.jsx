import React, { useContext, useEffect, useState } from "react";
import { api } from "../Instance/api";
import { Trash2, CreditCard, HandCoins, Loader, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";
import ConfirmModal from "./ConfirmModal"; // ✅ import your new modal

export default function SalesTable({ refresh }) {
  const { user } = useContext(UserContext);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0
  });

  // Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

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

  const handleDeleteClick = (id) => {
    setSaleToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/sales/delete-sale/${saleToDelete}`);
      toast.success("Sale deleted successfully");
      setConfirmOpen(false);
      setSaleToDelete(null);
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

  const cancelDelete = () => {
    setConfirmOpen(false);
    setSaleToDelete(null);
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
        <Loader className="animate-spin h-10 w-10 text-[#1C3333]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#1C3333]">
        <AlertCircle className="h-12 w-12 mb-4 text-[#FF6F61]" />
        <p className="text-lg font-medium">{error}</p>
        <button
          onClick={fetchSales}
          className="mt-4 px-4 py-2 bg-[#1C3333] text-white rounded-md hover:bg-[#1C3333]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3333]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-[#1C3333]/20 overflow-hidden">
        {/* Pagination Controls */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-[#1C3333]/20 bg-[#F4F9F9]">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[#1C3333]">
              Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.totalItems)}
              </span>{" "}
              of <span className="font-medium">{pagination.totalItems}</span> results
            </span>
            <select
              value={pagination.limit}
              onChange={handleLimitChange}
              className="text-sm border-[#1C3333]/30 rounded-md focus:ring-[#1C3333] focus:border-[#1C3333] text-[#1C3333]"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
          {/* Pagination buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 border border-[#1C3333]/30 rounded-md text-sm font-medium text-[#1C3333] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1C3333]/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {/* Page numbers */}
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
                        ? "bg-[#1C3333] text-white"
                        : "border border-[#1C3333]/30 hover:bg-[#1C3333]/10 text-[#1C3333]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {/* Ellipsis and last page */}
              {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                <span className="px-2 text-[#1C3333]">...</span>
              )}
              {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    pagination.page === pagination.totalPages
                      ? "bg-[#1C3333] text-white"
                      : "border border-[#1C3333]/30 hover:bg-[#1C3333]/10 text-[#1C3333]"
                  }`}
                >
                  {pagination.totalPages}
                </button>
              )}
            </div>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 border border-[#1C3333]/30 rounded-md text-sm font-medium text-[#1C3333] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1C3333]/10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#1C3333]/20">
            <thead className="bg-[#F4F9F9]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1C3333] uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1C3333] uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1C3333] uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#1C3333] uppercase tracking-wider">
                  Items
                </th>
                {user?.role === "admin" && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#1C3333] uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#1C3333]/20">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-[#F4F9F9]">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-[#1C3333]">{sale.customerName || "Walk-in"}</p>
                      {sale.customerEmail && (
                        <p className="text-xs text-[#1C3333]/70">{sale.customerEmail}</p>
                      )}
                      {sale.customerPhone && (
                        <p className="text-xs text-[#1C3333]/70">{sale.customerPhone}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1C3333]">
                    ${sale.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {sale.paymentType === "CARD" ? (
                        <CreditCard className="h-4 w-4 text-[#1C3333]" />
                      ) : (
                        <HandCoins className="h-4 w-4 text-[#1C3333]" />
                      )}
                      <span className="text-sm text-[#1C3333]">{sale.paymentType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {sale.saleItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <span className="text-sm text-[#1C3333]">{item.product.name}</span>
                          <span className="text-xs text-[#1C3333]/70">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  {user?.role === "admin" && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteClick(sale.id)}
                        className="text-[#FF6F61] hover:text-[#FF6F61]/80 p-1 rounded-md hover:bg-[#FF6F61]/10"
                        title="Delete sale"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {sales.length === 0 && !loading && (
          <div className="text-center py-10">
            <div className="bg-[#1C3333]/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="h-6 w-6 text-[#1C3333]" />
            </div>
            <h3 className="text-base font-medium text-[#1C3333]">No sales yet</h3>
            <p className="text-[#1C3333]/70 text-sm">Create your first sale</p>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete Sale"
        message="Are you sure you want to delete this sale? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );

}
