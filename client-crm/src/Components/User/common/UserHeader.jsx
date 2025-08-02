import { useTheme } from "../../../hooks/use-theme";
import React, { useEffect, useState } from 'react';
import { Bell, ChevronsLeft, Moon, Search, Sun,Menu } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";


export const UserHeader = ({ onToggleSidebar }) => {
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => {
  setTheme(theme === "light" ? "dark" : "light");
};
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
  const [userType, setUserType] = useState(localStorage.getItem("userType"));
  const navigate = useNavigate();

useEffect(() => {
    const handleStorageChange = () => {
        setIsLoggedIn(localStorage.getItem("loggedIn") === "true");
        setUserType(localStorage.getItem("userType"));
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Initialize state once
    handleStorageChange();

    return () => {
        window.removeEventListener("storage", handleStorageChange);
    };
}, []); 

const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("token"); 
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/login', { replace: true });
    window.location.reload();
};
    return (
 <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-white/80 px-6 shadow-sm backdrop-blur-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="md:hidden rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                    Dashboard
                </h1>
            </div>
            
            <div className="flex flex-1 items-center justify-end gap-6">
                {/* Search input */}
                <div className="hidden md:flex items-center w-full max-w-md">
                    <div className="relative flex w-full items-center">
                        <Search
                            size={18}
                            className="absolute left-3 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-orange-500 dark:focus:ring-orange-900/50"
                        />
                    </div>
                </div>
                
                {/* Notification and theme toggle */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun size={20} className="text-yellow-300" />
                        ) : (
                            <Moon size={20} className="text-slate-700" />
                        )}
                    </button>
                    
                    <button
                        onClick={handleLogout}
                        className="sm:inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>

    );
};

UserHeader.propTypes = {
    onToggleSidebar: PropTypes.func.isRequired,
};
