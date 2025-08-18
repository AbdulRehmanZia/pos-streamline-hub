import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; 
import Sidebar from "../components/SideBar";
import Product from "../pages/Product";
import Sales from "../pages/Sale";
import Dashboard from "../pages/Dashboard";
import Category from "../pages/Category";
import Member from "../pages/Member";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Sidebar />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="product" element={<Product />} />
          <Route path="category" element={<Category />} />
          <Route path="member" element={<Member />} />
          <Route path="sale" element={<Sales />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
