// import { useTheme } from "../../../hooks/use-theme";
// import React, { useEffect, useState } from 'react';
// import { Bell, ChevronsLeft, Moon, Search, Sun,Menu } from "lucide-react";
// import { useNavigate } from 'react-router-dom';
// import PropTypes from "prop-types";


// export const Header = ({ onToggleSidebar }) => {
//     const { theme, setTheme } = useTheme();
//     console.log('Current theme in Header:', theme);
//   const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
//   const [userType, setUserType] = useState(localStorage.getItem("userType"));
//   const navigate = useNavigate();

// useEffect(() => {
//     const handleStorageChange = () => {
//         setIsLoggedIn(localStorage.getItem("loggedIn") === "true");
//         setUserType(localStorage.getItem("userType"));
//     };

//     window.addEventListener("storage", handleStorageChange);
    
//     // Initialize state once
//     handleStorageChange();

//     return () => {
//         window.removeEventListener("storage", handleStorageChange);
//     };
// }, []); 

// const handleLogout = () => {
//     localStorage.removeItem("loggedIn");
//     localStorage.removeItem("userType");
//     localStorage.removeItem("token"); 
//     setIsLoggedIn(false);
//     setUserType(null);
//     navigate('/login', { replace: true });
//      window.location.reload();
// };
//     return (
//  <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-white/80 px-6 shadow-sm backdrop-blur-md transition-colors dark:bg-slate-900">
//             <div className="flex items-center gap-4">
//                 <button
//                     onClick={onToggleSidebar}
//                     className="md:hidden rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
//                     aria-label="Toggle sidebar"
//                 >
//                     <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
//                 </button>
//                 <h1 className="text-xl font-bold text-gray-800 dark:text-white">
//                     Dashboard
//                 </h1>
//             </div>
            
//             <div className="flex flex-1 items-center justify-end gap-6">
//                 {/* Search input */}
//                 <div className="hidden md:flex items-center w-full max-w-md">
//                     <div className="relative flex w-full items-center">
//                         <Search
//                             size={18}
//                             className="absolute left-3 text-gray-400"
//                         />
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-orange-500 dark:focus:ring-orange-900/50"
//                         />
//                     </div>
//                 </div>
                
//                 {/* Notification and theme toggle */}
//                 <div className="flex items-center gap-4">
//                     <button
//                         onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//                         className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700"
//                         aria-label="Toggle theme"
//                     >
//                         {theme === 'dark' ? (
//                             <Sun size={20} className="text-yellow-300" />
//                         ) : (
//                             <Moon size={20} className="text-slate-700" />
//                         )}
//                     </button>
                    
//                     <button
//                         onClick={handleLogout}
//                         className="sm:inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
//                     >
//                         Logout
//                     </button>
//                 </div>
//             </div>
//         </header>

// // Change the header container to:

//     );
// };

// Header.propTypes = {
//     onToggleSidebar: PropTypes.func.isRequired,
// };





// import { useTheme } from "../../../hooks/use-theme";
// import React, { useEffect, useState } from 'react';
// import { Bell, ChevronsLeft, Moon, Search, Sun,Menu } from "lucide-react";
// import { useNavigate } from 'react-router-dom';
// import PropTypes from "prop-types";
// import { useSearch } from "../../../contexts/SearchContext";

// export const Header = ({ onToggleSidebar }) => {
//     const { theme, setTheme } = useTheme();
//     const { updateSearchTerm } = useSearch();
//   const [localSearchTerm, setLocalSearchTerm] = useState('');
//     console.log('Current theme in Header:', theme);
//   const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
//   const [userType, setUserType] = useState(localStorage.getItem("userType"));
//   const navigate = useNavigate();

//     const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setLocalSearchTerm(value);
//     updateSearchTerm(value); 
//   };


// useEffect(() => {
//     const handleStorageChange = () => {
//         setIsLoggedIn(localStorage.getItem("loggedIn") === "true");
//         setUserType(localStorage.getItem("userType"));
//     };

//     window.addEventListener("storage", handleStorageChange);
    
//     // Initialize state once
//     handleStorageChange();

//     return () => {
//         window.removeEventListener("storage", handleStorageChange);
//     };
// }, []); 

// const handleLogout = () => {
//     localStorage.removeItem("loggedIn");
//     localStorage.removeItem("userType");
//     localStorage.removeItem("token"); 
//     setIsLoggedIn(false);
//     setUserType(null);
//     navigate('/login', { replace: true });
//      window.location.reload();
// };
//     return (
//  <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-white/80 px-6 shadow-sm backdrop-blur-md transition-colors dark:bg-slate-900">
//             <div className="flex items-center gap-4">
//                 <button
//                     onClick={onToggleSidebar}
//                     className="md:hidden rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
//                     aria-label="Toggle sidebar"
//                 >
//                     <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
//                 </button>
//                 <h1 className="text-xl font-bold text-gray-800 dark:text-white">
//                     Dashboard
//                 </h1>
//             </div>
            
