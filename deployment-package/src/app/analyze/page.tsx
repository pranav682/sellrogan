'use client';

import { useState, useEffect } from 'react';
import { BarChart, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';

interface ProductSource {
  id: number;
  name: string;
  price: number;
  source: string;
  url: string;
  reliability: number;
  shipping: number;
  total: number;
  image?: string;
}

interface SellingPlatform {
  id: number;
  name: string;
  baseFee: number;
  percentageFee: number;
  averagePrice?: number;
  recommendedPrice?: number;
  estimatedProfit?: number;
  roi?: number;
}

export default function ProfitAnalysisPage() {
  const [product, setProduct] = useState<ProductSource | null>(null);
  const [sellingPlatforms, setSellingPlatforms] = useState<SellingPlatform[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<SellingPlatform | null>(null);
  const [customPrice, setCustomPrice] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListing, setIsListing] = useState(false);
  
  // Mock function to simulate fetching product data
  // In a real implementation, this would come from URL params or state
  useEffect(() => {
    const mockProduct: ProductSource = {
      id: 1,
      name: "Wireless Bluetooth Earbuds",
      price: 24.99,
      source: "AliExpress",
      url: "https://aliexpress.com/item/123456",
      reliability: 4.2,
      shipping: 3.99,
      total: 28.98,
      image: "https://via.placeholder.com/150?text=Earbuds"
    };
    
    setProduct(mockProduct);
    
    // Initialize custom price with a reasonable markup
    setCustomPrice(parseFloat((mockProduct.total * 1.5).toFixed(2)));
  }, []);
  
  // Mock function to simulate fetching selling platform data
  useEffect(() => {
    if (!product) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockPlatforms: SellingPlatform[] = [
        {
          id: 1,
          name: "Amazon",
          baseFee: 0.99,
          percentageFee: 0.15,
          averagePrice: 49.99
        },
        {
          id: 2,
          name: "eBay",
          baseFee: 0.35,
          percentageFee: 0.10,
          averagePrice: 44.99
        },
        {
          id: 3,
          name: "Walmart",
          baseFee: 0,
          percentageFee: 0.15,
          averagePrice: 47.99
        },
        {
          id: 4,
          name: "Etsy",
          baseFee: 0.20,
          percentageFee: 0.05,
          averagePrice: 52.99
        }
      ];
      
      // Calculate recommended prices and profits
      const platformsWithAnalysis = mockPlatforms.map(platform => {
        const recommendedPrice = calculateRecommendedPrice(product!, platform);
        const estimatedProfit = calculateProfit(product!, platform, recommendedPrice);
        const roi = calculateROI(product!, estimatedProfit);
        
        return {
          ...platform,
          recommendedPrice,
          estimatedProfit,
          roi
        };
      });
      
      // Sort by estimated profit (highest first)
      platformsWithAnalysis.sort((a, b) => 
        (b.estimatedProfit || 0) - (a.estimatedProfit || 0)
      );
      
      setSellingPlatforms(platformsWithAnalysis);
      setSelectedPlatform(platformsWithAnalysis[0]);
      setIsLoading(false);
    }, 1500);
  }, [product]);
  
  // Calculate recommended selling price based on platform and product cost
  const calculateRecommendedPrice = (product: ProductSource, platform: SellingPlatform): number => {
    // Start with the average price on the platform
    const averagePrice = platform.averagePrice || 0;
    
    // Calculate minimum viable price (cost + fees + minimum profit)
    const minViablePrice = product.total + 
                          platform.baseFee + 
                          (product.total * platform.percentageFee) + 
                          5; // Minimum $5 profit
    
    // Use the higher of average market price or minimum viable price
    // But discount slightly from average to be competitive
    const recommendedPrice = Math.max(
      minViablePrice,
      averagePrice * 0.95 // 5% below average market price
    );
    
    return parseFloat(recommendedPrice.toFixed(2));
  };
  
  // Calculate estimated profit
  const calculateProfit = (
    product: ProductSource, 
    platform: SellingPlatform, 
    sellingPrice: number
  ): number => {
    const platformFees = platform.baseFee + (sellingPrice * platform.percentageFee);
    const profit = sellingPrice - product.total - platformFees;
    return parseFloat(profit.toFixed(2));
  };
  
  // Calculate ROI (Return on Investment)
  const calculateROI = (product: ProductSource, profit: number): number => {
    const roi = (profit / product.total) * 100;
    return parseFloat(roi.toFixed(2));
  };
  
  // Handle platform selection
  const handleSelectPlatform = (platform: SellingPlatform) => {
    setSelectedPlatform(platform);
    setCustomPrice(platform.recommendedPrice || '');
  };
  
  // Handle custom price change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomPrice(value === '' ? '' : parseFloat(value));
  };
  
  // Calculate current profit based on custom price
  const getCurrentProfit = (): number => {
    if (!selectedPlatform || customPrice === '') return 0;
    
    return calculateProfit(product!, selectedPlatform, Number(customPrice));
  };
  
  // Calculate current ROI based on custom price
  const getCurrentROI = (): number => {
    if (!product || customPrice === '') return 0;
    
    const profit = getCurrentProfit();
    return calculateROI(product, profit);
  };
  
  // Handle listing creation
  const handleCreateListing = () => {
    if (!product || !selectedPlatform || customPrice === '') return;
    
    setIsListing(true);
    
    // Simulate API call to create listing
    setTimeout(() => {
      // In a real implementation, this would call an API to create the listing
      console.log('Creating listing for', product.name, 'on', selectedPlatform.name, 'at price', customPrice);
      
      // Show success message
      alert(`Listing created successfully on ${selectedPlatform.name}!`);
      setIsListing(false);
    }, 2000);
  };
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>No product selected for analysis.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Profit Analysis</h1>
      
      <div className="max-w-6xl mx-auto">
        {/* Product Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            {product.image && (
              <div className="w-full md:w-1/4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">{product.name}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Source</p>
                  <p className="font-medium">{product.source}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Reliability</p>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          product.reliability >= 4.5 ? 'bg-green-600' : 
                          product.reliability >= 4.0 ? 'bg-blue-600' :
                          product.reliability >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(product.reliability / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span>{product.reliability.toFixed(1)}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Product Price</p>
                  <p className="font-medium">${product.price.toFixed(2)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Shipping</p>
                  <p className="font-medium">
                    {product.shipping === 0 ? 'Free' : `$${product.shipping.toFixed(2)}`}
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Cost</p>
                <p className="text-xl font-bold text-blue-700">${product.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Platform Recommendations */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Selling Platform Recommendations</h2>
            <p className="text-sm text-gray-500 mt-1">
              Based on market analysis and platform fees
            </p>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
              <p>Analyzing potential selling platforms...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Base Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recommended Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Est. Profit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ROI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sellingPlatforms.map((platform) => (
                    <tr 
                      key={platform.id} 
                      className={`hover:bg-gray-50 ${selectedPlatform?.id === platform.id ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{platform.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${platform.baseFee.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{(platform.percentageFee * 100).toFixed(0)}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${platform.averagePrice?.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${platform.recommendedPrice?.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          (platform.estimatedProfit || 0) > 10 ? 'text-green-600' : 
                          (platform.estimatedProfit || 0) > 5 ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          ${platform.estimatedProfit?.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          (platform.roi || 0) > 50 ? 'text-green-600' : 
                          (platform.roi || 0) > 25 ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {platform.roi?.toFixed(0)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleSelectPlatform(platform)}
                          className={`px-3 py-1 rounded text-sm ${
                            selectedPlatform?.id === platform.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {selectedPlatform?.id === platform.id ? 'Selected' : 'Select'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Pricing and Listing */}
        {selectedPlatform && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create Listing on {selectedPlatform.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Pricing</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Selling Price
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      min={product.total}
                      step="0.01"
                      value={customPrice}
                      onChange={handlePriceChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Recommended: ${selectedPlatform.recommendedPrice?.toFixed(2)}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-1">
                      <DollarSign size={16} className="text-green-600 mr-1" />
                      <p className="text-sm font-medium text-gray-700">Estimated Profit</p>
                    </div>
                    <p className={`text-xl font-bold ${
                      getCurrentProfit() > 10 ? 'text-green-600' : 
                      getCurrentProfit() > 5 ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      ${getCurrentProfit().toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-1">
                      <TrendingUp size={16} className="text-blue-600 mr-1" />
                      <p className="text-sm font-medium text-gray-700">ROI</p>
                    </div>
                    <p className={`text-xl font-bold ${
                      getCurrentROI() > 50 ? 'text-green-600' : 
                      getCurrentROI() > 25 ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {getCurrentROI().toFixed(0)}%
                    </p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-yellow-800 mb-2">Fee Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Platform Base Fee</span>
                      <span className="text-sm font-medium">${selectedPlatform.baseFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Platform Percentage Fee ({(selectedPlatform.percentageFee * 100).toFixed(0)}%)</span>
                      <span className="text-sm font-medium">
                        ${customPrice === '' ? '0.00' : ((Number(customPrice) * selectedPlatform.percentageFee)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Product Cost</span>
                      <span className="text-sm font-medium">${product.total.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-yellow-200 pt-2 mt-2 flex justify-between">
                      <span className="text-sm font-medium text-gray-800">Total Costs</span>
                      <span className="text-sm font-bold">
                        ${customPrice === '' ? product.total.toFixed(2) : (
                          product.total + 
                          selectedPlatform.baseFee + 
                          (Number(customPrice) * selectedPlatform.percentageFee)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Listing Details</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    defaultValue={product.name}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-3"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={`Brand new ${product.name}. High quality product with great features.`}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-3"
                    defaultValue="electronics"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="home">Home & Garden</option>
                    <option value="toys">Toys & Games</option>
                    <option value="beauty">Beauty & Personal Care</option>
                  </select>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-blue-800 mb-2">Platform Requirements</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      Minimum image resolution: 1000x1000px
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      Description minimum length: 100 characters
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      Category selection required
                    </li>
                  </ul>
                </div>
                
                <button
                  onClick={handleCreateListing}
                  disabled={isListing || customPrice === '' || Number(customPrice) <= 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isListing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Listing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} className="mr-2" />
                      Create Listing on {selectedPlatform.name}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
