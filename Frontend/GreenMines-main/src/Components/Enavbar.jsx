import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from "./logo.png";
import { FaUserCircle } from "react-icons/fa";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Carbon Footprint", href: "/emission" },
  { name: "Neutrality", href: "/neutralityoptions" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Enavbar({ className }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [navs, setNavs] = useState(navigation);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const updatedNavs = navigation.map(nav => ({
      ...nav,
      current: location.pathname === nav.href
    }));
    setNavs(updatedNavs);
  }, [location.pathname]);

  const handleSignOut = () => {
    // Implement your sign out logic here
    console.log("Signing out...");
  };

  return (
    <nav className={`bg-[#2B263F] fixed top-0 left-0 w-full z-50`}>
      <div className="w-full px-4">
        <div className="relative flex items-center justify-between h-24 max-w-screen-2xl mx-auto">
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-[#66C5CC] hover:text-white hover:bg-[#342F49] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-auto max-w-full cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex flex-grow justify-center">
            <div className="flex space-x-8">
              {navs.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? "text-transparent bg-clip-text bg-gradient-to-br from-[#6664F1] to-[#C94AF0] text-xl"
                      : "text-[#66C5CC]",
                    "px-6 py-3 rounded-md text-lg font-medium hover:text-white hover:scale-105 ease-in duration-200"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Us Button and Profile Icon */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/contactus")}
              className="hidden sm:block relative text-white border rounded px-8 py-3 text-lg hover:text-white c-btn tracking-wider overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-[#6664F1] to-[#C94AF0]"></span>
              <span className="relative z-10 flex justify-center items-center">
                Contact Us
              </span>
            </button>
            
            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-[#66C5CC] hover:text-white transition-colors duration-200"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <FaUserCircle className="text-4xl" />
                <ChevronDown className="ml-2 text-lg transition-transform duration-200" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-[#342F49] rounded-lg shadow-xl py-2 z-10">
                  <Link
                    to="/profile"
                    className="block px-6 py-3 text-base text-[#66C5CC] hover:bg-gradient-to-br hover:from-[#6664F1] hover:to-[#C94AF0] hover:text-white transition-colors duration-200"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/predictions"
                    className="block px-6 py-3 text-base text-[#66C5CC] hover:bg-gradient-to-br hover:from-[#6664F1] hover:to-[#C94AF0] hover:text-white transition-colors duration-200"
                  >
                    Predictions
                  </Link>
                  <Link
                    to="/routing"
                    className="block px-6 py-3 text-base text-[#66C5CC] hover:bg-gradient-to-br hover:from-[#6664F1] hover:to-[#C94AF0] hover:text-white transition-colors duration-200"
                  >
                    Route
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-6 py-3 text-base text-[#66C5CC] hover:bg-gradient-to-br hover:from-[#6664F1] hover:to-[#C94AF0] hover:text-white transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navs.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  item.current
                    ? "bg-[#342F49] text-[#66C5CC]"
                    : "text-[#66C5CC] hover:bg-[#342F49] hover:text-white",
                  "block px-6 py-3 rounded-md text-lg font-semibold"
                )}
                aria-current={item.current ? "page" : undefined}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Profile Link in Mobile Menu */}
            <div 
              className="block px-6 py-3 rounded-md text-lg font-semibold text-[#66C5CC] hover:bg-[#342F49] hover:text-white cursor-pointer"
              onClick={() => {
                navigate("/profile");
                setIsOpen(false);
              }}
            >
              Profile
            </div>
            <div 
              className="block px-6 py-3 rounded-md text-lg font-semibold text-[#66C5CC] hover:bg-[#342F49] hover:text-white cursor-pointer"
              onClick={() => {
                navigate("/predictions");
                setIsOpen(false);
              }}
            >
              Predictions
            </div>
            <div 
              className="block px-6 py-3 rounded-md text-lg font-semibold text-[#66C5CC] hover:bg-[#342F49] hover:text-white cursor-pointer"
              onClick={() => {
                navigate("/routing");
                setIsOpen(false);
              }}
            >
              Route
            </div>
            <div 
              className="block px-6 py-3 rounded-md text-lg font-semibold text-[#66C5CC] hover:bg-[#342F49] hover:text-white cursor-pointer"
              onClick={() => {
                handleSignOut();
                setIsOpen(false);
              }}
            >
              Logout
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Enavbar;

