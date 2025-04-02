import React, { useState, useEffect } from 'react';
import { aiListingAgent, ListingRequest, ListingResult } from '@/lib/aiListingAgent';
import { ProductSource } from '@/lib/scrapers';
import { ArrowRight, Check, AlertCircle, Loader, Image, DollarSign, Tag, BarChart } from 'lucide-react';

interface AIListingCreatorProps {
  product: ProductSource;
  className?: string;
  onListingCreated?: (result: ListingResult) => void;
}

const AIListingCreator: React.FC<AIListingCreatorProps> = ({ 
  product, 
  className = '',
  onListingCreated
}) => {
  const [step, setStep] = useState<'platform' | 'pricing' | 'optimization' | 'preview' | 'creating' | 'result'>('platform');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [pricingStrategy, setPricingStrategy] = useState<'competitive' | 'premium' | 'economy'>('competitive');
  const [minProfit, setMinProfit] = useState<number>(10);
  const [targetROI, setTargetROI] = useState<number>(30);
  const [offerFreeShipping, setOfferFreeShipping] = useState<boolean>(true);
  const [optimizedTitle, setOptimizedTitle] = useState<string>('');
  const [optimizedDescription, setOptimizedDescription] = useState<string>('');
  const [optimizedKeywords, setOptimizedKeywords] = useState<string[]>([]);
  const [optimizedPrice, setOptimizedPrice] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<{
    recommendedPlatforms: string[];
    pricingStrategy: 'competitive' | 'premium' | 'economy';
    estimatedProfit: Record<string, number>;
    optimizationTips: string[];
  } | null>(null);
  const [listingResult, setListingResult] = useState<ListingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const platforms = aiListingAgent.getPlatforms();
  
  // Get recommendations when component mounts
  useEffect(() => {
    const getRecommendations = async () => {
      try {
        const recs = await aiListingAgent.getListingRecommendations(product);
        setRecommendations(recs);
        
        // Pre-select the top recommended platform
        if (recs.recommendedPlatforms.length > 0) {
          setSelectedPlatform(recs.recommendedPlatforms[0]);
        }
        
        // Set recommended pricing strategy
        setPricingStrategy(recs.pricingStrategy);
      } catch (err) {
        setError('Failed to get recommendations. Please try again.');
        console.error(err);
      }
    };
    
    getRecommendations();
  }, [product]);
  
  // Generate optimized listing content when platform is selected
  useEffect(() => {
    if (selectedPlatform && step === 'optimization') {
      generateOptimizedListing();
    }
  }, [selectedPlatform, step]);
  
  // Generate optimized listing content
  const generateOptimizedListing = async () => {
    if (!selectedPlatform) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const platform = aiListingAgent.getPlatform(selectedPlatform);
      if (!platform) {
        throw new Error(`Platform ${selectedPlatform} not found`);
      }
      
      // Generate title, description, keywords, and price in parallel
      const [title, description, keywords, price] = await Promise.all([
        aiListingAgent.generateTitle(product, platform),
        aiListingAgent.generateDescription(product, platform),
        aiListingAgent.generateKeywords(product),
        aiListingAgent.calculateOptimalPrice(product, platform, pricingStrategy, minProfit)
      ]);
      
      setOptimizedTitle(title);
      setOptimizedDescription(description);
      setOptimizedKeywords(keywords);
      setOptimizedPrice(price);
    } catch (err) {
      setError('Failed to generate optimized listing. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Create listing on selected platform
  const createListing = async () => {
    if (!selectedPlatform) return;
    
    setStep('creating');
    setError(null);
    
    try {
      const listingRequest: ListingRequest = {
        product,
        targetPlatform: selectedPlatform,
        userPreferences: {
          pricing: {
            strategy: pricingStrategy,
            minProfit,
            targetROI
          },
          shipping: {
            offerFreeShipping,
            handlingTime: 1,
            shippingServices: ['Standard']
          },
          listing: {
            title: optimizedTitle,
            description: optimizedDescription,
            keywords: optimizedKeywords
          }
        },
        credentials: {
          platformId: selectedPlatform,
          apiKey: 'demo-key' // In a real app, we would get this from secure storage
        }
      };
      
      const result = await aiListingAgent.createListing(listingRequest);
      setListingResult(result);
      setStep('result');
      
      if (onListingCreated && result.success) {
        onListingCreated(result);
      }
    } catch (err) {
      setError('Failed to create listing. Please try again.');
      console.error(err);
      setStep('preview');
    }
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  // Render platform selection step
  const renderPlatformStep = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Select Selling Platform</h3>
      
      {recommendations && (
        <div className="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-lg">
          <h4 className="font-medium text-primary-800 mb-2">AI Recommendations</h4>
          <p className="text-sm text-primary-700 mb-2">
            Based on your product, we recommend selling on:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {recommendations.recommendedPlatforms.map(platformId => {
              const platform = platforms.find(p => p.id === platformId);
              return platform ? (
                <span key={platformId} className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-800">
                  <Check size={14} className="mr-1" />
                  {platform.name}
                </span>
              ) : null;
            })}
          </div>
          <p className="text-sm text-primary-700">
            Estimated profit: {recommendations.estimatedProfit[recommendations.recommendedPlatforms[0]] > 0 
              ? formatCurrency(recommendations.estimatedProfit[recommendations.recommendedPlatforms[0]]) 
              : 'Calculating...'}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {platforms.map(platform => (
          <div 
            key={platform.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedPlatform === platform.id 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-neutral-200 hover:border-primary-200 hover:bg-neutral-50'
            }`}
            onClick={() => setSelectedPlatform(platform.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{platform.name}</h4>
              {selectedPlatform === platform.id && (
                <Check size={18} className="text-primary-500" />
              )}
            </div>
            <p className="text-sm text-neutral-600 mb-2">
              Final value fee: {(platform.fees.finalValue * 100).toFixed(1)}%
            </p>
            {recommendations && recommendations.estimatedProfit[platform.id] > 0 && (
              <p className="text-sm font-medium text-accent-success">
                Est. profit: {formatCurrency(recommendations.estimatedProfit[platform.id])}
              </p>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <button
          className="btn btn-primary"
          onClick={() => setStep('pricing')}
          disabled={!selectedPlatform}
        >
          Continue to Pricing
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
  
  // Render pricing strategy step
  const renderPricingStep = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Set Pricing Strategy</h3>
      
      <div className="mb-6">
        <label className="form-label">Pricing Strategy</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              pricingStrategy === 'competitive' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-neutral-200 hover:border-primary-200 hover:bg-neutral-50'
            }`}
            onClick={() => setPricingStrategy('competitive')}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">Competitive</h4>
              {pricingStrategy === 'competitive' && (
                <Check size={18} className="text-primary-500" />
              )}
            </div>
            <p className="text-sm text-neutral-600">
              Price slightly below market average to maximize sales volume
            </p>
          </div>
          
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              pricingStrategy === 'premium' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-neutral-200 hover:border-primary-200 hover:bg-neutral-50'
            }`}
            onClick={() => setPricingStrategy('premium')}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">Premium</h4>
              {pricingStrategy === 'premium' && (
                <Check size={18} className="text-primary-500" />
              )}
            </div>
            <p className="text-sm text-neutral-600">
              Position as a premium product with higher margins
            </p>
          </div>
          
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              pricingStrategy === 'economy' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-neutral-200 hover:border-primary-200 hover:bg-neutral-50'
            }`}
            onClick={() => setPricingStrategy('economy')}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">Economy</h4>
              {pricingStrategy === 'economy' && (
                <Check size={18} className="text-primary-500" />
              )}
            </div>
            <p className="text-sm text-neutral-600">
              Optimize for thin margins but higher sales velocity
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="form-label" htmlFor="min-profit">
          Minimum Profit (USD)
        </label>
        <input
          id="min-profit"
          type="number"
          className="form-control"
          value={minProfit}
          onChange={(e) => setMinProfit(Number(e.target.value))}
          min="0"
          step="1"
        />
        <p className="text-sm text-neutral-500 mt-1">
          Minimum profit you want to make on each sale
        </p>
      </div>
      
      <div className="mb-6">
        <label className="form-label" htmlFor="target-roi">
          Target ROI (%)
        </label>
        <input
          id="target-roi"
          type="number"
          className="form-control"
          value={targetROI}
          onChange={(e) => setTargetROI(Number(e.target.value))}
          min="0"
          max="1000"
          step="1"
        />
        <p className="text-sm text-neutral-500 mt-1">
          Target return on investment percentage
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center">
          <input
            id="free-shipping"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            checked={offerFreeShipping}
            onChange={(e) => setOfferFreeShipping(e.target.checked)}
          />
          <label htmlFor="free-shipping" className="ml-2 block text-sm text-neutral-900">
            Offer Free Shipping
          </label>
        </div>
        <p className="text-sm text-neutral-500 mt-1 ml-6">
          Free shipping can improve visibility and conversion rates
        </p>
      </div>
      
      <div className="flex justify-between">
        <button
          className="btn btn-outline"
          onClick={() => setStep('platform')}
        >
          Back
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setStep('optimization')}
        >
          Continue to Optimization
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
  
  // Render optimization step
  const renderOptimizationStep = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Listing Optimization</h3>
      
      {isGenerating ? (
        <div className="text-center py-8">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-neutral-600">
            Our AI is optimizing your listing for maximum visibility and conversion...
          </p>
        </div>
      ) : error ? (
        <div className="bg-accent-danger bg-opacity-10 text-accent-danger p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
          <button
            className="btn btn-sm btn-outline mt-2"
            onClick={generateOptimizedListing}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <label className="form-label">Optimized Title</label>
            <div className="relative">
              <textarea
                className="form-control"
                value={optimizedTitle}
                onChange={(e) => setOptimizedTitle(e.target.value)}
                rows={2}
              />
              <div className="absolute bottom-2 right-2 text-xs text-neutral-500">
                {optimizedTitle.length}/80
              </div>
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              Optimized for search visibility and click-through rate
            </p>
          </div>
          
          <div className="mb-6">
            <label className="form-label">Optimized Price</label>
            <div className="relative">
              <input
                type="number"
                className="form-control pl-8"
                value={optimizedPrice}
                onChange={(e) => setOptimizedPrice(Number(e.target.value))}
                step="0.01"
                min="0"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-neutral-500">$</span>
              </div>
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              Strategically priced based on your selected strategy and market conditions
            </p>
          </div>
          
          <div className="mb-6">
            <label className="form-label">Keywords</label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-neutral-50">
              {optimizedKey
(Content truncated due to size limit. Use line ranges to read in chunks)