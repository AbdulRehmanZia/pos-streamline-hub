import { RiTeamLine } from "react-icons/ri";
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import {
  Bars3Icon,
  XMarkIcon,
  RectangleStackIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  TagIcon,

} from '@heroicons/react/24/outline';

export default function Slidebaar({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <RectangleStackIcon className="h-6 w-6" /> },
    { name: 'Sales', path: '/sales', icon: <RectangleStackIcon className="h-6 w-6" /> },
    { name: 'Product', path: '/product', icon: <ShoppingBagIcon className="h-6 w-6" /> },
    { name: 'Catagery', path: '/catagery', icon: <TagIcon className="h-6 w-6" /> },
    { name: 'Member', path: '/member', icon: <RiTeamLine className="h-6 w-6" /> },
  ];

  const navigate = useNavigate();
  const handleLogout = () => {
    //  Clear localStorage or any login state here (if any)
    // localStorage.removeItem('token'); // optional
    navigate('/login');
  };


  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white text-black shadow-md transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-20'
          }`}
      >
        <div className="p-4 mt-2">
          <nav className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition text-sm ${location.pathname === item.path
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-gray-200'
                  }`}
                onClick={() => { }}
              >
                {item.icon}
                <span className={`transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                  {item.name}
                </span>

              </Link>
            ))}
          </nav>
        </div>

        {/*  Logout Button at Bottom */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-md transition text-sm hover:bg-red-100 text-red-600 w-full !mt-36"
          >
            <BiLogOut className="h-6 w-6" />
            <span className={`${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
              Logout
            </span>
          </button>
        </div>

      </div>

      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-black focus:outline-none cursor-pointer "
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'} `}
      >
        {children}
      </div>
    </div>
  );
}


