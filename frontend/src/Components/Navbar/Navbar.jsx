// src/Components/Navbar/Navbar.jsx
import React, { useEffect, useState } from "react";
import { 
  UserCircle, 
  Clock, 
  Menu, 
  X, 
  Home,
  Star,
  Users,
  Github,
  Mail,
  ChevronDown,
  Settings,
  LogOut,
  User
} from "lucide-react";
import { FloatingNav } from "../ui/floating-navbar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DarkModeToggle from "../ui/DarkModeToggle";
import { useTimer } from "../../context/TimerContext";

const publicNavItems = [
  { name: "Home", link: "/", icon: Home },
  { name: "Features", link: "#features", icon: Star },
  { name: "About", link: "#about", icon: Users },
  { name: "GitHub", link: "https://github.com/DevSyncx/DevSync.git", icon: Github, external: true },
  { name: "Contact", link: "#contact", icon: Mail },
];

const Navbar = () => {
  const [showFloating, setShowFloating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [displayTime, setDisplayTime] = useState("25:00");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { timeLeft, isRunning } = useTimer();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setShowFloating(scrollTop > 100);
      setScrolled(scrollTop > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
      const seconds = String(timeLeft % 60).padStart(2, "0");
      setDisplayTime(`${minutes}:${seconds}`);
    }, 500);
    return () => clearInterval(interval);
  }, [timeLeft, isRunning]);

  useEffect(() => {
    const handleStorageChange = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserMenuOpen(false);
    navigate("/login");
  };

  const isActiveLink = (link) => {
    if (link === "/") return location.pathname === "/";
    return location.pathname.startsWith(link);
  };

  return (
    <>
      {!showFloating && (
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled 
              ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50' 
              : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-800/30'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              {/* Logo */}
              <Link 
                to="/" 
                className="flex items-center space-x-2 group"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <span className="text-white font-bold text-sm">DS</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  DevSync
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {!isAuthenticated && publicNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = !item.external && isActiveLink(item.link);
                  
                  return (
                    <a
                      key={item.name}
                      href={item.link}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      {item.external && (
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      )}
                    </a>
                  );
                })}

                {/* Timer Display */}
                {isAuthenticated && isRunning && (
                  <button
                    onClick={() => navigate("/pomodoro")}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                  >
                    <Clock className="w-4 h-4" />
                    <span className="font-mono text-sm">{displayTime}</span>
                  </button>
                )}
              </nav>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-3">
                <DarkModeToggle />
                
                {!isAuthenticated ? (
                  <div className="hidden md:flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center space-x-3">
                    {/* User Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* User Dropdown */}
                      {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                          <Link
                            to="/profile"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                          <hr className="my-1 border-gray-200 dark:border-gray-600" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  {menuOpen ? (
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
              <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
                {!isAuthenticated ? (
                  <>
                    {publicNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = !item.external && isActiveLink(item.link);
                      
                      return (
                        <a
                          key={item.name}
                          href={item.link}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            isActive
                              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </a>
                      );
                    })}
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg"
                    >
                      <User className="w-4 h-4" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mx-4"
                    >
                      <span>Get Started</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    
                    {isRunning && (
                      <button
                        onClick={() => navigate("/pomodoro")}
                        className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg w-full text-left"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Timer: {displayTime}</span>
                      </button>
                    )}
                    
                    <Link
                      to="/settings"
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    
                    <hr className="border-gray-200 dark:border-gray-700" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </header>
      )}

      {showFloating && <FloatingNav navItems={!isAuthenticated ? publicNavItems : []} />}
    </>
  );
};

export default Navbar;
