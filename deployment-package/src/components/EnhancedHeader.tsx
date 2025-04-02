import React, { useState } from 'react';
import { Bell, Mail, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import SmartSearch from './SmartSearch';
import AIAssistant from './AIAssistant';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New price alert',
    message: 'Wireless earbuds price dropped by 15% on Amazon',
    time: '10 minutes ago',
    read: false,
    type: 'info'
  },
  {
    id: '2',
    title: 'Listing created successfully',
    message: 'Your product "Bluetooth Speaker" has been listed on eBay',
    time: '1 hour ago',
    read: false,
    type: 'success'
  },
  {
    id: '3',
    title: 'Inventory alert',
    message: 'Phone charger stock is running low (5 units left)',
    time: '3 hours ago',
    read: true,
    type: 'warning'
  },
  {
    id: '4',
    title: 'Weekly report available',
    message: 'Your performance report for last week is ready to view',
    time: '1 day ago',
    read: true,
    type: 'info'
  }
];

const EnhancedHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [darkMode, setDarkMode] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real implementation, we would add/remove a class to the document body
    // and use CSS variables to change the theme
    if (!darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="w-2 h-2 rounded-full bg-accent-success"></div>;
      case 'warning':
        return <div className="w-2 h-2 rounded-full bg-accent-warning"></div>;
      case 'error':
        return <div className="w-2 h-2 rounded-full bg-accent-danger"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-accent-info"></div>;
    }
  };
  
  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-primary-600 font-bold text-xl">SourceAndSell</span>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-4">
              <a href="/" className="px-3 py-2 rounded-md text-sm font-medium text-neutral-900 hover:bg-neutral-100">
                Dashboard
              </a>
              <a href="/search" className="px-3 py-2 rounded-md text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100">
                Search
              </a>
              <a href="/compare" className="px-3 py-2 rounded-md text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100">
                Compare
              </a>
              <a href="/analyze" className="px-3 py-2 rounded-md text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100">
                Analyze
              </a>
              <a href="/listing" className="px-3 py-2 rounded-md text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100">
                Listings
              </a>
            </nav>
          </div>
          
          {/* Search bar */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <SmartSearch 
              onSearch={(query) => console.log('Searching for:', query)} 
              placeholder="Search for products to source..."
            />
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center">
            {/* Dark mode toggle */}
            <button 
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {/* Notifications */}
            <div className="ml-3 relative">
              <button
                className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-accent-danger text-white text-xs font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="notifications-menu">
                    <div className="px-4 py-2 border-b border-neutral-200 flex justify-between items-center">
                      <h3 className="text-sm font-medium">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          className="text-xs text-primary-600 hover:text-primary-800"
                          onClick={markAllAsRead}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-neutral-50 border-b border-neutral-100 ${!notification.read ? 'bg-primary-50' : ''}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-neutral-900">{notification.title}</p>
                                <p className="text-sm text-neutral-600">{notification.message}</p>
                                <p className="text-xs text-neutral-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-neutral-500 text-center">
                          No notifications
                        </div>
                      )}
                    </div>
                    
                    <div className="px-4 py-2 border-t border-neutral-200">
                      <a href="/notifications" className="text-xs text-primary-600 hover:text-primary-800 block text-center">
                        View all notifications
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* User menu */}
            <div className="ml-3 relative">
              <div>
                <button
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-neutral-700 hidden md:block">John Doe</span>
                  <ChevronDown className="ml-1 h-4 w-4 text-neutral-400 hidden md:block" />
                </button>
              </div>
              
              {/* User dropdown */}
              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      role="menuitem"
                    >
                      <User className="mr-3 h-4 w-4 text-neutral-400" />
                      Your Profile
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      role="menuitem"
                    >
                      <Settings className="mr-3 h-4 w-4 text-neutral-400" />
                      Settings
                    </a>
                    <a
                      href="/notifications-settings"
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      role="menuitem"
                    >
                      <Bell className="mr-3 h-4 w-4 text-neutral-400" />
                      Notification Settings
                    </a>
                    <div className="border-t border-neutral-100"></div>
                    <a
                      href="/logout"
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      role="menuitem"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-neutral-400" />
                      Sign out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile search - visible only on mobile */}
      <div className="md:hidden px-4 pb-3">
        <SmartSearch 
          onSearch={(query) => console.log('Searching for:', query)} 
          placeholder="Search for products..."
        />
      </div>
      
      {/* AI Assistant */}
      <AIAssistant />
    </header>
  );
};

export default EnhancedHeader;
