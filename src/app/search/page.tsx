'use client';

import React, { useState, useEffect } from 'react';
import SmartSearch from '@/components/SmartSearch';
import PriceComparisonEngine from '@/components/PriceComparisonEngine';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({});
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const handleSearch = (query: string, filters: any) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    setSearchPerformed(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Find the Best Deals Across Marketplaces</h1>
      
      <div className="max-w-4xl mx-auto mb-8">
        <SmartSearch onSearch={handleSearch} />
      </div>
      
      {searchPerformed && (
        <div className="mt-8">
          <PriceComparisonEngine 
            searchQuery={searchQuery} 
            filters={searchFilters} 
          />
        </div>
      )}
      
      {!searchPerformed && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4">
                <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">1</div>
                <h3 className="font-medium mb-2">Search Products</h3>
                <p className="text-gray-600 text-sm">Enter what you're looking for or ask our AI assistant for help</p>
              </div>
              <div className="p-4">
                <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">2</div>
                <h3 className="font-medium mb-2">Compare Prices</h3>
                <p className="text-gray-600 text-sm">We search across multiple marketplaces to find the best deals</p>
              </div>
              <div className="p-4">
                <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">3</div>
                <h3 className="font-medium mb-2">Buy or Sell</h3>
                <p className="text-gray-600 text-sm">Purchase from the best source or list your own products for sale</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
