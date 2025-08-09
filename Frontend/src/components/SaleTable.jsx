import { Button } from "@/components/ui/button"
import { api } from "../Instance/BaseUrl"

export default function SaleTable({ sales, onDelete }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      const response = await api.delete(`sale/delete-sale/${id}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        alert("Sale deleted successfully!");
        onDelete();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete sale");
      console.error(err);
    }
  };

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium">ID</th>
              <th className="py-3 px-4 text-left font-medium">Customer</th>
              <th className="py-3 px-4 text-left font-medium">Amount</th>
              <th className="py-3 px-4 text-left font-medium">Payment</th>
              <th className="py-3 px-4 text-left font-medium">Items</th>
              <th className="py-3 px-4 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <tr key={sale.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{sale.id}</td>
                  <td className="py-3 px-4">{sale.customerName || "N/A"}</td>
                  <td className="py-3 px-4">${sale.totalAmount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      sale.paymentType === 'CASH' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {sale.paymentType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {sale.saleItems.map((item) => (
                        <div key={item.id} className="text-sm text-gray-600">
                          {item.product.name} × {item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      onClick={() => handleDelete(sale.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No sales found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}