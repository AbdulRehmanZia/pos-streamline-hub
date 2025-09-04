import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, LogOut, User, Plus, Trash2, Edit3 } from "lucide-react";
import { getSuperAdmin, logout } from "../middleware/TokenDecode";
import api from "../ApiInstance/index.ts";
import { Table, Drawer, Form, Input, Select, Pagination, Popconfirm, message, Space } from "antd";

const { Option } = Select;

const AdminDashboard = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [planUpdateLoading, setPlanUpdateLoading] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);

  // Logout
  const handleLogout = () => {
    logout();
  };

  // Fetch Admins
  const fetchAdmins = async (currentPage = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/user?page=${currentPage}&limit=${limit}`);
      setAdmins(res.data.data || []);
      setTotal(res.data.meta?.totalUsers || 0);
    } catch (err) {
      console.error("Error fetching admins:", err);
      message.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(page);
  }, [page]);

  // Handle Submit
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await api.post(`/user/register`, values);
      setDrawerVisible(false);
      form.resetFields();
      fetchAdmins(page);
      message.success("Admin created successfully!");
    } catch (err) {
      console.error("Error creating admin:", err);
      message.error("Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await api.put(`/user/delete/${id}`);
      fetchAdmins(page);
      message.success("Admin deleted successfully!");
    } catch (err) {
      console.error("Error deleting admin:", err);
      message.error("Failed to delete admin");
    } finally {
      setLoading(false);
    }
  };

  // Handle Plan Update
  const handlePlanUpdate = async (id: string, newPlan: string) => {
    try {
      setPlanUpdateLoading(id);
      await api.put(`/user/update-plan/${id}`, { plan: newPlan });
      
      // Update the local state immediately for better UX
      setAdmins(prevAdmins => 
        prevAdmins.map(admin => 
          admin.id === id ? { ...admin, plan: newPlan } : admin
        )
      );
      
      message.success(`Plan updated to ${newPlan} successfully!`);
    } catch (err) {
      console.error("Error updating plan:", err);
      message.error("Failed to update plan");
    } finally {
      setPlanUpdateLoading(null);
    }
  };

  // Get plan badge color
  const getPlanBadgeClass = (plan: string) => {
    switch (plan) {
      case "premium":
        return "bg-green-100 text-green-700 border-green-200";
      case "standard":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "basic":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Table Columns
  const columns = [
    {
      title: "S#",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (_: any, __: any, index: number) => (page - 1) * limit + index + 1,
    },
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Current Plan",
      dataIndex: "plan",
      key: "plan",
      width: 120,
      render: (plan: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPlanBadgeClass(plan)}`}>
          {plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "N/A"}
        </span>
      ),
    },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      title: "Actions",
      key: "actions",
      width: 280,
      render: (_: any, record: any) => (
        <Space size="small">
          {/* Plan Update Dropdown */}
          <div className="flex items-center gap-2">
            <Edit3 className="w-3 h-3 text-blue-600" />
            <Select
              value={record.plan}
              size="small"
              style={{ width: 100 }}
              loading={planUpdateLoading === record.id}
              onChange={(value) => handlePlanUpdate(record.id, value)}
              className="text-xs"
            >
              <Option value="basic">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  Basic
                </div>
              </Option>
              <Option value="standard">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Standard
                </div>
              </Option>
              <Option value="premium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Premium
                </div>
              </Option>
            </Select>
          </div>

          {/* Delete Button */}
          <Popconfirm
            title="Delete Admin"
            description="Are you sure you want to delete this admin?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-800 hover:border-red-300 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> 
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen cursor-pointer bg-gradient-feature">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-hero rounded-lg">
              <Monitor className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">RetailPOS Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              <span>Super Admin</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2 bg-gradient-hero text-white hover:text-black"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome, Super Admin
          </h1>
          <p className="text-muted-foreground">
            Manage your retail POS system from this dashboard.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-md border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Admins</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-md border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Premium Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {admins.filter(admin => admin.plan === 'premium').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="w-4 h-4 bg-green-800 rounded-full animate-ping">
                   <span className="w-2 h-2 bg-green-200 rounded-full animate-ping"></span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Plans</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                    {admins.filter(admin => admin.plan === 'basic').length} Basic
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {admins.filter(admin => admin.plan === 'standard').length} Std
                  </span>
                </div>
              </div>
              <Edit3 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Admin Management Table Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Admin Management</h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage administrator accounts and their subscription plans
              </p>
            </div>
            <Button
              onClick={() => setDrawerVisible(true)}
              className="bg-gradient-hero text-white gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="w-4 h-4" /> Add New Admin
            </Button>
          </div>

          <Table
            dataSource={admins}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={false}
            scroll={{ y: 400, x: 800 }}
            className="text-sm"
            size="middle"
            bordered
          />

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} admins
            </div>
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        </div>
      </main>

      {/* Drawer Form */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Create New Admin</span>
          </div>
        }
        placement="right"
        width={450}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="[&_.ant-drawer-header]:bg-gray-50 [&_.ant-drawer-header]:border-b-2"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-4">
          <Form.Item
            label={<span className="font-semibold text-gray-700">Full Name</span>}
            name="fullname"
            rules={[
              { required: true, message: "Please enter full name" },
              { min: 2, message: "Name must be at least 2 characters" }
            ]}
          >
            <Input placeholder="Enter full name" size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Email Address</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Enter valid email address" }
            ]}
          >
            <Input placeholder="Enter email address" size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Password</span>}
            name="password"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
          >
            <Input.Password placeholder="Enter secure password" size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Subscription Plan</span>}
            name="plan"
            rules={[{ required: true, message: "Please select a plan" }]}
          >
            <Select placeholder="Select subscription plan" size="large">
              <Option value="basic">
                <div className="flex items-center gap-2 py-1">
                  <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
                  <div>
                    <div className="font-medium">Basic Plan</div>
                    <div className="text-xs text-gray-500">Essential features</div>
                  </div>
                </div>
              </Option>
              <Option value="standard">
                <div className="flex items-center gap-2 py-1">
                  <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                  <div>
                    <div className="font-medium">Standard Plan</div>
                    <div className="text-xs text-gray-500">Most popular choice</div>
                  </div>
                </div>
              </Option>
              <Option value="premium">
                <div className="flex items-center gap-2 py-1">
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  <div>
                    <div className="font-medium">Premium Plan</div>
                    <div className="text-xs text-gray-500">All features included</div>
                  </div>
                </div>
              </Option>
            </Select>
          </Form.Item>

          <div className="pt-4 border-t">
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="w-full h-8 bg-gradient-hero shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? "Creating Admin..." : "Create Admin Account"}
              </Button>
            </Form.Item>
          </div>
        </Form>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Plan Features:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Basic:</strong> Core POS features, up to 10 products</li>
            <li>• <strong>Standard:</strong> Advanced features, up to 100 products</li>
            <li>• <strong>Premium:</strong> All features, unlimited products</li>
          </ul>
        </div>
      </Drawer>
    </div>
  );
};

export default AdminDashboard;