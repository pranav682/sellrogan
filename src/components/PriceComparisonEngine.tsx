'use client';

import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, ExternalLink, ShoppingCart, Star, Clock, Shield } from 'lucide-react';

interface PriceComparisonEngineProps {
  className?: string;
  searchQuery?: string;
  filters?: any;
}

interface ProductSource {
  marketplace: string;
  price: number;
  shipping: number;
  condition: string;
  sellerRating: number;
  deliveryDays: number;
  returnPolicy: string;
  url: string;
  inStock: boolean;
  logo: string;
}

interface ProductResult {
  id: string;
  title: string;
  image: string;
  description: string;
  sources: ProductSource[];
  bestSource: string; // marketplace id of best source
}

const PriceComparisonEngine: React.FC<PriceComparisonEngineProps> = ({
  className = '',
  searchQuery = '',
  filters = {}
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ProductResult[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'delivery'>('price');
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Marketplace logos
  const marketplaceLogos = {
    amazon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png',
    ebay: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png',
    walmart: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/2560px-Walmart_logo.svg.png',
    etsy: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Etsy_logo.svg/2560px-Etsy_logo.svg.png',
    aliexpress: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/AliExpress_logo.svg/1280px-AliExpress_logo.svg.png'
  };
  
  // Search for products when query changes
  useEffect(() => {
    if (searchQuery) {
      searchProducts(searchQuery, filters);
    }
  }, [searchQuery, filters]);
  
  // Search for products
  const searchProducts = async (query: string, searchFilters: any) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call APIs and web scraping services
      // For now, we'll use mock data
      setTimeout(() => {
        const mockResults = generateMockResults(query, searchFilters);
        setResults(mockResults);
        setIsLoading(false);
        setSearchPerformed(true);
      }, 2000);
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Failed to search for products. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Generate mock results for demonstration
  const generateMockResults = (query: string, searchFilters: any): ProductResult[] => {
    // Create 3-5 mock products
    const productCount = Math.floor(Math.random() * 3) + 3;
    const products: ProductResult[] = [];
    
    for (let i = 0; i < productCount; i++) {
      // Generate 3-5 sources per product
      const sourceCount = Math.floor(Math.random() * 3) + 3;
      const sources: ProductSource[] = [];
      
      // Base price that will vary by marketplace
      const basePrice = Math.floor(Math.random() * 100) + 20;
      
      // Available marketplaces
      const marketplaces = ['amazon', 'ebay', 'walmart', 'etsy', 'aliexpress'];
      
      // Generate sources
      for (let j = 0; j < sourceCount; j++) {
        const marketplace = marketplaces[j % marketplaces.length];
        
        // Vary price by marketplace
        let price = basePrice;
        if (marketplace === 'amazon') price *= 1.1;
        if (marketplace === 'ebay') price *= 0.9;
        if (marketplace === 'walmart') price *= 0.95;
        if (marketplace === 'etsy') price *= 1.2;
        if (marketplace === 'aliexpress') price *= 0.7;
        
        // Apply any price filters
        if (searchFilters.minPrice && price < parseFloat(searchFilters.minPrice)) {
          continue;
        }
        if (searchFilters.maxPrice && price > parseFloat(searchFilters.maxPrice)) {
          continue;
        }
        
        // Apply platform filter
        if (searchFilters.platform && searchFilters.platform !== marketplace) {
          continue;
        }
        
        // Generate shipping cost
        const shipping = marketplace === 'amazon' ? 0 : Math.floor(Math.random() * 10) + 5;
        
        // Generate seller rating
        const sellerRating = Math.floor(Math.random() * 2) + 3 + Math.random();
        
        // Generate delivery days
        let deliveryDays = 0;
        if (marketplace === 'amazon') deliveryDays = Math.floor(Math.random() * 2) + 1;
        if (marketplace === 'ebay') deliveryDays = Math.floor(Math.random() * 4) + 2;
        if (marketplace === 'walmart') deliveryDays = Math.floor(Math.random() * 3) + 2;
        if (marketplace === 'etsy') deliveryDays = Math.floor(Math.random() * 5) + 3;
        if (marketplace === 'aliexpress') deliveryDays = Math.floor(Math.random() * 10) + 10;
        
        // Generate return policy
        let returnPolicy = '';
        if (marketplace === 'amazon') returnPolicy = '30-day returns';
        if (marketplace === 'ebay') returnPolicy = '14-day returns';
        if (marketplace === 'walmart') returnPolicy = '90-day returns';
        if (marketplace === 'etsy') returnPolicy = 'Varies by seller';
        if (marketplace === 'aliexpress') returnPolicy = '15-day returns';
        
        // Generate condition
        let condition = 'New';
        if (marketplace === 'ebay' && Math.random() > 0.7) {
          const conditions = ['Used - Like New', 'Used - Good', 'Used - Acceptable'];
          condition = conditions[Math.floor(Math.random() * conditions.length)];
        }
        
        // Apply condition filter
        if (searchFilters.condition && searchFilters.condition !== condition) {
          continue;
        }
        
        sources.push({
          marketplace,
          price: parseFloat(price.toFixed(2)),
          shipping,
          condition,
          sellerRating,
          deliveryDays,
          returnPolicy,
          url: `https://www.${marketplace}.com/product-${i}-${j}`,
          inStock: Math.random() > 0.1,
          logo: marketplaceLogos[marketplace as keyof typeof marketplaceLogos]
        });
      }
      
      // Skip products with no sources (filtered out)
      if (sources.length === 0) continue;
      
      // Determine best source based on total price (price + shipping)
      let bestSource = sources[0].marketplace;
      let lowestTotal = sources[0].price + sources[0].shipping;
      
      sources.forEach(source => {
        const total = source.price + source.shipping;
        if (total < lowestTotal) {
          lowestTotal = total;
          bestSource = source.marketplace;
        }
      });
      
      products.push({
        id: `product-${i}`,
        title: `${query} ${i + 1} - Premium Quality`,
        image: `https://via.placeholder.com/150?text=${query.replace(/\s+/g, '+')}+${i+1}`,
        description: `High-quality ${query} with premium features. Perfect for everyday use and professional applications.`,
        sources,
        bestSource
      });
    }
    
    return products;
  };
  
  // Sort sources based on selected criteria
  const sortSources = (sources: ProductSource[]): ProductSource[] => {
    return [...sources].sort((a, b) => {
      if (sortBy === 'price') {
        return (a.price + a.shipping) - (b.price + b.shipping);
      } else if (sortBy === 'rating') {
        return b.sellerRating - a.sellerRating;
      } else if (sortBy === 'delivery') {
        return a.deliveryDays - b.deliveryDays;
      }
      return 0;
    });
  };
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Get marketplace color
  const getMarketplaceColor = (marketplace: string): string => {
    if (marketplace === 'amazon') return 'bg-orange-100 text-orange-800';
    if (marketplace === 'ebay') return 'bg-blue-100 text-blue-800';
    if (marketplace === 'walmart') return 'bg-blue-100 text-blue-800';
    if (marketplace === 'etsy') return 'bg-orange-100 text-orange-800';
    if (marketplace === 'aliexpress') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };
  
  // Get marketplace badge
  const getMarketplaceBadge = (marketplace: string): JSX.Element => {
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getMarketplaceColor(marketplace)}`}>
        {marketplace.charAt(0).toUpperCase() + marketplace.slice(1)}
      </span>
    );
  };
  
  // Get rating stars
  const getRatingStars = (rating: number): JSX.Element => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="h-4 w-4 text-gray-300" />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className={`price-comparison-engine ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-lg font-medium text-gray-700">Searching across marketplaces...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && !error && results.length === 0 && searchPerformed && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">No products found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
      
      {/* Results */}
      {!isLoading && !error && results.length > 0 && (
        <div>
          {/* Sort controls */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Results for "{searchQuery}"</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Sort by:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSortBy('price')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    sortBy === 'price'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Price
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    sortBy === 'rating'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Rating
                </button>
                <button
                  onClick={() => setSortBy('delivery')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    sortBy === 'delivery'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Delivery
                </button>
              </div>
            </div>
          </div>
          
          {/* Product list */}
          <div className="space-y-8">
            {results.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                {/* Product header */}
                <div className="p-6 flex flex-col md:flex-row">
                  <div className="md:w-1/4 flex justify-center mb-4 md:mb-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <div className="md:w-3/4 md:pl-6">
                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    
                    {/* Best price badge */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.sources.length > 0 && (
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Best price: {formatCurrency(
                            product.sources.reduce((min, source) => {
                              const total = source.price + source.shipping;
                              return total < min ? total : min;
                            }, Infinity)
                          )}
                        </div>
                      )}
                      
                      {/* Available on badges */}
                      {Array.from(new Set(product.sources.map(s => s.marketplace))).map(marketplace => (
                        <div key={marketplace} className={`px-3 py-1 rounded-full text-sm font-medium ${getMarketplaceColor(marketplace)}`}>
                          Available on {marketplace.charAt(0).toUpperCase() + marketplace.slice(1)}
                        </div>
                      ))}
                    </div>
                    
                    {/* Source count and view all button */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {product.sources.length} sources found
                      </span>
                      <button
                        onClick={() => {
                          // Toggle expanded view in a real implementation
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View all sources
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Sources list */}
                <div className="border-t border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Marketplace
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Condition
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Seller Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Delivery
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Returns
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortSources(product.sources).slice(0, 3).map((source, index) => (
                        <tr key={index} className={source.marketplace === product.bestSource ? 'bg-green-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={source.logo}
                                alt={source.marketplace}
                                className="h-6 mr-2"
                              />
                              <div>
                                {getMarketplaceBadge(source.marketplace)}
                                {source.marketplace === product.bestSource && (
                                  <div className="text-xs text-green-600 font-medium mt-1">Best Deal</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{formatCurrency(source.price)}</div>
                            {source.shipping > 0 ? (
                              <div className="text-xs text-gray-500">+{formatCurrency(source.shipping)} shipping</div>
                            ) : (
                              <div className="text-xs text-green-600">Free shipping</div>
                            )}
                            <div className="font-bold text-sm">
                              Total: {formatCurrency(source.price + source.shipping)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {source.condition}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRatingStars(source.sellerRating)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-1" />
                              <span>{source.deliveryDays} day{source.deliveryDays !== 1 ? 's' : ''}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 text-gray-400 mr-1" />
                              <span>{source.returnPolicy}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900 font-medium flex items-center justify-end"
                            >
                              View
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceComparisonEngine;
