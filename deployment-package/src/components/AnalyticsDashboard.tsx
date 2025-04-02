'use client';

import React, { useState, useEffect } from 'react';

// Other imports...
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, BarChart2, PieChart as PieChartIcon,
  Calendar, Filter, Download, RefreshCw, ArrowUp, ArrowDown, AlertCircle, Bot
} from 'lucide-react';

interface AnalyticsDashboardProps {
  className?: string;
}

// Mock data for dashboard
const mockRevenueData = [
  { name: 'Jan', revenue: 6000, profit: 4000, cost: 2000 },
  { name: 'Feb', revenue: 5500, profit: 3000, cost: 2500 },
  { name: 'Mar', revenue: 8000, profit: 5000, cost: 3000 },
  { name: 'Apr', revenue: 5000, profit: 2780, cost: 2220 },
  { name: 'May', revenue: 4500, profit: 1890, cost: 2610 },
  { name: 'Jun', revenue: 5200, profit: 2390, cost: 2810 },
  { name: 'Jul', revenue: 6200, profit: 3490, cost: 2710 },
  { name: 'Aug', revenue: 7100, profit: 4200, cost: 2900 },
  { name: 'Sep', revenue: 6500, profit: 3800, cost: 2700 },
  { name: 'Oct', revenue: 7800, profit: 4800, cost: 3000 },
  { name: 'Nov', revenue: 8300, profit: 5100, cost: 3200 },
  { name: 'Dec', revenue: 9500, profit: 6200, cost: 3300 },
];

const mockPlatformData = [
  { name: 'Amazon', value: 45, color: '#FF9900' },
  { name: 'eBay', value: 25, color: '#E53238' },
  { name: 'Walmart', value: 15, color: '#0071DC' },
  { name: 'Etsy', value: 10, color: '#F1641E' },
  { name: 'Others', value: 5, color: '#6B7280' },
];

const mockCategoryData = [
  { name: 'Electronics', value: 35, color: '#4338CA' },
  { name: 'Home & Kitchen', value: 25, color: '#10B981' },
  { name: 'Toys & Games', value: 15, color: '#F59E0B' },
  { name: 'Beauty', value: 10, color: '#EC4899' },
  { name: 'Clothing', value: 10, color: '#3B82F6' },
  { name: 'Others', value: 5, color: '#6B7280' },
];

const mockProductPerformance = [
  { id: 1, name: 'Wireless Earbuds', profit: 1250, sales: 125, roi: 85, trend: 'up', platform: 'Amazon' },
  { id: 2, name: 'Smart Watch', profit: 980, sales: 49, roi: 65, trend: 'up', platform: 'eBay' },
  { id: 3, name: 'Bluetooth Speaker', profit: 750, sales: 75, roi: 50, trend: 'down', platform: 'Walmart' },
  { id: 4, name: 'Phone Charger', profit: 450, sales: 150, roi: 40, trend: 'up', platform: 'Amazon' },
  { id: 5, name: 'Laptop Stand', profit: 320, sales: 32, roi: 35, trend: 'down', platform: 'Etsy' },
  { id: 6, name: 'Wireless Mouse', profit: 580, sales: 58, roi: 45, trend: 'up', platform: 'Amazon' },
  { id: 7, name: 'Keyboard Cover', profit: 290, sales: 97, roi: 30, trend: 'down', platform: 'eBay' },
  { id: 8, name: 'Screen Protector', profit: 410, sales: 205, roi: 25, trend: 'up', platform: 'Walmart' },
  { id: 9, name: 'USB Hub', profit: 520, sales: 65, roi: 55, trend: 'up', platform: 'Amazon' },
  { id: 10, name: 'Desk Lamp', profit: 380, sales: 38, roi: 42, trend: 'down', platform: 'Etsy' },
];

