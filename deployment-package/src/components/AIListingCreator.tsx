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
              {optimizedKeywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              SEO-optimized keywords to improve search visibility
            </p>
          </div>
          
          <div className="mb-6">
            <label className="form-label">Description Preview</label>
            <div className="border rounded-md p-3 bg-white max-h-40 overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: optimizedDescription }} />
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              Compelling description optimized for conversion
            </p>
          </div>
          
          {recommendations && recommendations.optimizationTips.length > 0 && (
            <div className="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-lg">
              <h4 className="font-medium text-primary-800 mb-2">Optimization Tips</h4>
              <ul className="list-disc pl-5 space-y-1">
                {recommendations.optimizationTips.map((tip, index) => (
                  <li key={index} className="text-sm text-primary-700">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      
      <div className="flex justify-between">
        <button
          className="btn btn-outline"
          onClick={() => setStep('pricing')}
          disabled={isGenerating}
        >
          Back
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setStep('preview')}
          disabled={isGenerating || !optimizedTitle || !optimizedDescription}
        >
          Continue to Preview
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
  
  // Render preview step
  const renderPreviewStep = () => {
    const platform = platforms.find(p => p.id === selectedPlatform);
    
    return (
      <div>
        <h3 className="text-xl font-semibold mb-4">Listing Preview</h3>
        
        <div className="border rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 p-4 border-b">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{platform?.name} Listing</h4>
              <span className="text-sm text-neutral-500">Preview</span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <img 
                    src={product.imageUrls[0]} 
                    alt={product.title}
                    className="w-full h-auto rounded-md"
                  />
                ) : (
                  <div className="w-full aspect-square bg-neutral-100 rounded-md flex items-center justify-center">
                    <Image size={48} className="text-neutral-300" />
                  </div>
                )}
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-xl font-medium mb-2">{optimizedTitle}</h2>
                
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-accent-success mr-2">
                    {formatCurrency(optimizedPrice)}
                  </span>
                  {offerFreeShipping && (
                    <span className="text-sm bg-accent-success bg-opacity-10 text-accent-success px-2 py-0.5 rounded">
                      Free Shipping
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium mb-1">Description</h5>
                  <div className="text-sm text-neutral-600 max-h-40 overflow-y-auto border rounded p-2">
                    <div dangerouslySetInnerHTML={{ __html: optimizedDescription }} />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {optimizedKeywords.slice(0, 5).map((keyword, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-neutral-100 text-neutral-800"
                    >
                      <Tag size={12} className="mr-1" />
                      {keyword}
                    </span>
                  ))}
                  {optimizedKeywords.length > 5 && (
                    <span className="text-xs text-neutral-500">
                      +{optimizedKeywords.length - 5} more
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-neutral-500">Platform:</span>
                    <span className="ml-1 font-medium">{platform?.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Strategy:</span>
                    <span className="ml-1 font-medium capitalize">{pricingStrategy}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Source Price:</span>
                    <span className="ml-1 font-medium">{formatCurrency(product.price)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Est. Profit:</span>
                    <span className="ml-1 font-medium text-accent-success">
                      {recommendations && recommendations.estimatedProfit[selectedPlatform]
                        ? formatCurrency(recommendations.estimatedProfit[selectedPlatform])
                        : 'Calculating...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            className="btn btn-outline"
            onClick={() => setStep('optimization')}
          >
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={createListing}
          >
            Create Listing
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    );
  };
  
  // Render creating step
  const renderCreatingStep = () => (
    <div className="text-center py-12">
      <div className="loading-spinner mx-auto mb-6"></div>
      <h3 className="text-xl font-semibold mb-2">Creating Your Listing</h3>
      <p className="text-neutral-600 mb-8">
        Please wait while we create your listing on {platforms.find(p => p.id === selectedPlatform)?.name}...
      </p>
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Optimizing title</span>
          <Check size={16} className="text-accent-success" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Optimizing description</span>
          <Check size={16} className="text-accent-success" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Processing images</span>
          <Check size={16} className="text-accent-success" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Uploading to platform</span>
          <Loader size={16} className="text-primary-600 animate-spin" />
        </div>
      </div>
    </div>
  );
  
  // Render result step
  const renderResultStep = () => {
    if (!listingResult) return null;
    
    const platform = platforms.find(p => p.id === selectedPlatform);
    
    return (
      <div>
        {listingResult.success ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-accent-success bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-accent-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Listing Created Successfully!</h3>
              <p className="text-neutral-600">
                Your product has been listed on {platform?.name}
              </p>
            </div>
            
            <div className="border rounded-lg overflow-hidden mb-6">
              <div className="bg-neutral-50 p-4 border-b">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Listing Details</h4>
                  <span className="text-sm text-neutral-500">
                    {new Date(listingResult.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-neutral-500 block mb-1">Listing ID</span>
                    <span className="font-medium">{listingResult.listingId}</span>
                  </div>
                  <div>
                    <span className="text-sm text-neutral-500 block mb-1">Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-success bg-opacity-10 text-accent-success">
                      {listingResult.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-neutral-500 block mb-1">Platform</span>
                    <span className="font-medium">{listingResult.platform}</span>
                  </div>
                  <div>
                    <span className="text-sm text-neutral-500 block mb-1">Price</span>
                    <span className="font-medium">{formatCurrency(optimizedPrice)}</span>
                  </div>
                </div>
                
                {listingResult.analytics && (
                  <div className="border-t pt-4 mt-4">
                    <h5 className="font-medium mb-3 flex items-center">
                      <BarChart size={16} className="mr-2 text-primary-600" />
                      Analytics Predictions
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-neutral-500 block mb-1">Est. Views (30d)</span>
                        <span className="font-medium">{listingResult.analytics.estimatedViews}</span>
                      </div>
                      <div>
                        <span className="text-sm text-neutral-500 block mb-1">Est. Sales (30d)</span>
                        <span className="font-medium">{listingResult.analytics.estimatedSales}</span>
                      </div>
                      <div>
                        <span className="text-sm text-neutral-500 block mb-1">Competitors</span>
                        <span className="font-medium">{listingResult.analytics.competitorCount}</span>
                      </div>
                      <div>
                        <span className="text-sm text-neutral-500 block mb-1">Price Position</span>
                        <span className="font-medium capitalize">
                          {listingResult.analytics.pricePosition.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {listingResult.listingUrl && (
                <a
                  href={listingResult.listingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  View Listing
                </a>
              )}
              <button
                className="btn btn-outline"
                onClick={() => {
                  setStep('platform');
                  setListingResult(null);
                  setError(null);
                }}
              >
                Create Another Listing
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-accent-danger bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-accent-danger" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Listing Creation Failed</h3>
              <p className="text-neutral-600">
                We encountered an error while creating your listing
              </p>
            </div>
            
            {listingResult.errors && listingResult.errors.length > 0 && (
              <div className="bg-accent-danger bg-opacity-10 border border-accent-danger text-accent-danger p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-2">Error Details</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {listingResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-center">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setStep('preview');
                  setListingResult(null);
                  setError(null);
                }}
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    );
  };
  
  // Render the current step
  const renderCurrentStep = () => {
    switch (step) {
      case 'platform':
        return renderPlatformStep();
      case 'pricing':
        return renderPricingStep();
      case 'optimization':
        return renderOptimizationStep();
      case 'preview':
        return renderPreviewStep();
      case 'creating':
        return renderCreatingStep();
      case 'result':
        return renderResultStep();
      default:
        return null;
    }
  };
  
  return (
    <div className={`ai-listing-creator ${className}`}>
      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['platform', 'pricing', 'optimization', 'preview', 'result'].map((stepName, index) => (
            <div 
              key={stepName}
              className={`flex flex-col items-center ${index < 4 ? 'w-1/4' : ''}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ['creating', 'result'].includes(step) && stepName === 'result' ||
                  step === stepName || 
                  (
                    ['platform', 'pricing', 'optimization', 'preview', 'creating', 'result'].indexOf(step) > 
                    ['platform', 'pricing', 'optimization', 'preview', 'creating', 'result'].indexOf(stepName)
                  )
                    ? 'bg-primary-600 text-white' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-xs mt-1 text-center ${
                step === stepName ? 'text-primary-600 font-medium' : 'text-neutral-500'
              }`}>
                {stepName === 'platform' ? 'Platform' : 
                 stepName === 'pricing' ? 'Pricing' : 
                 stepName === 'optimization' ? 'Optimize' : 
                 stepName === 'preview' ? 'Preview' : 
                 'Result'}
              </span>
              
              {index < 4 && (
                <div className={`h-0.5 w-full mt-3 ${
                  ['platform', 'pricing', 'optimization', 'preview', 'creating', 'result'].indexOf(step) > index
                    ? 'bg-primary-600' 
                    : 'bg-neutral-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Current step content */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default AIListingCreator;
