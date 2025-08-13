// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Product from "../pages/Product";
import Sales from "../pages/Sale";
import Dashboard from "../pages/Dashboard";
import Catagery from "../pages/Catagery";
import Member from "../pages/Member";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../components/Login";

function App() {
  return (
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
        <Route path="category" element={<Catagery />} />
        <Route path="member" element={<Member />} />
        <Route path="sale" element={<Sales />} />
      </Route>
    </Routes>
  );
}

export default App;
