'use client';

import { useState } from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

interface ProductSource {
  id: number;
  name: string;
  price: number;
  source: string;
  url: string;
  reliability: number;
  shipping: number;
  total: number;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ProductSource[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    try {
      // In a real implementation, this would call our API
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      
      // For now, we'll simulate a search delay and use mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data for demonstration
      const mockResults: ProductSource[] = [
        {
          id: 1,
          name: searchQuery,
          price: 19.99,
          source: 'Amazon',
          url: 'https://amazon.com/product1',
          reliability: 4.8,
          shipping: 3.99,
          total: 23.98
        },
        {
          id: 2,
          name: searchQuery,
          price: 17.50,
          source: 'Walmart',
          url: 'https://walmart.com/product1',
          reliability: 4.5,
          shipping: 5.99,
          total: 23.49
        },
        {
          id: 3,
          name: searchQuery,
          price: 22.99,
          source: 'eBay',
          url: 'https://ebay.com/product1',
          reliability: 4.2,
          shipping: 0,
          total: 22.99
        },
        {
          id: 4,
          name: searchQuery,
          price: 16.75,
          source: 'AliExpress',
          url: 'https://aliexpress.com/product1',
          reliability: 3.9,
          shipping: 8.99,
          total: 25.74
        },
        {
          id: 5,
          name: searchQuery,
          price: 21.50,
          source: 'Target',
          url: 'https://target.com/product1',
          reliability: 4.6,
          shipping: 4.99,
          total: 26.49
        }
      ];
      
      // Sort by total price (price + shipping)
      mockResults.sort((a, b) => a.total - b.total);
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAnalyze = (result: ProductSource) => {
    // This will be implemented in the profit analysis step
    console.log('Analyzing product for reselling:', result);
    // Navigate to analysis page or open modal
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Find the Best Deals</h1>
      
      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter product name or description..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-70"
          >
            {isSearching ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <SearchIcon size={20} />
                Search
              </>
            )}
          </button>
        </form>
        
        <p className="text-sm text-gray-500 mt-2">
          We search across multiple platforms to find you the best deals
        </p>
      </div>

      {isSearching && (
        <div className="flex justify-center items-center py-12">
          <Loader2 size={40} className="animate-spin text-blue-600" />
          <p className="ml-4 text-lg">Searching across multiple platforms...</p>
        </div>
      )}

      {!isSearching && searchResults.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Top 20 Sources for "{searchQuery}"</h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipping
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reliability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchResults.map((result) => (
                  <tr key={`${result.source}-${result.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{result.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${result.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {result.shipping === 0 ? 'Free' : `$${result.shipping.toFixed(2)}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">${result.total.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.source}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(result.reliability / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-900">{result.reliability.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </a>
                        <button 
                          onClick={() => handleAnalyze(result)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Analyze Profit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
