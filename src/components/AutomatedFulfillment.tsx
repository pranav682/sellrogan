'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Star, X } from 'lucide-react';
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
    trackEvent('order_fulfilled', { 
      orderId, 
      marketplace: updatedOrders[orderIndex].marketplace 
    });
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
    trackEvent('order_completed', { 
      orderId, 
      marketplace: updatedOrders[orderIndex].marketplace 
    });
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
    trackEvent('order_cancelled', { 
      orderId, 
      marketplace: updatedOrders[orderIndex].marketplace 
    });
  };
  
  // Handle viewing order details
  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
  };
  
  // Handle closing order details modal
  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };
  
  // Format currency
  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get marketplace icon
  const getMarketplaceIcon = (marketplace: string) => {
    switch (marketplace) {
      case 'Amazon':
        return <ShoppingBag className="h-4 w-4 text-orange-500" />;
      case 'eBay':
        return <ShoppingBag className="h-4 w-4 text-blue-500" />;
      case 'Walmart':
        return <ShoppingBag className="h-4 w-4 text-blue-700" />;
      case 'Etsy':
        return <ShoppingBag className="h-4 w-4 text-orange-600" />;
      default:
        return <ShoppingBag className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get carrier icon
  const getCarrierIcon = (carrier: string) => {
    switch (carrier) {
      case 'USPS':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'FedEx':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'UPS':
        return <Truck className="h-4 w-4 text-brown-500" />;
      default:
        return <Truck className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Filter orders by status
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });
  
  // Loading state
  if (isLoading) {
    return (
      <div className={`automated-fulfillment ${className}`}>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Order Fulfillment</h2>
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          </div>
          
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`automated-fulfillment ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-600" />
            Order Fulfillment
          </h2>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
          >
            <Zap className="h-4 w-4 mr-1" />
            Settings
          </button>
        </div>
        
        {/* Status tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          {['pending', 'processing', 'completed', 'all'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== 'all' && (
                <span className="ml-1 text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                  {orders.filter(order => order.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* Orders list */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-500">
              {activeTab === 'all'
                ? "You don't have any orders yet."
                : `You don't have any ${activeTab} orders.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="font-medium">{order.id}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getStatusBadgeColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                      <div className="ml-2 flex items-center text-xs text-gray-500">
                        {getMarketplaceIcon(order.marketplace)}
                        <span className="ml-1">{order.marketplace}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-2">
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(order.date)}
                      </div>
                      <div>
                        <span className="font-medium">Customer:</span> {order.customer.name}
                      </div>
                      <div>
                        <span className="font-medium">Items:</span> {order.items.reduce((total: number, item: any) => total + item.quantity, 0)} items, {formatCurrency(order.total)}
                      </div>
                      {order.status === 'processing' && order.source.trackingNumber && (
                        <div className="flex items-center">
                          <span className="font-medium">Tracking:</span>
                          <span className="ml-1">{order.source.trackingNumber}</span>
                          <span className="ml-2 flex items-center">
                            {getCarrierIcon(order.source.carrier)}
                            <span className="ml-1">{order.source.carrier}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleFulfillOrder(order.id)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Fulfill Order
                      </button>
                    )}
                    
                    {order.status === 'processing' && (
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Mark Delivered
                      </button>
                    )}
                    
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleViewOrderDetails(order)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Fulfillment Settings</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Automated Fulfillment</div>
                  <div className="text-sm text-gray-500">Automatically fulfill orders when received</div>
                </div>
                <div>
                  <button
                    onClick={() => setFulfillmentSettings({
                      ...fulfillmentSettings,
                      autoFulfillment: !fulfillmentSettings.autoFulfillment
                    })}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                      fulfillmentSettings.autoFulfillment ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-1"></div>
                  </button>
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-2">Preferred Shipping Method</div>
                <select
                  value={fulfillmentSettings.preferredShippingMethod}
                  onChange={(e) => setFulfillmentSettings({
                    ...fulfillmentSettings,
                    preferredShippingMethod: e.target.value
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="economy">Economy (5-7 days)</option>
                  <option value="standard">Standard (3-5 days)</option>
                  <option value="expedited">Expedited (2-3 days)</option>
                  <option value="overnight">Overnight (1 day)</option>
                </select>
              </div>
              
              <div>
                <div className="font-medium mb-2">Minimum Profit Margin (%)</div>
                <input
                  type="number"
                  value={fulfillmentSettings.minimumProfitMargin}
                  onChange={(e) => setFulfillmentSettings({
                    ...fulfillmentSettings,
                    minimumProfitMargin: parseInt(e.target.value)
                  })}
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Notify on Fulfillment</div>
                  <div className="text-sm text-gray-500">Receive notifications when orders are fulfilled</div>
                </div>
                <div>
                  <button
                    onClick={() => setFulfillmentSettings({
                      ...fulfillmentSettings,
                      notifyOnFulfillment: !fulfillmentSettings.notifyOnFulfillment
                    })}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                      fulfillmentSettings.notifyOnFulfillment ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-1"></div>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Notify on Delivery</div>
                  <div className="text-sm text-gray-500">Receive notifications when orders are delivered</div>
                </div>
                <div>
                  <button
                    onClick={() => setFulfillmentSettings({
                      ...fulfillmentSettings,
                      notifyOnDelivery: !fulfillmentSettings.notifyOnDelivery
                    })}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                      fulfillmentSettings.notifyOnDelivery ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-1"></div>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto Rate Optimization</div>
                  <div className="text-sm text-gray-500">Automatically select the best shipping rate</div>
                </div>
                <div>
                  <button
                    onClick={() => setFulfillmentSettings({
                      ...fulfillmentSettings,
                      autoRateOptimization: !fulfillmentSettings.autoRateOptimization
                    })}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                      fulfillmentSettings.autoRateOptimization ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-1"></div>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">Order Details: {selectedOrder.id}</h3>
              <button
                onClick={handleCloseOrderDetails}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="font-medium">
                          <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusBadgeColor(selectedOrder.status)}`}>
                            {selectedOrder.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Date</div>
                        <div className="font-medium">{formatDate(selectedOrder.date)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Marketplace</div>
                        <div className="font-medium flex items-center">
                          {getMarketplaceIcon(selectedOrder.marketplace)}
                          <span className="ml-1">{selectedOrder.marketplace}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Total</div>
                        <div className="font-medium">{formatCurrency(selectedOrder.total)}</div>
                      </div>
                      {selectedOrder.status === 'processing' && selectedOrder.source.trackingNumber && (
                        <>
                          <div>
                            <div className="text-sm text-gray-500">Tracking Number</div>
                            <div className="font-medium">{selectedOrder.source.trackingNumber}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Carrier</div>
                            <div className="font-medium flex items-center">
                              {getCarrierIcon(selectedOrder.source.carrier)}
                              <span className="ml-1">{selectedOrder.source.carrier}</span>
                            </div>
                          </div>
                        </>
                      )}
                      {selectedOrder.status === 'completed' && selectedOrder.deliveredDate && (
                        <div>
                          <div className="text-sm text-gray-500">Delivered Date</div>
                          <div className="font-medium">{formatDate(selectedOrder.deliveredDate)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mt-4 mb-2">Customer Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-gray-500">Name</div>
                        <div className="font-medium">{selectedOrder.customer.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium">{selectedOrder.customer.email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium">{selectedOrder.customer.phone}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Shipping Address</div>
                        <div className="font-medium">{selectedOrder.customer.address}</div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedOrder.feedback && (
                    <>
                      <h4 className="font-medium text-gray-900 mt-4 mb-2">Customer Feedback</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
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
                          <div className="text-sm text-gray-700 italic">
                            "{selectedOrder.feedback.comment}"
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-4">
                      {selectedOrder.items.map((item: any) => (
                        <div key={item.id} className="flex items-center">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="ml-3 flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">
                              {item.quantity} × {formatCurrency(item.price)}
                            </div>
                          </div>
                          <div className="font-medium">
                            {formatCurrency(parseFloat(item.price) * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatCurrency(
                          selectedOrder.items.reduce(
                            (total: number, item: any) => total + (parseFloat(item.price) * item.quantity), 
                            0
                          )
                        )}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span>Shipping</span>
                        <span>{formatCurrency(selectedOrder.shipping)}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span>Tax</span>
                        <span>{formatCurrency(selectedOrder.tax)}</span>
                      </div>
                      <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mt-4 mb-2">Source Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-gray-500">Supplier</div>
                        <div className="font-medium">{selectedOrder.source.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Cost</div>
                        <div className="font-medium">{formatCurrency(selectedOrder.source.price)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Shipping Cost</div>
                        <div className="font-medium">{formatCurrency(selectedOrder.source.shipping)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Profit</div>
                        <div className="font-medium text-green-600">{formatCurrency(selectedOrder.profit)}</div>
                      </div>
                      {selectedOrder.source.estimatedDelivery && (
                        <div>
                          <div className="text-sm text-gray-500">Estimated Delivery</div>
                          <div className="font-medium">{formatDate(selectedOrder.source.estimatedDelivery)}</div>
                        </div>
                      )}
                      {selectedOrder.source.orderNumber && (
                        <div>
                          <div className="text-sm text-gray-500">Supplier Order Number</div>
                          <div className="font-medium">{selectedOrder.source.orderNumber}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              {selectedOrder.status === 'pending' && (
                <button
                  onClick={() => {
                    handleFulfillOrder(selectedOrder.id);
                    handleCloseOrderDetails();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
                >
                  Fulfill Order
                </button>
              )}
              
              {selectedOrder.status === 'processing' && (
                <button
                  onClick={() => {
                    handleCompleteOrder(selectedOrder.id);
                    handleCloseOrderDetails();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2"
                >
                  Mark Delivered
                </button>
              )}
              
              {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                <button
                  onClick={() => {
                    handleCancelOrder(selectedOrder.id);
                    handleCloseOrderDetails();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-2"
                >
                  Cancel Order
                </button>
              )}
              
              <button
                onClick={handleCloseOrderDetails}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AutomatedFulfillment;
