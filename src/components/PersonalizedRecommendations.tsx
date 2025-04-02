'use client';

import React, { useState, useEffect } from 'react';
import { UserDataContext } from '@/lib/userDataService';
import { Sparkles, TrendingUp, Zap, BarChart2, ShoppingBag } from 'lucide-react';

interface PersonalizedRecommendationsProps {
  className?: string;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ className = '' }) => {
  // Use user data context
  const { userData, privacySettings, trackEvent } = React.useContext(UserDataContext);
  
  // State for recommendations
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate mock recommendations based on user data
  const generateRecommendations = () => {
    // In a real implementation, this would use AI to analyze user data
    // For now, we'll generate mock recommendations
    const mockRecommendations = [
      {
        id: 'rec-001',
        title: 'Electronics Deals',
        type: 'search_based',
        confidence: 0.92,
        products: ['Smartphone', 'Laptop', 'Headphones']
      },
      {
        id: 'rec-002',
        title: 'Home Essentials',
        type: 'product_based',
        confidence: 0.85,
        products: ['Kitchen Appliances', 'Furniture', 'Decor']
      },
      {
        id: 'rec-003',
        title: 'Amazon Bestsellers',
        type: 'marketplace_based',
        confidence: 0.78,
        products: ['Books', 'Toys', 'Fashion']
      }
    ];
    
    return mockRecommendations;
  };
  
  // Get recommendations on mount and when userData changes
  useEffect(() => {
    if (privacySettings.allowPersonalization && privacySettings.allowCookies) {
      setIsLoading(true);
      // In a real implementation, this might be an API call
      // For now, we'll use a timeout to simulate loading
      setTimeout(() => {
        const recs = generateRecommendations();
        setRecommendations(recs);
        setIsLoading(false);
      }, 1000);
    } else {
      setRecommendations([]);
      setIsLoading(false);
    }
  }, [userData, privacySettings]);
  
  // Handle recommendation click
  const handleRecommendationClick = (recommendation: any) => {
    trackEvent('recommendation_click', { recommendation });
  };
  
  // If personalization is disabled, show opt-in message
  if (!privacySettings.allowPersonalization || !privacySettings.allowCookies) {
    return (
      <div className={`personalized-recommendations ${className}`}>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Personalized Recommendations</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            Enable personalization in your privacy settings to receive tailored product recommendations
            based on your interests and browsing history.
          </p>
          
          <button
            onClick={() => {
              // In a real implementation, this would navigate to privacy settings
              // or open a modal to enable personalization
              console.log('Navigate to privacy settings');
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            Enable Personalization
          </button>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className={`personalized-recommendations ${className}`}>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Personalized For You</h2>
          </div>
          
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 h-32 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // No recommendations yet
  if (recommendations.length === 0) {
    return (
      <div className={`personalized-recommendations ${className}`}>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Personalized For You</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            As you browse products and search for items, we'll learn your preferences
            and provide personalized recommendations here.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <ShoppingBag className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="font-medium">Browse Products</h3>
              </div>
              <p className="text-sm text-gray-500">
                Explore products to help us understand your interests
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Zap className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="font-medium">Search Specifically</h3>
              </div>
              <p className="text-sm text-gray-500">
                Search for specific items to refine your recommendations
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="font-medium">Check Back Soon</h3>
              </div>
              <p className="text-sm text-gray-500">
                We'll analyze your activity to suggest relevant products
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Get icon for recommendation type
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'search_based':
        return <Zap className="h-5 w-5 text-blue-600" />;
      case 'product_based':
        return <ShoppingBag className="h-5 w-5 text-purple-600" />;
      case 'marketplace_based':
        return <BarChart2 className="h-5 w-5 text-green-600" />;
      default:
        return <Sparkles className="h-5 w-5 text-orange-600" />;
    }
  };
  
  // Get background color for recommendation type
  const getRecommendationBg = (type: string) => {
    switch (type) {
      case 'search_based':
        return 'bg-blue-50 hover:bg-blue-100';
      case 'product_based':
        return 'bg-purple-50 hover:bg-purple-100';
      case 'marketplace_based':
        return 'bg-green-50 hover:bg-green-100';
      default:
        return 'bg-orange-50 hover:bg-orange-100';
    }
  };
  
  // Render recommendations
  return (
    <div className={`personalized-recommendations ${className}`}>
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold">Personalized For You</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((recommendation, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg cursor-pointer transition-colors duration-200 ${getRecommendationBg(recommendation.type)}`}
              onClick={() => handleRecommendationClick(recommendation)}
            >
              <div className="flex items-center mb-2">
                {getRecommendationIcon(recommendation.type)}
                <h3 className="font-medium ml-2">{recommendation.title}</h3>
              </div>
              
              {recommendation.type === 'search_based' && (
                <p className="text-sm text-gray-600">
                  Find more products related to your searches
                </p>
              )}
              
              {recommendation.type === 'product_based' && (
                <p className="text-sm text-gray-600">
                  Discover products similar to ones you've viewed
                </p>
              )}
              
              {recommendation.type === 'marketplace_based' && (
                <p className="text-sm text-gray-600">
                  Explore deals from your preferred marketplace
                </p>
              )}
              
              <div className="mt-2 text-xs text-gray-500">
                Confidence: {Math.round(recommendation.confidence * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
