import React, { useState, useEffect } from 'react';
import { Bot, X, Maximize2, Minimize2, Send } from 'lucide-react';

interface AIAssistantProps {
  className?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          text: "Hello! I'm your SourceAndSell assistant. I can help you find products, analyze prices, and create listings. How can I help you today?",
          sender: 'assistant',
          timestamp: new Date()
        }
      ]);
      
      // Set initial suggestions
      setSuggestions([
        "Find the cheapest electronics",
        "How to optimize my listings",
        "Compare prices across platforms"
      ]);
    }
  }, [messages.length]);

  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle sending a message
  const handleSendMessage = (text: string = input) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Generate AI response (mock implementation)
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        text: aiResponse.text,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setSuggestions(aiResponse.suggestions);
      setIsTyping(false);
    }, 1000);
  };

  // Mock AI response generation
  const generateAIResponse = (userMessage: string): { text: string; suggestions: string[] } => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Product search related
    if (lowerCaseMessage.includes('find') || lowerCaseMessage.includes('search') || lowerCaseMessage.includes('looking for')) {
      return {
        text: "I can help you search for products! What specific details are you looking for? For example, brand, model, price range, or specific features.",
        suggestions: [
          "Search for products under $50",
          "Find electronics with free shipping",
          "Look for bulk discounts"
        ]
      };
    }
    
    // Price comparison related
    if (lowerCaseMessage.includes('price') || lowerCaseMessage.includes('compare') || lowerCaseMessage.includes('cheapest')) {
      return {
        text: "I can help you compare prices across different platforms. Would you like me to find the best deals for a specific product?",
        suggestions: [
          "Compare prices for iPhone chargers",
          "Find the cheapest shipping options",
          "Show price history for this product"
        ]
      };
    }
    
    // Listing related
    if (lowerCaseMessage.includes('list') || lowerCaseMessage.includes('sell') || lowerCaseMessage.includes('posting')) {
      return {
        text: "I can help you create optimized listings to maximize your sales. Would you like me to help you create a new listing or optimize an existing one?",
        suggestions: [
          "Create a new listing",
          "Optimize my existing listings",
          "Suggest pricing for my product"
        ]
      };
    }
    
    // Default response
    return {
      text: "I'm here to help you source products at the best prices and sell them for maximum profit. What specific aspect of your e-commerce business can I assist with today?",
      suggestions: [
        "How to find reliable suppliers",
        "Tips for increasing profit margins",
        "Best platforms to sell on"
      ]
    };
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  // Handle key press in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render the minimized button
  if (!isExpanded) {
    return (
      <button 
        className={`ai-assistant ${className}`}
        onClick={toggleExpanded}
        aria-label="Open AI Assistant"
      >
        <Bot size={24} />
      </button>
    );
  }

  // Render the expanded assistant
  return (
    <div className={`ai-assistant expanded ${className}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-primary-600 text-white rounded-t-lg">
          <div className="flex items-center">
            <Bot size={20} className="mr-2" />
            <h3 className="font-medium m-0">SourceAndSell Assistant</h3>
          </div>
          <div className="flex">
            <button 
              className="p-1 hover:bg-primary-700 rounded-full"
              onClick={toggleExpanded}
              aria-label="Minimize Assistant"
            >
              <Minimize2 size={18} />
            </button>
            <button 
              className="p-1 hover:bg-primary-700 rounded-full ml-1"
              onClick={() => setIsExpanded(false)}
              aria-label="Close Assistant"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-3 overflow-y-auto bg-white">
          {messages.map(message => (
            <div 
              key={message.id}
              className={`mb-3 ${
                message.sender === 'user' 
                  ? 'ml-auto max-w-[80%]' 
                  : 'mr-auto max-w-[80%]'
              }`}
            >
              <div 
                className={`p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-neutral-100 text-neutral-800'
                }`}
              >
                {message.text}
              </div>
              <div 
                className={`text-xs mt-1 text-neutral-500 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="mr-auto max-w-[80%] mb-3">
              <div className="p-3 rounded-lg bg-neutral-100 text-neutral-800">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="p-2 bg-neutral-50 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="text-sm bg-white border border-neutral-200 rounded-full px-3 py-1 hover:bg-neutral-100 text-neutral-700"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input */}
        <div className="p-3 bg-white border-t border-neutral-200 rounded-b-lg">
          <div className="flex items-center">
            <textarea
              className="form-control resize-none"
              placeholder="Type your message..."
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="ml-2 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleSendMessage()}
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
