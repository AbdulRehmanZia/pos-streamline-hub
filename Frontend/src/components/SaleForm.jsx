import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "../Instance/BaseUrl"
import { useState } from "react"

export default function SaleForm({ onSaleAdded }) {
  const [formData, setFormData] = useState({
    paymentType: "CASH",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    items: [{ productId: "", quantity: "" }],
  });

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const addItemField = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: "", quantity: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedItems = formData.items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
      }));

      const payload = { ...formData, items: formattedItems };

      // Using the api instance from BaseUrl.js
      const response = await api.post('sale/add-sale', payload, {
        withCredentials: true,
      });

      if (response.data.success) {
        alert("Sale Created Successfully!");
        onSaleAdded?.(); 
        // Reset form
        setFormData({
          paymentType: "CASH",
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          items: [{ productId: "", quantity: "" }],
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error creating sale");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Create New Sale</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label>Customer Name</Label>
            <Input
              placeholder="Enter customer name" 
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Customer Email</Label>
            <Input
              type="email"
              placeholder="Enter customer email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Customer Phone</Label>
            <Input
              placeholder="Enter customer phone"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Payment Type</Label>
            <Select
              value={formData.paymentType}
              onValueChange={(value) => setFormData({ ...formData, paymentType: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Payment Type</SelectLabel>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Items</Label>
          {formData.items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Product ID"
                value={item.productId}
                onChange={(e) => handleItemChange(idx, "productId", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
              />
            </div>
          ))}
          <Button 
            type="button" 
            onClick={addItemField}
            variant="outline" 
            className="w-full bg-[#155dfc] !text-white hover:bg-blue-700"
          >
            Add Item
          </Button>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#155dfc] !text-white hover:bg-blue-700"
        >
          Create Sale
        </Button>
      </form>
    </div>
  );
}