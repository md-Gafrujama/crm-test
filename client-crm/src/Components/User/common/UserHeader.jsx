import { useTheme } from "../../../hooks/use-theme";
import React, { useEffect, useState } from 'react';
import { Bell, ChevronsLeft, Moon, Search, Sun, Menu } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import { API_BASE_URL } from "../../../config/api";

export const UserHeader = ({ onToggleSidebar }) => {
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };
    
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
    const [userType, setUserType] = useState(localStorage.getItem("userType"));
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        photo: "",
        username: ""
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Function to fetch user info from API
    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            
            if (!token) {
                console.warn("No token found, user might not be logged in");
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/allUser/info/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    photo: data.photo || "https://tse4.mm.bing.net/th/id/OIP.C4yEUq2tPmLDROuTo9XkcQHaHa?rs=1&pid=ImgDetMain",
                    username: data.username || ""
                });
            } else if (response.status === 401) {
                // Token might be expired, handle logout
                handleLogout();
            } else {
                console.error("Failed to fetch user info:", response.statusText);
                // Use fallback values
                setUserInfo({
                    firstName: "User",
                    lastName: "",
                    photo: "https://tse4.mm.bing.net/th/id/OIP.C4yEUq2tPmLDROuTo9XkcQHaHa?rs=1&pid=ImgDetMain",
                    username: "user"
                });
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
            // Use fallback values
            setUserInfo({
                firstName: "User",
                lastName: "",
                photo: "https://tse4.mm.bing.net/th/id/OIP.C4yEUq2tPmLDROuTo9XkcQHaHa?rs=1&pid=ImgDetMain",
                username: "user"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const loggedIn = localStorage.getItem("loggedIn") === "true";
            const currentUserType = localStorage.getItem("userType");
            
            setIsLoggedIn(loggedIn);
            setUserType(currentUserType);
            
            // Fetch user info from API if logged in
            if (loggedIn) {
                fetchUserInfo();
            } else {
                // Clear user info if not logged in
                setUserInfo({
                    firstName: "",
                    lastName: "",
                    photo: "",
                    username: ""
                });
                setLoading(false);
            }
        };

        // Listen for storage changes
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
        localStorage.removeItem("companyName");
        localStorage.removeItem("companyImage");
        setIsLoggedIn(false);
        setUserType(null);
        setUserInfo({
            firstName: "",
            lastName: "",
            photo: "",
            username: ""
        });
        navigate('/login', { replace: true });
        window.location.reload();
    };

    // Get display name and image
    const displayName = userInfo.firstName 
        ? `${userInfo.firstName}${userInfo.lastName ? ` ${userInfo.lastName}` : ''}`
        : userInfo.username || "User";
    
    const profileImage = userInfo.photo || "https://tse4.mm.bing.net/th/id/OIP.C4yEUq2tPmLDROuTo9XkcQHaHa?rs=1&pid=ImgDetMain";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-white/90 px-6 shadow-sm backdrop-blur-md transition-colors dark:bg-slate-900/90">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="md:hidden rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                
                {/* User Profile and Welcome Message */}
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800">
                        {loading ? (
                            <div className="h-full w-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
                        ) : (
                            <img
                                src={profileImage}
                                alt={`${displayName} profile`}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://tse4.mm.bing.net/th/id/OIP.C4yEUq2tPmLDROuTo9XkcQHaHa?rs=1&pid=ImgDetMain";
                                }}
                            />
                        )}
                    </div>
                    
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                            {loading ? (
                                <span className="inline-block h-4 w-20 bg-gray-200 dark:bg-slate-700 animate-pulse rounded" />
                            ) : (
                                `Welcome, ${displayName}`
                            )}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-1 items-center justify-end gap-6">
                {/* Search input */}
                <div className="hidden md:flex items-center w-full max-w-md">
                    <div className="relative flex w-full items-center">
                        <Search
                            size={18}
                            className="absolute left-3 text-gray-400 dark:text-gray-500"
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-900/50"
                        />
                    </div>
                </div>
                
                {/* Theme toggle and logout */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun size={20} className="text-yellow-400" />
                        ) : (
                            <Moon size={20} className="text-slate-600" />
                        )}
                    </button>
                    
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
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