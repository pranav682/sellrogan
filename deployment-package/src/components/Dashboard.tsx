import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, ShoppingCart, Truck } from 'lucide-react';

interface DashboardProps {
  className?: string;
}

// Mock data for dashboard
const mockProfitData = [
  { name: 'Jan', profit: 4000, revenue: 6000, cost: 2000 },
  { name: 'Feb', profit: 3000, revenue: 5500, cost: 2500 },
  { name: 'Mar', profit: 5000, revenue: 8000, cost: 3000 },
  { name: 'Apr', profit: 2780, revenue: 5000, cost: 2220 },
  { name: 'May', profit: 1890, revenue: 4500, cost: 2610 },
  { name: 'Jun', profit: 2390, revenue: 5200, cost: 2810 },
  { name: 'Jul', profit: 3490, revenue: 6200, cost: 2710 },
];

const mockPlatformData = [
  { name: 'Amazon', value: 45, color: '#FF9900' },
  { name: 'eBay', value: 25, color: '#E53238' },
  { name: 'Walmart', value: 15, color: '#0071DC' },
  { name: 'Etsy', value: 10, color: '#F1641E' },
  { name: 'Others', value: 5, color: '#6B7280' },
];

const mockProductPerformance = [
  { id: 1, name: 'Wireless Earbuds', profit: 1250, sales: 125, roi: 85, trend: 'up' },
  { id: 2, name: 'Smart Watch', profit: 980, sales: 49, roi: 65, trend: 'up' },
  { id: 3, name: 'Bluetooth Speaker', profit: 750, sales: 75, roi: 50, trend: 'down' },
  { id: 4, name: 'Phone Charger', profit: 450, sales: 150, roi: 40, trend: 'up' },
  { id: 5, name: 'Laptop Stand', profit: 320, sales: 32, roi: 35, trend: 'down' },
];

const Dashboard: React.FC<DashboardProps> = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [averageROI, setAverageROI] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate summary metrics
  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    
    setTimeout(() => {
      // Calculate total profit
      const profit = mockProductPerformance.reduce((sum, product) => sum + product.profit, 0);
      setTotalProfit(profit);
      
      // Calculate total sales
      const sales = mockProductPerformance.reduce((sum, product) => sum + product.sales, 0);
      setTotalSales(sales);
      
      // Calculate average ROI
      const roi = mockProductPerformance.reduce((sum, product) => sum + product.roi, 0) / mockProductPerformance.length;
      setAverageROI(roi);
      
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={`dashboard ${className}`}>
      {/* Time range selector */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md ${timeRange === 'week' ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-700'}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 rounded-md ${timeRange === 'month' ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-700'}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 rounded-md ${timeRange === 'year' ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-700'}`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Profit Card */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 mb-1">Total Profit</p>
                {isLoading ? (
                  <div className="skeleton h-8 w-24"></div>
                ) : (
                  <h3 className="text-2xl font-bold">{formatCurrency(totalProfit)}</h3>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <DollarSign size={24} />
              </div>
            </div>
            {!isLoading && (
              <div className="mt-4 flex items-center">
                <span className="text-accent-success flex items-center">
                  <ArrowUp size={16} className="mr-1" />
                  12.5%
                </span>
                <span className="text-neutral-500 ml-2 text-sm">vs last {timeRange}</span>
              </div>
            )}
          </div>
        </div>

        {/* Total Sales Card */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 mb-1">Total Sales</p>
                {isLoading ? (
                  <div className="skeleton h-8 w-24"></div>
                ) : (
                  <h3 className="text-2xl font-bold">{totalSales}</h3>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                <ShoppingCart size={24} />
              </div>
            </div>
            {!isLoading && (
              <div className="mt-4 flex items-center">
                <span className="text-accent-success flex items-center">
                  <ArrowUp size={16} className="mr-1" />
                  8.3%
                </span>
                <span className="text-neutral-500 ml-2 text-sm">vs last {timeRange}</span>
              </div>
            )}
          </div>
        </div>

        {/* Average ROI Card */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 mb-1">Average ROI</p>
                {isLoading ? (
                  <div className="skeleton h-8 w-24"></div>
                ) : (
                  <h3 className="text-2xl font-bold">{averageROI.toFixed(1)}%</h3>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-accent-info bg-opacity-20 flex items-center justify-center text-accent-info">
                <TrendingUp size={24} />
              </div>
            </div>
            {!isLoading && (
              <div className="mt-4 flex items-center">
                <span className="text-accent-danger flex items-center">
                  <ArrowDown size={16} className="mr-1" />
                  2.1%
                </span>
                <span className="text-neutral-500 ml-2 text-sm">vs last {timeRange}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Profit Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Profit Overview</h3>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="skeleton h-64 w-full"></div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockProfitData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, undefined]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#4338ca" />
                  <Bar dataKey="cost" name="Cost" fill="#ef4444" />
                  <Bar dataKey="profit" name="Profit" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

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
      </div>

      {/* Top Products Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold">Top Performing Products</h3>
        </div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="py-3 px-4 text-left font-medium text-neutral-500">Product</th>
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
                      <td className="py-3 px-4"><div className="skeleton h-6 w-16"></div></td>
                      <td className="py-3 px-4"><div className="skeleton h-6 w-16"></div></td>
                      <td className="py-3 px-4"><div className="skeleton h-6 w-16"></div></td>
                    </tr>
                  ))
                ) : (
                  mockProductPerformance.map((product) => (
                    <tr key={product.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                      <td className="py-3 px-4 font-medium">{product.name}</td>
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

      {/* AI Insights */}
      <div className="mt-6">
        <div className="ai-suggestion">
          <h4 className="font-medium mb-2 flex items-center">
            <Bot size={18} className="mr-2 text-primary-600" />
            AI Insights
          </h4>
          <p className="mb-2">Based on your sales data, here are some recommendations:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Wireless Earbuds have the highest ROI. Consider increasing inventory by 15%.</li>
            <li>Bluetooth Speaker sales are declining. Try bundling with complementary products.</li>
            <li>Amazon is your best performing platform. Optimize your listings with A+ content.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
