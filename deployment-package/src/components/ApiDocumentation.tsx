'use client';

import React from 'react';
import { Code, FileJson, Key, Lock, Server, Zap } from 'lucide-react';

interface ApiDocumentationProps {
  className?: string;
}

export const ApiDocumentation: React.FC<ApiDocumentationProps> = ({ className = '' }) => {
  return (
    <div className={`api-documentation ${className}`}>
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-xl font-semibold flex items-center">
            <FileJson size={20} className="mr-2 text-primary-600" />
            API Documentation
          </h2>
        </div>
        <div className="card-body">
          <p className="mb-4">
            The SourceAndSell API allows you to programmatically access our platform's features, 
            including product search, listing management, and analytics. This API is available 
            exclusively to Premium and Enterprise subscribers.
          </p>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Key size={18} className="mr-2 text-primary-600" />
              Authentication
            </h3>
            <p className="mb-3">
              All API requests require authentication using an API key. You can generate an API key 
              in your account settings.
            </p>
            <div className="bg-neutral-50 p-4 rounded-md mb-3">
              <p className="font-mono text-sm mb-2">Example request with API key:</p>
              <pre className="bg-neutral-800 text-white p-3 rounded-md overflow-x-auto">
                <code>
                  curl -X GET https://api.sourceandsell.com/v1/products/search?query=wireless+earbuds \<br/>
                  &nbsp;&nbsp;-H "x-api-key: sas_your_api_key"
                </code>
              </pre>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Server size={18} className="mr-2 text-primary-600" />
              Base URL
            </h3>
            <p className="mb-3">
              All API endpoints are relative to the base URL:
            </p>
            <div className="bg-neutral-50 p-4 rounded-md">
              <p className="font-mono">https://api.sourceandsell.com/v1</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Lock size={18} className="mr-2 text-primary-600" />
              Rate Limits
            </h3>
            <p className="mb-3">
              API rate limits vary by subscription tier:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="py-2 px-4 text-left font-medium text-neutral-500">Subscription Tier</th>
                    <th className="py-2 px-4 text-left font-medium text-neutral-500">Rate Limit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-neutral-100">
                    <td className="py-2 px-4">Premium</td>
                    <td className="py-2 px-4">100 requests per minute</td>
                  </tr>
                  <tr className="border-t border-neutral-100">
                    <td className="py-2 px-4">Enterprise</td>
                    <td className="py-2 px-4">500 requests per minute</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Zap size={18} className="mr-2 text-primary-600" />
              Available Endpoints
            </h3>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Product Search</h4>
              <div className="bg-neutral-50 p-4 rounded-md mb-3">
                <p className="font-mono text-sm mb-1">GET /products/search</p>
                <p className="text-sm text-neutral-600 mb-2">Search for products across multiple platforms</p>
                <div className="mb-2">
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-1">query</span>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-1">platform</span>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-1">minPrice</span>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-1">maxPrice</span>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-1">sortBy</span>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">sortOrder</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Listings</h4>
              <div className="bg-neutral-50 p-4 rounded-md mb-3">
                <p className="font-mono text-sm mb-1">GET /listings</p>
                <p className="text-sm text-neutral-600 mb-2">Get all listings for the authenticated user</p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-md mb-3">
                <p className="font-mono text-sm mb-1">POST /listings</p>
                <p className="text-sm text-neutral-600 mb-2">Create a new listing on a specified platform</p>
                <div className="mb-2">
                  <span className="inline-block bg-accent-danger bg-opacity-20 text-accent-danger text-xs px-2 py-1 rounded-full mr-1">platform*</span>
                  <span className="inline-block bg-accent-danger bg-opacity-20 text-accent-danger text-xs px-2 py-1 rounded-full mr-1">title*</span>
                  <span className="inline-block bg-accent-danger bg-opacity-20 text-accent-danger text-xs px-2 py-1 rounded-full mr-1">description*</span>
                  <span className="inline-block bg-accent-danger bg-opacity-20 text-accent-danger text-xs px-2 py-1 rounded-full mr-1">price*</span>
                  <span className="inline-block bg-accent-danger bg-opacity-20 text-accent-danger text-xs px-2 py-1 rounded-full mr-1">quantity*</span>
                  <span className="inline-block bg-accent-danger bg-opacity-20 text-accent-danger text-xs px-2 py-1 rounded-full mr-1">category*</span>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-1">currency</span>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">images</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Analytics</h4>
              <div className="bg-neutral-50 p-4 rounded-md mb-3">
                <p className="font-mono text-sm mb-1">GET /analytics</p>
                <p className="text-sm text-neutral-600 mb-2">Get analytics data with filtering and pagination</p>
                <div className="mb-2">
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-1">page</span>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-1">limit</span>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-1">startDate</span>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-1">endDate</span>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-1">platform</span>
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">category</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">User</h4>
              <div className="bg-neutral-50 p-4 rounded-md mb-3">
                <p className="font-mono text-sm mb-1">GET /users/me</p>
                <p className="text-sm text-neutral-600 mb-2">Get information about the authenticated user</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Documentation</h4>
              <div className="bg-neutral-50 p-4 rounded-md mb-3">
                <p className="font-mono text-sm mb-1">GET /docs</p>
                <p className="text-sm text-neutral-600 mb-2">Get OpenAPI documentation</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Code size={18} className="mr-2 text-primary-600" />
              Code Examples
            </h3>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">JavaScript/Node.js</h4>
              <pre className="bg-neutral-800 text-white p-3 rounded-md overflow-x-auto">
                <code>
                  const axios = require('axios');<br/>
                  <br/>
                  const API_KEY = 'sas_your_api_key';<br/>
                  const BASE_URL = 'https://api.sourceandsell.com/v1';<br/>
                  <br/>
                  async function searchProducts(query) &#123;<br/>
                  &nbsp;&nbsp;try &#123;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;const response = await axios.get(`$&#123;BASE_URL&#125;/products/search`, &#123;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;params: &#123; query &#125;,<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;headers: &#123; 'x-api-key': API_KEY &#125;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&#125;);<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;return response.data;<br/>
                  &nbsp;&nbsp;&#125; catch (error) &#123;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;console.error('Error searching products:', error);<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;throw error;<br/>
                  &nbsp;&nbsp;&#125;<br/>
                  &#125;
                </code>
              </pre>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Python</h4>
              <pre className="bg-neutral-800 text-white p-3 rounded-md overflow-x-auto">
                <code>
                  import requests<br/>
                  <br/>
                  API_KEY = 'sas_your_api_key'<br/>
                  BASE_URL = 'https://api.sourceandsell.com/v1'<br/>
                  <br/>
                  def search_products(query):<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;try:<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;response = requests.get(<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f"&#123;BASE_URL&#125;/products/search",<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;params=&#123;"query": query&#125;,<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;headers=&#123;"x-api-key": API_KEY&#125;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;response.raise_for_status()<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return response.json()<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;except Exception as e:<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print(f"Error searching products: &#123;e&#125;")<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;raise
                </code>
              </pre>
            </div>
          </div>
          
          <div className="text-center">
            <a href="/api/v1/docs" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              View Full API Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
