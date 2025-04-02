'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Clipboard, Check, X, Image, FileText, Tag, DollarSign } from 'lucide-react';
import { generateProductListing } from '@/lib/aiListingAgent';
import { generateProductDescription } from '@/lib/geminiAIService';

interface AIListingCreatorProps {
  className?: string;
  initialProductData?: any;
}

const AIListingCreator: React.FC<AIListingCreatorProps> = ({ 
  className = '',
  initialProductData = null
}) => {
  // Product data state
  const [productData, setProductData] = useState({
    name: initialProductData?.name || '',
    category: initialProductData?.category || '',
    price: initialProductData?.price || '',
    features: initialProductData?.features || '',
    targetAudience: initialProductData?.targetAudience || '',
    competitiveAdvantage: initialProductData?.competitiveAdvantage || '',
    imageUrl: initialProductData?.imageUrl || '',
  });
  
  // Generated content state
  const [generatedContent, setGeneratedContent] = useState({
    title: '',
    description: '',
    bulletPoints: [] as string[],
    keywords: [] as string[],
  });
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'preview'>('input');
  const [generationComplete, setGenerationComplete] = useState(false);
  const [optimizationLevel, setOptimizationLevel] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [platform, setPlatform] = useState<'amazon' | 'ebay' | 'etsy' | 'walmart'>('amazon');
  const [error, setError] = useState<string | null>(null);
  
  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setProductData({
      ...productData,
      [field]: value
    });
    
    // Reset generated content when inputs change
    if (generationComplete) {
      setGenerationComplete(false);
    }
  };
  
  // Generate optimized listing
  const generateOptimizedListing = async () => {
    // Validate inputs
    if (!productData.name || !productData.category || !productData.features) {
      setError('Please fill in the required fields: Product Name, Category, and Key Features');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Generate listing using AI
      const result = await generateProductListing({
        productName: productData.name,
        category: productData.category,
        price: productData.price,
        features: productData.features,
        targetAudience: productData.targetAudience,
        competitiveAdvantage: productData.competitiveAdvantage,
        platform,
        optimizationLevel,
      });
      
      // Generate a more detailed description using Gemini
      const detailedDescription = await generateProductDescription(
        productData.name,
        productData.features,
        productData.targetAudience,
        platform
      );
      
      // Update with generated content
      setGeneratedContent({
        title: result.title || `${productData.name} - Premium Quality`,
        description: detailedDescription || result.description,
        bulletPoints: result.bulletPoints || [
          'High-quality materials for durability',
          'Easy to use and maintain',
          'Perfect for everyday use',
          'Makes a great gift'
        ],
        keywords: result.keywords || [
          productData.name.toLowerCase(),
          productData.category.toLowerCase(),
          'quality',
          'premium'
        ],
      });
      
      setGenerationComplete(true);
      setActiveTab('preview');
    } catch (err) {
      console.error('Error generating listing:', err);
      setError('Failed to generate listing. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Copy content to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, would show a toast notification
  };
  
  // Reset form
  const resetForm = () => {
    setProductData({
      name: '',
      category: '',
      price: '',
      features: '',
      targetAudience: '',
      competitiveAdvantage: '',
      imageUrl: '',
    });
    setGeneratedContent({
      title: '',
      description: '',
      bulletPoints: [],
      keywords: [],
    });
    setGenerationComplete(false);
    setActiveTab('input');
  };
  
  // Effect to update when initialProductData changes
  useEffect(() => {
    if (initialProductData) {
      setProductData({
        name: initialProductData.name || '',
        category: initialProductData.category || '',
        price: initialProductData.price || '',
        features: initialProductData.features || '',
        targetAudience: initialProductData.targetAudience || '',
        competitiveAdvantage: initialProductData.competitiveAdvantage || '',
        imageUrl: initialProductData.imageUrl || '',
      });
    }
  }, [initialProductData]);
  
  return (
    <div className={`ai-listing-creator ${className}`}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('input')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'input'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="inline-block mr-1 h-4 w-4" />
              Product Information
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              disabled={!generationComplete && !isGenerating}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'preview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : generationComplete || isGenerating
                  ? 'text-gray-500 hover:text-gray-700'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <Search className="inline-block mr-1 h-4 w-4" />
              Listing Preview
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {activeTab === 'input' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-1">Create AI-Optimized Listing</h2>
                <p className="text-gray-600">
                  Fill in the details about your product, and our AI will generate an optimized listing for your chosen platform.
                </p>
              </div>
              
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={productData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Wireless Bluetooth Headphones"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={productData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Electronics, Home & Kitchen"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="text"
                      value={productData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="e.g., 49.99"
                      className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={productData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Features <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={productData.features}
                  onChange={(e) => handleInputChange('features', e.target.value)}
                  placeholder="List the main features and specifications of your product. Be as detailed as possible."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <textarea
                    value={productData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder="Who is this product designed for? What problems does it solve for them?"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Competitive Advantage
                  </label>
                  <textarea
                    value={productData.competitiveAdvantage}
                    onChange={(e) => handleInputChange('competitiveAdvantage', e.target.value)}
                    placeholder="What makes your product better than competitors? Any unique selling points?"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  ></textarea>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPlatform('amazon')}
                      className={`py-2 px-3 rounded-lg text-sm font-medium ${
                        platform === 'amazon'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Amazon
                    </button>
                    <button
                      onClick={() => setPlatform('ebay')}
                      className={`py-2 px-3 rounded-lg text-sm font-medium ${
                        platform === 'ebay'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      eBay
                    </button>
                    <button
                      onClick={() => setPlatform('etsy')}
                      className={`py-2 px-3 rounded-lg text-sm font-medium ${
                        platform === 'etsy'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Etsy
                    </button>
                    <button
                      onClick={() => setPlatform('walmart')}
                      className={`py-2 px-3 rounded-lg text-sm font-medium ${
                        platform === 'walmart'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Walmart
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Optimization Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setOptimizationLevel('basic')}
                      className={`py-2 px-3 rounded-lg text-sm font-medium ${
                        optimizationLevel === 'basic'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Basic
                    </button>
                    <button
                      onClick={() => setOptimizationLevel('standard')}
                      className={`py-2 px-3 rounded-lg text-sm font-medium ${
                        optimizationLevel === 'standard'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => setOptimizationLevel('premium')}
                      className={`py-2 px-3 rounded-lg text-sm font-medium ${
                        optimizationLevel === 'premium'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Premium
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  onClick={generateOptimizedListing}
                  disabled={isGenerating}
                  className={`px-4 py-2 rounded-lg text-white font-medium flex items-center ${
                    isGenerating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Listing
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'preview' && (
            <div>
              {isGenerating ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-700">Generating your optimized listing...</h3>
                  <p className="text-gray-500 mt-2">This may take a few moments</p>
                </div>
              ) : generationComplete ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-1">AI-Optimized Listing Preview</h2>
                    <p className="text-gray-600">
                      Here's your optimized listing for {platform.charAt(0).toUpperCase() + platform.slice(1)}. You can copy individual sections or edit as needed.
                    </p>
                  </div>
                  
                  {/* Product image */}
                  {productData.imageUrl && (
                    <div className="mb-6 border rounded-lg p-4 flex justify-center">
                      <img 
                        src={productData.imageUrl} 
                        className="max-h-64 object-contain" 
                      />
                    </div>
                  )}
                  
                  {/* Title */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-blue-600" />
                        Title
                      </h3>
                      <button
                        onClick={() => copyToClipboard(generatedContent.title)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <Clipboard className="mr-1 h-4 w-4" />
                        Copy
                      </button>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <p className="font-medium">{generatedContent.title}</p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-blue-600" />
                        Description
                      </h3>
                      <button
                        onClick={() => copyToClipboard(generatedContent.description)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <Clipboard className="mr-1 h-4 w-4" />
                        Copy
                      </button>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <p className="whitespace-pre-line">{generatedContent.description}</p>
                    </div>
                  </div>
                  
                  {/* Bullet Points */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-blue-600" />
                        Key Features (Bullet Points)
                      </h3>
                      <button
                        onClick={() => copyToClipboard(generatedContent.bulletPoints.join('\n'))}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <Clipboard className="mr-1 h-4 w-4" />
                        Copy All
                      </button>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <ul className="space-y-2">
                        {generatedContent.bulletPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Keywords */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium flex items-center">
                        <Tag className="mr-2 h-4 w-4 text-blue-600" />
                        Suggested Keywords
                      </h3>
                      <button
                        onClick={() => copyToClipboard(generatedContent.keywords.join(', '))}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <Clipboard className="mr-1 h-4 w-4" />
                        Copy All
                      </button>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.keywords.map((keyword, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => setActiveTab('input')}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Edit Information
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 flex items-center"
                    >
                      Create Listing
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    Fill in your product information and click "Generate Listing" to see the preview.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIListingCreator;
