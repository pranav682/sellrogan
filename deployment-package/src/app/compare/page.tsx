'use client';

import { useState, useEffect } from 'react';
import { Search as SearchIcon, Loader2, Filter, ArrowUpDown, ExternalLink, BarChart } from 'lucide-react';

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

interface FilterOptions {
  maxPrice: number | null;
  minReliability: number | null;
  sources: string[];
}

export default function PriceComparisonPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ProductSource[]>([]);
  const [filteredResults, setFilteredResults] = useState<ProductSource[]>([]);
  const [sortField, setSortField] = useState<'total' | 'price' | 'reliability'>('total');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    maxPrice: null,
    minReliability: 3.5,
    sources: []
  });
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters and sorting whenever results or filter/sort settings change
  useEffect(() => {
    if (searchResults.length === 0) return;

    let results = [...searchResults];
    
    // Apply filters
    if (filters.maxPrice) {
      results = results.filter(item => item.total <= filters.maxPrice!);
    }
    
    if (filters.minReliability) {
      results = results.filter(item => item.reliability >= filters.minReliability!);
    }
    
    if (filters.sources.length > 0) {
      results = results.filter(item => filters.sources.includes(item.source));
    }
    
    // Apply sorting
    results.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
    
    setFilteredResults(results);
  }, [searchResults, filters, sortField, sortDirection]);

  // Extract available sources from search results
  useEffect(() => {
    if (searchResults.length > 0) {
      const sources = [...new Set(searchResults.map(item => item.source))];
      setAvailableSources(sources);
      
      // Initialize filters.sources with all available sources if empty
      if (filters.sources.length === 0) {
        setFilters(prev => ({
          ...prev,
          sources: sources
        }));
      }
    }
  }, [searchResults]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSort = (field: 'total' | 'price' | 'reliability') => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and reset direction to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSourceFilter = (source: string) => {
    setFilters(prev => {
      const currentSources = [...prev.sources];
      
      if (currentSources.includes(source)) {
        // Remove source if already selected
        return {
          ...prev,
          sources: currentSources.filter(s => s !== source)
        };
      } else {
        // Add source if not selected
        return {
          ...prev,
          sources: [...currentSources, source]
        };
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      maxPrice: null,
      minReliability: 3.5,
      sources: availableSources
    });
  };

  const handleAnalyze = (result: ProductSource) => {
    // This will be implemented in the profit analysis step
    console.log('Analyzing product for reselling:', result);
    // Navigate to analysis page or open modal
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Price Comparison Tool</h1>
      
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

      {!isSearching && filteredResults.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Results for "{searchQuery}"</h2>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
              >
                <Filter size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <div className="flex flex-wrap gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Max Total Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      maxPrice: e.target.value ? parseFloat(e.target.value) : null
                    }))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="No limit"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Min Reliability</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      value={filters.minReliability || 1}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        minReliability: parseFloat(e.target.value)
                      }))}
                      className="w-32"
                    />
                    <span>{filters.minReliability?.toFixed(1) || '1.0'}</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Sources</label>
                  <div className="flex flex-wrap gap-2 max-w-md">
                    {availableSources.map(source => (
                      <label key={source} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.sources.includes(source)}
                          onChange={() => toggleSourceFilter(source)}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('price')}
                  >
                    <div className="flex items-center gap-1">
                      Price
                      {sortField === 'price' && (
                        <ArrowUpDown size={14} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipping
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('total')}
                  >
                    <div className="flex items-center gap-1">
                      Total
                      {sortField === 'total' && (
                        <ArrowUpDown size={14} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('reliability')}
                  >
                    <div className="flex items-center gap-1">
                      Reliability
                      {sortField === 'reliability' && (
                        <ArrowUpDown size={14} className={sortDirection === 'desc' ? 'transform rotate-180' : ''} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.map((result) => (
                  <tr key={`${result.source}-${result.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {result.image && (
                          <img 
                            src={result.image} 
                            alt={result.name} 
                            className="w-10 h-10 object-contain mr-3"
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">{result.name}</div>
                      </div>
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
                            className={`h-2.5 rounded-full ${
                              result.reliability >= 4.5 ? 'bg-green-600' : 
                              result.reliability >= 4.0 ? 'bg-blue-600' :
                              result.reliability >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
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
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <ExternalLink size={14} />
                          View
                        </a>
                        <button 
                          onClick={() => handleAnalyze(result)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                        >
                          <BarChart size={14} />
                          Analyze Profit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredResults.length === 0 && searchResults.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No results match your current filters.</p>
              <button 
                onClick={resetFilters}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Reset Filters
              </button>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-500 text-right">
            Showing {filteredResults.length} of {searchResults.length} results
          </div>
        </div>
      )}
    </div>
  );
}