//             <div className="flex flex-1 items-center justify-end gap-6">
                
//                 {/* Notification and theme toggle */}
//                 <div className="flex items-center gap-4">
//                     <button
//                         onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//                         className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700"
//                         aria-label="Toggle theme"
//                     >
//                         {theme === 'dark' ? (
//                             <Sun size={20} className="text-yellow-300" />
//                         ) : (
//                             <Moon size={20} className="text-slate-700" />
//                         )}
//                     </button>
                    
//                     <button
//                         onClick={handleLogout}
//                         className="sm:inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
//                     >
//                         Logout
//                     </button>
//                 </div>
//             </div>
//         </header>

// // Change the header container to:

//     );
// };

// Header.propTypes = {
//     onToggleSidebar: PropTypes.func.isRequired,
// };


import { useTheme } from "../../../hooks/use-theme";
import React, { useEffect, useState } from 'react';
import { Bell, ChevronsLeft, Moon, Search, Sun, Menu } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import { useSearch } from "../../../contexts/SearchContext";
import axios from 'axios';
import { API_BASE_URL } from "../../../config/api";

export const Header = ({ onToggleSidebar }) => {
    const { theme, setTheme } = useTheme();
    const { updateSearchTerm } = useSearch();
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
    const [userType, setUserType] = useState(localStorage.getItem("userType"));
    const [companyName, setCompanyName] = useState("");
    const [companyImage, setCompanyImage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setLocalSearchTerm(value);
        updateSearchTerm(value); 
    };

    // Function to fetch company registration data
    const fetchCompanyData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            // if (!token) {
            //     console.log('No token found');
            //     return;
            // }
            //console.log('Making API call...');
            const response = await axios.get(`${API_BASE_URL}/api/registerComp/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('API Response:', response.data);

            if (response.data && response.data.data) {
                const { companyName: apiCompanyName, profileImage: apiCompanyImage } = response.data.data;
                
                console.log('Extracted data:', { apiCompanyName, apiCompanyImage });
                
                setCompanyName(apiCompanyName || "");
                setCompanyImage(apiCompanyImage || "https://tse4.mm.bing.net/th/id/OIP.C4yEUq2tPmLDROuTo9XkcQHaHa?rs=1&pid=ImgDetMain");
                
                localStorage.setItem("companyName", apiCompanyName || "");
                localStorage.setItem("companyImage", apiCompanyImage || "https://tse4.mm.bing.net/th/id/OIP.C4yEUq2tPmLDROuTo9XkcQHaHa?rs=1&pid=ImgDetMain");
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
            
            setCompanyName(localStorage.getItem("companyName") || "");
            setCompanyImage(localStorage.getItem("companyImage") || "https://tse4.mm.bing.net/th/id/OIP.C4yEUq2tPmLDROuTo9XkcQHaHa?rs=1&pid=ImgDetMain");
            
            if (error.response?.status === 401) {
                console.log('Unauthorized - token may be expired');
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(localStorage.getItem("loggedIn") === "true");
            setUserType(localStorage.getItem("userType"));
            
            // Get initial company information from localStorage
            setCompanyName(localStorage.getItem("companyName") || "");
            setCompanyImage(localStorage.getItem("companyImage") || "https://tse4.mm.bing.net/th/id/OIP.C4yEUq2tPmLDROuTo9XkcQHaHa?rs=1&pid=ImgDetMain");
        };

        // Initialize state
        handleStorageChange();
        
        // Fetch fresh company data from API if user is logged in
        if (localStorage.getItem("loggedIn") === "true") {
            fetchCompanyData();
        }

        window.addEventListener("storage", handleStorageChange);

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
        localStorage.removeItem("expandedSections");
        setIsLoggedIn(false);
        setUserType(null);
        navigate('/login', { replace: true });
        window.location.reload();
    };

    return (   
             <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-white px-6 shadow-lg border-b border-gray-200 dark:border-slate-700 transition-colors dark:bg-slate-900">

            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="md:hidden rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                
                {/* Company Logo and Welcome Message */}
                <div className="flex items-center gap-3">
                    {companyImage && (
                        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800">
                            <img
                                src={companyImage}
                                alt={`${companyName} logo`}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                    
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                Dashboard
                            </h1>
                            {loading && (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
                            )}
                        </div>
                        {/* Updated welcome message with conditional rendering */}
                        <p className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                            {loading ? "Loading..." : companyName ? `Welcome, ${companyName}` : "Welcome"}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-1 items-center justify-end gap-6">

                
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

Header.propTypes = {
    onToggleSidebar: PropTypes.func.isRequired,
};
