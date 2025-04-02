'use client';

import React, { useState, useEffect } from 'react';
import { UserDataContext } from '@/lib/userDataService';
import SmartSearch from '@/components/SmartSearch';
import PriceComparisonEngine from '@/components/PriceComparisonEngine';
import AIAgentManager from '@/components/AIAgentManager';
import AutomatedFulfillment from '@/components/AutomatedFulfillment';
import MarketplaceIntegration from '@/components/MarketplaceIntegration';
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  ShoppingBag, 
  Package, 
  Settings, 
  BarChart2, 
  MessageCircle,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  // Use user data context
  const { userData, trackEvent } = React.useContext(UserDataContext);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('search');
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({});
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Handle search
  const handleSearch = (query: string, filters: any) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    setSearchPerformed(true);
    
    // Track event
    trackEvent('search_performed', { query, filters });
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Track event
    trackEvent('dashboard_tab_changed', { tab: value });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Main content */}
        <div className="flex-1 w-full">
          <h1 className="text-3xl font-bold mb-6">SellRogan Dashboard</h1>
          
          <Tabs defaultValue="search" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </TabsTrigger>
              <TabsTrigger value="listings" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Listings</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Find Products to Source</h2>
                <SmartSearch onSearch={handleSearch} />
              </div>
              
              {searchPerformed && (
                <PriceComparisonEngine 
                  searchQuery={searchQuery} 
                  filters={searchFilters} 
                />
              )}
              
              <PersonalizedRecommendations />
            </TabsContent>
            
            <TabsContent value="listings" className="space-y-8">
              <MarketplaceIntegration />
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-8">
              <AutomatedFulfillment />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
                <p className="text-gray-600">
                  View your sales performance, profit margins, and marketplace analytics.
                </p>
                
                {/* Placeholder for analytics dashboard */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Total Sales</h3>
                    <p className="text-2xl font-bold">$1,245.89</p>
                    <p className="text-sm text-green-600">↑ 12% from last month</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Active Listings</h3>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-sm text-gray-500">Across 3 marketplaces</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Profit Margin</h3>
                    <p className="text-2xl font-bold">18.7%</p>
                    <p className="text-sm text-green-600">↑ 2.3% from last month</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium mb-4">Sales by Marketplace</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Sales chart will appear here</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <p className="text-gray-600 mb-6">
                  Manage your account settings, marketplace connections, and notification preferences.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          defaultValue="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          defaultValue="john@example.com"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">API Keys</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">Google AI API Key</p>
                          <p className="text-sm text-gray-500">Used for AI-powered features</p>
                        </div>
                        <div className="flex items-center">
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium mr-2">
                            Active
                          </span>
                          <button className="text-sm text-blue-600 hover:text-blue-800">
                            Update
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                          value="••••••••••••••••••••••••••••••"
                          readOnly
                        />
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700">
                          Show
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Notification Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="notifyOrders"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                        <label htmlFor="notifyOrders" className="ml-2 text-sm text-gray-700">
                          Order notifications
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="notifyListings"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                        <label htmlFor="notifyListings" className="ml-2 text-sm text-gray-700">
                          Listing status updates
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="notifyPriceAlerts"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                        <label htmlFor="notifyPriceAlerts" className="ml-2 text-sm text-gray-700">
                          Price change alerts
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* AI Assistant Sidebar */}
        <div className="w-full md:w-96 sticky top-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">AI Assistant</h2>
            </div>
            <AIAgentManager className="h-[500px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