const mockTrafficData = [
  { date: '2025-03-01', views: 120, clicks: 45, conversion: 12 },
  { date: '2025-03-02', views: 132, clicks: 52, conversion: 15 },
  { date: '2025-03-03', views: 101, clicks: 35, conversion: 10 },
  { date: '2025-03-04', views: 134, clicks: 48, conversion: 14 },
  { date: '2025-03-05', views: 190, clicks: 55, conversion: 18 },
  { date: '2025-03-06', views: 211, clicks: 67, conversion: 20 },
  { date: '2025-03-07', views: 150, clicks: 50, conversion: 15 },
  { date: '2025-03-08', views: 169, clicks: 49, conversion: 14 },
  { date: '2025-03-09', views: 173, clicks: 57, conversion: 16 },
  { date: '2025-03-10', views: 156, clicks: 51, conversion: 14 },
  { date: '2025-03-11', views: 195, clicks: 60, conversion: 18 },
  { date: '2025-03-12', views: 202, clicks: 64, conversion: 20 },
  { date: '2025-03-13', views: 187, clicks: 58, conversion: 17 },
  { date: '2025-03-14', views: 223, clicks: 75, conversion: 22 },
  { date: '2025-03-15', views: 284, clicks: 93, conversion: 28 },
  { date: '2025-03-16', views: 255, clicks: 81, conversion: 25 },
  { date: '2025-03-17', views: 263, clicks: 87, conversion: 26 },
  { date: '2025-03-18', views: 285, clicks: 96, conversion: 29 },
  { date: '2025-03-19', views: 302, clicks: 105, conversion: 32 },
  { date: '2025-03-20', views: 290, clicks: 98, conversion: 30 },
  { date: '2025-03-21', views: 304, clicks: 102, conversion: 31 },
  { date: '2025-03-22', views: 292, clicks: 94, conversion: 29 },
  { date: '2025-03-23', views: 287, clicks: 95, conversion: 28 },
  { date: '2025-03-24', views: 305, clicks: 102, conversion: 31 },
  { date: '2025-03-25', views: 322, clicks: 110, conversion: 34 },
  { date: '2025-03-26', views: 340, clicks: 118, conversion: 36 },
  { date: '2025-03-27', views: 358, clicks: 125, conversion: 38 },
  { date: '2025-03-28', views: 374, clicks: 131, conversion: 40 },
  { date: '2025-03-29', views: 395, clicks: 138, conversion: 42 },
  { date: '2025-03-30', views: 407, clicks: 142, conversion: 43 },
  { date: '2025-03-31', views: 423, clicks: 150, conversion: 45 },
];

const mockCompetitorData = [
  { name: 'Your Store', price: 49.99, rating: 4.5, shipping: 0, total: 49.99 },
  { name: 'Competitor A', price: 54.99, rating: 4.3, shipping: 0, total: 54.99 },
  { name: 'Competitor B', price: 47.99, rating: 4.1, shipping: 4.99, total: 52.98 },
  { name: 'Competitor C', price: 59.99, rating: 4.7, shipping: 0, total: 59.99 },
  { name: 'Competitor D', price: 44.99, rating: 3.9, shipping: 7.99, total: 52.98 },
];

