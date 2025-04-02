'use client';

import React, { useState, useEffect } from 'react';
import { UserDataContext } from '@/lib/userDataService';
import { Bell, Settings, Eye, Search, ShoppingBag, Shield, Clock, X } from 'lucide-react';

interface PrivacySettingsProps {
  className?: string;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ className = '' }) => {
  // Use user data context
  const { privacySettings, updatePrivacySettings } = React.useContext(UserDataContext);
  
  // Local state for form
  const [localSettings, setLocalSettings] = useState({
    allowSearchTracking: true,
    allowProductViewTracking: true,
    allowPersonalization: true,
    allowCookies: true,
    dataRetentionPeriod: 90, // days
  });
  
  // Update local state when context changes
  useEffect(() => {
    // Map the context privacy settings to our local settings structure
    setLocalSettings(prev => ({
      ...prev,
      allowPersonalization: privacySettings.allowPersonalization,
      allowCookies: privacySettings.allowCookies,
      // Map allowAnalytics to our tracking settings
      allowSearchTracking: privacySettings.allowAnalytics,
      allowProductViewTracking: privacySettings.allowAnalytics
    }));
  }, [privacySettings]);
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setLocalSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map our local settings back to the context structure
    updatePrivacySettings({
      allowPersonalization: localSettings.allowPersonalization,
      allowCookies: localSettings.allowCookies,
      allowAnalytics: localSettings.allowSearchTracking && localSettings.allowProductViewTracking
    });
  };
  
  // Handle reset to defaults
  const handleReset = () => {
    const defaults = {
      allowSearchTracking: true,
      allowProductViewTracking: true,
      allowPersonalization: true,
      allowCookies: true,
      dataRetentionPeriod: 90,
    };
    
    setLocalSettings(defaults);
    
    // Map to context structure
    updatePrivacySettings({
      allowPersonalization: defaults.allowPersonalization,
      allowCookies: defaults.allowCookies,
      allowAnalytics: defaults.allowSearchTracking && defaults.allowProductViewTracking
    });
  };
  
  return (
    <div className={`privacy-settings ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          Privacy Settings
        </h2>
        
        <p className="text-gray-600 mb-6">
          Control how your data is collected and used to personalize your experience.
          We respect your privacy and give you full control over your data.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Data Collection Section */}
            <div>
              <h3 className="text-lg font-medium mb-3">Data Collection</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="allowCookies"
                      name="allowCookies"
                      type="checkbox"
                      checked={localSettings.allowCookies}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="allowCookies" className="font-medium text-gray-700">
                      Allow cookies and local storage
                    </label>
                    <p className="text-gray-500">
                      Enables basic functionality and remembers your preferences.
                      Required for personalized features.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="allowSearchTracking"
                      name="allowSearchTracking"
                      type="checkbox"
                      checked={localSettings.allowSearchTracking}
                      onChange={handleChange}
                      disabled={!localSettings.allowCookies}
                      className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                        !localSettings.allowCookies ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label 
                      htmlFor="allowSearchTracking" 
                      className={`font-medium ${
                        !localSettings.allowCookies ? 'text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      Track search history
                    </label>
                    <p className={!localSettings.allowCookies ? 'text-gray-400' : 'text-gray-500'}>
                      Remembers your searches to provide better recommendations and faster access to recent searches.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="allowProductViewTracking"
                      name="allowProductViewTracking"
                      type="checkbox"
                      checked={localSettings.allowProductViewTracking}
                      onChange={handleChange}
                      disabled={!localSettings.allowCookies}
                      className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                        !localSettings.allowCookies ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label 
                      htmlFor="allowProductViewTracking" 
                      className={`font-medium ${
                        !localSettings.allowCookies ? 'text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      Track product views
                    </label>
                    <p className={!localSettings.allowCookies ? 'text-gray-400' : 'text-gray-500'}>
                      Remembers products you've viewed to help you find them again and suggest similar items.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Personalization Section */}
            <div>
              <h3 className="text-lg font-medium mb-3">Personalization</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="allowPersonalization"
                      name="allowPersonalization"
                      type="checkbox"
                      checked={localSettings.allowPersonalization}
                      onChange={handleChange}
                      disabled={!localSettings.allowCookies}
                      className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                        !localSettings.allowCookies ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label 
                      htmlFor="allowPersonalization" 
                      className={`font-medium ${
                        !localSettings.allowCookies ? 'text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      Personalized recommendations
                    </label>
                    <p className={!localSettings.allowCookies ? 'text-gray-400' : 'text-gray-500'}>
                      Uses your activity to provide personalized product recommendations and search results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Data Retention Section */}
            <div>
              <h3 className="text-lg font-medium mb-3">Data Retention</h3>
              <div className="space-y-4">
                <div>
                  <label 
                    htmlFor="dataRetentionPeriod" 
                    className={`block text-sm font-medium ${
                      !localSettings.allowCookies ? 'text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    Keep my data for
                  </label>
                  <div className="mt-1">
                    <select
                      id="dataRetentionPeriod"
                      name="dataRetentionPeriod"
                      value={localSettings.dataRetentionPeriod}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        dataRetentionPeriod: parseInt(e.target.value)
                      })}
                      disabled={!localSettings.allowCookies}
                      className={`mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${
                        !localSettings.allowCookies ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <option value={30}>30 days</option>
                      <option value={90}>90 days</option>
                      <option value={180}>180 days</option>
                      <option value={365}>1 year</option>
                    </select>
                  </div>
                  <p className={`mt-2 text-sm ${!localSettings.allowCookies ? 'text-gray-400' : 'text-gray-500'}`}>
                    Data older than this will be automatically deleted.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Data Visualization */}
            <div>
              <h3 className="text-lg font-medium mb-3">Your Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Search className="h-5 w-5 text-gray-400 mr-2" />
                    <h4 className="font-medium">Search History</h4>
                  </div>
                  <p className="text-sm text-gray-500">
                    {localSettings.allowSearchTracking && localSettings.allowCookies
                      ? "Your search history is being saved to improve your experience."
                      : "You've opted out of search history tracking."}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Eye className="h-5 w-5 text-gray-400 mr-2" />
                    <h4 className="font-medium">Product Views</h4>
                  </div>
                  <p className="text-sm text-gray-500">
                    {localSettings.allowProductViewTracking && localSettings.allowCookies
                      ? "Products you view are tracked to provide better recommendations."
                      : "You've opted out of product view tracking."}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Bell className="h-5 w-5 text-gray-400 mr-2" />
                    <h4 className="font-medium">Personalization</h4>
                  </div>
                  <p className="text-sm text-gray-500">
                    {localSettings.allowPersonalization && localSettings.allowCookies
                      ? "You're receiving personalized recommendations based on your activity."
                      : "You've opted out of personalized recommendations."}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Reset to Defaults
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrivacySettings;
