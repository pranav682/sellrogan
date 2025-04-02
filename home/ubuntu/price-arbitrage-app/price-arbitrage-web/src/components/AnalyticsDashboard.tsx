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
(Content truncated due to size limit. Use line ranges to read in chunks)