import { useTheme } from "../../../hooks/use-theme";
import React, { useEffect, useState, useCallback } from 'react';
import { Moon, Search, Sun, Menu, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import { API_BASE_URL } from "../../../config/api";

// Default user avatar component
const DefaultAvatar = ({ name, size = 40 }) => {
    const initials = name
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';
    
    return (
        <div 
            className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold rounded-full"
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {initials}
        </div>
    );
};

DefaultAvatar.propTypes = {
    name: PropTypes.string,
    size: PropTypes.number,
};

export const UserHeader = ({ onToggleSidebar }) => {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState(null);
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        photo: null,
        username: "",
        email: ""
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Memoized function to fetch user info from API
    const fetchUserInfo = useCallback(async () => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            console.warn("No authentication token found");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
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
                    photo: data.photo || null, // Using 'photo' as per your JSON structure
                    username: data.username || "",
                    email: data.email || ""
                });
            } else if (response.status === 401) {
                // Token expired or invalid
                console.warn("Authentication failed - redirecting to login");
                handleLogout();
            } else {
                console.error(`Failed to fetch user info: ${response.status} ${response.statusText}`);
                // Keep existing user info or set minimal fallback
                if (!userInfo.firstName && !userInfo.username) {
                    setUserInfo(prev => ({
                        ...prev,
                        firstName: "User",
                        username: "user"
                    }));
                }
            }
        } catch (error) {
            console.error("Network error while fetching user info:", error);
            // Keep existing user info on network error
        } finally {
            setLoading(false);
        }
    }, [userInfo.firstName, userInfo.username]);

    // Handle authentication state changes
    useEffect(() => {
        const checkAuthState = () => {
            const loggedIn = localStorage.getItem("loggedIn") === "true";
            const currentUserType = localStorage.getItem("userType");
            const token = localStorage.getItem("token");
            
            // Validate that we have both loggedIn flag and token
            const isAuthenticated = loggedIn && token;
            
            setIsLoggedIn(isAuthenticated);
            setUserType(currentUserType);
            
            if (isAuthenticated) {
                fetchUserInfo();
            } else {
                // Clear user info if not authenticated
                setUserInfo({
                    firstName: "",
                    lastName: "",
                    photo: null,
                    username: "",
                    email: ""
                });
                setLoading(false);
            }
        };

        // Listen for storage changes (login/logout from other tabs)
        const handleStorageChange = (e) => {
            if (['loggedIn', 'token', 'userType'].includes(e.key)) {
                checkAuthState();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        checkAuthState(); // Initial check

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [fetchUserInfo]);

    // Handle logout
    const handleLogout = useCallback(() => {
        // Clear all auth-related localStorage items
        const authKeys = ['loggedIn', 'userType', 'token', 'companyName', 'companyImage'];
        authKeys.forEach(key => localStorage.removeItem(key));
        
        // Reset state
        setIsLoggedIn(false);
        setUserType(null);
        setUserInfo({
            firstName: "",
            lastName: "",
            photo: null,
            username: "",
            email: ""
        });
        
        // Navigate to login
        navigate('/login', { replace: true });
    }, [navigate]);

    // Handle search
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            // Implement search functionality here
            console.log('Search query:', searchQuery);
            // You can emit an event or call a parent function to handle search
        }
    };

    // Get display name
    const getDisplayName = () => {
        if (userInfo.firstName) {
            return userInfo.lastName 
                ? `${userInfo.firstName} ${userInfo.lastName}` 
                : userInfo.firstName;
        }
        return userInfo.username || userInfo.email || "User";
    };

    const displayName = getDisplayName();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-white/95 px-6 shadow-sm backdrop-blur-md transition-colors dark:bg-slate-900/95">
            {/* Left section */}
            <div className="flex items-center gap-4">
                {/* Mobile menu toggle */}
                <button
                    onClick={onToggleSidebar}
                    className="md:hidden rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                
                {/* User Profile and Welcome */}
                <div className="flex items-center gap-3">
                    {/* Profile Avatar */}
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-slate-600">
                        {loading ? (
                            <div className="h-full w-full bg-gray-200 dark:bg-slate-700 animate-pulse rounded-full" />
                        ) : userInfo.photo ? (
                            <img
                                src={userInfo.photo}
                                alt={`${displayName}'s avatar`}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    // Replace broken image with default avatar
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        {/* Default avatar fallback */}
                        <div 
                            className="absolute inset-0"
                            style={{ display: userInfo.photo ? 'none' : 'flex' }}
                        >
                            <DefaultAvatar name={displayName} size={40} />
                        </div>
                    </div>
                    
                    {/* Welcome text */}
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                            {loading ? (
                                <span className="inline-block h-4 w-24 bg-gray-200 dark:bg-slate-700 animate-pulse rounded" />
                            ) : (
                                `Welcome, ${displayName}`
                            )}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Right section */}
            <div className="flex flex-1 items-center justify-end gap-6">
                {/* <div className="hidden md:flex items-center w-full max-w-md">
                    <div className="relative flex w-full items-center">
                        <Search
                            size={18}
                            className="absolute left-3 text-gray-400 dark:text-gray-500"
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
                        />
                    </div>
                </div> */}
                
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <button
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 transition-colors"
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                    >
                        {theme === 'dark' ? (
                            <Sun size={20} className="text-yellow-500" />
                        ) : (
                            <Moon size={20} className="text-slate-600" />
                        )}
                    </button>
                    
                    {/* Logout button */}
                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

UserHeader.propTypes = {
    onToggleSidebar: PropTypes.func.isRequired,
};