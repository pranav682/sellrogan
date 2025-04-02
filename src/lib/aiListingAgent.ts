/**
 * AI Listing Agent for SellRogan
 * This module provides functions for generating optimized product listings using AI
 */

import { generateProductDescription } from './geminiAIService';

// Types for the listing generation
interface ProductListingInput {
  productName: string;
  category: string;
  price?: string;
  features: string;
  targetAudience?: string;
  competitiveAdvantage?: string;
  platform: 'amazon' | 'ebay' | 'etsy' | 'walmart';
  optimizationLevel: 'basic' | 'standard' | 'premium';
}

interface ProductListingOutput {
  title: string;
  description: string;
  bulletPoints: string[];
  keywords: string[];
}

/**
 * Generate an optimized product listing based on input data
 * @param input - Product data and generation parameters
 * @returns Optimized product listing
 */
export async function generateProductListing(input: ProductListingInput): Promise<ProductListingOutput> {
  try {
    // Generate a detailed description using the Gemini AI service
    const description = await generateProductDescription(
      input.productName,
      input.features,
      input.targetAudience || '',
      input.platform
    );
    
    // Generate title based on platform and product details
    const title = generateTitle(input);
    
    // Generate bullet points based on features and optimization level
    const bulletPoints = generateBulletPoints(input);
    
    // Generate keywords based on product details
    const keywords = generateKeywords(input);
    
    return {
      title,
      description,
      bulletPoints,
      keywords
    };
  } catch (error) {
    console.error('Error generating product listing:', error);
    // Return fallback content if generation fails
    return getFallbackListing(input);
  }
}

/**
 * Generate an optimized title for the product
 * @param input - Product data and generation parameters
 * @returns Optimized title
 */
function generateTitle(input: ProductListingInput): string {
  const { productName, category, platform, optimizationLevel } = input;
  
  // Base title is just the product name
  let title = productName;
  
  // Add category if available
  if (category) {
    title += ` - ${category}`;
  }
  
  // Add platform-specific optimizations
  if (platform === 'amazon' && optimizationLevel !== 'basic') {
    // Amazon titles can be longer and benefit from more keywords
    title += ` | Premium Quality | Professional Grade`;
  } else if (platform === 'etsy' && optimizationLevel !== 'basic') {
    // Etsy benefits from handmade/unique emphasis
    title += ` | Handcrafted Quality | Perfect Gift`;
  }
  
  // Add optimization level enhancements
  if (optimizationLevel === 'premium') {
    title += ` | 100% Satisfaction Guaranteed`;
  }
  
  // Ensure title isn't too long for the platform
  const maxLengths = {
    amazon: 200,
    ebay: 80,
    etsy: 140,
    walmart: 200
  };
  
  if (title.length > maxLengths[platform]) {
    title = title.substring(0, maxLengths[platform] - 3) + '...';
  }
  
  return title;
}

/**
 * Generate bullet points for the product listing
 * @param input - Product data and generation parameters
 * @returns Array of bullet points
 */
function generateBulletPoints(input: ProductListingInput): string[] {
  const { features, targetAudience, competitiveAdvantage, optimizationLevel } = input;
  
  // Extract features from the input
  const featuresList = features.split(/[.,;]\s*/).filter(f => f.trim().length > 0);
  
  // Create basic bullet points from features
  let bulletPoints = featuresList.map(feature => feature.trim()).slice(0, 5);
  
  // Add target audience point if available
  if (targetAudience && targetAudience.trim().length > 0) {
    bulletPoints.push(`Perfect for ${targetAudience.trim()}`);
  }
  
  // Add competitive advantage if available
  if (competitiveAdvantage && competitiveAdvantage.trim().length > 0) {
    bulletPoints.push(competitiveAdvantage.trim());
  }
  
  // Add standard bullet points if we don't have enough
  if (bulletPoints.length < 5) {
    const standardPoints = [
      'Made with premium quality materials for durability',
      'Easy to use and maintain',
      'Compact design for convenient storage',
      'Makes a perfect gift for any occasion',
      'Backed by our satisfaction guarantee'
    ];
    
    bulletPoints = [...bulletPoints, ...standardPoints.slice(0, 5 - bulletPoints.length)];
  }
  
  // Enhance bullet points based on optimization level
  if (optimizationLevel === 'premium') {
    bulletPoints = bulletPoints.map(point => {
      // Add emphasis and enhancement to each point
      if (!point.includes('!')) {
        return point + ' - Guaranteed Satisfaction!';
      }
      return point;
    });
  }
  
  return bulletPoints;
}

/**
 * Generate keywords for the product listing
 * @param input - Product data and generation parameters
 * @returns Array of keywords
 */
function generateKeywords(input: ProductListingInput): string[] {
  const { productName, category, features, targetAudience, platform } = input;
  
  // Start with basic keywords from product name and category
  const baseKeywords = [
    ...productName.toLowerCase().split(' '),
    ...category.toLowerCase().split(' ')
  ];
  
  // Extract potential keywords from features
  const featureKeywords = features
    .toLowerCase()
    .split(/[\s.,;]+/)
    .filter(word => word.length > 3);
  
  // Extract potential keywords from target audience
  const audienceKeywords = targetAudience
    ? targetAudience.toLowerCase().split(/[\s.,;]+/).filter(word => word.length > 3)
    : [];
  
  // Combine all keywords
  let allKeywords = [...baseKeywords, ...featureKeywords, ...audienceKeywords];
  
  // Add platform-specific keywords
  if (platform === 'amazon') {
    allKeywords.push('quality', 'premium', 'best');
  } else if (platform === 'etsy') {
    allKeywords.push('handmade', 'unique', 'gift');
  } else if (platform === 'ebay') {
    allKeywords.push('deal', 'bargain', 'value');
  } else if (platform === 'walmart') {
    allKeywords.push('affordable', 'value', 'quality');
  }
  
  // Remove duplicates and short words
  const uniqueKeywords = [...new Set(allKeywords)]
    .filter(word => word.length > 3)
    .slice(0, 20);
  
  return uniqueKeywords;
}

/**
 * Get fallback listing content if AI generation fails
 * @param input - Product data and generation parameters
 * @returns Basic product listing
 */
function getFallbackListing(input: ProductListingInput): ProductListingOutput {
  const { productName, category, features } = input;
  
  return {
    title: `${productName} - Premium Quality ${category}`,
    description: `Introducing the ${productName}, a high-quality ${category} designed to meet your needs. ${features}`,
    bulletPoints: [
      `Premium quality ${category} for everyday use`,
      'Durable construction for long-lasting performance',
      'Easy to use and maintain',
      'Compact design for convenient storage',
      'Satisfaction guaranteed or your money back'
    ],
    keywords: [
      productName.toLowerCase(),
      category.toLowerCase(),
      'quality',
      'premium',
      'durable',
      'best',
      'value'
    ]
  };
}

/**
 * Analyze a product listing and provide improvement suggestions
 * @param listing - Current product listing
 * @returns Array of improvement suggestions
 */
export async function analyzeProductListing(listing: {
  title: string;
  description: string;
  bulletPoints: string[];
}): Promise<string[]> {
  // This would ideally use AI to analyze the listing
  // For now, we'll return some generic suggestions
  return [
    'Add more specific details about product dimensions and materials',
    'Include more keywords in your title to improve searchability',
    'Make bullet points more concise and benefit-focused',
    'Add information about warranty or guarantee if applicable',
    'Consider adding social proof or use cases in the description'
  ];
}
