'use client';

import React, { useState } from 'react';
import { Key, Plus, Trash2, Check, X } from 'lucide-react';

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<Array<{
    id: string;
    platform: string;
    apiKey: string;
    username?: string;
    password?: string;
    isActive: boolean;
  }>>([
    {
      id: '1',
      platform: 'Amazon',
      apiKey: 'amzn1_application_o1abc123defghijklmn',
      username: 'seller@example.com',
      isActive: true
    },
    {
      id: '2',
      platform: 'eBay',
      apiKey: 'ebay-oauth-abc123defghijklmn',
      username: 'ebayseller',
      isActive: true
    },
    {
      id: '3',
      platform: 'Etsy',
      apiKey: 'etsy_api_v3_abc123defghijklmn',
      username: 'etsyshop',
      isActive: false
    }
  ]);
  
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCredential, setNewCredential] = useState({
    platform: '',
    apiKey: '',
    username: '',
    password: ''
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    platform: '',
    apiKey: '',
    username: '',
    password: ''
  });
  
  // Available platforms
  const platforms = [
    'Amazon',
    'eBay',
    'Etsy',
    'Walmart',
    'Shopify',
    'WooCommerce',
    'BigCommerce',
    'Magento',
    'Wish',
    'Mercado Libre',
    'Other'
  ];
  
  // Handle adding new credential
  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewCredential({
      platform: '',
      apiKey: '',
      username: '',
      password: ''
    });
  };
  
  // Handle canceling add new
  const handleCancelAdd = () => {
    setIsAddingNew(false);
  };
  
  // Handle saving new credential
  const handleSaveNew = () => {
    if (!newCredential.platform || !newCredential.apiKey) return;
    
    const newId = Math.random().toString(36).substring(2, 10);
    
    setCredentials([
      ...credentials,
      {
        id: newId,
        platform: newCredential.platform,
        apiKey: newCredential.apiKey,
        username: newCredential.username || undefined,
        password: newCredential.password || undefined,
        isActive: true
      }
    ]);
    
    setIsAddingNew(false);
  };
  
  // Handle editing credential
  const handleEdit = (id: string) => {
    const credential = credentials.find(c => c.id === id);
    if (!credential) return;
    
    setEditingId(id);
    setEditForm({
      platform: credential.platform,
      apiKey: credential.apiKey,
      username: credential.username || '',
      password: credential.password || ''
    });
  };
  
  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingId(null);
  };
  
  // Handle saving edit
  const handleSaveEdit = () => {
    if (!editingId || !editForm.platform || !editForm.apiKey) return;
    
    setCredentials(credentials.map(c => 
      c.id === editingId
        ? {
            ...c,
            platform: editForm.platform,
            apiKey: editForm.apiKey,
            username: editForm.username || undefined,
            password: editForm.password || undefined
          }
        : c
    ));
    
    setEditingId(null);
  };
  
  // Handle deleting credential
  const handleDelete = (id: string) => {
    setCredentials(credentials.filter(c => c.id !== id));
  };
  
  // Handle toggling active status
  const handleToggleActive = (id: string) => {
    setCredentials(credentials.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };
  
  // Test connection
  const handleTestConnection = (id: string) => {
    // In a real app, this would make an API call to test the connection
    alert('Connection test successful!');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Platform Credentials</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Credentials</h2>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </button>
          </div>
          
          {credentials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Key className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>You haven't added any platform credentials yet.</p>
              <button
                onClick={handleAddNew}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Add your first credential
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Key</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {credentials.map((credential) => (
                    <tr key={credential.id} className="hover:bg-gray-50">
                      {editingId === credential.id ? (
                        // Edit mode
                        <>
                          <td className="px-4 py-3">
                            <select
                              value={editForm.platform}
                              onChange={(e) => setEditForm({ ...editForm, platform: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            >
                              <option value="">Select Platform</option>
                              {platforms.map((platform) => (
                                <option key={platform} value={platform}>{platform}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editForm.username}
                              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                              placeholder="Username (optional)"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editForm.apiKey}
                              onChange={(e) => setEditForm({ ...editForm, apiKey: e.target.value })}
                              placeholder="API Key"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              credential.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {credential.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </td>
                        </>
                      ) : (
                        // View mode
                        <>
                          <td className="px-4 py-3 font-medium">{credential.platform}</td>
                          <td className="px-4 py-3">{credential.username || '-'}</td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm">
                              {credential.apiKey.substring(0, 8)}...
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggleActive(credential.id)}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                credential.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {credential.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => handleTestConnection(credential.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Test
                            </button>
                            <button
                              onClick={() => handleEdit(credential.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(credential.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  
                  {/* Add new credential form */}
                  {isAddingNew && (
                    <tr className="bg-blue-50">
                      <td className="px-4 py-3">
                        <select
                          value={newCredential.platform}
                          onChange={(e) => setNewCredential({ ...newCredential, platform: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="">Select Platform</option>
                          {platforms.map((platform) => (
                            <option key={platform} value={platform}>{platform}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={newCredential.username}
                          onChange={(e) => setNewCredential({ ...newCredential, username: e.target.value })}
                          placeholder="Username (optional)"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={newCredential.apiKey}
                          onChange={(e) => setNewCredential({ ...newCredential, apiKey: e.target.value })}
                          placeholder="API Key"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={handleSaveNew}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleCancelAdd}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">About Platform Credentials</h2>
          <div className="text-gray-600 space-y-4">
            <p>
              Platform credentials are required to connect SellRogan with your selling platforms.
              These credentials allow us to fetch product data, create listings, and manage your inventory.
            </p>
            <p>
              To obtain API credentials:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Log in to your seller account on the platform</li>
              <li>Navigate to the developer or API section</li>
              <li>Create a new application or API key</li>
              <li>Copy the credentials and paste them here</li>
            </ol>
            <p>
              Your credentials are securely encrypted and stored. We never share your credentials with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
