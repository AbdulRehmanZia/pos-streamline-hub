import React, { useState, useEffect } from "react";
import { api } from "../Instance/api";
import {
  PlusCircle,
  Trash2,
  Loader,
  CreditCard,
  HandCoins,
  Search,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

function SaleForm({ onSaleAdded }) {
  const [paymentType, setPaymentType] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [newItem, setNewItem] = useState({ productId: "", product: null, quantity: 1 });

  // Debounce search function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchProducts(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProducts = async (query) => {
    try {
      setSearchLoading(true);
      const res = await api.get(`admin/products?search=${query}`);
      setSearchResults(res.data.data);
    } catch (error) {
      console.error("Error searching products", error);
      toast.error("Failed to search products");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    const existingItemIndex = items.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex !== -1) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += 1;
      setItems(updatedItems);
    } else {
      setItems([...items, {
        productId: product.id,
        product: product,
        quantity: 1
      }]);
    }
    
    // Reset search
    setSearchQuery("");
    setSearchResults([]);
    setNewItem({ productId: "", product: null, quantity: 1 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error("Please add at least one product");
      return;
    }
    
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
      onSaleAdded();
      setPaymentType("");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setItems([]);
    } catch (error) {
      toast.error("Failed to complete sale");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const updateQuantity = (index, value) => {
    const updated = [...items];
    updated[index].quantity = parseInt(value, 10) || 1;
    setItems(updated);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#1C3333]">Customer Name</label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Optional"
            className="w-full px-3 py-2 border border-[#1C3333]/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1C3333] focus:border-[#1C3333] text-[#1C3333] bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#1C3333]">Customer Email</label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="Optional"
            className="w-full px-3 py-2 border border-[#1C3333]/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1C3333] focus:border-[#1C3333] text-[#1C3333] bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#1C3333]">Customer Phone</label>
          <input
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Optional"
            className="w-full px-3 py-2 border border-[#1C3333]/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1C3333] focus:border-[#1C3333] text-[#1C3333] bg-white"
          />
        </div>

        <div className="space-y-2 ">
          <label className="block text-sm font-medium text-[#1C3333]">Payment Type</label>
          <div className="relative">
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full px-3 py-2 border cursor-pointer border-[#1C3333]/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1C3333] focus:border-[#1C3333] text-[#1C3333] bg-white appearance-none"
              required
            >
              <option value="">Payment type</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {paymentType === "CARD" ? (
                <CreditCard className="h-5 w-5 text-[#1C3333]/70" />
              ) : paymentType === "CASH" ? (
                <HandCoins className="h-5 w-5 text-[#1C3333]/70" />
              ) : (
                <span className="text-[#1C3333]/70">⌄</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1C3333]/20 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-[#1C3333]">Items</h3>
        </div>

        {/* Product Search Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1C3333]">Add Product</label>
          <div className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#1C3333]/50" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-[#1C3333]/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1C3333] focus:border-[#1C3333] text-[#1C3333] bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-[#1C3333]/50 hover:text-[#1C3333]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {searchQuery && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60 focus:outline-none sm:text-sm">
                {searchLoading ? (
                  <div className="px-4 py-2 text-[#1C3333]/70 flex items-center">
                    <Loader className="animate-spin mr-2 h-4 w-4" />
                    Searching...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="px-4 py-2 text-[#1C3333]/70">No products found</div>
                ) : (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="cursor-pointer hover:bg-[#F4F9F9] px-4 py-2 flex justify-between text-[#1C3333]"
                      onClick={() => handleProductSelect(product)}
                    >
                      <span>{product.name}</span>
                      <span className="text-[#1C3333]/70">Rs.{product.price.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-4 text-[#1C3333]/70">
              No products added yet. Search and add products above.
            </div>
          ) : (
            items.map((item, index) => (
              <div key={index} className="flex gap-3 items-center p-3 bg-[#F4F9F9] rounded-md">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[#1C3333] font-medium mt-5">{item.product.name}</span>
                    <span className="text-[#1C3333]/70 mt-5">Rs.{item.product.price.toFixed()}</span>
                  </div>
                </div>
                
                <div className="w-24">
                  <label className="block text-sm font-medium text-[#1C3333]">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(index, e.target.value)}
                    className="w-full px-3 cursor-pointer py-2 border border-[#1C3333]/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1C3333] focus:border-[#1C3333] text-[#1C3333] bg-white"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 cursor-pointer mt-5  text-[#1C3333]/50 hover:text-red-500 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5 text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="w-full flex cursor-pointer justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1C3333] hover:bg-[#1C3333]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3333] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
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