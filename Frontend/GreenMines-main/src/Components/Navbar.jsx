import React, { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { HashLink } from "react-router-hash-link";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaChevronDown } from "react-icons/fa";
import logo from "./logo.png";

const navigation = [
  { name: "Home", href: "/" },
  { name: "DashBoard", href: "/dashboard" },
  { name: "Carbon Footprint", href: "/emission" },
  { name: "Neutrality", href: "/neutralityoptions" }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ className }) {
  const location = useLocation();
  const navigate = useNavigate();
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
    <Disclosure as="nav" className={`bg-transparent ${className}`}>
  {({ open }) => (
    <>
      <div className="w-full px-4">
        <div className="relative flex items-center justify-between h-20 max-w-screen-2xl mx-auto sm:mt-4 mt-8">
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {open ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </Disclosure.Button>
          </div>

          {/* Title */}
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex flex-grow justify-center">
            <div className="flex space-x-24">
              {navs.map((item) => (
                <HashLink
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? "text-transparent bg-clip-text bg-gradient-to-br from-[#6664F1] to-[#C94AF0] text-xl"
                      : "text-gray-300",
                    "px-4 py-2 rounded-md text-lg font-medium hover:text-white hover:scale-110 ease-in duration-200"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </HashLink>
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

            {/* Desktop Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <FaUserCircle className="text-5xl" />
                <FaChevronDown className="ml-2 text-lg transition-transform duration-200" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-[#342F49] rounded-lg shadow-xl py-2 z-10">
                  <a
                    href="/profile"
                    className="block px-6 py-3 text-base text-[#66C5CC] hover:bg-gradient-to-br hover:from-[#6664F1] hover:to-[#C94AF0] hover:text-white transition-colors duration-200"
                  >
                    Profile
                  </a>
                  <a
                    href="/predictions"
                    className="block px-6 py-3 text-base text-[#66C5CC] hover:bg-gradient-to-br hover:from-[#6664F1] hover:to-[#C94AF0] hover:text-white transition-colors duration-200"
                  >
                    Predictions
                  </a>
                  <a
                    href="/routing"
                    className="block px-6 py-3 text-base text-[#66C5CC] hover:bg-gradient-to-br hover:from-[#6664F1] hover:to-[#C94AF0] hover:text-white transition-colors duration-200"
                  >
                    Route
                  </a>
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
      <Disclosure.Panel className="sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navs.map((item) => (
            <Disclosure.Button
              key={item.name}
              as="a"
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-[#342F49] text-[#66C5CC]"
                  : "text-[#66C5CC] hover:bg-[#342F49] hover:text-white",
                "block px-6 py-3 rounded-md text-lg font-semibold"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              {item.name}
            </Disclosure.Button>
          ))}
          {/* Additional Options in Mobile Menu */}
          <Disclosure.Button
            as="a"
            href="/profile"
            className="block px-6 py-3 text-[#66C5CC] hover:bg-[#342F49] hover:text-white rounded-md text-lg font-semibold"
          >
            Profile
          </Disclosure.Button>
          <Disclosure.Button
            as="a"
            href="/predictions"
            className="block px-6 py-3 text-[#66C5CC] hover:bg-[#342F49] hover:text-white rounded-md text-lg font-semibold"
          >
            Predictions
          </Disclosure.Button>
          <Disclosure.Button
            as="a"
            href="/routing"
            className="block px-6 py-3 text-[#66C5CC] hover:bg-[#342F49] hover:text-white rounded-md text-lg font-semibold"
          >
            Route
          </Disclosure.Button>
          <Disclosure.Button
            as="button"
            onClick={handleSignOut}
            className="block w-full text-left px-6 py-3 text-[#66C5CC] hover:bg-[#342F49] hover:text-white rounded-md text-lg font-semibold"
          >
            Logout
          </Disclosure.Button>
        </div>
      </Disclosure.Panel>
    </>
  )}
</Disclosure>

  );
}

