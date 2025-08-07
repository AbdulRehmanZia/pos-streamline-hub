import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SideBar';

const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ padding: '20px', flexGrow: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
