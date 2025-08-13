import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { RiTeamLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { Bars3Icon, XMarkIcon, RectangleStackIcon, ShoppingBagIcon, TagIcon } from '@heroicons/react/24/outline';
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <RectangleStackIcon className="h-6 w-6" /> },
    { name: 'Sales', path: '/dashboard/sale', icon: <RectangleStackIcon className="h-6 w-6" /> },
    { name: 'Product', path: '/dashboard/product', icon: <ShoppingBagIcon className="h-6 w-6" /> },
    { name: 'Category', path: '/dashboard/category', icon: <TagIcon className="h-6 w-6" /> },
    { name: 'Member', path: '/dashboard/member', icon: <RiTeamLine className="h-6 w-6" /> },
  ];
const {logout} = useContext(UserContext)
  const handleLogout = () => {
logout()
    navigate('/');
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white text-black shadow-md transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 mt-2 flex flex-col justify-between h-full">
          {/* Navigation */}
          <nav className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'hover:bg-gray-200'
                }`}
              >
                {item.icon}
                <span className={`${isOpen ? 'opacity-100' : 'hidden'}`}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-md transition text-sm hover:bg-red-100 text-red-600"
          >
            <BiLogOut className="h-6 w-6" />
            <span className={`${isOpen ? 'opacity-100' : 'hidden'}`}>
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-black focus:outline-none cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'} p-4 w-full`}>
        <Outlet />
      </div>
    </div>
  );
}
