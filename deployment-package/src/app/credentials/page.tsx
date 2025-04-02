'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Key, Lock, Check, AlertCircle, Loader2 } from 'lucide-react';

interface Platform {
  id: number;
  name: string;
  apiEndpoint: string;
  requiresAuth: boolean;
}

interface Credential {
  id: number;
  platformId: number;
  platformName: string;
  username: string;
  isConnected: boolean;
  lastVerified: string;
}

export default function CredentialsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    apiKey: '',
    secretKey: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch platforms and credentials on component mount
  useEffect(() => {
    // Simulate API call to fetch platforms
    setTimeout(() => {
      const mockPlatforms: Platform[] = [
        { id: 1, name: 'Amazon', apiEndpoint: 'https://api.amazon.com', requiresAuth: true },
        { id: 2, name: 'eBay', apiEndpoint: 'https://api.ebay.com', requiresAuth: true },
        { id: 3, name: 'Walmart', apiEndpoint: 'https://api.walmart.com', requiresAuth: true },
        { id: 4, name: 'Etsy', apiEndpoint: 'https://api.etsy.com', requiresAuth: true },
        { id: 5, name: 'Shopify', apiEndpoint: 'https://api.shopify.com', requiresAuth: true }
      ];
      
      const mockCredentials: Credential[] = [
        { 
          id: 1, 
          platformId: 1, 
          platformName: 'Amazon', 
          username: 'amazon_seller123', 
          isConnected: true,
          lastVerified: '2025-03-30T14:30:00Z'
        },
        { 
          id: 2, 
          platformId: 2, 
          platformName: 'eBay', 
          username: 'ebay_user456', 
          isConnected: true,
          lastVerified: '2025-04-01T09:15:00Z'
        }
      ];
      
      setPlatforms(mockPlatforms);
      setCredentials(mockCredentials);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddCredential = () => {
    if (!selectedPlatform) {
      setSelectedPlatform(platforms[0]);
    }
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({
      username: '',
      password: '',
      apiKey: '',
      secretKey: ''
    });
    setErrorMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const platformId = parseInt(e.target.value);
    const platform = platforms.find(p => p.id === platformId) || null;
    setSelectedPlatform(platform);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlatform) {
      setErrorMessage('Please select a platform');
      return;
    }
    
    if (!formData.username) {
      setErrorMessage('Username is required');
      return;
    }
    
    // Different platforms might have different auth requirements
    if (selectedPlatform.name === 'Amazon' || selectedPlatform.name === 'eBay') {
      if (!formData.password) {
        setErrorMessage('Password is required');
        return;
      }
    } else {
      if (!formData.apiKey || !formData.secretKey) {
        setErrorMessage('API Key and Secret Key are required');
        return;
      }
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Simulate API call to save credentials
    setTimeout(() => {
      // Create new credential
      const newCredential: Credential = {
        id: credentials.length + 1,
        platformId: selectedPlatform.id,
        platformName: selectedPlatform.name,
        username: formData.username,
        isConnected: true,
        lastVerified: new Date().toISOString()
      };
      
      // Add to credentials list
      setCredentials(prev => [...prev, newCredential]);
      
      // Reset form and close modal
      setIsSubmitting(false);
      handleCloseModal();
    }, 2000);
  };

  const handleVerifyCredential = (credentialId: number) => {
    // Find the credential to verify
    const credential = credentials.find(c => c.id === credentialId);
    if (!credential) return;
    
    // Update credential status to show verification in progress
    setCredentials(prev => 
      prev.map(c => 
        c.id === credentialId 
          ? { ...c, isConnected: false } 
          : c
      )
    );
    
    // Simulate API call to verify credential
    setTimeout(() => {
      // Update credential with verification result
      setCredentials(prev => 
        prev.map(c => 
          c.id === credentialId 
            ? { ...c, isConnected: true, lastVerified: new Date().toISOString() } 
            : c
        )
      );
    }, 1500);
  };

  const handleDeleteCredential = (credentialId: number) => {
    if (window.confirm('Are you sure you want to delete this credential?')) {
      // Simulate API call to delete credential
      setTimeout(() => {
        setCredentials(prev => prev.filter(c => c.id !== credentialId));
      }, 500);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Platform Credentials</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Saved Credentials</h2>
            <button
              onClick={handleAddCredential}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Key size={18} />
              Add New Credential
            </button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 size={40} className="animate-spin mx-auto mb-4 text-blue-600" />
              <p>Loading your credentials...</p>
            </div>
          ) : credentials.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Lock size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Credentials Found</h3>
              <p className="text-gray-500 mb-4">
                You haven't added any platform credentials yet. Add credentials to enable one-click listing.
              </p>
              <button
                onClick={handleAddCredential}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
              >
                <Key size={18} />
                Add Your First Credential
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Verified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {credentials.map((credential) => (
                    <tr key={credential.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{credential.platformName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{credential.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {credential.isConnected ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <Check size={14} className="mr-1" /> Connected
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            <Loader2 size={14} className="animate-spin mr-1" /> Verifying
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(credential.lastVerified).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleVerifyCredential(credential.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          disabled={!credential.isConnected}
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleDeleteCredential(credential.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">About Platform Credentials</h3>
          <p className="text-blue-700 mb-4">
            Adding your platform credentials enables one-click listing functionality, allowing you to automatically
            create listings on various e-commerce platforms directly from our app.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2">Security</h4>
              <p className="text-sm text-gray-600">
                Your credentials are encrypted and stored securely. We never store your passwords in plain text.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2">Permissions</h4>
              <p className="text-sm text-gray-600">
                We only request the minimum permissions needed to create and manage listings on your behalf.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Credential Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Add Platform Credential</h3>
            
            {errorMessage && (
              <div className="mb-4 bg-red-50 p-3 rounded-lg flex items-start">
                <AlertCircle size={18} className="text-red-500 mr-2 mt-0.5" />
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <select
                  value={selectedPlatform?.id || ''}
                  onChange={handlePlatformChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {platforms.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username / Email
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {selectedPlatform?.name === 'Amazon' || selectedPlatform?.name === 'eBay' ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <input
                      type="text"
                      name="apiKey"
                      value={formData.apiKey}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secret Key
                    </label>
                    <input
                      type="password"
                      name="secretKey"
                      value={formData.secretKey}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Credential'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
