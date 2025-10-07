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
  const [expandedSections, setExpandedSections] = useState(
    navbarLinks.reduce((acc, section) => {
      acc[section.title] = true;
      return acc;
    }, {})
  );

  // Track mobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-expand all sections when sidebar is expanded
  useEffect(() => {
    if (!collapsed) {
      setExpandedSections(
        navbarLinks.reduce((acc, section) => {
          acc[section.title] = true;
          return acc;
        }, {})
      );
    }
  }, [collapsed]);

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
          "fixed z-50 flex w-64 flex-col border-r bg-white shadow-lg transition-all duration-300 ease-in-out dark:border-slate-700 dark:bg-slate-900",
          isMobile ? "h-screen top-0" : "h-[calc(100vh-4rem)] top-16",
          theme === "dark" ? "border-slate-900" : "border-slate-200",
          collapsed && "md:w-20",
          isOpen ? "left-0" : "-left-full",
          "md:left-0" 
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Mobile Header with Close Button */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Menu
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        )}

        {/* Desktop Collapse/Expand Button */}
        {!isMobile && (
          <div className="flex items-center p-1 border-b border-gray-200 dark:border-slate-700">
            {!collapsed && (
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex-grow px-3">
                Menu
              </h2>
            )}
            <button
              onClick={toggleCollapse}
              className={cn(
                "rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700",
                collapsed ? "mx-auto" : ""
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronsRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <ChevronsLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex flex-1 flex-col gap-y-2 overflow-y-auto overflow-x-hidden px-3 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-slate-600 dark:scrollbar-track-slate-800">
          {navbarLinks.map((navbarLink) => (
            <nav
              key={navbarLink.title}
              className={cn("sidebar-group", collapsed && "md:items-center")}
            >
              {/* Group Title with Toggle - Always show on mobile, conditional on desktop */}
              {(isMobile || !collapsed) && (
                <div
                  className="flex items-center justify-between mb-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
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
                  <p className="text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {navbarLink.title}
                  </p>
                  <div className="transition-transform">
                    {expandedSections[navbarLink.title] ? (
                      <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                </div>
              )}

              {/* Links - Show when expanded or on mobile */}
              {(isMobile || collapsed || expandedSections[navbarLink.title]) && (
                <div className="space-y-1" id={`section-${navbarLink.title}`}>
                  {navbarLink.links.map((link) => (
                    <NavLink
                      key={link.label}
                      to={link.path}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center rounded-lg px-3 py-3 transition-all duration-200 relative",
                          "hover:bg-orange-500 hover:text-white dark:hover:bg-orange-600",
                          "focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
                          isActive
                            ? "bg-orange-100 font-medium text-orange-600 dark:bg-slate-800 dark:text-orange-400"
                            : "text-gray-700 dark:text-gray-300",
                          collapsed && !isMobile && "justify-center px-2"
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
                        size={20}
                        className={cn(
                          "flex-shrink-0 transition-colors",
                          collapsed ? "group-hover:text-white" : ""
                        )}
                      />
                      {(isMobile || !collapsed) && (
                        <span className="ml-3 whitespace-nowrap transition-opacity duration-200">
                          {link.label}
                        </span>
                      )}

                      {collapsed && !isMobile && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                          {link.label}
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
          "transition-all duration-300 min-h-screen pt-16 bg-slate-100 dark:bg-slate-900",
          collapsed ? "md:ml-20" : "md:ml-64",
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