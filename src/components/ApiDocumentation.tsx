'use client';

import React, { useState } from 'react';
import { FileText, Code, Book } from 'lucide-react';

interface ApiDocumentationProps {
  className?: string;
}

const ApiDocumentation: React.FC<ApiDocumentationProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'endpoints' | 'authentication'>('overview');
  
  return (
    <div className={`api-documentation ${className}`}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="inline-block mr-1 h-4 w-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('endpoints')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'endpoints'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Code className="inline-block mr-1 h-4 w-4" />
              Endpoints
            </button>
            <button
              onClick={() => setActiveTab('authentication')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'authentication'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Book className="inline-block mr-1 h-4 w-4" />
              Authentication
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">SellRogan API Overview</h2>
              <p className="text-gray-600 mb-4">
                The SellRogan API allows you to programmatically access product data, create listings,
                and manage your inventory across multiple e-commerce platforms.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">Base URL</h3>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                  https://api.sellrogan.com/v1
                </code>
              </div>
              <h3 className="font-medium mb-2">Features</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Search for products across multiple platforms</li>
                <li>Retrieve detailed product information</li>
                <li>Create and manage listings</li>
                <li>Track prices and inventory</li>
                <li>Generate analytics reports</li>
              </ul>
            </div>
          )}
          
          {activeTab === 'endpoints' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Products</h3>
                  
                  <div className="border rounded-lg overflow-hidden mb-4">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <div className="flex items-center">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">GET</span>
                        <code className="ml-2 font-mono text-sm">/products</code>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 text-sm mb-2">Get a list of products</p>
                      <h4 className="text-xs font-medium text-gray-500 uppercase mt-3 mb-1">Query Parameters</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-2 text-left font-medium text-gray-500">Parameter</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500">Type</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-4 py-2 font-mono text-xs">page</td>
                              <td className="px-4 py-2">integer</td>
                              <td className="px-4 py-2">Page number (default: 1)</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 font-mono text-xs">limit</td>
                              <td className="px-4 py-2">integer</td>
                              <td className="px-4 py-2">Items per page (default: 10, max: 100)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden mb-4">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">POST</span>
                        <code className="ml-2 font-mono text-sm">/products/search</code>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 text-sm mb-2">Search for products across multiple platforms</p>
                      <h4 className="text-xs font-medium text-gray-500 uppercase mt-3 mb-1">Request Body</h4>
                      <pre className="bg-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`{
  "query": "wireless headphones",
  "platforms": ["amazon", "ebay", "walmart"],
  "filters": {
    "minPrice": 20,
    "maxPrice": 100
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Listings</h3>
                  
                  <div className="border rounded-lg overflow-hidden mb-4">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">POST</span>
                        <code className="ml-2 font-mono text-sm">/listings</code>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 text-sm mb-2">Create a new listing</p>
                      <h4 className="text-xs font-medium text-gray-500 uppercase mt-3 mb-1">Request Body</h4>
                      <pre className="bg-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`{
  "platform": "amazon",
  "title": "Wireless Bluetooth Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "price": 49.99,
  "quantity": 100,
  "images": ["https://example.com/image1.jpg"]
}`}
                      </pre>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Analytics</h3>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <div className="flex items-center">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">GET</span>
                        <code className="ml-2 font-mono text-sm">/analytics</code>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 text-sm mb-2">Get analytics data for your listings</p>
                      <h4 className="text-xs font-medium text-gray-500 uppercase mt-3 mb-1">Query Parameters</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-2 text-left font-medium text-gray-500">Parameter</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500">Type</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-4 py-2 font-mono text-xs">startDate</td>
                              <td className="px-4 py-2">string (ISO date)</td>
                              <td className="px-4 py-2">Start date for analytics data</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 font-mono text-xs">endDate</td>
                              <td className="px-4 py-2">string (ISO date)</td>
                              <td className="px-4 py-2">End date for analytics data</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 font-mono text-xs">platform</td>
                              <td className="px-4 py-2">string</td>
                              <td className="px-4 py-2">Filter by platform (optional)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'authentication' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Authentication</h2>
              <p className="text-gray-600 mb-4">
                The SellRogan API uses API keys for authentication. You can obtain an API key from your account settings.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">API Key Authentication</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Include your API key in the request headers:
                </p>
                <pre className="bg-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`// Example request with API key
fetch('https://api.sellrogan.com/v1/products', {
  headers: {
    'x-api-key': 'your_api_key_here'
  }
})`}
                </pre>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">Security Notice</h3>
                <p className="text-sm text-yellow-700">
                  Keep your API key secure and never expose it in client-side code. Use server-side code to make API requests.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
