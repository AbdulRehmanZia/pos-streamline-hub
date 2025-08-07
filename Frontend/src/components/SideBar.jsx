import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav style={{ width: '200px', padding: '20px', background: '#eee' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><Link to="/dashboard/members">Members</Link></li>
        <li><Link to="/dashboard/products">Products</Link></li>
        <li><Link to="/dashboard/category">Category</Link></li>
        <li><Link to="/dashboard/sales">Sales</Link></li>
        <li><Link to="/dashboard/sales-query">Sales Query</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
