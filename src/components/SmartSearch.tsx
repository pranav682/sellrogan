'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, MessageSquare, Sparkles, Filter } from 'lucide-react';
import { answerSellingQuestion } from '@/lib/geminiAIService';

interface SmartSearchProps {
  className?: string;
  onSearch?: (query: string, filters: any) => void;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ 
  className = '',
  onSearch = () => {}
}) => {
  // Search state
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Conversation state
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', text: string}>>([]);
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    platform: '',
    minPrice: '',
    maxPrice: '',
    category: '',
    condition: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Mock suggestions based on query
  useEffect(() => {
    if (query.length > 1) {
      const mockSuggestions = [
        `${query} on Amazon`,
        `${query} best price`,
        `${query} for reselling`,
        `wholesale ${query}`,
        `${query} profit margin`
      ];
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query]);
  
  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle search submission
  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Add to search history
    if (!searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev].slice(0, 5));
    }
    
    // If not in conversation mode, just perform the search
    if (!isConversationMode) {
      onSearch(query, filters);
      setIsSearching(false);
      setShowSuggestions(false);
      return;
    }
    
    // In conversation mode, add the query to conversation
    setConversation(prev => [...prev, { type: 'user', text: query }]);
    setQuery('');
    
    // Simulate AI thinking
    setIsAiThinking(true);
    
    // Generate AI response based on the query
    generateAiResponse(query);
  };
  
  // Generate AI response for conversation mode
  const generateAiResponse = async (userQuery: string) => {
    try {
      // Determine if this is the first query or a follow-up
      const isFirstQuery = conversation.length === 0;
      
      if (isFirstQuery) {
        // For first query, ask a clarifying question
        const clarifyingQuestions = [
          `What price range are you looking for with "${userQuery}"?`,
          `Are you interested in new or used "${userQuery}"?`,
          `Which marketplace would you prefer to source "${userQuery}" from?`,
          `Are you looking for "${userQuery}" to resell or for personal use?`
        ];
        
        // Select a random question
        const randomQuestion = clarifyingQuestions[Math.floor(Math.random() * clarifyingQuestions.length)];
        
        // Generate options based on the question
        let options: string[] = [];
        if (randomQuestion.includes('price range')) {
          options = ['Under $20', '$20-$50', '$50-$100', 'Over $100'];
        } else if (randomQuestion.includes('new or used')) {
          options = ['New', 'Used - Like New', 'Used - Good', 'Used - Acceptable'];
        } else if (randomQuestion.includes('marketplace')) {
          options = ['Amazon', 'eBay', 'Walmart', 'Etsy', 'Any marketplace'];
        } else if (randomQuestion.includes('resell or for personal')) {
          options = ['For reselling', 'Personal use', 'Both'];
        }
        
        setTimeout(() => {
          setAiQuestion(randomQuestion);
          setAiSuggestions(options);
          setIsAiThinking(false);
          setConversation(prev => [...prev, { type: 'ai', text: randomQuestion }]);
        }, 1500);
      } else {
        // For follow-up queries, use the Gemini AI to generate a response
        const previousContext = conversation.map(msg => `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n');
        
        const prompt = `
          Previous conversation:
          ${previousContext}
          
          User: ${userQuery}
          
          Based on this conversation about product search, generate:
          1. A helpful response that narrows down what the user is looking for
          2. A specific search query that would give the best results
          3. 2-4 suggested filter options that would be relevant
          
          Format your response exactly as follows:
          RESPONSE: [your helpful response]
          SEARCH_QUERY: [specific search query]
          FILTERS: [filter1, filter2, ...]
        `;
        
        // Use a simulated response for now
        // In a real implementation, we would call the Gemini AI here
        setTimeout(() => {
          const simulatedResponse = {
            response: `I'll help you find the best options for ${userQuery}. Let me search for that with some recommended filters.`,
            searchQuery: userQuery,
            filters: ['Amazon', 'New condition', 'Free shipping', 'Highly rated']
          };
          
          // Update conversation with AI response
          setConversation(prev => [...prev, { type: 'ai', text: simulatedResponse.response }]);
          
          // Perform the search with the refined query
          onSearch(simulatedResponse.searchQuery, filters);
          
          // Update UI state
          setIsAiThinking(false);
          setAiQuestion('');
          setAiSuggestions([]);
          
          // Exit conversation mode after completing the search
          setTimeout(() => {
            setIsConversationMode(false);
          }, 2000);
        }, 2000);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsAiThinking(false);
      setConversation(prev => [...prev, { type: 'ai', text: 'I apologize, but I encountered an error. Could you try asking in a different way?' }]);
    }
  };
  
  // Handle option selection in conversation mode
  const handleOptionSelect = (option: string) => {
    // Add selected option to conversation
    setConversation(prev => [...prev, { type: 'user', text: option }]);
    
    // Simulate AI thinking
    setIsAiThinking(true);
    
    // Clear current options
    setAiSuggestions([]);
    
    // Update filters based on selection
    if (['Amazon', 'eBay', 'Walmart', 'Etsy'].includes(option)) {
      setFilters(prev => ({ ...prev, platform: option }));
    } else if (['New', 'Used - Like New', 'Used - Good', 'Used - Acceptable'].includes(option)) {
      setFilters(prev => ({ ...prev, condition: option }));
    } else if (['Under $20', '$20-$50', '$50-$100', 'Over $100'].includes(option)) {
      let minPrice = '';
      let maxPrice = '';
      
      if (option === 'Under $20') {
        maxPrice = '20';
      } else if (option === '$20-$50') {
        minPrice = '20';
        maxPrice = '50';
      } else if (option === '$50-$100') {
        minPrice = '50';
        maxPrice = '100';
      } else if (option === 'Over $100') {
        minPrice = '100';
      }
      
      setFilters(prev => ({ ...prev, minPrice, maxPrice }));
    }
    
    // Generate next AI response
    generateAiResponse(option);
  };
  
  // Toggle conversation mode
  const toggleConversationMode = () => {
    setIsConversationMode(!isConversationMode);
    if (!isConversationMode) {
      // Entering conversation mode
      setConversation([]);
      setAiQuestion('');
      setAiSuggestions([]);
    }
  };
  
  // Reset search
  const resetSearch = () => {
    setQuery('');
    setFilters({
      platform: '',
      minPrice: '',
      maxPrice: '',
      category: '',
      condition: ''
    });
    setIsConversationMode(false);
    setConversation([]);
    setAiQuestion('');
    setAiSuggestions([]);
    setShowFilters(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  return (
    <div className={`smart-search ${className}`}>
      <div className="relative">
        {/* Search input */}
        <div className="flex items-center">
          <div className="relative flex-1">
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowSuggestions(query.length > 0)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={isConversationMode ? "Ask me about products..." : "Search for products..."}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-expanded={showSuggestions}
              role="textbox"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* Search button */}
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isSearching}
            className={`ml-2 px-4 py-2.5 rounded-lg font-medium flex items-center ${
              !query.trim() || isSearching
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
          </button>
          
          {/* Conversation mode toggle */}
          <button
            onClick={toggleConversationMode}
            className={`ml-2 px-3 py-2.5 rounded-lg ${
              isConversationMode
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isConversationMode ? "Exit conversation mode" : "Enter conversation mode"}
          >
            {isConversationMode ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <MessageSquare className="h-5 w-5" />
            )}
          </button>
          
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`ml-2 px-3 py-2.5 rounded-lg ${
              showFilters
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={showFilters ? "Hide filters" : "Show filters"}
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
        
        {/* Search suggestions */}
        {showSuggestions && suggestions.length > 0 && !isConversationMode && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => {
                  setQuery(suggestion);
                  setShowSuggestions(false);
                  handleSearch();
                }}
              >
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <span>{suggestion}</span>
              </div>
            ))}
            
            {searchHistory.length > 0 && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="px-4 py-1 text-xs text-gray-500">Recent searches</div>
                {searchHistory.slice(0, 3).map((item, index) => (
                  <div
                    key={`history-${index}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => {
                      setQuery(item);
                      setShowSuggestions(false);
                      handleSearch();
                    }}
                  >
                    <Search className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{item}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
        
        {/* Filters panel */}
        {showFilters && (
          <div className="mt-2 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  value={filters.platform}
                  onChange={(e) => setFilters({...filters, platform: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">All Platforms</option>
                  <option value="Amazon">Amazon</option>
                  <option value="eBay">eBay</option>
                  <option value="Walmart">Walmart</option>
                  <option value="Etsy">Etsy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters({...filters, condition: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Any Condition</option>
                  <option value="New">New</option>
                  <option value="Used - Like New">Used - Like New</option>
                  <option value="Used - Good">Used - Good</option>
                  <option value="Used - Acceptable">Used - Acceptable</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={resetSearch}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  handleSearch();
                  setShowFilters(false);
                }}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Conversation interface */}
      {isConversationMode && conversation.length > 0 && (
        <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="space-y-4">
            {conversation.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            
            {isAiThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-800">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* AI suggestions */}
          {aiSuggestions.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
