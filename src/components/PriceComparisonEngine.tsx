'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserDataContext } from '@/lib/userDataService';

interface PriceComparisonEngineProps {
  className?: string;
  initialQuery?: string;
  searchQuery?: string;
  filters?: any;
}

const PriceComparisonEngine: React.FC<PriceComparisonEngineProps> = ({ 
  className = '',
  initialQuery = '',
  searchQuery = '',
  filters = {}
}) => {
  // Use user data context
  const { trackEvent } = React.useContext(UserDataContext);
  
  // State for search query
  const [searchQueryState, setSearchQueryState] = useState(initialQuery || searchQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [sortOption, setSortOption] = useState('price_asc');
  const [filterOptions, setFilterOptions] = useState({
    maxPrice: '',
    minRating: 0,
    freeShipping: false,
    inStock: true,
    ...filters
  });
  
  // Search for products when query changes
  useEffect(() => {
    if (initialQuery) {
      setSearchQueryState(initialQuery);
      searchProducts(initialQuery);
    } else if (searchQuery) {
      setSearchQueryState(searchQuery);
      searchProducts(searchQuery);
    }
  }, [initialQuery, searchQuery]);
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQueryState.trim()) {
      searchProducts(searchQueryState);
    }
  };
  
  // Search for products
  const searchProducts = (query: string) => {
    setIsSearching(true);
    setSearchResults([]);
    
    // Track search event
    trackEvent('product_search', { query });
    
    // Simulate API call to search for products
    setTimeout(() => {
      const results = generateMockResults(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 1500);
  };
  
  // Generate mock search results
  const generateMockResults = (query: string) => {
    const mockResults = [];
    
    // Amazon results
    mockResults.push({
      id: 'amz-001',
      title: `${query} - Premium Quality`,
      price: 24.99,
      shipping: 0,
      marketplace: 'Amazon',
      seller: 'OfficialStore',
      rating: 4.5,
      reviews: 128,
      inStock: true,
      deliveryDays: '2-3',
      image: 'https://via.placeholder.com/100',
      url: 'https://amazon.com',
      reliability: 95,
      returnPolicy: '30 days free returns',
      sellerRating: 4.8
    });
    
    mockResults.push({
      id: 'amz-002',
      title: `${query} - Value Pack`,
      price: 19.99,
      shipping: 4.99,
      marketplace: 'Amazon',
      seller: 'ValueSeller',
      rating: 4.2,
      reviews: 87,
      inStock: true,
      deliveryDays: '3-5',
      image: 'https://via.placeholder.com/100',
      url: 'https://amazon.com',
      reliability: 88,
      returnPolicy: '30 days returns',
      sellerRating: 4.3
    });
    
    // eBay results
    mockResults.push({
      id: 'ebay-001',
      title: `${query} - New Model`,
      price: 22.50,
      shipping: 3.99,
      marketplace: 'eBay',
      seller: 'TopRatedPlus',
      rating: 4.3,
      reviews: 56,
      inStock: true,
      deliveryDays: '3-7',
      image: 'https://via.placeholder.com/100',
      url: 'https://ebay.com',
      reliability: 85,
      returnPolicy: '14 days returns',
      sellerRating: 4.5
    });
    
    // Walmart results
    mockResults.push({
      id: 'wmt-001',
      title: `${query} - Everyday Essential`,
      price: 17.99,
      shipping: 0,
      marketplace: 'Walmart',
      seller: 'Walmart',
      rating: 3.9,
      reviews: 42,
      inStock: true,
      deliveryDays: '3-5',
      image: 'https://via.placeholder.com/100',
      url: 'https://walmart.com',
      reliability: 90,
      returnPolicy: '90 days returns',
      sellerRating: 4.0
    });
    
    // AliExpress results
    mockResults.push({
      id: 'ali-001',
      title: `${query} - Wholesale Price`,
      price: 12.99,
      shipping: 2.99,
      marketplace: 'AliExpress',
      seller: 'GlobalTrade',
      rating: 4.1,
      reviews: 215,
      inStock: true,
      deliveryDays: '15-30',
      image: 'https://via.placeholder.com/100',
      url: 'https://aliexpress.com',
      reliability: 75,
      returnPolicy: 'Buyer protection',
      sellerRating: 4.2
    });
    
    mockResults.push({
      id: 'ali-002',
      title: `${query} - Bulk Pack`,
      price: 9.99,
      shipping: 5.99,
      marketplace: 'AliExpress',
      seller: 'DirectFactory',
      rating: 3.8,
      reviews: 89,
      inStock: true,
      deliveryDays: '20-40',
      image: 'https://via.placeholder.com/100',
      url: 'https://aliexpress.com',
      reliability: 70,
      returnPolicy: 'Buyer protection',
      sellerRating: 3.9
    });
    
    // Etsy results
    mockResults.push({
      id: 'etsy-001',
      title: `Handmade ${query}`,
      price: 34.99,
      shipping: 4.50,
      marketplace: 'Etsy',
      seller: 'CraftsmanWorkshop',
      rating: 4.9,
      reviews: 32,
      inStock: true,
      deliveryDays: '5-10',
      image: 'https://via.placeholder.com/100',
      url: 'https://etsy.com',
      reliability: 92,
      returnPolicy: 'Shop policy',
      sellerRating: 4.9
    });
    
    return mockResults;
  };
  
  // Sort search results
  const sortedResults = [...searchResults].sort((a, b) => {
    const totalPriceA = a.price + a.shipping;
    const totalPriceB = b.price + b.shipping;
    
    switch (sortOption) {
      case 'price_asc':
        return totalPriceA - totalPriceB;
      case 'price_desc':
        return totalPriceB - totalPriceA;
      case 'rating_desc':
        return b.rating - a.rating;
      case 'reliability_desc':
        return b.reliability - a.reliability;
      default:
        return totalPriceA - totalPriceB;
    }
  });
  
  // Filter search results
  const filteredResults = sortedResults.filter(result => {
    const totalPrice = result.price + result.shipping;
    
    // Filter by max price
    if (filterOptions.maxPrice && totalPrice > parseFloat(filterOptions.maxPrice)) {
      return false;
    }
    
    // Filter by minimum rating
    if (result.rating < filterOptions.minRating) {
      return false;
    }
    
    // Filter by free shipping
    if (filterOptions.freeShipping && result.shipping > 0) {
      return false;
    }
    
    // Filter by in stock
    if (filterOptions.inStock && !result.inStock) {
      return false;
    }
    
    return true;
  });
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Get marketplace color
  const getMarketplaceColor = (marketplace: string) => {
    switch (marketplace) {
      case 'Amazon':
        return 'bg-orange-100 text-orange-800';
      case 'eBay':
        return 'bg-blue-100 text-blue-800';
      case 'Walmart':
        return 'bg-blue-100 text-blue-800';
      case 'AliExpress':
        return 'bg-red-100 text-red-800';
      case 'Etsy':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get reliability badge color
  const getReliabilityBadgeColor = (reliability: number) => {
    if (reliability >= 90) {
      return 'bg-green-100 text-green-800';
    } else if (reliability >= 80) {
      return 'bg-blue-100 text-blue-800';
    } else if (reliability >= 70) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };
  
  // Handle selecting a source
  const handleSelectSource = (source: any) => {
    setSelectedSource(source);
    
    // Track selection event
    trackEvent('source_selected', { 
      source_id: source.id,
      marketplace: source.marketplace,
      price: source.price,
      shipping: source.shipping
    });
  };
  
  // Handle clearing selected source
  const handleClearSelectedSource = () => {
    setSelectedSource(null);
  };
  
  // Handle filter change
  const handleFilterChange = (name: string, value: any) => {
    setFilterOptions({
      ...filterOptions,
      [name]: value
    });
  };
  
  return (
    <div className={`price-comparison-engine ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Price Comparison</h2>
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchQueryState}
              onChange={(e) => setSearchQueryState(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        
        {/* Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Filters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="maxPrice" className="block text-xs text-gray-500 mb-1">
                Max Price
              </label>
              <input
                type="number"
                id="maxPrice"
                value={filterOptions.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="Max price"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="minRating" className="block text-xs text-gray-500 mb-1">
                Min Rating
              </label>
              <select
                id="minRating"
                value={filterOptions.minRating}
                onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              >
                <option value="0">Any rating</option>
                <option value="3">3+ stars</option>
                <option value="3.5">3.5+ stars</option>
                <option value="4">4+ stars</option>
                <option value="4.5">4.5+ stars</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="freeShipping"
                checked={filterOptions.freeShipping}
                onChange={(e) => handleFilterChange('freeShipping', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label htmlFor="freeShipping" className="ml-2 text-sm text-gray-700">
                Free shipping only
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                checked={filterOptions.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                In stock only
              </label>
            </div>
          </div>
        </div>
        
        {/* Sort options */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rating</option>
              <option value="reliability_desc">Most Reliable</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredResults.length} results
          </div>
        </div>
        
        {/* Results */}
        {isSearching ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No results found. Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-24 mb-4 sm:mb-0 flex-shrink-0">
                        <img 
                          src={result.image} 
                          alt={result.title}
                          className="w-full rounded-md"
                        />
                      </div>
                      <div className="flex-1 sm:ml-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{result.title}</h3>
                            <div className="flex items-center mt-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getMarketplaceColor(result.marketplace)}`}>
                                {result.marketplace}
                              </span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-gray-500">
                                Seller: {result.seller}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0 text-right">
                            <div className="font-bold text-lg">{formatCurrency(result.price)}</div>
                            <div className="text-sm text-gray-500">
                              {result.shipping === 0 ? (
                                <span className="text-green-600">Free shipping</span>
                              ) : (
                                <span>+ {formatCurrency(result.shipping)} shipping</span>
                              )}
                            </div>
                            <div className="text-sm font-medium">
                              Total: {formatCurrency(result.price + result.shipping)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          <div className="flex items-center text-sm">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span>{result.rating}</span>
                            <span className="text-gray-400 ml-1">({result.reviews})</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="mr-1">•</span>
                            Delivery: {result.deliveryDays}
                          </div>
                          <div className={`px-2 py-0.5 rounded-full text-xs ${getReliabilityBadgeColor(result.reliability)}`}>
                            {result.reliability}% Reliable
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <div className="text-sm text-gray-600">
                            {result.returnPolicy}
                          </div>
                          <div className="mt-3 sm:mt-0 flex space-x-2">
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              View Details
                            </a>
                            <button
                              onClick={() => handleSelectSource(result)}
                              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Select Source
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Selected source modal */}
        {selectedSource && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">Source Selected</h3>
                  <button
                    onClick={handleClearSelectedSource}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center">
                    <img 
                      src={selectedSource.image} 
                      alt={selectedSource.title}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="ml-4">
                      <h4 className="font-medium">{selectedSource.title}</h4>
                      <div className="flex items-center mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getMarketplaceColor(selectedSource.marketplace)}`}>
                          {selectedSource.marketplace}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">{formatCurrency(selectedSource.price)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Shipping</p>
                      <p className="font-medium">
                        {selectedSource.shipping === 0 ? 'Free' : formatCurrency(selectedSource.shipping)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-bold">{formatCurrency(selectedSource.price + selectedSource.shipping)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Delivery</p>
                      <p className="font-medium">{selectedSource.deliveryDays} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Reliability</p>
                      <p className="font-medium">{selectedSource.reliability}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Return Policy</p>
                      <p className="font-medium">{selectedSource.returnPolicy}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h4 className="font-medium mb-4">What would you like to do with this source?</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={selectedSource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-center"
                      >
                        Visit Source
                      </a>
                      <button
                        onClick={() => {
                          handleClearSelectedSource();
                          // In a real app, this would navigate to the listing creation page
                          trackEvent('create_listing_from_source', { source_id: selectedSource.id });
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Create Listing
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceComparisonEngine;
