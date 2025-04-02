'use client';

import React, { useState, useEffect } from 'react';
import { Database, User, Settings } from 'lucide-react';

interface UserDataServiceProps {
  children: React.ReactNode;
}

// Context for user data
export const UserDataContext = React.createContext<{
  userData: any;
  updateUserData: (data: any) => void;
  trackEvent: (eventName: string, eventData: any) => void;
  getRecommendations: () => any[];
  privacySettings: any;
  updatePrivacySettings: (settings: any) => void;
}>({
  userData: {},
  updateUserData: () => {},
  trackEvent: () => {},
  getRecommendations: () => [],
  privacySettings: {},
  updatePrivacySettings: () => {},
});

// User data service provider component
const UserDataService: React.FC<UserDataServiceProps> = ({ children }) => {
  // User data state
  const [userData, setUserData] = useState<any>({
    searchHistory: [],
    viewedProducts: [],
    preferences: {
      preferredMarketplaces: [],
      preferredCategories: [],
      priceRanges: {},
    },
    interactions: [],
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    allowSearchTracking: true,
    allowProductViewTracking: true,
    allowPersonalization: true,
    allowCookies: true,
    dataRetentionPeriod: 90, // days
  });
  
  // Load user data from local storage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Load privacy settings first
        const storedPrivacySettings = localStorage.getItem('sellrogan_privacy_settings');
        if (storedPrivacySettings) {
          setPrivacySettings(JSON.parse(storedPrivacySettings));
        }
        
        // Only load user data if allowed by privacy settings
        if (privacySettings.allowCookies) {
          const storedUserData = localStorage.getItem('sellrogan_user_data');
          if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);
  
  // Save user data to local storage when it changes
  useEffect(() => {
    const saveUserData = () => {
      try {
        if (privacySettings.allowCookies) {
          localStorage.setItem('sellrogan_user_data', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    };
    
    saveUserData();
  }, [userData, privacySettings.allowCookies]);
  
  // Save privacy settings when they change
  useEffect(() => {
    try {
      localStorage.setItem('sellrogan_privacy_settings', JSON.stringify(privacySettings));
    } catch (error) {
      console.error('Error saving privacy settings:', error);
    }
  }, [privacySettings]);
  
  // Update user data
  const updateUserData = (data: any) => {
    setUserData(prevData => ({
      ...prevData,
      ...data,
    }));
  };
  
  // Track user events
  const trackEvent = (eventName: string, eventData: any) => {
    // Check privacy settings before tracking
    if (!shouldTrackEvent(eventName)) {
      return;
    }
    
    // Add timestamp to event
    const event = {
      name: eventName,
      data: eventData,
      timestamp: new Date().toISOString(),
    };
    
    // Update interactions array
    setUserData(prevData => ({
      ...prevData,
      interactions: [...prevData.interactions, event],
    }));
    
    // Handle specific event types
    switch (eventName) {
      case 'search':
        if (privacySettings.allowSearchTracking) {
          trackSearch(eventData.query);
        }
        break;
      case 'product_view':
        if (privacySettings.allowProductViewTracking) {
          trackProductView(eventData.product);
        }
        break;
      case 'marketplace_click':
        trackMarketplaceClick(eventData.marketplace);
        break;
      // Add more event types as needed
    }
    
    // In a real implementation, you might also send events to an analytics service
    // analyticsService.trackEvent(event);
  };
  
  // Check if event should be tracked based on privacy settings
  const shouldTrackEvent = (eventName: string): boolean => {
    if (!privacySettings.allowCookies) return false;
    
    switch (eventName) {
      case 'search':
        return privacySettings.allowSearchTracking;
      case 'product_view':
        return privacySettings.allowProductViewTracking;
      case 'personalization':
        return privacySettings.allowPersonalization;
      default:
        return true;
    }
  };
  
  // Track search
  const trackSearch = (query: string) => {
    setUserData(prevData => {
      // Add to search history if not already present
      const searchHistory = prevData.searchHistory || [];
      if (!searchHistory.includes(query)) {
        // Limit history to 20 items
        const updatedHistory = [query, ...searchHistory].slice(0, 20);
        return {
          ...prevData,
          searchHistory: updatedHistory,
        };
      }
      return prevData;
    });
  };
  
  // Track product view
  const trackProductView = (product: any) => {
    setUserData(prevData => {
      const viewedProducts = prevData.viewedProducts || [];
      
      // Check if product is already in viewed products
      const existingIndex = viewedProducts.findIndex((p: any) => p.id === product.id);
      
      if (existingIndex >= 0) {
        // Update existing product with new timestamp and increment view count
        const updatedProducts = [...viewedProducts];
        updatedProducts[existingIndex] = {
          ...updatedProducts[existingIndex],
          lastViewed: new Date().toISOString(),
          viewCount: (updatedProducts[existingIndex].viewCount || 1) + 1,
        };
        return {
          ...prevData,
          viewedProducts: updatedProducts,
        };
      } else {
        // Add new product to viewed products
        const newProduct = {
          ...product,
          firstViewed: new Date().toISOString(),
          lastViewed: new Date().toISOString(),
          viewCount: 1,
        };
        
        // Limit to 50 most recently viewed products
        const updatedProducts = [newProduct, ...viewedProducts].slice(0, 50);
        
        return {
          ...prevData,
          viewedProducts: updatedProducts,
        };
      }
    });
  };
  
  // Track marketplace click
  const trackMarketplaceClick = (marketplace: string) => {
    setUserData(prevData => {
      const preferences = prevData.preferences || {};
      const preferredMarketplaces = preferences.preferredMarketplaces || [];
      
      // Update marketplace preferences
      let updatedMarketplaces = [...preferredMarketplaces];
      
      // Check if marketplace is already in preferences
      const existingIndex = updatedMarketplaces.findIndex((m: any) => 
        m.name === marketplace
      );
      
      if (existingIndex >= 0) {
        // Increment count for existing marketplace
        updatedMarketplaces[existingIndex] = {
          ...updatedMarketplaces[existingIndex],
          count: (updatedMarketplaces[existingIndex].count || 1) + 1,
          lastUsed: new Date().toISOString(),
        };
      } else {
        // Add new marketplace preference
        updatedMarketplaces.push({
          name: marketplace,
          count: 1,
          firstUsed: new Date().toISOString(),
          lastUsed: new Date().toISOString(),
        });
      }
      
      // Sort by count (most used first)
      updatedMarketplaces.sort((a, b) => b.count - a.count);
      
      return {
        ...prevData,
        preferences: {
          ...preferences,
          preferredMarketplaces: updatedMarketplaces,
        },
      };
    });
  };
  
  // Get personalized recommendations based on user data
  const getRecommendations = () => {
    if (!privacySettings.allowPersonalization) {
      return [];
    }
    
    // In a real implementation, this would use more sophisticated algorithms
    // For now, we'll return simple recommendations based on search history and viewed products
    
    const recommendations = [];
    
    // Add recommendations based on search history
    if (userData.searchHistory && userData.searchHistory.length > 0) {
      // Use the most recent search terms
      const recentSearches = userData.searchHistory.slice(0, 3);
      
      recentSearches.forEach((search: string) => {
        recommendations.push({
          type: 'search_based',
          title: `More items like "${search}"`,
          query: search,
          confidence: 0.8,
        });
      });
    }
    
    // Add recommendations based on viewed products
    if (userData.viewedProducts && userData.viewedProducts.length > 0) {
      // Use the most viewed products
      const mostViewed = [...userData.viewedProducts]
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 2);
      
      mostViewed.forEach((product: any) => {
        recommendations.push({
          type: 'product_based',
          title: `Similar to ${product.title}`,
          productId: product.id,
          category: product.category,
          confidence: 0.7,
        });
      });
    }
    
    // Add recommendations based on marketplace preferences
    if (userData.preferences?.preferredMarketplaces?.length > 0) {
      const topMarketplace = userData.preferences.preferredMarketplaces[0];
      
      recommendations.push({
        type: 'marketplace_based',
        title: `Top deals on ${topMarketplace.name}`,
        marketplace: topMarketplace.name,
        confidence: 0.6,
      });
    }
    
    return recommendations;
  };
  
  // Update privacy settings
  const updatePrivacySettings = (settings: any) => {
    setPrivacySettings(prevSettings => ({
      ...prevSettings,
      ...settings,
    }));
    
    // If cookies are disabled, clear user data
    if (!settings.allowCookies) {
      setUserData({
        searchHistory: [],
        viewedProducts: [],
        preferences: {
          preferredMarketplaces: [],
          preferredCategories: [],
          priceRanges: {},
        },
        interactions: [],
      });
      
      try {
        localStorage.removeItem('sellrogan_user_data');
      } catch (error) {
        console.error('Error removing user data:', error);
      }
    }
  };
  
  return (
    <UserDataContext.Provider
      value={{
        userData,
        updateUserData,
        trackEvent,
        getRecommendations,
        privacySettings,
        updatePrivacySettings,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataService;
