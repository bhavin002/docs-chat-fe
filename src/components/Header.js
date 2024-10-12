import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAuth } from '../context/auth';

const Header = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [auth, setAuth] = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuth({
      user: null,
      token: "",
    });
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="px-5">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <Icon icon="hugeicons:pdf-01" className='w-6 h-6 mr-1' />
              PDF Chat
          </div>
          <div className="flex">
            {auth?.user ? (
              <>
                <button
                  onClick={() => navigate("/documents")}
                  className="ml-4 flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <Icon icon="oui:documents" className="h-5 w-5 mr-2" />
                  Documents
                </button>
                <div className="ml-3 relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <Icon icon="streamline:user-profile-focus" className="h-5 w-5 mr-2" />
                    <span>User</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="flex items-center text-center pl-2 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <Icon icon="streamline:user-profile-focus" className="h-5 w-5 mr-2" />
              </button>

            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;