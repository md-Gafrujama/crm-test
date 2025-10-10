import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { navbarLinks } from "../constants";
import { cn } from "../../../utils/cn";
import PropTypes from "prop-types";
import { useTheme } from "../../../hooks/use-theme";

export const Sidebar = ({ isOpen, onClose, children, onCollapsedChange }) => {
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

 const [expandedSections, setExpandedSections] = useState(() => {

  const saved = localStorage.getItem("expandedSections");
  if (saved) {
    return JSON.parse(saved);
  }

 
  return navbarLinks.reduce((acc, section) => {
    acc[section.title] = false;
    return acc;
  }, {});
});

useEffect(() => {
  localStorage.setItem("expandedSections", JSON.stringify(expandedSections));
}, [expandedSections]);



  // Track mobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  // Close mobile sidebar when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && isOpen) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  //close mobile sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const toggleSection = (title) => {
    if (!collapsed) {
      setExpandedSections((prev) => ({
        ...prev,
        [title]: !prev[title],
      }));
    }
  };

  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsed);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300 ease-in-out md:hidden bg-black bg-opacity-50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-50 flex w-72 flex-col bg-white shadow-xl transition-all duration-300 ease-in-out dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800",
          isMobile ? "h-screen top-0" : "h-[calc(100vh-4rem)] top-16",
          collapsed && "md:w-20",
          isOpen ? "left-0" : "-left-full",
          "md:left-0" 
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Mobile Header with Close Button */}
        {isMobile && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 dark:border-slate-800 bg-gradient-to-r from-orange-50 to-red-50 dark:from-slate-800 dark:to-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Navigation
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 transition-all duration-200 hover:bg-white hover:shadow-md dark:hover:bg-slate-600"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-300" />
            </button>
          </div>
        )}

        {/* Desktop Collapse/Expand Button */}
        {!isMobile && (
          <div className="flex items-center px-6 py-4 border-b border-gray-50 dark:border-slate-800 bg-gradient-to-r from-gray-50 to-orange-50 dark:from-slate-800 dark:to-slate-700">
            {!collapsed && (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex-grow">
                Menu
              </h2>
            )}
            <button
              onClick={toggleCollapse}
              className={cn(
                "rounded-full p-2.5 transition-all duration-200 hover:bg-white hover:shadow-lg dark:hover:bg-slate-600 bg-white/50 dark:bg-slate-600/50",
                collapsed ? "mx-auto" : ""
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronsRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <ChevronsLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent dark:scrollbar-thumb-slate-600 hover:scrollbar-thumb-gray-300 dark:hover:scrollbar-thumb-slate-500">
          {navbarLinks.map((navbarLink) => (
            <nav
              key={navbarLink.title}
              className={cn("sidebar-group", collapsed && "md:items-center")}
            >
              {/* Group Title with Toggle - Always show on mobile, conditional on desktop */}
              {(isMobile || !collapsed) && (
                <div
                  className="flex items-center justify-between mb-3 cursor-pointer px-3 py-2 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-200 group"
                  onClick={() => toggleSection(navbarLink.title)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleSection(navbarLink.title);
                    }
                  }}
                  aria-expanded={expandedSections[navbarLink.title]}
                  aria-controls={`section-${navbarLink.title}`}
                >
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors">
                    {navbarLink.title}
                  </h3>
                  <div className="transition-all duration-200 group-hover:scale-110">
                    {expandedSections[navbarLink.title] ? (
                      <ChevronUp className="h-4 w-4 text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400" />
                    )}
                  </div>
                </div>
              )}

              {/* Links - Show when expanded or on mobile */}
              {(isMobile || collapsed || expandedSections[navbarLink.title]) && (
                <div className="space-y-2 ml-2" id={`section-${navbarLink.title}`}>
                  {navbarLink.links.map((link) => (
                    <NavLink
                      key={link.label}
                      to={link.path}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center rounded-xl px-4 py-3 transition-all duration-200 relative border border-transparent",
                          "hover:bg-orange-500 hover:text-white hover:shadow-lg hover:scale-[1.02]",
                          "focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
                          isActive
                            ? "bg-orange-100 font-medium text-orange-600 dark:bg-slate-800 dark:text-orange-400 shadow-lg"
                            : "text-gray-600 dark:text-gray-300 hover:text-white",
                          collapsed && !isMobile && "justify-center px-3"
                        )
                      }
                      onClick={() => {
                        if (isMobile) {
                          onClose();
                        }
                      }}
                      title={collapsed && !isMobile ? link.label : ""}
                      aria-label={link.label}
                    >
                      <link.icon
                        size={18}
                        className="flex-shrink-0 transition-all duration-200"
                      />
                      {(isMobile || !collapsed) && (
                        <span className="ml-3 whitespace-nowrap transition-all duration-200 font-medium">
                          {link.label}
                        </span>
                      )}

                      {collapsed && !isMobile && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 shadow-lg">
                          {link.label}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </nav>
          ))}
        </div>
      </aside>

   

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300 min-h-screen pt-16 bg-gray-50 dark:bg-slate-900",
          collapsed ? "md:ml-20" : "md:ml-72",
          "ml-0"
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  onCollapsedChange: PropTypes.func,
};



// Custom Hook for Sidebar State Management
export const useSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
  };
};