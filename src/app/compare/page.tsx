'use client';

import React, { useState } from 'react';
import { Search, BarChart2, ArrowRight } from 'lucide-react';

export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [comparisonMetric, setComparisonMetric] = useState<'price' | 'rating' | 'shipping' | 'total'>('total');
  
  // Handle search for products
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // In a real app, this would call an API
    // For demo, we'll use mock data
    setTimeout(() => {
      const mockResults = [
        {
          id: '1',
          name: `${searchQuery} - Premium Version`,
          price: 49.99,
          source: 'Amazon',
          url: 'https://amazon.com/product1',
          image: 'https://via.placeholder.com/150',
          shipping: 4.99,
          condition: 'New',
          rating: 4.5,
          reviews: 120,
          features: ['Premium quality', 'Fast shipping', '1-year warranty', 'Customer support']
        },
        {
          id: '2',
          name: `${searchQuery} - Standard Model`,
          price: 29.99,
          source: 'eBay',
          url: 'https://ebay.com/product2',
          image: 'https://via.placeholder.com/150',
          shipping: 3.99,
          condition: 'New',
          rating: 4.2,
          reviews: 85,
          features: ['Standard quality', 'Regular shipping', '6-month warranty']
        },
        {
          id: '3',
          name: `${searchQuery} - Budget Option`,
          price: 19.99,
          source: 'AliExpress',
          url: 'https://aliexpress.com/product3',
          image: 'https://via.placeholder.com/150',
          shipping: 2.99,
          condition: 'New',
          rating: 3.8,
          reviews: 42,
          features: ['Budget quality', 'Economy shipping', '30-day warranty']
        },
        {
          id: '4',
          name: `${searchQuery} - Deluxe Edition`,
          price: 59.99,
          source: 'Walmart',
          url: 'https://walmart.com/product4',
          image: 'https://via.placeholder.com/150',
          shipping: 0,
          condition: 'New',
          rating: 4.7,
          reviews: 65,
          features: ['Deluxe quality', 'Free shipping', '2-year warranty', 'Premium support', 'Gift packaging']
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };
  
  // Handle product selection for comparison
  const handleSelectProduct = (product: any) => {
    if (selectedProducts.some(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      if (selectedProducts.length < 3) {
        setSelectedProducts([...selectedProducts, product]);
      }
    }
  };
  
  // Calculate total cost (price + shipping)
  const calculateTotal = (product: any) => {
    return product.price + (product.shipping || 0);
  };
  
  // Get comparison value based on selected metric
  const getComparisonValue = (product: any) => {
    switch (comparisonMetric) {
      case 'price':
        return product.price;
      case 'rating':
        return product.rating;
      case 'shipping':
        return product.shipping || 0;
      case 'total':
        return calculateTotal(product);
      default:
        return product.price;
    }
  };
  
  // Find the best product based on comparison metric
  const getBestProduct = () => {
    if (selectedProducts.length === 0) return null;
    
    return selectedProducts.reduce((best, current) => {
      if (comparisonMetric === 'rating') {
        return getComparisonValue(current) > getComparisonValue(best) ? current : best;
      } else {
        return getComparisonValue(current) < getComparisonValue(best) ? current : best;
      }
    }, selectedProducts[0]);
  };
  
  // Clear all selected products
  const clearSelection = () => {
    setSelectedProducts([]);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Price Comparison Tool</h1>
      
      <div className="max-w-2xl mx-auto mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Search for Products</h2>
          <div className="flex mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter product name..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className={`bg-blue-600 text-white px-4 py-2 rounded-r-lg ${
                isSearching || !searchQuery.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {isSearching && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Searching for products...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Search Results */}
      {!isSearching && searchResults.length > 0 && (
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <div className="text-sm text-gray-500">
                Select up to 3 products to compare
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedProducts.some(p => p.id === product.id)
                      ? 'border-blue-600 bg-blue-50 shadow-sm'
                      : 'hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => handleSelectProduct(product)}
                >
                  <div className="h-40 bg-gray-100 flex items-center justify-center relative">
                    {selectedProducts.some(p => p.id === product.id) && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {selectedProducts.findIndex(p => p.id === product.id) + 1}
                      </div>
                    )}
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium mb-1 line-clamp-2">{product.name}</h4>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-blue-600 font-bold">${product.price.toFixed(2)}</div>
                      <div className="text-gray-500 text-sm">{product.source}</div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-500">
                        Shipping: ${product.shipping ? product.shipping.toFixed(2) : '0.00'}
                      </div>
                      <div className="text-gray-500">
                        Rating: {product.rating}/5
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Comparison Table */}
      {selectedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Product Comparison</h2>
              <div className="flex items-center">
                <label className="mr-2 text-sm text-gray-700">Compare by:</label>
                <select
                  value={comparisonMetric}
                  onChange={(e) => setComparisonMetric(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  <option value="total">Total Cost</option>
                  <option value="price">Price</option>
                  <option value="shipping">Shipping</option>
                  <option value="rating">Rating</option>
                </select>
                <button
                  onClick={clearSelection}
                  className="ml-4 text-sm text-red-600 hover:text-red-800"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    {selectedProducts.map((product) => (
                      <th key={product.id} className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center">
                          <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                            ) : (
                              <div className="text-gray-400">No image</div>
                            )}
                          </div>
                          <div className="text-sm font-medium line-clamp-1">{product.name}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">Price</td>
                    {selectedProducts.map((product) => (
                      <td key={`${product.id}-price`} className="px-4 py-3 text-center">
                        <div className={`font-bold ${getBestProduct()?.id === product.id && comparisonMetric === 'price' ? 'text-green-600' : ''}`}>
                          ${product.price.toFixed(2)}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">Shipping</td>
                    {selectedProducts.map((product) => (
                      <td key={`${product.id}-shipping`} className="px-4 py-3 text-center">
                        <div className={`${getBestProduct()?.id === product.id && comparisonMetric === 'shipping' ? 'text-green-600 font-bold' : ''}`}>
                          ${product.shipping ? product.shipping.toFixed(2) : '0.00'}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">Total Cost</td>
                    {selectedProducts.map((product) => (
                      <td key={`${product.id}-total`} className="px-4 py-3 text-center">
                        <div className={`font-bold ${getBestProduct()?.id === product.id && comparisonMetric === 'total' ? 'text-green-600' : ''}`}>
                          ${calculateTotal(product).toFixed(2)}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">Rating</td>
                    {selectedProducts.map((product) => (
                      <td key={`${product.id}-rating`} className="px-4 py-3 text-center">
                        <div className={`${getBestProduct()?.id === product.id && comparisonMetric === 'rating' ? 'text-green-600 font-bold' : ''}`}>
                          {product.rating}/5 ({product.reviews} reviews)
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">Source</td>
                    {selectedProducts.map((product) => (
                      <td key={`${product.id}-source`} className="px-4 py-3 text-center">
                        {product.source}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">Condition</td>
                    {selectedProducts.map((product) => (
                      <td key={`${product.id}-condition`} className="px-4 py-3 text-center">
                        {product.condition}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">Features</td>
                    {selectedProducts.map((product) => (
                      <td key={`${product.id}-features`} className="px-4 py-3 text-center">
                        <ul className="text-sm text-left list-disc pl-5">
                          {product.features.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3"></td>
                    {selectedProducts.map((product) => (
                      <td key={`${product.id}-action`} className="px-4 py-3 text-center">
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                        >
                          View Product
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Best Value Recommendation */}
          {getBestProduct() && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Best Value Recommendation</h2>
              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 mb-4 md:mb-0 flex items-center justify-center">
                    <div className="h-32 w-32 bg-white rounded-lg flex items-center justify-center">
                      {getBestProduct()?.image ? (
                        <img src={getBestProduct()?.image} alt={getBestProduct()?.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <div className="text-gray-400">No image</div>
                      )}
                    </div>
                  </div>
                  <div className="md:w-3/4 md:pl-6">
                    <h3 className="text-lg font-medium mb-2">{getBestProduct()?.name}</h3>
                    <p className="text-green-600 font-bold mb-2">
                      Best {comparisonMetric === 'rating' ? 'Rating' : 'Value'} Option
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-sm">Price</p>
                        <p className="font-bold">${getBestProduct()?.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Shipping</p>
                        <p>${getBestProduct()?.shipping ? getBestProduct()?.shipping.toFixed(2) : '0.00'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Total Cost</p>
                        <p className="font-bold">${calculateTotal(getBestProduct()).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Rating</p>
                        <p>{getBestProduct()?.rating}/5 ({getBestProduct()?.reviews} reviews)</p>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <a
                        href={getBestProduct()?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
                      >
                        View Product
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center">
                        Create Listing
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
