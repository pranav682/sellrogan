'use client';

import React, { useState, useEffect } from 'react';

interface UserDataServiceProviderProps {
  children: React.ReactNode;
}

// Define user data interface
interface UserData {
  searchHistory: Array<{
    query: string;
    timestamp: string;
  }>;
  viewedProducts: Array<any>;
  preferences: Record<string, any>;
  recommendations: Array<any>;
  [key: string]: any;
}

// Define the context type
interface UserDataContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  trackEvent: (eventName: string, eventData: any) => void;
  privacySettings: {
    allowCookies: boolean;
    allowAnalytics: boolean;
    allowPersonalization: boolean;
  };
  updatePrivacySettings: (settings: Partial<{
    allowCookies: boolean;
    allowAnalytics: boolean;
    allowPersonalization: boolean;
  }>) => void;
}

// Create the context with default values
export const UserDataContext = React.createContext<UserDataContextType>({
  userData: {
    searchHistory: [],
    viewedProducts: [],
    preferences: {},
    recommendations: []
  },
  updateUserData: () => {},
  trackEvent: () => {},
  privacySettings: {
    allowCookies: true,
    allowAnalytics: true,
    allowPersonalization: true
  },
  updatePrivacySettings: () => {}
});

export const UserDataServiceProvider: React.FC<UserDataServiceProviderProps> = ({ children }) => {
  // User data state
  const [userData, setUserData] = useState<UserData>({
    searchHistory: [],
    viewedProducts: [],
    preferences: {},
    recommendations: []
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    allowCookies: true,
    allowAnalytics: true,
    allowPersonalization: true
  });
  
  // Update user data
  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prevData: UserData) => ({
      ...prevData,
      ...data
    }));
    
    // Save to localStorage if cookies are allowed
    if (privacySettings.allowCookies) {
      localStorage.setItem('sellrogan_user_data', JSON.stringify({
        ...userData,
        ...data
      }));
    }
  };
  
  // Track user event
  const trackEvent = (eventName: string, eventData: any) => {
    // Only track if analytics are allowed
    if (privacySettings.allowAnalytics) {
      // In a real app, this would send data to an analytics service
      console.log(`[Event Tracked] ${eventName}:`, eventData);
      
      // Update search history for search events
      if (eventName === 'product_search') {
        const searchHistory = [...userData.searchHistory];
        searchHistory.unshift({
          query: eventData.query,
          timestamp: new Date().toISOString()
        });
        
        // Limit to last 20 searches
        if (searchHistory.length > 20) {
          searchHistory.pop();
        }
        
        updateUserData({ searchHistory });
      }
      
      // Update viewed products
      if (eventName === 'product_view') {
        const viewedProducts = [...userData.viewedProducts];
        
        // Check if product is already in history
        const existingIndex = viewedProducts.findIndex(p => p.id === eventData.product.id);
        
        if (existingIndex !== -1) {
          // Move to top if already viewed
          viewedProducts.splice(existingIndex, 1);
        }
        
        viewedProducts.unshift({
          ...eventData.product,
          timestamp: new Date().toISOString()
        });
        
        // Limit to last 50 products
        if (viewedProducts.length > 50) {
          viewedProducts.pop();
        }
        
        updateUserData({ viewedProducts });
      }
    }
  };
  
  // Update privacy settings
  const updatePrivacySettings = (settings: Partial<{
    allowCookies: boolean;
    allowAnalytics: boolean;
    allowPersonalization: boolean;
  }>) => {
    setPrivacySettings((prevSettings) => ({
      ...prevSettings,
      ...settings
    }));
    
    // Save privacy settings to localStorage
    localStorage.setItem('sellrogan_privacy_settings', JSON.stringify({
      ...privacySettings,
      ...settings
    }));
    
    // If cookies are disabled, clear localStorage
    if (settings.allowCookies === false && privacySettings.allowCookies === false) {
      localStorage.removeItem('sellrogan_user_data');
    }
  };
  
  // Load data from localStorage on mount
  useEffect(() => {
    // Load privacy settings
    const savedPrivacySettings = localStorage.getItem('sellrogan_privacy_settings');
    if (savedPrivacySettings) {
      try {
        setPrivacySettings(JSON.parse(savedPrivacySettings));
      } catch (e) {
        console.error('Error parsing privacy settings:', e);
      }
    }
    
    // Load user data if cookies are allowed
    if (privacySettings.allowCookies) {
      const savedUserData = localStorage.getItem('sellrogan_user_data');
      if (savedUserData) {
        try {
          setUserData(JSON.parse(savedUserData));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }, []);
  
  return (
    <UserDataContext.Provider value={{ 
      userData, 
      updateUserData, 
      trackEvent,
      privacySettings,
      updatePrivacySettings
    }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataServiceProvider;
