import React from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Member from "./pages/Member";
import Product from "./pages/Product";
import Category from "./pages/Category";
import Sale from "./pages/Sale";
import SalesQuery from "./pages/SalesQuery";
import DashboardLayout from "./layout/DashboardLayout";
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Protected Dashboard Routes */}

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="members" element={<Member />} />
          <Route path="products" element={<Product />} />
          <Route path="category" element={<Category />} />
          <Route path="sales" element={<Sale />} />
          <Route path="sales-query" element={<SalesQuery />} />
        </Route>
      </Routes>
    </Router>
  );
}
