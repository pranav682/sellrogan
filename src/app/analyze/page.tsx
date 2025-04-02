'use client';

import React, { useState } from 'react';
import { BarChart2, DollarSign, ArrowRight, ArrowDown } from 'lucide-react';

export default function AnalyzePage() {
  const [product, setProduct] = useState({
    name: 'Wireless Bluetooth Headphones',
    cost: 25.99,
    shipping: 4.99,
    platforms: [
      { id: 'amazon', name: 'Amazon', fees: 0.15, subscription: 39.99, shipping: 3.99 },
      { id: 'ebay', name: 'eBay', fees: 0.1, insertion: 0.35, shipping: 4.99 },
      { id: 'etsy', name: 'Etsy', fees: 0.05, listing: 0.20, shipping: 5.99 },
      { id: 'walmart', name: 'Walmart', fees: 0.12, shipping: 0 },
      { id: 'shopify', name: 'Shopify', fees: 0.02, subscription: 29.99, shipping: 5.99 }
    ]
  });
  
  const [pricingStrategy, setPricingStrategy] = useState<'competitive' | 'premium' | 'economy'>('competitive');
  const [offerFreeShipping, setOfferFreeShipping] = useState(false);
  const [customPrice, setCustomPrice] = useState('');
  
  // Calculate pricing based on strategy
  const calculatePrice = (platformId: string) => {
    const platform = product.platforms.find(p => p.id === platformId);
    if (!platform) return 0;
    
    let markup = 0;
    switch (pricingStrategy) {
      case 'premium':
        markup = 0.5; // 50% markup
        break;
      case 'competitive':
        markup = 0.3; // 30% markup
        break;
      case 'economy':
        markup = 0.15; // 15% markup
        break;
    }
    
    if (customPrice && !isNaN(parseFloat(customPrice))) {
      return parseFloat(customPrice);
    }
    
    return product.cost * (1 + markup);
  };
  
  // Calculate fees for a platform
  const calculateFees = (platformId: string) => {
    const platform = product.platforms.find(p => p.id === platformId);
    if (!platform) return 0;
    
    const price = calculatePrice(platformId);
    let fees = price * platform.fees;
    
    if (platform.subscription) {
      // Assume 30 sales per month to distribute subscription cost
      fees += platform.subscription / 30;
    }
    
    if (platform.insertion) {
      fees += platform.insertion;
    }
    
    if (platform.listing) {
      fees += platform.listing;
    }
    
    return fees;
  };
  
  // Calculate shipping cost
  const calculateShippingCost = (platformId: string) => {
    if (!offerFreeShipping) return 0;
    
    const platform = product.platforms.find(p => p.id === platformId);
    if (!platform) return 0;
    
    return platform.shipping || product.shipping;
  };
  
  // Calculate profit for a platform
  const calculateProfit = (platformId: string) => {
    const price = calculatePrice(platformId);
    const fees = calculateFees(platformId);
    const shippingCost = calculateShippingCost(platformId);
    
    return price - product.cost - fees - shippingCost;
  };
  
  // Calculate ROI for a platform
  const calculateROI = (platformId: string) => {
    const profit = calculateProfit(platformId);
    return (profit / product.cost) * 100;
  };
  
  // Sort platforms by profit
  const sortedPlatforms = [...product.platforms].sort((a, b) => {
    return calculateProfit(b.id) - calculateProfit(a.id);
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Profit Analysis</h1>
      
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Product Information */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Product Information</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Price ($)
                </label>
                <input
                  type="number"
                  value={product.cost}
                  onChange={(e) => setProduct({ ...product, cost: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Cost ($)
                </label>
                <input
                  type="number"
                  value={product.shipping}
                  onChange={(e) => setProduct({ ...product, shipping: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Pricing Strategy</h2>
              <div className="mb-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all mb-2 ${
                    pricingStrategy === 'competitive'
                      ? 'border-blue-600 bg-blue-50 shadow-sm'
                      : 'hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => setPricingStrategy('competitive')}
                >
                  <h4 className="font-medium mb-1">Competitive</h4>
                  <p className="text-sm text-gray-600">30% markup - Balance between profit and sales volume.</p>
                </div>
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all mb-2 ${
                    pricingStrategy === 'premium'
                      ? 'border-blue-600 bg-blue-50 shadow-sm'
                      : 'hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => setPricingStrategy('premium')}
                >
                  <h4 className="font-medium mb-1">Premium</h4>
                  <p className="text-sm text-gray-600">50% markup - Higher profit margin but potentially fewer sales.</p>
                </div>
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    pricingStrategy === 'economy'
                      ? 'border-blue-600 bg-blue-50 shadow-sm'
                      : 'hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => setPricingStrategy('economy')}
                >
                  <h4 className="font-medium mb-1">Economy</h4>
                  <p className="text-sm text-gray-600">15% markup - Lower profit margin but potentially more sales.</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Price ($) <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="Enter custom price"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={offerFreeShipping}
                    onChange={(e) => setOfferFreeShipping(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2">Offer Free Shipping (absorb shipping cost)</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Analysis Results */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Profit Analysis</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedPlatforms.map((platform) => (
                      <tr key={platform.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-medium">{platform.name}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          ${calculatePrice(platform.id).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          ${calculateFees(platform.id).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right font-medium">
                          <span className={calculateProfit(platform.id) > 0 ? 'text-green-600' : 'text-red-600'}>
                            ${calculateProfit(platform.id).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <span className={calculateROI(platform.id) > 0 ? 'text-blue-600' : 'text-red-600'}>
                            {calculateROI(platform.id).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Best Platform Recommendation</h2>
              {sortedPlatforms.length > 0 && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-lg">{sortedPlatforms[0].name}</h3>
                      <p className="text-gray-600">Highest profit potential</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">${calculateProfit(sortedPlatforms[0].id).toFixed(2)}</div>
                      <div className="text-blue-600">{calculateROI(sortedPlatforms[0].id).toFixed(1)}% ROI</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Cost</p>
                      <p className="font-medium">${product.cost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Selling Price</p>
                      <p className="font-medium">${calculatePrice(sortedPlatforms[0].id).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fees</p>
                      <p className="font-medium">${calculateFees(sortedPlatforms[0].id).toFixed(2)}</p>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full">
                    Create Listing on {sortedPlatforms[0].name}
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Profit Breakdown</h2>
              {sortedPlatforms.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">For {sortedPlatforms[0].name}</h3>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            Cost: ${product.cost.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                            Profit: ${calculateProfit(sortedPlatforms[0].id).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        <div style={{ width: `${(product.cost / calculatePrice(sortedPlatforms[0].id)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                        <div style={{ width: `${(calculateFees(sortedPlatforms[0].id) / calculatePrice(sortedPlatforms[0].id)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                        <div style={{ width: `${(calculateShippingCost(sortedPlatforms[0].id) / calculatePrice(sortedPlatforms[0].id)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
                        <div style={{ width: `${(calculateProfit(sortedPlatforms[0].id) / calculatePrice(sortedPlatforms[0].id)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                      </div>
                      <div className="flex text-xs justify-between">
                        <span>Cost: ${product.cost.toFixed(2)}</span>
                        <span>Fees: ${calculateFees(sortedPlatforms[0].id).toFixed(2)}</span>
                        {offerFreeShipping && (
                          <span>Shipping: ${calculateShippingCost(sortedPlatforms[0].id).toFixed(2)}</span>
                        )}
                        <span>Profit: ${calculateProfit(sortedPlatforms[0].id).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Monthly Projection</h3>
                      <div className="border rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">10 Sales/Month</p>
                            <p className="font-medium text-green-600">${(calculateProfit(sortedPlatforms[0].id) * 10).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">30 Sales/Month</p>
                            <p className="font-medium text-green-600">${(calculateProfit(sortedPlatforms[0].id) * 30).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">50 Sales/Month</p>
                            <p className="font-medium text-green-600">${(calculateProfit(sortedPlatforms[0].id) * 50).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">100 Sales/Month</p>
                            <p className="font-medium text-green-600">${(calculateProfit(sortedPlatforms[0].id) * 100).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Break-Even Analysis</h3>
                      <div className="border rounded-lg p-4">
                        <p className="text-sm mb-2">You need to sell <span className="font-bold">{Math.ceil(product.cost / calculateProfit(sortedPlatforms[0].id))}</span> units to break even on your investment.</p>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                          <span className="ml-2 text-sm">30%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
