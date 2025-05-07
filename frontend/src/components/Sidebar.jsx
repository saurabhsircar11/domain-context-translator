import { NavLink } from "react-router-dom";
import { Home, PlusCircle } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="hidden w-64 h-screen p-6 border-r shadow-lg bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 md:block">
      <h1 className="mb-8 text-3xl font-extrabold tracking-wide text-white">
        TranslateX
      </h1>
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 
            ${
              isActive
                ? "bg-white text-blue-600 shadow-lg"
                : "text-gray-300 hover:bg-blue-600 hover:rounded-xl hover:text-white"
            }`
          }
        >
          <Home className="w-6 h-6" />
          Dashboard
        </NavLink>
        <NavLink
          to="/projects/new"
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 
            ${
              isActive
                ? "bg-white text-blue-600 shadow-lg"
                : "text-gray-300 hover:bg-blue-600 hover:rounded-xl hover:text-white"
            }`
          }
        >
          <PlusCircle className="w-6 h-6" />
          New Project
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
