'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserDataContext } from '@/lib/userDataService';
import { Sparkles, ArrowRight, ShoppingBag, Check, AlertCircle } from 'lucide-react';

interface MarketplaceIntegrationProps {
  className?: string;
}

const MarketplaceIntegration: React.FC<MarketplaceIntegrationProps> = ({ className = '' }) => {
  // Use user data context
  const { userData, trackEvent } = React.useContext(UserDataContext);
  
  // State for marketplace credentials
  const [credentials, setCredentials] = useState({
    amazon: { connected: false, username: '', apiKey: '' },
    ebay: { connected: false, username: '', apiKey: '' },
    walmart: { connected: false, username: '', apiKey: '' },
    etsy: { connected: false, username: '', apiKey: '' }
  });
  
  // State for current marketplace being edited
  const [currentMarketplace, setCurrentMarketplace] = useState<string | null>(null);
  
  // State for form inputs
  const [formInputs, setFormInputs] = useState({
    username: '',
    apiKey: '',
    password: ''
  });
  
  // State for form validation
  const [formErrors, setFormErrors] = useState({
    username: '',
    apiKey: '',
    password: ''
  });
  
  // State for connection status
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  
  // Handle opening the connection modal
  const openConnectionModal = (marketplace: string) => {
    setCurrentMarketplace(marketplace);
    setFormInputs({
      username: credentials[marketplace as keyof typeof credentials].username || '',
      apiKey: credentials[marketplace as keyof typeof credentials].apiKey || '',
      password: ''
    });
    setFormErrors({
      username: '',
      apiKey: '',
      password: ''
    });
    setConnectionStatus('idle');
  };
  
  // Handle closing the connection modal
  const closeConnectionModal = () => {
    setCurrentMarketplace(null);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormInputs({
      ...formInputs,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    if (!formInputs.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    }
    
    if (!formInputs.apiKey.trim()) {
      newErrors.apiKey = 'API Key is required';
      valid = false;
    }
    
    if (currentMarketplace === 'amazon' && !formInputs.password.trim()) {
      newErrors.password = 'Password is required for Amazon';
      valid = false;
    }
    
    setFormErrors(newErrors);
    return valid;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !currentMarketplace) return;
    
    // Simulate connection process
    setConnectionStatus('connecting');
    
    // Track event
    trackEvent('marketplace_connect_attempt', { 
      marketplace: currentMarketplace 
    });
    
    // Simulate API call to connect marketplace
    setTimeout(() => {
      // 90% success rate for demo
      const success = Math.random() > 0.1;
      
      if (success) {
        setConnectionStatus('success');
        
        // Update credentials
        setCredentials({
          ...credentials,
          [currentMarketplace]: {
            connected: true,
            username: formInputs.username,
            apiKey: formInputs.apiKey
          }
        });
        
        // Track successful connection
        trackEvent('marketplace_connect_success', { 
          marketplace: currentMarketplace 
        });
        
        // Close modal after delay
        setTimeout(() => {
          closeConnectionModal();
        }, 1500);
      } else {
        setConnectionStatus('error');
        
        // Track failed connection
        trackEvent('marketplace_connect_error', { 
          marketplace: currentMarketplace 
        });
      }
    }, 2000);
  };
  
  // Handle disconnecting a marketplace
  const handleDisconnect = (marketplace: string) => {
    // Confirm disconnect
    if (window.confirm(`Are you sure you want to disconnect your ${marketplace} account?`)) {
      setCredentials({
        ...credentials,
        [marketplace]: {
          connected: false,
          username: '',
          apiKey: ''
        }
      });
      
      // Track disconnect
      trackEvent('marketplace_disconnect', { marketplace });
    }
  };
  
  // Get marketplace logo
  const getMarketplaceLogo = (marketplace: string) => {
    return `https://via.placeholder.com/40?text=${marketplace}`;
  };
  
  // Get marketplace color
  const getMarketplaceColor = (marketplace: string) => {
    switch (marketplace) {
      case 'amazon':
        return 'bg-orange-500';
      case 'ebay':
        return 'bg-blue-500';
      case 'walmart':
        return 'bg-blue-700';
      case 'etsy':
        return 'bg-orange-600';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className={`marketplace-integration ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2 text-blue-600" />
          Marketplace Integrations
        </h2>
        
        <p className="text-gray-600 mb-6">
          Connect your marketplace accounts to automatically list products and manage inventory across platforms.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amazon */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={getMarketplaceLogo('amazon')} 
                  alt="Amazon" 
                  className="w-10 h-10 mr-3"
                />
                <div>
                  <h3 className="font-medium">Amazon</h3>
                  <p className="text-sm text-gray-500">
                    {credentials.amazon.connected 
                      ? `Connected as ${credentials.amazon.username}` 
                      : 'Not connected'}
                  </p>
                </div>
              </div>
              
              {credentials.amazon.connected ? (
                <button
                  onClick={() => handleDisconnect('amazon')}
                  className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => openConnectionModal('amazon')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
          
          {/* eBay */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={getMarketplaceLogo('ebay')} 
                  alt="eBay" 
                  className="w-10 h-10 mr-3"
                />
                <div>
                  <h3 className="font-medium">eBay</h3>
                  <p className="text-sm text-gray-500">
                    {credentials.ebay.connected 
                      ? `Connected as ${credentials.ebay.username}` 
                      : 'Not connected'}
                  </p>
                </div>
              </div>
              
              {credentials.ebay.connected ? (
                <button
                  onClick={() => handleDisconnect('ebay')}
                  className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => openConnectionModal('ebay')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
          
          {/* Walmart */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={getMarketplaceLogo('walmart')} 
                  alt="Walmart" 
                  className="w-10 h-10 mr-3"
                />
                <div>
                  <h3 className="font-medium">Walmart</h3>
                  <p className="text-sm text-gray-500">
                    {credentials.walmart.connected 
                      ? `Connected as ${credentials.walmart.username}` 
                      : 'Not connected'}
                  </p>
                </div>
              </div>
              
              {credentials.walmart.connected ? (
                <button
                  onClick={() => handleDisconnect('walmart')}
                  className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => openConnectionModal('walmart')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
          
          {/* Etsy */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={getMarketplaceLogo('etsy')} 
                  alt="Etsy" 
                  className="w-10 h-10 mr-3"
                />
                <div>
                  <h3 className="font-medium">Etsy</h3>
                  <p className="text-sm text-gray-500">
                    {credentials.etsy.connected 
                      ? `Connected as ${credentials.etsy.username}` 
                      : 'Not connected'}
                  </p>
                </div>
              </div>
              
              {credentials.etsy.connected ? (
                <button
                  onClick={() => handleDisconnect('etsy')}
                  className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => openConnectionModal('etsy')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Why connect your marketplaces?</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Automatically list products across multiple platforms</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Sync inventory and pricing in real-time</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Manage orders from a single dashboard</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Get AI-powered optimization for each platform</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Connection Modal */}
      {currentMarketplace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className={`h-2 rounded-t-lg ${getMarketplaceColor(currentMarketplace)}`}></div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img 
                  src={getMarketplaceLogo(currentMarketplace)} 
                  alt={currentMarketplace} 
                  className="w-10 h-10 mr-3"
                />
                <h3 className="text-xl font-semibold">
                  Connect {currentMarketplace.charAt(0).toUpperCase() + currentMarketplace.slice(1)}
                </h3>
              </div>
              
              {connectionStatus === 'idle' || connectionStatus === 'connecting' ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formInputs.username}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${
                          formErrors.username ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={`Your ${currentMarketplace} username`}
                        disabled={connectionStatus === 'connecting'}
                      />
                      {formErrors.username && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                        API Key
                      </label>
                      <input
                        type="password"
                        id="apiKey"
                        name="apiKey"
                        value={formInputs.apiKey}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${
                          formErrors.apiKey ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={`Your ${currentMarketplace} API key`}
                        disabled={connectionStatus === 'connecting'}
                      />
                      {formErrors.apiKey && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.apiKey}</p>
                      )}
                    </div>
                    
                    {currentMarketplace === 'amazon' && (
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formInputs.password}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md ${
                            formErrors.password ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Your Amazon password"
                          disabled={connectionStatus === 'connecting'}
                        />
                        {formErrors.password && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                        )}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-500">
                      <p>
                        Your credentials are securely stored and used only for connecting to your marketplace account.
                        We never share your information with third parties.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeConnectionModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      disabled={connectionStatus === 'connecting'}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                      disabled={connectionStatus === 'connecting'}
                    >
                      {connectionStatus === 'connecting' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Connecting...
                        </>
                      ) : (
                        'Connect'
                      )}
                    </button>
                  </div>
                </form>
              ) : connectionStatus === 'success' ? (
                <div className="text-center py-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Successful</h3>
                  <p className="text-gray-500">
                    Your {currentMarketplace} account has been successfully connected.
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Failed</h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't connect to your {currentMarketplace} account. Please check your credentials and try again.
                  </p>
                  <button
                    onClick={() => setConnectionStatus('idle')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceIntegration;
