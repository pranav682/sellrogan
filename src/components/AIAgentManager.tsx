'use client';

import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { UserDataContext } from '@/lib/userDataService';
import { 
  Sparkles, 
  MessageCircle, 
  ShoppingBag, 
  Search, 
  TrendingUp, 
  Zap,
  ArrowRight,
  BarChart2,
  Package,
  Truck,
  CreditCard
} from 'lucide-react';

interface AIAgentManagerProps {
  className?: string;
}

const AIAgentManager: React.FC<AIAgentManagerProps> = ({ className = '' }) => {
  // Use user data context
  const { userData, trackEvent } = useContext(UserDataContext);
  
  // State for active agent
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  
  // State for chat messages
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome',
      type: 'agent',
      agent: 'coordinator',
      content: "Hello! I'm your AI assistant. I can help you find products to source, create listings, and manage your orders. What would you like to do today?",
      timestamp: new Date().toISOString()
    }
  ]);
  
  // State for user input
  const [userInput, setUserInput] = useState('');
  
  // State for loading
  const [isLoading, setIsLoading] = useState(false);
  
  // State for agent settings
  const [agentSettings, setAgentSettings] = useState({
    searchAgent: { enabled: true, proactivity: 'medium' },
    listingAgent: { enabled: true, proactivity: 'medium' },
    fulfillmentAgent: { enabled: true, proactivity: 'medium' },
    coordinatorAgent: { enabled: true, proactivity: 'medium' }
  });
  
  // State for settings modal
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // State for agent info
  const [showAgentInfo, setShowAgentInfo] = useState<string | null>(null);
  
  // State for suggested actions
  const [suggestedActions, setSuggestedActions] = useState<any[]>([
    { id: 'search', label: 'Find products to source', icon: Search },
    { id: 'create-listing', label: 'Create a new listing', icon: ShoppingBag },
    { id: 'analyze-market', label: 'Analyze market trends', icon: TrendingUp }
  ]);
  
  // State for context panel
  const [showContextPanel, setShowContextPanel] = useState(false);
  const [contextData, setContextData] = useState<any>({
    recentSearches: ['makhana', 'wireless earbuds', 'yoga mat'],
    recentProducts: [
      { id: 'p1', name: 'Organic Makhana', price: '$12.99', source: 'Supplier A' },
      { id: 'p2', name: 'Wireless Earbuds', price: '$49.99', source: 'Supplier B' }
    ],
    pendingOrders: 3,
    activeListings: 5
  });
  
  // Handle sending a message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userInput,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, userMessage]);
    
    // Track event
    trackEvent('ai_message_sent', { content: userInput });
    
    // Clear input
    setUserInput('');
    
    // Set loading
    setIsLoading(true);
    
    // Process message and determine which agent should respond
    processUserMessage(userInput);
  };
  
  // Process user message and determine which agent should respond
  const processUserMessage = (message: string) => {
    // Lowercase message for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Determine which agent should handle the message
    let agentType = 'coordinator';
    
    if (lowerMessage.includes('search') || 
        lowerMessage.includes('find') || 
        lowerMessage.includes('looking for') ||
        lowerMessage.includes('makhana') ||
        lowerMessage.includes('price') ||
        lowerMessage.includes('cheapest')) {
      agentType = 'search';
    } else if (lowerMessage.includes('list') || 
               lowerMessage.includes('sell') || 
               lowerMessage.includes('create listing') ||
               lowerMessage.includes('marketplace')) {
      agentType = 'listing';
    } else if (lowerMessage.includes('order') || 
               lowerMessage.includes('fulfill') || 
               lowerMessage.includes('shipping') ||
               lowerMessage.includes('delivery')) {
      agentType = 'fulfillment';
    }
    
    // Set active agent
    setActiveAgent(agentType);
    
    // Generate agent response based on message and agent type
    generateAgentResponse(message, agentType);
  };
  
  // Generate agent response
  const generateAgentResponse = (userMessage: string, agentType: string) => {
    // Simulate API call delay
    setTimeout(() => {
      let response = '';
      let suggestedFollowup: any[] = [];
      
      // Generate response based on agent type
      switch (agentType) {
        case 'search':
          if (userMessage.toLowerCase().includes('makhana')) {
            response = "I found several sources for makhana (fox nuts). The cheapest reliable option is from Supplier A at $8.50 per pound with free shipping on orders over $50. Would you like me to show you all available options with price comparisons?";
            suggestedFollowup = [
              { id: 'show-all-sources', label: 'Show all sources', icon: Search },
              { id: 'compare-prices', label: 'Compare prices', icon: BarChart2 },
              { id: 'create-listing-makhana', label: 'Create listing for makhana', icon: ShoppingBag }
            ];
            setContextData({
              ...contextData,
              productContext: {
                product: 'Makhana (Fox Nuts)',
                sources: [
                  { name: 'Supplier A', price: '$8.50/lb', shipping: 'Free over $50', rating: 4.8 },
                  { name: 'Supplier B', price: '$9.25/lb', shipping: '$5.99', rating: 4.9 },
                  { name: 'Supplier C', price: '$7.99/lb', shipping: '$8.99', rating: 4.2 }
                ]
              }
            });
            setShowContextPanel(true);
          } else {
            response = "I'd be happy to help you search for products. What specific item are you looking for? Please provide details like product type, quantity, and any specific requirements.";
          }
          break;
          
        case 'listing':
          response = "I can help you create optimized listings across multiple marketplaces. Would you like to create a new listing or optimize an existing one? I'll need information about the product, your target price, and which marketplaces you want to list on.";
          suggestedFollowup = [
            { id: 'new-listing', label: 'Create new listing', icon: ShoppingBag },
            { id: 'optimize-listing', label: 'Optimize existing listing', icon: Zap },
            { id: 'marketplace-recommendation', label: 'Recommend marketplace', icon: TrendingUp }
          ];
          break;
          
        case 'fulfillment':
          response = "I can help manage your order fulfillment process. I can automatically place orders with suppliers when you receive a sale, track shipments, and handle customer notifications. Would you like to see your current orders or set up automated fulfillment?";
          suggestedFollowup = [
            { id: 'view-orders', label: 'View current orders', icon: Package },
            { id: 'setup-auto-fulfillment', label: 'Setup auto-fulfillment', icon: Truck },
            { id: 'fulfillment-settings', label: 'Fulfillment settings', icon: CreditCard }
          ];
          break;
          
        case 'coordinator':
        default:
          if (userMessage.toLowerCase().includes('makhana')) {
            response = "I see you're interested in makhana (fox nuts). I can help you with the entire process - from finding the cheapest reliable source to creating optimized listings and fulfilling orders. Would you like me to search for makhana suppliers first?";
            suggestedFollowup = [
              { id: 'search-makhana', label: 'Search for makhana', icon: Search },
              { id: 'market-analysis-makhana', label: 'Market analysis for makhana', icon: BarChart2 }
            ];
          } else {
            response = "I'm here to coordinate your entire selling process. I can help you find products, create listings, and manage order fulfillment. What would you like assistance with today?";
            suggestedFollowup = [
              { id: 'find-products', label: 'Find products to source', icon: Search },
              { id: 'create-listing', label: 'Create a new listing', icon: ShoppingBag },
              { id: 'manage-orders', label: 'Manage orders', icon: Package }
            ];
          }
          break;
      }
      
      // Add agent response
      const agentMessage = {
        id: `agent-${Date.now()}`,
        type: 'agent',
        agent: agentType,
        content: response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, agentMessage]);
      
      // Update suggested actions
      setSuggestedActions(suggestedFollowup);
      
      // Set loading to false
      setIsLoading(false);
      
      // Track event
      trackEvent('ai_response_generated', { agent: agentType });
    }, 1500);
  };
  
  // Handle suggested action click
  const handleSuggestedActionClick = (actionId: string) => {
    let message = '';
    
    // Generate message based on action
    switch (actionId) {
      case 'search-makhana':
        message = "Search for makhana suppliers";
        break;
      case 'show-all-sources':
        message = "Show me all sources for makhana";
        break;
      case 'compare-prices':
        message = "Compare prices for makhana";
        break;
      case 'create-listing-makhana':
        message = "I want to create a listing for makhana";
        break;
      case 'market-analysis-makhana':
        message = "Provide market analysis for makhana";
        break;
      case 'new-listing':
        message = "I want to create a new listing";
        break;
      case 'optimize-listing':
        message = "Help me optimize my existing listing";
        break;
      case 'marketplace-recommendation':
        message = "Which marketplace is best for my product?";
        break;
      case 'view-orders':
        message = "Show me my current orders";
        break;
      case 'setup-auto-fulfillment':
        message = "I want to set up automated fulfillment";
        break;
      case 'fulfillment-settings':
        message = "Help me configure fulfillment settings";
        break;
      case 'find-products':
        message = "I want to find products to source";
        break;
      case 'create-listing':
        message = "I want to create a new listing";
        break;
      case 'manage-orders':
        message = "I need to manage my orders";
        break;
      default:
        message = actionId;
    }
    
    // Set user input and send message
    setUserInput(message);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
    
    // Track event
    trackEvent('suggested_action_clicked', { actionId });
  };
  
  // Handle settings update
  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track event
    trackEvent('agent_settings_updated', { settings: agentSettings });
    
    // Close settings modal
    setShowSettingsModal(false);
    
    // Add system message about settings update
    const systemMessage = {
      id: `system-${Date.now()}`,
      type: 'system',
      content: "AI agent settings have been updated.",
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, systemMessage]);
  };
  
  // Get agent name
  const getAgentName = (agentType: string) => {
    switch (agentType) {
      case 'search':
        return 'Search Agent';
      case 'listing':
        return 'Listing Agent';
      case 'fulfillment':
        return 'Fulfillment Agent';
      case 'coordinator':
        return 'Coordinator Agent';
      default:
        return 'AI Assistant';
    }
  };
  
  // Get agent icon
  const getAgentIcon = (agentType: string) => {
    switch (agentType) {
      case 'search':
        return <Search className="h-5 w-5 text-blue-500" />;
      case 'listing':
        return <ShoppingBag className="h-5 w-5 text-purple-500" />;
      case 'fulfillment':
        return <Package className="h-5 w-5 text-green-500" />;
      case 'coordinator':
        return <Sparkles className="h-5 w-5 text-indigo-500" />;
      default:
        return <MessageCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get agent color
  const getAgentColor = (agentType: string) => {
    switch (agentType) {
      case 'search':
        return 'bg-blue-100 text-blue-800';
      case 'listing':
        return 'bg-purple-100 text-purple-800';
      case 'fulfillment':
        return 'bg-green-100 text-green-800';
      case 'coordinator':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get agent description
  const getAgentDescription = (agentType: string) => {
    switch (agentType) {
      case 'search':
        return 'Finds the cheapest and most reliable sources for products you want to sell.';
      case 'listing':
        return 'Creates optimized listings across multiple marketplaces to maximize your sales.';
      case 'fulfillment':
        return 'Manages order fulfillment, automatically ordering from suppliers and tracking shipments.';
      case 'coordinator':
        return 'Coordinates between all agents, maintaining context and ensuring a seamless experience.';
      default:
        return 'Assists with various tasks related to your e-commerce business.';
    }
  };
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);
  
  return (
    <div className={`ai-agent-manager ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">AI Agent Manager</h2>
            {activeAgent && (
              <div className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getAgentColor(activeAgent)}`}>
                {getAgentName(activeAgent)}
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => setShowContextPanel(!showContextPanel)}
              className={`mr-2 p-1.5 rounded-full ${
                showContextPanel ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Toggle context panel"
            >
              <BarChart2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              title="Agent settings"
            >
              <Zap className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat area */}
          <div className={`flex-1 flex flex-col ${showContextPanel ? 'hidden md:flex' : ''}`}>
            {/* Messages */}
            <div 
              id="chat-container"
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'agent' && (
                    <div className="flex h-8 w-8 rounded-full items-center justify-center mr-2 flex-shrink-0">
                      {getAgentIcon(message.agent)}
                    </div>
                  )}
                  
                  <motion.div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : message.type === 'system'
                        ? 'bg-gray-100 text-gray-800 text-center max-w-full'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message.type === 'agent' && (
                      <div className="flex items-center mb-1">
                        <span className={`text-xs font-medium ${
                          message.agent === 'search' ? 'text-blue-600' :
                          message.agent === 'listing' ? 'text-purple-600' :
                          message.agent === 'fulfillment' ? 'text-green-600' :
                          'text-indigo-600'
                        }`}>
                          {getAgentName(message.agent)}
                        </span>
                        <button
                          onClick={() => setShowAgentInfo(message.agent)}
                          className="ml-1 text-gray-400 hover:text-gray-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="mt-1 text-xs opacity-70 text-right">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </motion.div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex h-8 w-8 rounded-full items-center justify-center mr-2">
                    {getAgentIcon(activeAgent || 'coordinator')}
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Suggested actions */}
            {suggestedActions.length > 0 && (
              <div className="p-3 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {suggestedActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleSuggestedActionClick(action.id)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 flex items-center"
                    >
                      {action.icon && <action.icon className="h-3.5 w-3.5 mr-1" />}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input area */}
            <div className="p-3 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={!userInput.trim() || isLoading}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
          
          {/* Context panel */}
          {showContextPanel && (
            <div className="w-full md:w-80 border-l border-gray-200 overflow-y-auto p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-3">Context & Information</h3>
              
              {contextData.productContext && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Product Information</h4>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm">
                    <p className="font-medium">{contextData.productContext.product}</p>
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-gray-500">Available Sources:</p>
                      {contextData.productContext.sources.map((source: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{source.name}</span>
                            <div className="flex items-center mt-0.5">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg 
                                    key={i} 
                                    className={`h-3 w-3 ${
                                      i < Math.floor(source.rating) 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300 fill-current'
                                    }`} 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 ml-1">{source.rating}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{source.price}</div>
                            <div className="text-xs text-gray-500">{source.shipping}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleSuggestedActionClick('create-listing-makhana')}
                        className="w-full px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center justify-center"
                      >
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        Create Listing
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h4>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <ul className="space-y-1">
                    {contextData.recentSearches.map((search: string, index: number) => (
                      <li key={index}>
                        <button
                          onClick={() => handleSuggestedActionClick(`search-${search}`)}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <Search className="h-3 w-3 mr-1" />
                          {search}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Products</h4>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <ul className="space-y-2">
                    {contextData.recentProducts.map((product: any, index: number) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="text-sm">{product.name}</span>
                        <span className="text-sm font-medium">{product.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-blue-600">{contextData.pendingOrders}</div>
                  <div className="text-xs text-gray-500">Pending Orders</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-green-600">{contextData.activeListings}</div>
                  <div className="text-xs text-gray-500">Active Listings</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="h-2 rounded-t-lg bg-blue-600"></div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-600" />
                AI Agent Settings
              </h3>
              
              <form onSubmit={handleUpdateSettings}>
                <div className="space-y-6">
                  {/* Coordinator Agent */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Sparkles className="h-5 w-5 text-indigo-600 mr-2" />
                        <h4 className="font-medium">Coordinator Agent</h4>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Enabled</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="coordinatorEnabled"
                            checked={agentSettings.coordinatorAgent.enabled}
                            onChange={(e) => setAgentSettings({
                              ...agentSettings,
                              coordinatorAgent: {
                                ...agentSettings.coordinatorAgent,
                                enabled: e.target.checked
                              }
                            })}
                            className="sr-only"
                          />
                          <label
                            htmlFor="coordinatorEnabled"
                            className={`block overflow-hidden h-5 rounded-full cursor-pointer ${
                              agentSettings.coordinatorAgent.enabled ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`block h-5 w-5 rounded-full bg-white transform transition-transform ${
                                agentSettings.coordinatorAgent.enabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Coordinates between all agents, maintaining context and ensuring a seamless experience.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proactivity Level
                      </label>
                      <select
                        value={agentSettings.coordinatorAgent.proactivity}
                        onChange={(e) => setAgentSettings({
                          ...agentSettings,
                          coordinatorAgent: {
                            ...agentSettings.coordinatorAgent,
                            proactivity: e.target.value
                          }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        disabled={!agentSettings.coordinatorAgent.enabled}
                      >
                        <option value="low">Low - Only responds when directly addressed</option>
                        <option value="medium">Medium - Occasionally offers suggestions</option>
                        <option value="high">High - Proactively guides the conversation</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Search Agent */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Search className="h-5 w-5 text-blue-600 mr-2" />
                        <h4 className="font-medium">Search Agent</h4>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Enabled</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="searchEnabled"
                            checked={agentSettings.searchAgent.enabled}
                            onChange={(e) => setAgentSettings({
                              ...agentSettings,
                              searchAgent: {
                                ...agentSettings.searchAgent,
                                enabled: e.target.checked
                              }
                            })}
                            className="sr-only"
                          />
                          <label
                            htmlFor="searchEnabled"
                            className={`block overflow-hidden h-5 rounded-full cursor-pointer ${
                              agentSettings.searchAgent.enabled ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`block h-5 w-5 rounded-full bg-white transform transition-transform ${
                                agentSettings.searchAgent.enabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Finds the cheapest and most reliable sources for products you want to sell.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proactivity Level
                      </label>
                      <select
                        value={agentSettings.searchAgent.proactivity}
                        onChange={(e) => setAgentSettings({
                          ...agentSettings,
                          searchAgent: {
                            ...agentSettings.searchAgent,
                            proactivity: e.target.value
                          }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        disabled={!agentSettings.searchAgent.enabled}
                      >
                        <option value="low">Low - Basic search results only</option>
                        <option value="medium">Medium - Includes price comparisons</option>
                        <option value="high">High - Detailed analysis and recommendations</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Listing Agent */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <ShoppingBag className="h-5 w-5 text-purple-600 mr-2" />
                        <h4 className="font-medium">Listing Agent</h4>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Enabled</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="listingEnabled"
                            checked={agentSettings.listingAgent.enabled}
                            onChange={(e) => setAgentSettings({
                              ...agentSettings,
                              listingAgent: {
                                ...agentSettings.listingAgent,
                                enabled: e.target.checked
                              }
                            })}
                            className="sr-only"
                          />
                          <label
                            htmlFor="listingEnabled"
                            className={`block overflow-hidden h-5 rounded-full cursor-pointer ${
                              agentSettings.listingAgent.enabled ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`block h-5 w-5 rounded-full bg-white transform transition-transform ${
                                agentSettings.listingAgent.enabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Creates optimized listings across multiple marketplaces to maximize your sales.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proactivity Level
                      </label>
                      <select
                        value={agentSettings.listingAgent.proactivity}
                        onChange={(e) => setAgentSettings({
                          ...agentSettings,
                          listingAgent: {
                            ...agentSettings.listingAgent,
                            proactivity: e.target.value
                          }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        disabled={!agentSettings.listingAgent.enabled}
                      >
                        <option value="low">Low - Basic listing creation</option>
                        <option value="medium">Medium - Optimized listings with suggestions</option>
                        <option value="high">High - Fully optimized with market analysis</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Fulfillment Agent */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="font-medium">Fulfillment Agent</h4>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Enabled</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="fulfillmentEnabled"
                            checked={agentSettings.fulfillmentAgent.enabled}
                            onChange={(e) => setAgentSettings({
                              ...agentSettings,
                              fulfillmentAgent: {
                                ...agentSettings.fulfillmentAgent,
                                enabled: e.target.checked
                              }
                            })}
                            className="sr-only"
                          />
                          <label
                            htmlFor="fulfillmentEnabled"
                            className={`block overflow-hidden h-5 rounded-full cursor-pointer ${
                              agentSettings.fulfillmentAgent.enabled ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`block h-5 w-5 rounded-full bg-white transform transition-transform ${
                                agentSettings.fulfillmentAgent.enabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Manages order fulfillment, automatically ordering from suppliers and tracking shipments.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proactivity Level
                      </label>
                      <select
                        value={agentSettings.fulfillmentAgent.proactivity}
                        onChange={(e) => setAgentSettings({
                          ...agentSettings,
                          fulfillmentAgent: {
                            ...agentSettings.fulfillmentAgent,
                            proactivity: e.target.value
                          }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        disabled={!agentSettings.fulfillmentAgent.enabled}
                      >
                        <option value="low">Low - Manual fulfillment only</option>
                        <option value="medium">Medium - Semi-automated with approval</option>
                        <option value="high">High - Fully automated fulfillment</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Agent Info Modal */}
      {showAgentInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className={`h-2 rounded-t-lg ${
              showAgentInfo === 'search' ? 'bg-blue-600' :
              showAgentInfo === 'listing' ? 'bg-purple-600' :
              showAgentInfo === 'fulfillment' ? 'bg-green-600' :
              'bg-indigo-600'
            }`}></div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                {getAgentIcon(showAgentInfo)}
                <h3 className="text-xl font-semibold ml-2">
                  {getAgentName(showAgentInfo)}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                {getAgentDescription(showAgentInfo)}
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-2">Capabilities</h4>
                <ul className="space-y-2">
                  {showAgentInfo === 'search' && (
                    <>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Finds the cheapest sources across multiple suppliers</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Evaluates supplier reliability and shipping times</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Compares prices including shipping costs</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Identifies bulk purchase opportunities</span>
                      </li>
                    </>
                  )}
                  
                  {showAgentInfo === 'listing' && (
                    <>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Creates optimized listings for multiple marketplaces</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Suggests optimal pricing based on market analysis</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Generates SEO-friendly titles and descriptions</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Recommends best marketplaces for specific products</span>
                      </li>
                    </>
                  )}
                  
                  {showAgentInfo === 'fulfillment' && (
                    <>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Automatically places orders with suppliers</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Tracks shipments and delivery status</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Handles customer notifications</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Manages inventory across multiple marketplaces</span>
                      </li>
                    </>
                  )}
                  
                  {showAgentInfo === 'coordinator' && (
                    <>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Maintains context across the entire conversation</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Delegates tasks to specialized agents</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Ensures seamless transitions between different tasks</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Provides a unified experience across the platform</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAgentInfo(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AIAgentManager;
