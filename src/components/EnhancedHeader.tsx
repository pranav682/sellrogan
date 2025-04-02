import React, { useState } from 'react';
import Link from 'next/link';
import { Search, BarChart2, DollarSign, ShoppingCart, User, Menu, X, Home, Key, LogOut } from 'lucide-react';

interface EnhancedHeaderProps {
  className?: string;
  isLoggedIn?: boolean;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({ 
  className = '',
  isLoggedIn = true,
  userName = 'John Doe',
  userEmail = 'john.doe@example.com',
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsUserMenuOpen(false);
  };

  return (
    <header className={`bg-white shadow-sm ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary-600 font-bold text-xl">SellRogan</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              <Home className="mr-1 h-5 w-5" />
              Home
            </Link>
            <Link href="/search" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              <Search className="mr-1 h-5 w-5" />
              Search
            </Link>
            <Link href="/compare" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              <BarChart2 className="mr-1 h-5 w-5" />
              Compare
            </Link>
            <Link href="/analyze" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              <DollarSign className="mr-1 h-5 w-5" />
              Analyze
            </Link>
            <Link href="/listing" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              <ShoppingCart className="mr-1 h-5 w-5" />
              List
            </Link>
          </nav>

          {/* User dropdown */}
          {isLoggedIn ? (
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={toggleUserMenu}
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                </button>
              </div>

              {isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-medium">{userName}</p>
                    <p className="text-gray-500">{userEmail}</p>
                  </div>
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      Dashboard
                    </div>
                  </Link>
                  <Link href="/credentials" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center">
                      <Key className="mr-2 h-4 w-4" />
                      Platform Credentials
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <Link href="/auth" className="text-gray-500 hover:text-gray-700 mr-4">
                Sign in
              </Link>
              <Link href="/auth?signup=true" className="btn btn-primary">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
              <div className="flex items-center">
                <Home className="mr-2 h-5 w-5" />
                Home
              </div>
            </Link>
            <Link href="/search" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
              <div className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Search
              </div>
            </Link>
            <Link href="/compare" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
              <div className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" />
                Compare
              </div>
            </Link>
            <Link href="/analyze" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
              <div className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Analyze
              </div>
            </Link>
            <Link href="/listing" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
              <div className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                List
              </div>
            </Link>
            {isLoggedIn && (
              <>
                <Link href="/dashboard" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
                  <div className="flex items-center">
                    <BarChart2 className="mr-2 h-5 w-5" />
                    Dashboard
                  </div>
                </Link>
                <Link href="/credentials" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
                  <div className="flex items-center">
                    <Key className="mr-2 h-5 w-5" />
                    Credentials
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-2 h-5 w-5" />
                    Sign out
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default EnhancedHeader;
