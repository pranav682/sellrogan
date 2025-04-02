'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Check, AlertCircle, Loader2, Image, Package, Tag, ArrowRight } from 'lucide-react';

interface ProductSource {
  id: number;
  name: string;
  price: number;
  source: string;
  url: string;
  reliability: number;
  shipping: number;
  total: number;
  image?: string;
}

interface SellingPlatform {
  id: number;
  name: string;
  baseFee: number;
  percentageFee: number;
  connected: boolean;
}

interface ListingDetails {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  quantity: number;
  images: string[];
}

export default function CreateListingPage() {
  const [product, setProduct] = useState<ProductSource | null>(null);
  const [platforms, setPlatforms] = useState<SellingPlatform[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<SellingPlatform | null>(null);
  const [listingDetails, setListingDetails] = useState<ListingDetails>({
    title: '',
    description: '',
    price: 0,
    category: 'electronics',
    condition: 'new',
    quantity: 1,
    images: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [listingUrl, setListingUrl] = useState('');
  
  // Fetch product and platforms on component mount
  useEffect(() => {
    // Simulate API call to fetch product and platforms
    setTimeout(() => {
      // Mock product data (in a real app, this would come from URL params or state)
      const mockProduct: ProductSource = {
        id: 1,
        name: "Wireless Bluetooth Earbuds",
        price: 24.99,
        source: "AliExpress",
        url: "https://aliexpress.com/item/123456",
        reliability: 4.2,
        shipping: 3.99,
        total: 28.98,
        image: "https://via.placeholder.com/150?text=Earbuds"
      };
      
      // Mock platforms data
      const mockPlatforms: SellingPlatform[] = [
        { id: 1, name: "Amazon", baseFee: 0.99, percentageFee: 0.15, connected: true },
        { id: 2, name: "eBay", baseFee: 0.35, percentageFee: 0.10, connected: true },
        { id: 3, name: "Walmart", baseFee: 0, percentageFee: 0.15, connected: false },
        { id: 4, name: "Etsy", baseFee: 0.20, percentageFee: 0.05, connected: false }
      ];
      
      setProduct(mockProduct);
      setPlatforms(mockPlatforms);
      
      // Initialize listing details with product data
      setListingDetails({
        title: mockProduct.name,
        description: `Brand new ${mockProduct.name}. High quality product with great features.`,
        price: parseFloat((mockProduct.total * 1.5).toFixed(2)),
        category: 'electronics',
        condition: 'new',
        quantity: 1,
        images: mockProduct.image ? [mockProduct.image] : []
      });
      
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const platformId = parseInt(e.target.value);
    const platform = platforms.find(p => p.id === platformId) || null;
    setSelectedPlatform(platform);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setListingDetails(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) : value
    }));
  };
  
  const handleAddImage = () => {
    // In a real app, this would open a file picker or URL input
    // For this demo, we'll add a placeholder image
    const newImage = `https://via.placeholder.com/150?text=Image${listingDetails.images.length + 1}`;
    
    setListingDetails(prev => ({
      ...prev,
      images: [...prev.images, newImage]
    }));
  };
  
  const handleRemoveImage = (index: number) => {
    setListingDetails(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const calculateFees = (): { platformFee: number, totalFees: number } => {
    if (!selectedPlatform) {
      return { platformFee: 0, totalFees: 0 };
    }
    
    const platformFee = selectedPlatform.baseFee + (listingDetails.price * selectedPlatform.percentageFee);
    return {
      platformFee: parseFloat(platformFee.toFixed(2)),
      totalFees: parseFloat(platformFee.toFixed(2))
    };
  };
  
  const calculateProfit = (): number => {
    if (!product) return 0;
    
    const { totalFees } = calculateFees();
    const profit = listingDetails.price - product.total - totalFees;
    return parseFloat(profit.toFixed(2));
  };
  
  const calculateROI = (): number => {
    if (!product) return 0;
    
    const profit = calculateProfit();
    const roi = (profit / product.total) * 100;
    return parseFloat(roi.toFixed(2));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlatform) {
      setErrorMessage('Please select a platform');
      return;
    }
    
    if (!selectedPlatform.connected) {
      setErrorMessage(`You need to connect your ${selectedPlatform.name} account first. Go to Credentials page.`);
      return;
    }
    
    if (!listingDetails.title || !listingDetails.description) {
      setErrorMessage('Title and description are required');
      return;
    }
    
    if (listingDetails.price <= 0) {
      setErrorMessage('Price must be greater than zero');
      return;
    }
    
    if (listingDetails.images.length === 0) {
      setErrorMessage('At least one image is required');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    // Simulate API call to create listing
    setTimeout(() => {
      // In a real implementation, this would call the platform's API to create the listing
      console.log('Creating listing on', selectedPlatform.name, 'with details:', listingDetails);
      
      // Generate a mock listing URL
      const mockListingUrl = `https://${selectedPlatform.name.toLowerCase()}.com/listing/${Math.floor(Math.random() * 1000000)}`;
      
      // Show success message
      setSuccessMessage(`Listing successfully created on ${selectedPlatform.name}!`);
      setListingUrl(mockListingUrl);
      setIsSubmitting(false);
    }, 2000);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Loader2 size={40} className="animate-spin mx-auto mb-4 text-blue-600" />
        <p>Loading product information...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>No product selected for listing.</p>
      </div>
    );
  }
  
  const { platformFee, totalFees } = calculateFees();
  const profit = calculateProfit();
  const roi = calculateROI();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Listing</h1>
      
      <div className="max-w-6xl mx-auto">
        {/* Product Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            {product.image && (
              <div className="w-full md:w-1/4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">{product.name}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Source</p>
                  <p className="font-medium">{product.source}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Product Price</p>
                  <p className="font-medium">${product.price.toFixed(2)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Shipping</p>
                  <p className="font-medium">
                    {product.shipping === 0 ? 'Free' : `$${product.shipping.toFixed(2)}`}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="font-medium">${product.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Create Listing Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Listing Details</h2>
              <p className="text-sm text-gray-500 mt-1">
                Create a listing on your connected selling platform
              </p>
            </div>
            
            <div className="p-6">
              {errorMessage && (
                <div className="mb-6 bg-red-50 p-4 rounded-lg flex items-start">
                  <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5" />
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              )}
              
              {successMessage && (
                <div className="mb-6 bg-green-50 p-4 rounded-lg flex items-start">
                  <Check size={20} className="text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-green-700">{successMessage}</p>
                    {listingUrl && (
                      <a 
                        href={listingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mt-2 inline-block"
                      >
                        View Listing <ArrowRight size={14} className="inline" />
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Platform
                  </label>
                  <select
                    name="platform"
                    value={selectedPlatform?.id || ''}
                    onChange={handlePlatformChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a platform</option>
                    {platforms.map(platform => (
                      <option key={platform.id} value={platform.id}>
                        {platform.name} {platform.connected ? '(Connected)' : '(Not Connected)'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Listing Price
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      min={product.total}
                      step="0.01"
                      value={listingDetails.price}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Listing Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={listingDetails.title}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={listingDetails.description}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={listingDetails.category}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="home">Home & Garden</option>
                    <option value="toys">Toys & Games</option>
                    <option value="beauty">Beauty & Personal Care</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <select
                    name="condition"
                    value={listingDetails.condition}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={listingDetails.quantity}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                  {listingDetails.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Product image ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400"
                  >
                    <Image size={24} />
                    <span className="mt-2 text-sm">Add Image</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profit Analysis */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Profit Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <Tag size={16} className="text-gray-600 mr-2" />
                  <p className="text-sm font-medium text-gray-700">Platform Fees</p>
                </div>
                <p className="text-xl font-bold text-gray-800">${platformFee.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedPlatform ? `${selectedPlatform.name}: $${selectedPlatform.baseFee.toFixed(2)} + ${(selectedPlatform.percentageFee * 100).toFixed(0)}%` : 'Select a platform'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <Package size={16} className="text-gray-600 mr-2" />
                  <p className="text-sm font-medium text-gray-700">Product Cost</p>
                </div>
                <p className="text-xl font-bold text-gray-800">${product.total.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Price: ${product.price.toFixed(2)} + Shipping: ${product.shipping.toFixed(2)}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${profit > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center mb-1">
                  <ShoppingCart size={16} className={`${profit > 0 ? 'text-green-600' : 'text-red-600'} mr-2`} />
                  <p className="text-sm font-medium text-gray-700">Estimated Profit</p>
                </div>
                <p className={`text-xl font-bold ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${profit.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ROI: {roi.toFixed(0)}%
                </p>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Profit Calculation</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Selling Price</span>
                  <span className="text-sm font-medium">${listingDetails.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Product Cost</span>
                  <span className="text-sm font-medium">- ${product.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Platform Fees</span>
                  <span className="text-sm font-medium">- ${platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between">
                  <span className="text-sm font-medium text-gray-800">Net Profit</span>
                  <span className={`text-sm font-bold ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${profit.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !selectedPlatform || !selectedPlatform.connected}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Creating Listing...
                </>
              ) : (
                <>
                  <ShoppingCart size={20} className="mr-2" />
                  Create Listing {selectedPlatform ? `on ${selectedPlatform.name}` : ''}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
