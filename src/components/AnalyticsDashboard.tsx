'use client';

import React, { useState } from 'react';
import { BarChart2, TrendingUp, Users, DollarSign, ShoppingCart, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'ytd' | 'all'>('30d');
  const [platform, setPlatform] = useState<string>('all');
  
  // Mock data for demonstration
  const mockData = {
    summary: {
      revenue: 12458.75,
      profit: 4235.42,
      orders: 187,
      views: 8432,
      conversionRate: 2.22
    },
    revenueByDay: [
      { date: '2025-03-01', revenue: 345.67 },
      { date: '2025-03-02', revenue: 412.89 },
      { date: '2025-03-03', revenue: 378.45 },
      { date: '2025-03-04', revenue: 456.78 },
      { date: '2025-03-05', revenue: 389.23 },
      { date: '2025-03-06', revenue: 421.56 },
      { date: '2025-03-07', revenue: 467.89 },
      { date: '2025-03-08', revenue: 432.12 },
      { date: '2025-03-09', revenue: 398.45 },
      { date: '2025-03-10', revenue: 421.67 },
      { date: '2025-03-11', revenue: 445.23 },
      { date: '2025-03-12', revenue: 467.89 },
      { date: '2025-03-13', revenue: 432.12 },
      { date: '2025-03-14', revenue: 398.45 }
    ],
    topProducts: [
      { id: '1', name: 'Wireless Bluetooth Headphones', revenue: 2345.67, profit: 987.45, orders: 42, platform: 'Amazon' },
      { id: '2', name: 'Smart Watch Series 5', revenue: 1876.34, profit: 756.23, orders: 28, platform: 'eBay' },
      { id: '3', name: 'Portable Bluetooth Speaker', revenue: 1543.21, profit: 623.45, orders: 31, platform: 'Amazon' },
      { id: '4', name: 'Wireless Charging Pad', revenue: 1234.56, profit: 498.76, orders: 25, platform: 'Walmart' },
      { id: '5', name: 'Fitness Tracker Band', revenue: 987.65, profit: 412.34, orders: 19, platform: 'Etsy' }
    ],
    platformPerformance: [
      { platform: 'Amazon', revenue: 5678.90, profit: 2345.67, orders: 87 },
      { platform: 'eBay', revenue: 3456.78, profit: 1234.56, orders: 54 },
      { platform: 'Walmart', revenue: 2345.67, profit: 876.54, orders: 32 },
      { platform: 'Etsy', revenue: 987.65, profit: 412.34, orders: 14 }
    ]
  };
  
  // Filter data based on selected platform
  const filteredData = {
    ...mockData,
    topProducts: platform === 'all' 
      ? mockData.topProducts 
      : mockData.topProducts.filter(product => product.platform === platform)
  };
  
  // Calculate changes from previous period (mock data)
  const changes = {
    revenue: 12.5,
    profit: 8.7,
    orders: -3.2,
    views: 15.4,
    conversionRate: 0.3
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format number with commas
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  
  // Get chart data based on date range
  const getChartData = () => {
    // In a real app, this would filter based on the selected date range
    // For demo, we'll just return the mock data
    return mockData.revenueByDay;
  };
  
  // Get chart labels based on date range
  const getChartLabels = () => {
    // In a real app, this would format dates based on the selected date range
    // For demo, we'll just return simplified labels
    return mockData.revenueByDay.map((_, index) => `Day ${index + 1}`);
  };
  
  return (
    <div className={`analytics-dashboard ${className}`}>
      {/* Dashboard header with filters */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="ytd">Year to date</option>
            <option value="all">All time</option>
          </select>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="all">All Platforms</option>
            <option value="Amazon">Amazon</option>
            <option value="eBay">eBay</option>
            <option value="Walmart">Walmart</option>
            <option value="Etsy">Etsy</option>
          </select>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="text-gray-500 text-sm">Revenue</div>
            <div className={`text-xs font-medium ${changes.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {changes.revenue >= 0 ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />}
              {Math.abs(changes.revenue)}%
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-3 bg-blue-100 p-2 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{formatCurrency(filteredData.summary.revenue)}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="text-gray-500 text-sm">Profit</div>
            <div className={`text-xs font-medium ${changes.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {changes.profit >= 0 ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />}
              {Math.abs(changes.profit)}%
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-3 bg-green-100 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{formatCurrency(filteredData.summary.profit)}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="text-gray-500 text-sm">Orders</div>
            <div className={`text-xs font-medium ${changes.orders >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {changes.orders >= 0 ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />}
              {Math.abs(changes.orders)}%
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-3 bg-purple-100 p-2 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{formatNumber(filteredData.summary.orders)}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="text-gray-500 text-sm">Views</div>
            <div className={`text-xs font-medium ${changes.views >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {changes.views >= 0 ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />}
              {Math.abs(changes.views)}%
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-3 bg-orange-100 p-2 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{formatNumber(filteredData.summary.views)}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="text-gray-500 text-sm">Conversion Rate</div>
            <div className={`text-xs font-medium ${changes.conversionRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {changes.conversionRate >= 0 ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />}
              {Math.abs(changes.conversionRate)}%
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-3 bg-red-100 p-2 rounded-lg">
              <BarChart2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{formatPercentage(filteredData.summary.conversionRate)}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Revenue chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
        <div className="h-64 flex items-center justify-center">
          {/* In a real app, this would be a chart component */}
          <div className="w-full h-full flex items-end justify-between px-4">
            {mockData.revenueByDay.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="bg-blue-500 w-8 rounded-t-sm" 
                  style={{ height: `${(day.revenue / 500) * 100}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-1">{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Top products and platform performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.platform}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      {formatCurrency(product.revenue)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      {formatCurrency(product.profit)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      {product.orders}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.platformPerformance.map((platform) => (
                  <tr key={platform.platform} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium">{platform.platform}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      {formatCurrency(platform.revenue)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      {formatCurrency(platform.profit)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      {platform.orders}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
