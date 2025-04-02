import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, Camera, X } from 'lucide-react';

interface SmartSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

interface Suggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'ai';
}

const SmartSearch: React.FC<SmartSearchProps> = ({
  placeholder = 'Search for products...',
  onSearch,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Mock AI suggestions - in a real app, this would come from an API
  const getAISuggestions = async (input: string): Promise<Suggestion[]> => {
    if (!input.trim()) return [];
    
    // Simulate API call
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsLoading(false);
    
    // Mock suggestions based on input
    const mockSuggestions: Suggestion[] = [
      { id: '1', text: `${input} best price`, type: 'ai' },
      { id: '2', text: `cheap ${input} online`, type: 'ai' },
      { id: '3', text: `${input} wholesale`, type: 'ai' },
      { id: '4', text: `${input} bulk purchase`, type: 'ai' },
    ];
    
    // Add some trending suggestions
    if (input.length > 2) {
      mockSuggestions.push(
        { id: '5', text: `${input} amazon vs walmart`, type: 'trending' },
        { id: '6', text: `${input} price history`, type: 'trending' }
      );
    }
    
    return mockSuggestions;
  };

  // Get recent searches from localStorage
  const getRecentSearches = (): Suggestion[] => {
    try {
      const recentSearches = localStorage.getItem('recentSearches');
      if (recentSearches) {
        return JSON.parse(recentSearches).map((text: string, index: number) => ({
          id: `recent-${index}`,
          text,
          type: 'recent'
        }));
      }
    } catch (error) {
      console.error('Error getting recent searches:', error);
    }
    return [];
  };

  // Save search to recent searches
  const saveToRecentSearches = (searchQuery: string) => {
    try {
      const recentSearches = localStorage.getItem('recentSearches');
      let searches = recentSearches ? JSON.parse(recentSearches) : [];
      
      // Remove if already exists
      searches = searches.filter((s: string) => s !== searchQuery);
      
      // Add to beginning
      searches.unshift(searchQuery);
      
      // Keep only last 5
      searches = searches.slice(0, 5);
      
      localStorage.setItem('recentSearches', JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  // Handle input change
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim()) {
        const aiSuggestions = await getAISuggestions(query);
        const recentSuggestions = getRecentSearches()
          .filter(s => s.text.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 3);
        
        setSuggestions([...recentSuggestions, ...aiSuggestions]);
      } else {
        setSuggestions(getRecentSearches().slice(0, 5));
      }
    };

    fetchSuggestions();
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[highlightedIndex].text);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      saveToRecentSearches(query);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (text: string) => {
    setQuery(text);
    onSearch(text);
    saveToRecentSearches(text);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle voice search
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setTimeout(() => handleSearch(), 300);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  // Handle image search (mock implementation)
  const handleImageSearch = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real app, you would upload the image to your server
        // and perform image recognition/search
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setQuery('product from image');
          handleSearch();
        }, 1500);
      }
    };
    input.click();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`smart-search-container ${className}`}>
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          className="form-control pr-24"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-activedescendant={
            highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined
          }
        />
        
        {query && (
          <button
            type="button"
            className="absolute right-20 text-neutral-400 hover:text-neutral-600"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
        
        <div className="absolute right-2 flex space-x-1">
          <button
            type="button"
            className={`p-1 rounded-full ${isListening ? 'text-primary-600 bg-primary-100' : 'text-neutral-400 hover:text-neutral-600'}`}
            onClick={handleVoiceSearch}
            aria-label="Voice search"
          >
            <Mic size={18} />
          </button>
          
          <button
            type="button"
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-600"
            onClick={handleImageSearch}
            aria-label="Image search"
          >
            <Camera size={18} />
          </button>
          
          <button
            type="button"
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-600"
            onClick={handleSearch}
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>
      </div>
      
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="smart-search-suggestions"
          id="search-suggestions"
          role="listbox"
        >
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="loading-spinner mx-auto"></div>
              <p className="mt-2 text-neutral-500">Searching...</p>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                id={`suggestion-${index}`}
                className={`smart-search-item ${
                  index === highlightedIndex ? 'highlighted' : ''
                }`}
                onClick={() => handleSelectSuggestion(suggestion.text)}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                <div className="flex items-center">
                  <Search size={16} className="mr-2 text-neutral-400" />
                  <span>{suggestion.text}</span>
                  {suggestion.type === 'recent' && (
                    <span className="ml-auto text-xs text-neutral-400">Recent</span>
                  )}
                  {suggestion.type === 'trending' && (
                    <span className="ml-auto text-xs text-accent-info">Trending</span>
                  )}
                  {suggestion.type === 'ai' && (
                    <span className="ml-auto text-xs text-primary-600">AI Suggestion</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-neutral-500">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
