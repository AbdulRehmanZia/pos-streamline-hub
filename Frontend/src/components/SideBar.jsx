import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { RiTeamLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import {
  Bars3Icon,
  XMarkIcon,
  RectangleStackIcon,
  ShoppingBagIcon,
  TagIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ShoppingCartIcon } from "lucide-react";

export default function SideBar() {
  const { user, logout } = useContext(UserContext);
  console.log("User role:", user?.role);

  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      roles: ["admin"],
      icon: <ChartBarIcon className="h-6 w-6" />,
    },
    {
    name: "New Sale",
    path: "/dashboard/new-sale",
    roles: ["admin", "cashier"], 
    icon: <ShoppingCartIcon className="h-6 w-6" />,
  },
    {
      name: "Sales",
      path: "/dashboard/sale",
      roles: ["admin", "cashier"],
      icon: <RectangleStackIcon className="h-6 w-6" />,
    },
    {
      name: "Products",
      path: "/dashboard/product",
      roles: ["admin", "cashier"],
      icon: <ShoppingBagIcon className="h-6 w-6" />,
    },
    {
      name: "Categories",
      roles: ["admin", "cashier"],
      path: "/dashboard/category",
      icon: <TagIcon className="h-6 w-6" />,
    },
    {
      name: "Members",
      path: "/dashboard/member",
      roles: ["admin"],
      icon: <RiTeamLine className="h-6 w-6" />,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#F4F9F9]">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#1C3333] text-[#F4F9F9] border-r border-[#F4F9F9]/20 shadow-md transition-[width] duration-300 z-40 
        flex flex-col
        ${isOpen ? "w-72" : "w-24"}`}
      >
        {/* Sidebar Header */}
        <div className="flex mt-9 items-center justify-between px-4 py-4 border border-[#F4F9F9]/20">
          {isOpen && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#F4F9F9] text-[#1C3333] flex items-center justify-center font-bold">
                {user?.fullname?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{user?.fullname}</p>
                <p className="text-xs text-[#F4F9F9]/70">
                  {user?.role.toUpperCase()}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md cursor-pointer hover:bg-[#F4F9F9]/20"
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6 text-[#F4F9F9]" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-[#F4F9F9]" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-6 space-y-2 overflow-y-auto flex-1">
          <p
            className={`px-3 text-xs uppercase text-[#F4F9F9]/50 ${
              !isOpen && "hidden"
            }`}
          >
            Main
          </p>

          {navItems
  .filter(item => item.roles.includes(user?.role)) 
  .map((item) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        key={item.name}
        to={item.path}
        title={!isOpen ? item.name : ""}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
          ${
            isActive
              ? "bg-[#F4F9F9] text-[#1C3333] shadow-md border-l-4"
              : "text-[#F4F9F9] hover:bg-[#F4F9F9]/20"
          }`}
      >
        {item.icon}
        {isOpen && <span>{item.name}</span>}
      </Link>
    );
  })}

        </nav>

        {/* Logout Button */}
        <div className="border-t border-[#F4F9F9]/20 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-4 py-3  w-full text-sm font-medium text-red-500 hover:bg-red-600/20 transition-colors cursor-pointer"
          >
            <BiLogOut className="h-6 w-6" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? "ml-72" : "ml-24"
        }`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
