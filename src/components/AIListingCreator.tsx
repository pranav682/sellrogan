'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AIListingCreatorProps {
  className?: string;
}

const AIListingCreator: React.FC<AIListingCreatorProps> = ({ className = '' }) => {
  // State for product information
  const [productInfo, setProductInfo] = useState({
    name: '',
    category: '',
    description: '',
    features: '',
    condition: 'new',
    price: '',
    images: [] as string[]
  });
  
  // State for generated listing
  const [generatedListing, setGeneratedListing] = useState<any>(null);
  
  // State for loading
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('product-info');
  const [selectedMarketplace, setSelectedMarketplace] = useState('amazon');
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductInfo({
      ...productInfo,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateListing();
  };
  
  // Generate listing
  const generateListing = () => {
    setIsGenerating(true);
    
    // Simulate API call to generate listing
    setTimeout(() => {
      const listing = generateMockListing();
      setGeneratedListing(listing);
      setIsGenerating(false);
      setActiveTab('generated-listing');
    }, 3000);
  };
  
  // Generate mock listing
  const generateMockListing = () => {
    const marketplaceTemplates = {
      amazon: {
        title: `${productInfo.name} - Premium Quality ${productInfo.category} for All Your Needs`,
        description: `<p>Experience the exceptional quality of our ${productInfo.name}. ${productInfo.description}</p>
        <p>Key Features:</p>
        <ul>
          ${productInfo.features.split('\n').map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <p>Perfect for anyone looking for a reliable ${productInfo.category.toLowerCase()}. Order now and enjoy fast shipping!</p>`,
        bulletPoints: productInfo.features.split('\n').slice(0, 5),
        keywords: `${productInfo.name}, ${productInfo.category}, premium, quality`,
        price: productInfo.price ? parseFloat(productInfo.price) : 29.99,
        recommendedPrice: productInfo.price ? (parseFloat(productInfo.price) * 1.2).toFixed(2) : '35.99',
        images: productInfo.images.length > 0 ? productInfo.images : ['https://via.placeholder.com/500x500?text=Product+Image']
      },
      ebay: {
        title: `NEW: ${productInfo.name} - Top Quality ${productInfo.category} - Fast Shipping!`,
        description: `<p><strong>Description:</strong></p>
        <p>${productInfo.description}</p>
        <p><strong>Features:</strong></p>
        <ul>
          ${productInfo.features.split('\n').map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <p><strong>Condition:</strong> ${productInfo.condition.charAt(0).toUpperCase() + productInfo.condition.slice(1)}</p>
        <p><strong>Shipping:</strong> Fast & Free Shipping Available!</p>
        <p>100% Satisfaction Guaranteed!</p>`,
        format: 'Buy It Now',
        duration: '30 days',
        price: productInfo.price ? parseFloat(productInfo.price) : 29.99,
        recommendedPrice: productInfo.price ? (parseFloat(productInfo.price) * 1.15).toFixed(2) : '34.49',
        images: productInfo.images.length > 0 ? productInfo.images : ['https://via.placeholder.com/500x500?text=Product+Image']
      },
      etsy: {
        title: `Handcrafted ${productInfo.name} | Premium ${productInfo.category} | Perfect Gift Idea`,
        description: `<p>Welcome to our shop!</p>
        <p>${productInfo.description}</p>
        <p><strong>What makes this ${productInfo.name} special:</strong></p>
        <ul>
          ${productInfo.features.split('\n').map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <p><strong>Materials:</strong> Premium quality materials</p>
        <p><strong>Dimensions:</strong> Standard size</p>
        <p>Thank you for supporting our small business!</p>`,
        tags: [`${productInfo.name}`, `${productInfo.category}`, 'premium', 'quality', 'gift idea'],
        price: productInfo.price ? parseFloat(productInfo.price) : 29.99,
        recommendedPrice: productInfo.price ? (parseFloat(productInfo.price) * 1.25).toFixed(2) : '37.49',
        images: productInfo.images.length > 0 ? productInfo.images : ['https://via.placeholder.com/500x500?text=Product+Image']
      },
      walmart: {
        title: `${productInfo.name} - High Quality ${productInfo.category} at Everyday Low Price`,
        description: `<p>${productInfo.description}</p>
        <p>Features:</p>
        <ul>
          ${productInfo.features.split('\n').map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <p>Specifications:</p>
        <ul>
          <li>Brand: SellRogan</li>
          <li>Condition: ${productInfo.condition.charAt(0).toUpperCase() + productInfo.condition.slice(1)}</li>
          <li>Category: ${productInfo.category}</li>
        </ul>`,
        price: productInfo.price ? parseFloat(productInfo.price) : 29.99,
        recommendedPrice: productInfo.price ? (parseFloat(productInfo.price) * 1.1).toFixed(2) : '32.99',
        images: productInfo.images.length > 0 ? productInfo.images : ['https://via.placeholder.com/500x500?text=Product+Image']
      }
    };
    
    return marketplaceTemplates[selectedMarketplace as keyof typeof marketplaceTemplates];
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = [...productInfo.images];
      
      // For demo purposes, we'll just use placeholder images
      for (let i = 0; i < e.target.files.length; i++) {
        newImages.push(`https://via.placeholder.com/500x500?text=Product+Image+${productInfo.images.length + i + 1}`);
      }
      
      setProductInfo({
        ...productInfo,
        images: newImages
      });
    }
  };
  
  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    const newImages = [...productInfo.images];
    newImages.splice(index, 1);
    
    setProductInfo({
      ...productInfo,
      images: newImages
    });
  };
  
  // Format currency
  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  };
  
  return (
    <div className={`ai-listing-creator ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">AI Listing Creator</h2>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'product-info'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('product-info')}
          >
            Product Information
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'generated-listing'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('generated-listing')}
            disabled={!generatedListing}
          >
            Generated Listing
          </button>
        </div>
        
        {/* Product Information Form */}
        {activeTab === 'product-info' && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={productInfo.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Wireless Bluetooth Headphones"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={productInfo.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Electronics, Clothing, Home Goods"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={productInfo.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your product in detail..."
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">
                    Features (one per line)
                  </label>
                  <textarea
                    id="features"
                    name="features"
                    value={productInfo.features}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={productInfo.condition}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Cost Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={productInfo.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 29.99"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="marketplace" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Marketplace
                  </label>
                  <select
                    id="marketplace"
                    name="marketplace"
                    value={selectedMarketplace}
                    onChange={(e) => setSelectedMarketplace(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="amazon">Amazon</option>
                    <option value="ebay">eBay</option>
                    <option value="etsy">Etsy</option>
                    <option value="walmart">Walmart</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images
                  </label>
                  <div className="border border-dashed border-gray-300 rounded-md p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {productInfo.images.map((image, index) => (
                        <div key={index} className="relative w-20 h-20">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <div className="text-sm text-gray-600">
                        {productInfo.images.length === 0 ? 'Upload images' : 'Add more images'}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isGenerating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Listing'}
              </button>
            </div>
          </form>
        )}
        
        {/* Generated Listing */}
        {activeTab === 'generated-listing' && generatedListing && (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Generated Listing for {selectedMarketplace.charAt(0).toUpperCase() + selectedMarketplace.slice(1)}</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Marketplace:</span>
                  <select
                    value={selectedMarketplace}
                    onChange={(e) => {
                      setSelectedMarketplace(e.target.value);
                      setGeneratedListing(generateMockListing());
                    }}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="amazon">Amazon</option>
                    <option value="ebay">eBay</option>
                    <option value="etsy">Etsy</option>
                    <option value="walmart">Walmart</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Title</h4>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {generatedListing.title}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                    <div 
                      className="p-3 bg-gray-50 rounded-md prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: generatedListing.description }}
                    />
                  </div>
                  
                  {generatedListing.bulletPoints && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Bullet Points</h4>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <ul className="list-disc list-inside space-y-1">
                          {generatedListing.bulletPoints.map((point: string, index: number) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {generatedListing.tags && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Tags</h4>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <div className="flex flex-wrap gap-2">
                          {generatedListing.tags.map((tag: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {generatedListing.keywords && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Keywords</h4>
                      <div className="p-3 bg-gray-50 rounded-md">
                        {generatedListing.keywords}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Images</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {generatedListing.images.map((image: string, index: number) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-40 object-cover rounded"
                          />
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Main Image
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Pricing</h4>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Your Cost</div>
                          <div className="font-medium">{formatCurrency(generatedListing.price)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Recommended Selling Price</div>
                          <div className="font-medium text-green-600">{formatCurrency(generatedListing.recommendedPrice)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Estimated Profit</div>
                          <div className="font-medium text-green-600">
                            {formatCurrency(parseFloat(generatedListing.recommendedPrice) - generatedListing.price)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Profit Margin</div>
                          <div className="font-medium text-green-600">
                            {Math.round(((parseFloat(generatedListing.recommendedPrice) - generatedListing.price) / parseFloat(generatedListing.recommendedPrice)) * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedMarketplace === 'ebay' && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Listing Details</h4>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-gray-500">Format</div>
                            <div className="font-medium">{generatedListing.format}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Duration</div>
                            <div className="font-medium">{generatedListing.duration}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Marketplace-Specific Optimizations</h4>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <ul className="space-y-2 text-sm">
                        {selectedMarketplace === 'amazon' && (
                          <>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Title optimized for Amazon search algorithm</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Bullet points formatted for maximum visibility</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Keywords selected for high search volume</span>
                            </li>
                          </>
                        )}
                        
                        {selectedMarketplace === 'ebay' && (
                          <>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Title includes high-converting keywords for eBay</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Description formatted for mobile viewing</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Buy It Now format for immediate sales</span>
                            </li>
                          </>
                        )}
                        
                        {selectedMarketplace === 'etsy' && (
                          <>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Title optimized for Etsy's search algorithm</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Tags selected for maximum visibility</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Description emphasizes handcrafted quality</span>
                            </li>
                          </>
                        )}
                        
                        {selectedMarketplace === 'walmart' && (
                          <>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Title formatted for Walmart search visibility</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Competitive pricing strategy for Walmart marketplace</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Specifications formatted for easy scanning</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setActiveTab('product-info')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Edit Product Info
              </button>
              
              <div>
                <button
                  onClick={() => {
                    // This would actually post the listing to the marketplace
                    alert(`Listing would be posted to ${selectedMarketplace.charAt(0).toUpperCase() + selectedMarketplace.slice(1)}`);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-2"
                >
                  Post to {selectedMarketplace.charAt(0).toUpperCase() + selectedMarketplace.slice(1)}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIListingCreator;
