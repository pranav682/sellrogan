'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserDataContext } from '@/lib/userDataService';
import { 
  ShoppingBag, 
  ArrowRight, 
  DollarSign, 
  TrendingUp, 
  BarChart2, 
  Zap, 
  Check,
  Truck,
  Package,
  CreditCard
} from 'lucide-react';

interface AutomatedFulfillmentProps {
  className?: string;
}

const AutomatedFulfillment: React.FC<AutomatedFulfillmentProps> = ({ className = '' }) => {
  // Use user data context
  const { userData, trackEvent } = React.useContext(UserDataContext);
  
  // State for orders
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  
  // State for fulfillment settings
  const [fulfillmentSettings, setFulfillmentSettings] = useState({
    autoFulfillment: true,
    preferredShippingMethod: 'standard',
    minimumProfitMargin: 15,
    notifyOnFulfillment: true,
    notifyOnDelivery: true,
    autoRateOptimization: true
  });
  
  // State for settings modal
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // State for order details modal
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Load mock orders on mount
  useEffect(() => {
    // Simulate API call to load orders
    setIsLoading(true);
    setTimeout(() => {
      setOrders(generateMockOrders());
      setIsLoading(false);
    }, 1500);
  }, []);
  
  // Generate mock orders
  const generateMockOrders = () => {
    const mockOrders = [];
    
    // Pending orders
    for (let i = 0; i < 3; i++) {
      mockOrders.push({
        id: `ORD-${1000 + i}`,
        status: 'pending',
        date: new Date(Date.now() - i * 86400000).toISOString(), // days ago
        customer: {
          name: `Customer ${i + 1}`,
          email: `customer${i + 1}@example.com`,
          address: `${100 + i} Main St, City, State, 10000`,
          phone: `(555) 555-${1000 + i}`
        },
        items: [
          {
            id: `ITEM-${2000 + i}`,
            name: `Product ${i + 1}`,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: (Math.random() * 50 + 20).toFixed(2),
            image: `https://via.placeholder.com/50?text=Product${i+1}`
          }
        ],
        marketplace: ['Amazon', 'eBay', 'Walmart', 'Etsy'][i % 4],
        total: (Math.random() * 100 + 30).toFixed(2),
        shipping: (Math.random() * 10 + 5).toFixed(2),
        tax: (Math.random() * 8 + 2).toFixed(2),
        profit: (Math.random() * 20 + 10).toFixed(2),
        source: {
          name: ['SupplierA', 'SupplierB', 'SupplierC'][i % 3],
          price: (Math.random() * 40 + 10).toFixed(2),
          shipping: (Math.random() * 8 + 2).toFixed(2),
          estimatedDelivery: new Date(Date.now() + (Math.floor(Math.random() * 5) + 3) * 86400000).toISOString()
        }
      });
    }
    
    // Processing orders
    for (let i = 0; i < 2; i++) {
      mockOrders.push({
        id: `ORD-${1100 + i}`,
        status: 'processing',
        date: new Date(Date.now() - (i + 3) * 86400000).toISOString(), // days ago
        customer: {
          name: `Customer ${i + 4}`,
          email: `customer${i + 4}@example.com`,
          address: `${200 + i} Main St, City, State, 10000`,
          phone: `(555) 555-${1100 + i}`
        },
        items: [
          {
            id: `ITEM-${2100 + i}`,
            name: `Product ${i + 4}`,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: (Math.random() * 50 + 20).toFixed(2),
            image: `https://via.placeholder.com/50?text=Product${i+4}`
          }
        ],
        marketplace: ['Amazon', 'eBay', 'Walmart', 'Etsy'][(i + 2) % 4],
        total: (Math.random() * 100 + 30).toFixed(2),
        shipping: (Math.random() * 10 + 5).toFixed(2),
        tax: (Math.random() * 8 + 2).toFixed(2),
        profit: (Math.random() * 20 + 10).toFixed(2),
        source: {
          name: ['SupplierA', 'SupplierB', 'SupplierC'][(i + 1) % 3],
          price: (Math.random() * 40 + 10).toFixed(2),
          shipping: (Math.random() * 8 + 2).toFixed(2),
          estimatedDelivery: new Date(Date.now() + (Math.floor(Math.random() * 5) + 3) * 86400000).toISOString(),
          orderNumber: `SUP-${5000 + i}`,
          trackingNumber: `TRK-${9000 + i}`,
          carrier: ['USPS', 'FedEx', 'UPS'][i % 3]
        }
      });
    }
    
    // Completed orders
    for (let i = 0; i < 4; i++) {
      mockOrders.push({
        id: `ORD-${1200 + i}`,
        status: 'completed',
        date: new Date(Date.now() - (i + 5) * 86400000).toISOString(), // days ago
        deliveredDate: new Date(Date.now() - (i + 2) * 86400000).toISOString(),
        customer: {
          name: `Customer ${i + 6}`,
          email: `customer${i + 6}@example.com`,
          address: `${300 + i} Main St, City, State, 10000`,
          phone: `(555) 555-${1200 + i}`
        },
        items: [
          {
            id: `ITEM-${2200 + i}`,
            name: `Product ${i + 6}`,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: (Math.random() * 50 + 20).toFixed(2),
            image: `https://via.placeholder.com/50?text=Product${i+6}`
          }
        ],
        marketplace: ['Amazon', 'eBay', 'Walmart', 'Etsy'][(i + 1) % 4],
        total: (Math.random() * 100 + 30).toFixed(2),
        shipping: (Math.random() * 10 + 5).toFixed(2),
        tax: (Math.random() * 8 + 2).toFixed(2),
        profit: (Math.random() * 20 + 10).toFixed(2),
        source: {
          name: ['SupplierA', 'SupplierB', 'SupplierC'][(i + 2) % 3],
          price: (Math.random() * 40 + 10).toFixed(2),
          shipping: (Math.random() * 8 + 2).toFixed(2),
          orderNumber: `SUP-${5100 + i}`,
          trackingNumber: `TRK-${9100 + i}`,
          carrier: ['USPS', 'FedEx', 'UPS'][(i + 1) % 3]
        },
        feedback: {
          rating: Math.floor(Math.random() * 2) + 4,
          comment: i % 3 === 0 ? 'Great product, fast shipping!' : null
        }
      });
    }
    
    return mockOrders;
  };
  
  // Handle fulfilling an order
  const handleFulfillOrder = (orderId: string) => {
    // Find the order
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    // Update order status
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = {
      ...updatedOrders[orderIndex],
      status: 'processing',
      source: {
        ...updatedOrders[orderIndex].source,
        orderNumber: `SUP-${Math.floor(Math.random() * 1000) + 5000}`,
        trackingNumber: `TRK-${Math.floor(Math.random() * 1000) + 9000}`,
        carrier: ['USPS', 'FedEx', 'UPS'][Math.floor(Math.random() * 3)]
      }
    };
    
    setOrders(updatedOrders);
    
    // Track event
    trackEvent('order_fulfilled', { orderId });
    
    // Close order details if open
    setSelectedOrder(null);
  };
  
  // Handle completing an order
  const handleCompleteOrder = (orderId: string) => {
    // Find the order
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    // Update order status
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = {
      ...updatedOrders[orderIndex],
      status: 'completed',
      deliveredDate: new Date().toISOString()
    };
    
    setOrders(updatedOrders);
    
    // Track event
    trackEvent('order_completed', { orderId });
    
    // Close order details if open
    setSelectedOrder(null);
  };
  
  // Handle cancelling an order
  const handleCancelOrder = (orderId: string) => {
    // Find the order
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    // Update order status
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = {
      ...updatedOrders[orderIndex],
      status: 'cancelled',
      cancelledDate: new Date().toISOString()
    };
    
    setOrders(updatedOrders);
    
    // Track event
    trackEvent('order_cancelled', { orderId });
    
    // Close order details if open
    setSelectedOrder(null);
  };
  
  // Handle updating fulfillment settings
  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track event
    trackEvent('fulfillment_settings_updated', { settings: fulfillmentSettings });
    
    // Close settings modal
    setShowSettingsModal(false);
  };
  
  // Format currency
  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(typeof value === 'string' ? parseFloat(value) : value);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get filtered orders based on active tab
  const getFilteredOrders = () => {
    return orders.filter(order => {
      if (activeTab === 'all') return true;
      return order.status === activeTab;
    });
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Processing
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };
  
  // Get marketplace badge
  const getMarketplaceBadge = (marketplace: string) => {
    switch (marketplace.toLowerCase()) {
      case 'amazon':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Amazon
          </span>
        );
      case 'ebay':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            eBay
          </span>
        );
      case 'walmart':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Walmart
          </span>
        );
      case 'etsy':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Etsy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {marketplace}
          </span>
        );
    }
  };
  
  return (
    <div className={`automated-fulfillment ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-600" />
            Automated Order Fulfillment
          </h2>
          
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 flex items-center"
          >
            <Zap className="h-4 w-4 mr-1" />
            Fulfillment Settings
          </button>
        </div>
        
        {/* Auto-fulfillment status */}
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          fulfillmentSettings.autoFulfillment 
            ? 'bg-green-50 text-green-700' 
            : 'bg-yellow-50 text-yellow-700'
        }`}>
          {fulfillmentSettings.autoFulfillment ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Automated fulfillment is enabled</p>
                <p className="text-sm">New orders will be automatically fulfilled from the optimal source.</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Automated fulfillment is disabled</p>
                <p className="text-sm">You'll need to manually fulfill new orders.</p>
              </div>
            </>
          )}
        </div>
        
        {/* Order tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6">
            {['pending', 'processing', 'completed', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab !== 'all' && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {orders.filter(order => order.status === tab).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Orders list */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-gray-600">Loading orders...</p>
          </div>
        ) : getFilteredOrders().length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No {activeTab !== 'all' ? activeTab : ''} orders found</h3>
            <p className="text-gray-500">
              {activeTab === 'pending' 
                ? 'When you receive new orders, they will appear here.'
                : activeTab === 'processing'
                ? 'Orders being fulfilled will appear here.'
                : activeTab === 'completed'
                ? 'Completed orders will appear here.'
                : 'You don\'t have any orders yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marketplace
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredOrders().map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                        {order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">{order.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getMarketplaceBadge(order.marketplace)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(order.total)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600 font-medium">{formatCurrency(order.profit)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(order.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleFulfillOrder(order.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Fulfill
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="h-2 rounded-t-lg bg-blue-600"></div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-600" />
                Fulfillment Settings
              </h3>
              
              <form onSubmit={handleUpdateSettings}>
                <div className="space-y-4">
                  {/* Auto-fulfillment toggle */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="autoFulfillment"
                        name="autoFulfillment"
                        type="checkbox"
                        checked={fulfillmentSettings.autoFulfillment}
                        onChange={(e) => setFulfillmentSettings({
                          ...fulfillmentSettings,
                          autoFulfillment: e.target.checked
                        })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="autoFulfillment" className="font-medium text-gray-700">
                        Enable automated fulfillment
                      </label>
                      <p className="text-gray-500">
                        Automatically place orders with suppliers when you receive a new order.
                      </p>
                    </div>
                  </div>
                  
                  {/* Preferred shipping method */}
                  <div>
                    <label htmlFor="preferredShippingMethod" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred shipping method
                    </label>
                    <select
                      id="preferredShippingMethod"
                      name="preferredShippingMethod"
                      value={fulfillmentSettings.preferredShippingMethod}
                      onChange={(e) => setFulfillmentSettings({
                        ...fulfillmentSettings,
                        preferredShippingMethod: e.target.value
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="economy">Economy (5-7 days)</option>
                      <option value="standard">Standard (3-5 days)</option>
                      <option value="expedited">Expedited (2-3 days)</option>
                      <option value="priority">Priority (1-2 days)</option>
                    </select>
                  </div>
                  
                  {/* Minimum profit margin */}
                  <div>
                    <label htmlFor="minimumProfitMargin" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum profit margin (%)
                    </label>
                    <input
                      type="number"
                      id="minimumProfitMargin"
                      name="minimumProfitMargin"
                      min="0"
                      max="100"
                      value={fulfillmentSettings.minimumProfitMargin}
                      onChange={(e) => setFulfillmentSettings({
                        ...fulfillmentSettings,
                        minimumProfitMargin: parseInt(e.target.value)
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Orders with profit margins below this threshold will require manual approval.
                    </p>
                  </div>
                  
                  {/* Notification settings */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Notifications</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="notifyOnFulfillment"
                          name="notifyOnFulfillment"
                          type="checkbox"
                          checked={fulfillmentSettings.notifyOnFulfillment}
                          onChange={(e) => setFulfillmentSettings({
                            ...fulfillmentSettings,
                            notifyOnFulfillment: e.target.checked
                          })}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="notifyOnFulfillment" className="ml-2 text-sm text-gray-700">
                          Notify me when an order is fulfilled
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="notifyOnDelivery"
                          name="notifyOnDelivery"
                          type="checkbox"
                          checked={fulfillmentSettings.notifyOnDelivery}
                          onChange={(e) => setFulfillmentSettings({
                            ...fulfillmentSettings,
                            notifyOnDelivery: e.target.checked
                          })}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="notifyOnDelivery" className="ml-2 text-sm text-gray-700">
                          Notify me when an order is delivered
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Advanced settings */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Advanced Settings</h4>
                    <div className="flex items-center">
                      <input
                        id="autoRateOptimization"
                        name="autoRateOptimization"
                        type="checkbox"
                        checked={fulfillmentSettings.autoRateOptimization}
                        onChange={(e) => setFulfillmentSettings({
                          ...fulfillmentSettings,
                          autoRateOptimization: e.target.checked
                        })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="autoRateOptimization" className="ml-2 text-sm text-gray-700">
                        Automatically optimize shipping rates
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Compare shipping rates across carriers to find the best option.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className={`h-2 rounded-t-lg ${
              selectedOrder.status === 'pending' ? 'bg-yellow-500' :
              selectedOrder.status === 'processing' ? 'bg-blue-600' :
              selectedOrder.status === 'completed' ? 'bg-green-500' :
              'bg-red-500'
            }`}></div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold flex items-center">
                    <Package className="h-5 w-5 mr-2 text-blue-600" />
                    Order {selectedOrder.id}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {formatDate(selectedOrder.date)}
                  </p>
                </div>
                
                <div className="flex items-center">
                  {getStatusBadge(selectedOrder.status)}
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="ml-4 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Customer Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Name:</span> {selectedOrder.customer.name}</p>
                    <p><span className="text-gray-500">Email:</span> {selectedOrder.customer.email}</p>
                    <p><span className="text-gray-500">Phone:</span> {selectedOrder.customer.phone}</p>
                    <p><span className="text-gray-500">Address:</span> {selectedOrder.customer.address}</p>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Marketplace:</span> {selectedOrder.marketplace}</p>
                    <p><span className="text-gray-500">Total:</span> {formatCurrency(selectedOrder.total)}</p>
                    <p><span className="text-gray-500">Shipping:</span> {formatCurrency(selectedOrder.shipping)}</p>
                    <p><span className="text-gray-500">Tax:</span> {formatCurrency(selectedOrder.tax)}</p>
                    <p className="font-medium text-green-600">
                      <span className="text-gray-500 font-normal">Profit:</span> {formatCurrency(selectedOrder.profit)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Order Items</h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-10 w-10 rounded-md mr-3"
                              />
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatCurrency(parseFloat(item.price) * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Fulfillment Information */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Fulfillment Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Supplier:</span> {selectedOrder.source.name}</p>
                    <p><span className="text-gray-500">Cost:</span> {formatCurrency(selectedOrder.source.price)}</p>
                    <p><span className="text-gray-500">Shipping:</span> {formatCurrency(selectedOrder.source.shipping)}</p>
                    
                    {selectedOrder.status === 'pending' && (
                      <p><span className="text-gray-500">Estimated Delivery:</span> {formatDate(selectedOrder.source.estimatedDelivery)}</p>
                    )}
                    
                    {(selectedOrder.status === 'processing' || selectedOrder.status === 'completed') && (
                      <>
                        <p><span className="text-gray-500">Order Number:</span> {selectedOrder.source.orderNumber}</p>
                        <p><span className="text-gray-500">Tracking Number:</span> {selectedOrder.source.trackingNumber}</p>
                        <p><span className="text-gray-500">Carrier:</span> {selectedOrder.source.carrier}</p>
                        {selectedOrder.status === 'processing' && (
                          <p><span className="text-gray-500">Estimated Delivery:</span> {formatDate(selectedOrder.source.estimatedDelivery)}</p>
                        )}
                      </>
                    )}
                    
                    {selectedOrder.status === 'completed' && selectedOrder.deliveredDate && (
                      <p><span className="text-gray-500">Delivered On:</span> {formatDate(selectedOrder.deliveredDate)}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Customer Feedback */}
              {selectedOrder.status === 'completed' && selectedOrder.feedback && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Customer Feedback</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${
                              i < selectedOrder.feedback.rating 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {selectedOrder.feedback.rating}/5
                      </span>
                    </div>
                    
                    {selectedOrder.feedback.comment && (
                      <p className="text-sm text-gray-600 italic">
                        "{selectedOrder.feedback.comment}"
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                
                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => handleFulfillOrder(selectedOrder.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Truck className="h-4 w-4 mr-1" />
                    Fulfill Order
                  </button>
                )}
                
                {selectedOrder.status === 'processing' && (
                  <button
                    onClick={() => handleCompleteOrder(selectedOrder.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark as Delivered
                  </button>
                )}
                
                {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AutomatedFulfillment;
