import { useState, useEffect } from "react"
import SaleForm from "../components/SaleForm"
import SaleTable from "../components/SaleTable"
import { api } from "../Instance/BaseUrl"

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const response = await api.get('sale/get-sales', {
        withCredentials: true
      });
      if (response.data.success) {
        setSales(response.data.sales);
      }
    } catch (err) {
      console.error('Failed to fetch sales:', err);
      alert(err.response?.data?.message || "Error fetching sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Sales Management</h1>
        <SaleForm onSaleAdded={fetchSales} />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Sales History</h2>
        {loading ? (
          <div className="text-center py-4">Loading sales...</div>
        ) : (
          <SaleTable sales={sales} onDelete={fetchSales} />
        )}
      </div>
    </div>
  );
}