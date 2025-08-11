import React, { useState, useEffect } from "react";
import { api } from "../Instance/api";
import { PlusCircle, Trash2, Loader, CreditCard, HandCoins, Search, X } from "lucide-react";
import toast from "react-hot-toast";

function SaleForm({ onSaleAdded }) {
  const [paymentType, setPaymentType] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [items, setItems] = useState([{ productId: "", product: null, quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(null);

  // Debounce search function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() && activeSearchIndex !== null) {
        fetchProducts(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, activeSearchIndex]);

  const fetchProducts = async (query) => {
    try {
      setSearchLoading(true);
      const res = await api.get(`admin/products?search=${query}`);
      console.log("Products: ", res);
      
      setSearchResults(res.data.data);
    } catch (error) {
      console.error("Error searching products", error);
      toast.error("Failed to search products");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleProductSelect = (product, index) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      productId: product.id,
      product: product
    };
    setItems(updatedItems);
    setSearchQuery("");
    setSearchResults([]);
    setActiveSearchIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const saleData = {
        paymentType,
        customerName,
        customerEmail,
        customerPhone,
        items: items.map((item) => ({
          productId: parseInt(item.productId, 10),
          quantity: parseInt(item.quantity, 10),
        })),
      };
      await api.post("/sales/add-sale", saleData);
      toast.success("Sale completed successfully!");
      onSaleAdded();
      setPaymentType("");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setItems([{ productId: "", product: null, quantity: 1 }]);
    } catch (error) {
      toast.error("Failed to complete sale");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addItemRow = () => {
    setItems([...items, { productId: "", product: null, quantity: 1 }]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) return;
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  const handleSearchFocus = (index) => {
    setActiveSearchIndex(index);
    if (items[index].productId) {
      setSearchQuery(items[index].product?.name || "");
    }
  };

  const clearSelection = (index) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      productId: "",
      product: null
    };
    setItems(updatedItems);
    setSearchQuery("");
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Optional"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Customer Email</label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="Optional"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Customer Phone</label>
          <input
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Optional"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Payment Type</label>
          <div className="relative">
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              required
            >
              <option value="">Payment type</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {paymentType === "CARD" ? (
                <CreditCard className="h-5 w-5 text-gray-400" />
              ) : paymentType === "CASH" ? (
                <HandCoins className="h-5 w-5 text-gray-400" />
              ) : (
                <span className="text-gray-400">⌄</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Items</h3>
          <button
            type="button"
            onClick={addItemRow}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2  focus:ring-blue-500"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            Add More Item
          </button>
        </div>
        
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <label className="block text-sm font-medium text-gray-700">Product</label>
                
                {item.product ? (
                  <div className="relative">
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900">{item.product.name}</span>
                        <span className="text-gray-500 mr-4.5">${item.product.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => clearSelection(index)}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={activeSearchIndex === index ? searchQuery : ""}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => handleSearchFocus(index)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {activeSearchIndex === index && (searchQuery || searchResults.length > 0) && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60 focus:outline-none sm:text-sm">
                        {searchLoading ? (
                          <div className="px-4 py-2 text-gray-500 flex items-center">
                            <Loader className="animate-spin mr-2 h-4 w-4" />
                            Searching...
                          </div>
                        ) : searchResults.length === 0 ? (
                          <div className="px-4 py-2 text-gray-500">No products found</div>
                        ) : (
                          searchResults.map((product) => (
                            <div
                              key={product.id}
                              className="cursor-pointer hover:bg-gray-100 px-4 py-2 flex justify-between"
                              onClick={() => handleProductSelect(product, index)}
                            >
                              <span>{product.name}</span>
                              <span className="text-gray-500">${product.price.toFixed(2)}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  placeholder="Qty"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItemRow(index)}
                  className="mb-1 p-2 text-gray-500 hover:text-red-500 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <Loader className="animate-spin mr-2 h-4 w-4" />
            Processing...
          </>
        ) : (
          "Add Sale"
        )}
      </button>
    </form>
  );
}

export default SaleForm;