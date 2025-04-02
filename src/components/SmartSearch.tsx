'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SmartSearchProps {
  className?: string;
  onSearch?: (query: string, filters: any) => void;
}

// Define the option type for clarity
interface ClarifyingQuestion {
  id: string;
  question: string;
  options: string[];
}

const SmartSearch: React.FC<SmartSearchProps> = ({ 
  className = '',
  onSearch
}) => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchStage, setSearchStage] = useState<'initial' | 'clarifying' | 'results'>('initial');
  const [clarifyingQuestions, setClarifyingQuestions] = useState<ClarifyingQuestion[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      setSearchStage('clarifying');
      
      // Simulate API call to get clarifying questions
      setTimeout(() => {
        setClarifyingQuestions(generateClarifyingQuestions(searchQuery));
        setIsSearching(false);
      }, 1500);
    }
  };
  
  // Generate clarifying questions based on search query
  const generateClarifyingQuestions = (query: string): ClarifyingQuestion[] => {
    // This would be replaced with actual AI-generated questions
    const questions = [
      {
        id: 'category',
        question: `What category of ${query} are you looking for?`,
        options: ['Electronics', 'Food', 'Clothing', 'Home Goods', 'Other']
      },
      {
        id: 'price_range',
        question: 'What is your price range?',
        options: ['Under $20', '$20-$50', '$50-$100', 'Over $100']
      },
      {
        id: 'quality',
        question: 'What quality level are you looking for?',
        options: ['Budget', 'Mid-range', 'Premium', 'Luxury']
      },
      {
        id: 'purpose',
        question: `What will you use the ${query} for?`,
        options: ['Personal use', 'Reselling', 'Gift', 'Business']
      }
    ];
    
    return questions;
  };
  
  // Handle option selection
  const handleOptionSelect = (questionId: string, option: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: option
    });
  };
  
  // Handle submitting clarifying questions
  const handleSubmitClarification = () => {
    setIsSearching(true);
    
    // Simulate API call to get search results
    setTimeout(() => {
      // This would be replaced with actual search results based on query and selected options
      setSearchResults([
        {
          id: 'result-1',
          title: `${searchQuery} - Premium Quality`,
          description: 'This is a high-quality product that matches your search criteria.',
          price: 49.99,
          rating: 4.5,
          reviews: 128,
          image: 'https://via.placeholder.com/100'
        },
        {
          id: 'result-2',
          title: `${searchQuery} - Best Value`,
          description: 'Great value for money, perfect for your needs.',
          price: 29.99,
          rating: 4.2,
          reviews: 87,
          image: 'https://via.placeholder.com/100'
        },
        {
          id: 'result-3',
          title: `${searchQuery} - Budget Option`,
          description: 'Affordable option that still meets quality standards.',
          price: 19.99,
          rating: 3.9,
          reviews: 42,
          image: 'https://via.placeholder.com/100'
        }
      ]);
      
      setSearchStage('results');
      setIsSearching(false);
      
      // Call onSearch callback if provided
      if (onSearch) {
        onSearch(searchQuery, selectedOptions);
      }
    }, 2000);
  };
  
  // Reset search
  const handleResetSearch = () => {
    setSearchQuery('');
    setSearchStage('initial');
    setClarifyingQuestions([]);
    setSelectedOptions({});
    setSearchResults([]);
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <div className={`smart-search ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Smart Search</h2>
        
        {/* Initial search form */}
        {searchStage === 'initial' && (
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                role="textbox"
                aria-label="Search query"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Our AI will help you find exactly what you're looking for by asking a few questions.
            </p>
          </form>
        )}
        
        {/* Clarifying questions */}
        {searchStage === 'clarifying' && (
          <div>
            <div className="flex items-center mb-4">
              <button
                onClick={handleResetSearch}
                className="text-blue-600 hover:text-blue-700 mr-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <h3 className="text-lg font-medium">Searching for: {searchQuery}</h3>
            </div>
            
            {isSearching ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4].map(j => (
                        <div key={j} className="h-8 bg-gray-200 rounded w-24"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-600">
                  To help you find the best results, please answer these questions:
                </p>
                
                {clarifyingQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <h4 className="font-medium mb-3">{question.question}</h4>
                    <div className="flex flex-wrap gap-2">
                      {question.options.map((option: string) => (
                        <button
                          key={option}
                          onClick={() => handleOptionSelect(question.id, option)}
                          className={`px-3 py-1.5 rounded-full text-sm ${
                            selectedOptions[question.id] === option
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
                
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitClarification}
                    disabled={Object.keys(selectedOptions).length < clarifyingQuestions.length}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    Search with These Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Search results */}
        {searchStage === 'results' && (
          <div>
            <div className="flex items-center mb-4">
              <button
                onClick={handleResetSearch}
                className="text-blue-600 hover:text-blue-700 mr-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <h3 className="text-lg font-medium">Results for: {searchQuery}</h3>
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Search Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedOptions).map(([key, value]) => (
                  <div key={key} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {value}
                  </div>
                ))}
              </div>
            </div>
            
            {isSearching ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map(result => (
                  <motion.div
                    key={result.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex">
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-lg">{result.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{result.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="font-bold text-lg text-blue-600">
                            {formatCurrency(result.price)}
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center mr-2">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(result.rating)
                                      ? 'text-yellow-400'
                                      : i < result.rating
                                      ? 'text-yellow-300'
                                      : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              ({result.reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSearch;