const mockPerformanceMetrics = [
  { subject: 'Price Competitiveness', A: 85, B: 90, fullMark: 100 },
  { subject: 'Listing Quality', A: 92, B: 80, fullMark: 100 },
  { subject: 'Customer Ratings', A: 88, B: 70, fullMark: 100 },
  { subject: 'Shipping Speed', A: 75, B: 95, fullMark: 100 },
  { subject: 'Return Policy', A: 90, B: 85, fullMark: 100 },
  { subject: 'Product Images', A: 95, B: 75, fullMark: 100 },
];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const [comparisonPeriod, setComparisonPeriod] = useState<'previous' | 'yoy'>('previous');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [summaryMetrics, setSummaryMetrics] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalSales: 0,
    averageROI: 0,
    revenueChange: 0,
    profitChange: 0,
    salesChange: 0,
    roiChange: 0
  });
  
  // Calculate summary metrics based on filters
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Calculate total revenue, profit, sales, and ROI
      const revenue = mockRevenueData.reduce((sum, item) => sum + item.revenue, 0);
      const profit = mockRevenueData.reduce((sum, item) => sum + item.profit, 0);
      const sales = mockProductPerformance.reduce((sum, item) => sum + item.sales, 0);
      const roi = mockProductPerformance.reduce((sum, item) => sum + item.roi, 0) / mockProductPerformance.length;
      
      // Calculate changes (mock data)
      const revenueChange = 12.5;
      const profitChange = 8.3;
      const salesChange = 15.2;
      const roiChange = -2.1;
      
      setSummaryMetrics({
        totalRevenue: revenue,
        totalProfit: profit,
        totalSales: sales,
        averageROI: roi,
        revenueChange,
        profitChange,
        salesChange,
        roiChange
      });
      
      setIsLoading(false);
    }, 1000);
  }, [timeRange, selectedPlatform, selectedCategory]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };
  
  // Get chart data based on time range
  const getChartData = () => {
    switch (timeRange) {
      case '7d':
        return mockRevenueData.slice(-7);
      case '30d':
        return mockRevenueData.slice(-12);
      case '90d':
        return mockRevenueData;
      case '1y':
        return mockRevenueData;
      case 'all':
        return mockRevenueData;
      default:
        return mockRevenueData;
    }
  };
  
  // Get traffic data based on time range
  const getTrafficData = () => {
    switch (timeRange) {
      case '7d':
        return mockTrafficData.slice(-7);
      case '30d':
        return mockTrafficData;
      case '90d':
        return mockTrafficData;
      case '1y':
        return mockTrafficData;
      case 'all':
        return mockTrafficData;
      default:
        return mockTrafficData;
    }
  };
  
  // Filter products based on selected platform and category
  const getFilteredProducts = () => {
    return mockProductPerformance.filter(product => {
      if (selectedPlatform !== 'all' && product.platform !== selectedPlatform) {
        return false;
      }
      return true;
    });
  };
  
  return (
    <div className={`analytics-dashboard ${className}`}>
      {/* Dashboard header with filters */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        
        <div className="flex flex-wrap gap-2">
          {/* Time range selector */}
          <div className="flex space-x-1 bg-neutral-100 rounded-md p-1">
            <button
              className={`px-3 py-1 rounded-md text-sm ${timeRange === '7d' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-600'}`}
              onClick={() => setTimeRange('7d')}
            >
              7D
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${timeRange === '30d' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-600'}`}
              onClick={() => setTimeRange('30d')}
            >
              30D
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${timeRange === '90d' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-600'}`}
              onClick={() => setTimeRange('90d')}
            >
              90D
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${timeRange === '1y' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-600'}`}
              onClick={() => setTimeRange('1y')}
            >
              1Y
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${timeRange === 'all' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-600'}`}
              onClick={() => setTimeRange('all')}
            >
              All
            </button>
          </div>
          
          {/* Comparison period selector */}
          <div className="flex space-x-1 bg-neutral-100 rounded-md p-1">
            <button
              className={`px-3 py-1 rounded-md text-sm ${comparisonPeriod === 'previous' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-600'}`}
              onClick={() => setComparisonPeriod('previous')}
            >
              vs. Previous
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${comparisonPeriod === 'yoy' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-600'}`}
              onClick={() => setComparisonPeriod('yoy')}
            >
              vs. YoY
            </button>
          </div>
          
          {/* Platform filter */}
          <select
            className="form-select text-sm"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="Amazon">Amazon</option>
            <option value="eBay">eBay</option>
            <option value="Walmart">Walmart</option>
            <option value="Etsy">Etsy</option>
          </select>
          
          {/* Category filter */}
          <select
            className="form-select text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Toys & Games">Toys & Games</option>
            <option value="Beauty">Beauty</option>
            <option value="Clothing">Clothing</option>
          </select>
          
          {/* Refresh button */}
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1000);
            }}
          >
            <RefreshCw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          {/* Export button */}
          <button
            className="btn btn-outline btn-sm"
          >
            <Download size={16} className="mr-1" />
            Export
          </button>
        </div>
      </div>
      
      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Revenue Card */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 mb-1">Total Revenue</p>
                {isLoading ? (
                  <div className="skeleton h-8 w-24"></div>
                ) : (
                  <h3 className="text-2xl font-bold">{formatCurrency(summaryMetrics.totalRevenue)}</h3>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <DollarSign size={24} />
              </div>
            </div>
            {!isLoading && (
              <div className="mt-4 flex items-center">
                <span className={`flex items-center ${summaryMetrics.revenueChange >= 0 ? 'text-accent-success' : 'text-accent-danger'}`}>
                  {summaryMetrics.revenueChange >= 0 ? (
                    <ArrowUp size={16} className="mr-1" />
                  ) : (
                    <ArrowDown size={16} className="mr-1" />
                  )}
                  {formatPercentage(summaryMetrics.revenueChange)}
                </span>
                <span className="text-neutral-500 ml-2 text-sm">
                  vs. {comparisonPeriod === 'previous' ? 'previous' : 'last year'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Profit Card */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 mb-1">Total Profit</p>
                {isLoading ? (
                  <div className="skeleton h-8 w-24"></div>
                ) : (
                  <h3 className="text-2xl font-bold">{formatCurrency(summaryMetrics.totalProfit)}</h3>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                <TrendingUp size={24} />
              </div>
            </div>
            {!isLoading && (
              <div className="mt-4 flex items-center">
                <span className={`flex items-center ${summaryMetrics.profitChange >= 0 ? 'text-accent-success' : 'text-accent-danger'}`}>
                  {summaryMetrics.profitChange >= 0 ? (
                    <ArrowUp size={16} className="mr-1" />
                  ) : (
                    <ArrowDown size={16} className="mr-1" />
                  )}
                  {formatPercentage(summaryMetrics.profitChange)}
                </span>
                <span className="text-neutral-500 ml-2 text-sm">
                  vs. {comparisonPeriod === 'previous' ? 'previous' : 'last year'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Sales Card */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 mb-1">Total Sales</p>
                {isLoading ? (
                  <div className="skeleton h-8 w-24"></div>
                ) : (
                  <h3 className="text-2xl font-bold">{summaryMetrics.totalSales}</h3>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-accent-info bg-opacity-20 flex items-center justify-center text-accent-info">
                <ShoppingCart size={24} />
              </div>
            </div>
            {!isLoading && (
              <div className="mt-4 flex items-center">
                <span className={`flex items-center ${summaryMetrics.salesChange >= 0 ? 'text-accent-success' : 'text-accent-danger'}`}>
                  {summaryMetrics.salesChange >= 0 ? (
                    <ArrowUp size={16} className="mr-1" />
                  ) : (
                    <ArrowDown size={16} className="mr-1" />
                  )}
                  {formatPercentage(summaryMetrics.salesChange)}
                </span>
                <span className="text-neutral-500 ml-2 text-sm">
                  vs. {comparisonPeriod === 'previous' ? 'previous' : 'last year'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* ROI Card */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 mb-1">Average ROI</p>
                {isLoading ? (
                  <div className="skeleton h-8 w-24"></div>
                ) : (
                  <h3 className="text-2xl font-bold">{summaryMetrics.averageROI.toFixed(1)}%</h3>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-accent-warning bg-opacity-20 flex items-center justify-center text-accent-warning">
                <BarChart2 size={24} />
              </div>
            </div>
            {!isLoading && (
              <div className="mt-4 flex items-center">
                <span className={`flex items-center ${summaryMetrics.roiChange >= 0 ? 'text-accent-success' : 'text-accent-danger'}`}>
                  {summaryMetrics.roiChange >= 0 ? (
                    <ArrowUp size={16} className="mr-1" />
                  ) : (
                    <ArrowDown size={16} className="mr-1" />
                  )}
                  {formatPercentage(summaryMetrics.roiChange)}
                </span>
                <span className="text-neutral-500 ml-2 text-sm">
                  vs. {comparisonPeriod === 'previous' ? 'previous' : 'last year'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Revenue and Profit Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Revenue & Profit</h3>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="skeleton h-64 w-full"></div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, undefined]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#4338ca" />
                  <Bar dataKey="profit" name="Profit" fill="#10b981" />
                  <Bar dataKey="cost" name="Cost" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        
        {/* Traffic Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Traffic & Conversion</h3>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="skeleton h-64 w-full"></div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getTrafficData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="views" name="Views" stroke="#4338ca" activeDot={{ r: 8 }} />
                  <Line yAxisId="left" type="monotone" dataKey="clicks" name="Clicks" stroke="#10b981" />
                  <Line yAxisId="right" type="monotone" dataKey="conversion" name="Conversions" stroke="#f59e0b" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      
      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Platform Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Sales by Platform</h3>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="skeleton h-64 w-full"></div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockPlatformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockPlatformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        
        {/* Category Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Sales by Category</h3>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="skeleton h-64 w-full"></div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      
      {/* Top Products Table */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="font-semibold">Top Performing Products</h3>
        </div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="py-3 px-4 text-left font-medium text-neutral-500">Product</th>
                  <th className="py-3 px-4 text-left font-medium text-neutral-500">Platform</th>
                  <th className="py-3 px-4 text-left font-medium text-neutral-500">Profit</th>
                  <th className="py-3 px-4 text-left font-medium text-neutral-500">Sales</th>
                  <th className="py-3 px-4 text-left font-medium text-neutral-500">ROI</th>
                  <th className="py-3 px-4 text-left font-medium text-neutral-500">Trend</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(5).fill(0).map((_, index) => (
                    <tr key={index} className="border-t border-neutral-100">
                      <td className="py-3 px-4"><div className="skeleton h-6 w-32"></div></td>
                      <td className="py-3 px-4"><div className="skeleton h-6 w-20"></div></td>
                      <td className="py-3 px-4"><div className="skeleton h-6 w-20"></div></td>
                      <td className="py-3 px-4"><div className="skeleton h-6 w-16"></div></td>
                      <td className="py-3 px-4"><div className="skeleton h-6 w-16"></div></td>
                      <td className="py-3 px-4"><div className="skeleton h-6 w-16"></div></td>
                    </tr>
                  ))
                ) : (
                  getFilteredProducts().map((product) => (
                    <tr key={product.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                      <td className="py-3 px-4 font-medium">{product.name}</td>
                      <td className="py-3 px-4">{product.platform}</td>
                      <td className="py-3 px-4">{formatCurrency(product.profit)}</td>
                      <td className="py-3 px-4">{product.sales}</td>
                      <td className="py-3 px-4">{product.roi}%</td>
                      <td className="py-3 px-4">
                        {product.trend === 'up' ? (
                          <span className="text-accent-success flex items-center">
                            <ArrowUp size={16} className="mr-1" />
                            Up
                          </span>
                        ) : (
                          <span className="text-accent-danger flex items-center">
                            <ArrowDown size={16} className="mr-1" />
                            Down
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Competitor Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Competitor Price Comparison */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Competitor Price Comparison</h3>
          </div>
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="py-3 px-4 text-left font-medium text-neutral-500">Seller</th>
                    <th className="py-3 px-4 text-left font-medium text-neutral-500">Price</th>
                    <th className="py-3 px-4 text-left font-medium text-neutral-500">Rating</th>
                    <th className="py-3 px-4 text-left font-medium text-neutral-500">Shipping</th>
                    <th className="py-3 px-4 text-left font-medium text-neutral-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, index) => (
                      <tr key={index} className="border-t border-neutral-100">
                        <td className="py-3 px-4"><div className="skeleton h-6 w-24"></div></td>
                        <td className="py-3 px-4"><div className="skeleton h-6 w-16"></div></td>
                        <td className="py-3 px-4"><div className="skeleton h-6 w-16"></div></td>
                        <td className="py-3 px-4"><div className="skeleton h-6 w-16"></div></td>
                        <td className="py-3 px-4"><div className="skeleton h-6 w-16"></div></td>
                      </tr>
                    ))
                  ) : (
                    mockCompetitorData.map((competitor, index) => (
                      <tr 
                        key={index} 
                        className={`border-t border-neutral-100 hover:bg-neutral-50 ${
                          competitor.name === 'Your Store' ? 'bg-primary-50' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-medium">{competitor.name}</td>
                        <td className="py-3 px-4">${competitor.price.toFixed(2)}</td>
                        <td className="py-3 px-4">{competitor.rating.toFixed(1)}</td>
                        <td className="py-3 px-4">
                          {competitor.shipping === 0 ? (
                            <span className="text-accent-success">Free</span>
                          ) : (
                            `$${competitor.shipping.toFixed(2)}`
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium">${competitor.total.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Performance Radar Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Performance Metrics</h3>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="skeleton h-64 w-full"></div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius={90} data={mockPerformanceMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Your Store" dataKey="A" stroke="#4338ca" fill="#4338ca" fillOpacity={0.6} />
                  <Radar name="Competitors Avg" dataKey="B" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      
      {/* AI Insights */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="font-semibold flex items-center">
            <Bot size={18} className="mr-2 text-primary-600" />
            AI Insights & Recommendations
          </h3>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="space-y-4">
              <div className="skeleton h-6 w-3/4"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-2/3"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-md">
                <h4 className="font-medium text-primary-800 mb-2">Performance Summary</h4>
                <p className="text-primary-700">
                  Your overall performance is strong with a 12.5% increase in revenue compared to the previous period. 
                  Your profit margins are healthy at 45%, which is above the industry average of 35%.
                </p>
              </div>
              
              <div className="bg-accent-success bg-opacity-10 border-l-4 border-accent-success p-4 rounded-r-md">
                <h4 className="font-medium text-accent-success mb-2">Growth Opportunities</h4>
                <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                  <li>Wireless Earbuds have the highest ROI (85%). Consider increasing inventory by 15-20%.</li>
                  <li>Your Amazon listings are performing 35% better than other platforms. Focus more resources here.</li>
                  <li>Electronics category shows the strongest growth trend. Explore expanding your product range.</li>
                </ul>
              </div>
              
              <div className="bg-accent-warning bg-opacity-10 border-l-4 border-accent-warning p-4 rounded-r-md">
                <h4 className="font-medium text-accent-warning mb-2">Areas for Improvement</h4>
                <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                  <li>Bluetooth Speaker sales are declining. Consider bundling with complementary products or refreshing the listing.</li>
                  <li>Your shipping costs are 12% higher than competitors. Negotiate better rates with carriers.</li>
                  <li>Conversion rate on Etsy (2.1%) is below platform average (3.5%). Optimize your listings with better images and descriptions.</li>
                </ul>
              </div>
              
              <div className="bg-accent-info bg-opacity-10 border-l-4 border-accent-info p-4 rounded-r-md">
                <h4 className="font-medium text-accent-info mb-2">Pricing Strategy Recommendations</h4>
                <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                  <li>Your Smart Watch is priced 10% higher than competitors but still selling well. This suggests strong brand value.</li>
                  <li>Phone Charger price is optimal - you're the second lowest priced seller with good margins.</li>
                  <li>Consider a 5-8% price increase for USB Hub as demand is strong and competitors are priced higher.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Forecast */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold">Sales Forecast</h3>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="skeleton h-64 w-full"></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Actual Revenue" stroke="#4338ca" fill="#4338ca" fillOpacity={0.3} />
                <Area type="monotone" dataKey="profit" name="Actual Profit" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Area type="monotone" dataKey="revenue" name="Forecast Revenue" stroke="#4338ca" strokeDasharray="5 5" fill="none" />
                <Area type="monotone" dataKey="profit" name="Forecast Profit" stroke="#10b981" strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          )}
          
          <div className="mt-4 text-sm text-neutral-500 text-center">
            <p>Forecast based on historical data and seasonal trends. Updated daily.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
