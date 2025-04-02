import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
// In a production environment, this should be stored in environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'YOUR_API_KEY');

/**
 * Generate a product description using Google's Gemini AI
 * @param productName - Name of the product
 * @param features - Key features of the product
 * @param targetAudience - Target audience for the product
 * @param platform - The platform where the product will be listed
 * @returns A detailed product description
 */
export async function generateProductDescription(
  productName: string,
  features: string,
  targetAudience: string = '',
  platform: string = 'amazon'
): Promise<string> {
  try {
    // For demo purposes, if no API key is provided, return a mock response
    if (process.env.GOOGLE_AI_API_KEY === 'YOUR_API_KEY') {
      return getMockProductDescription(productName, platform);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Create a detailed and compelling product description for the following product:
      
      Product Name: ${productName}
      Key Features: ${features}
      ${targetAudience ? `Target Audience: ${targetAudience}` : ''}
      Platform: ${platform}
      
      The description should:
      1. Be engaging and persuasive
      2. Highlight the key benefits and features
      3. Address the target audience's needs
      4. Be optimized for ${platform} marketplace
      5. Be between 200-300 words
      6. Use professional and clear language
      
      Return only the description text without any additional formatting or notes.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generating product description:', error);
    return getMockProductDescription(productName, platform);
  }
}

/**
 * Generate product listing recommendations using Google's Gemini AI
 * @param productData - Product data including name, category, price, etc.
 * @returns Recommendations for improving the product listing
 */
export async function generateListingRecommendations(productData: any): Promise<string[]> {
  try {
    // For demo purposes, if no API key is provided, return mock recommendations
    if (process.env.GOOGLE_AI_API_KEY === 'YOUR_API_KEY') {
      return getMockListingRecommendations(productData.name);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Analyze this product listing and provide 5 specific recommendations to improve it:
      
      Product Name: ${productData.name}
      Category: ${productData.category || 'N/A'}
      Price: ${productData.price || 'N/A'}
      Description: ${productData.description || 'N/A'}
      
      Focus on:
      1. SEO optimization
      2. Conversion rate optimization
      3. Customer appeal
      4. Competitive positioning
      5. Clarity and completeness
      
      Return exactly 5 recommendations as a list without any additional text.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the recommendations into an array
    const recommendations = text
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 5);
    
    return recommendations.length > 0 ? recommendations : getMockListingRecommendations(productData.name);
  } catch (error) {
    console.error('Error generating listing recommendations:', error);
    return getMockListingRecommendations(productData.name);
  }
}

/**
 * Generate product pricing recommendations using Google's Gemini AI
 * @param productData - Product data including name, cost, category, etc.
 * @param competitorPrices - Array of competitor prices
 * @returns Pricing recommendations
 */
export async function generatePricingRecommendations(
  productData: any,
  competitorPrices: number[] = []
): Promise<{ recommendedPrice: number; strategy: string; explanation: string }> {
  try {
    // For demo purposes, if no API key is provided, return mock pricing
    if (process.env.GOOGLE_AI_API_KEY === 'YOUR_API_KEY') {
      return getMockPricingRecommendation(productData.cost || 25);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const avgCompetitorPrice = competitorPrices.length > 0
      ? competitorPrices.reduce((sum, price) => sum + price, 0) / competitorPrices.length
      : 0;
    
    const prompt = `
      Generate a pricing recommendation for the following product:
      
      Product Name: ${productData.name}
      Category: ${productData.category || 'N/A'}
      Cost: $${productData.cost || 'N/A'}
      ${competitorPrices.length > 0 ? `Competitor Prices: $${competitorPrices.join(', $')}` : ''}
      ${avgCompetitorPrice > 0 ? `Average Competitor Price: $${avgCompetitorPrice.toFixed(2)}` : ''}
      
      Provide:
      1. A specific recommended price (just the number)
      2. The pricing strategy name (e.g., "Premium Pricing", "Competitive Pricing", "Economy Pricing")
      3. A brief explanation for the recommendation (1-2 sentences)
      
      Format your response exactly as follows:
      Price: [recommended price]
      Strategy: [strategy name]
      Explanation: [brief explanation]
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response
    const priceMatch = text.match(/Price:\s*\$?(\d+\.?\d*)/i);
    const strategyMatch = text.match(/Strategy:\s*([^\n]+)/i);
    const explanationMatch = text.match(/Explanation:\s*([^\n]+)/i);
    
    if (priceMatch && strategyMatch && explanationMatch) {
      return {
        recommendedPrice: parseFloat(priceMatch[1]),
        strategy: strategyMatch[1].trim(),
        explanation: explanationMatch[1].trim()
      };
    }
    
    return getMockPricingRecommendation(productData.cost || 25);
  } catch (error) {
    console.error('Error generating pricing recommendations:', error);
    return getMockPricingRecommendation(productData.cost || 25);
  }
}

/**
 * Answer user questions about selling products online
 * @param question - User's question
 * @returns AI-generated answer
 */
export async function answerSellingQuestion(question: string): Promise<string> {
  try {
    // For demo purposes, if no API key is provided, return a mock answer
    if (process.env.GOOGLE_AI_API_KEY === 'YOUR_API_KEY') {
      return getMockAnswer(question);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      You are an expert e-commerce consultant specializing in helping sellers optimize their online product listings and sales strategies.
      
      Answer the following question about selling products online:
      
      Question: ${question}
      
      Provide a helpful, accurate, and concise answer based on best practices in e-commerce.
      Limit your response to 3-4 sentences unless more detail is absolutely necessary.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error answering question:', error);
    return getMockAnswer(question);
  }
}

// Mock data functions for when API key is not available

function getMockProductDescription(productName: string, platform: string): string {
  return `Introducing the ${productName}, the perfect solution for your everyday needs. Crafted with premium materials and designed with user comfort in mind, this product delivers exceptional performance and reliability. The intuitive design makes it easy to use right out of the box, while the durable construction ensures it will stand the test of time.

Whether you're a professional looking for dependable tools or a casual user seeking quality and convenience, the ${productName} exceeds expectations with its versatile functionality and sleek appearance. The compact size makes it portable and easy to store, while still providing all the features you need.

Backed by our satisfaction guarantee and responsive customer service, you can purchase with confidence knowing you're investing in a product that truly delivers value. Don't settle for less—experience the difference that quality engineering and thoughtful design can make in your daily routine with the ${productName}.`;
}

function getMockListingRecommendations(productName: string): string[] {
  return [
    `Add more high-quality images showing the ${productName} from multiple angles and in use`,
    `Include specific measurements and technical specifications in bullet points for easy scanning`,
    `Incorporate more keywords related to the product's benefits and use cases in the title and description`,
    `Add customer testimonials or use cases to build credibility and address potential concerns`,
    `Create a more compelling opening sentence that immediately communicates the primary benefit of the ${productName}`
  ];
}

function getMockPricingRecommendation(cost: number): { recommendedPrice: number; strategy: string; explanation: string } {
  const markup = 0.4; // 40% markup
  const recommendedPrice = cost * (1 + markup);
  
  return {
    recommendedPrice: parseFloat(recommendedPrice.toFixed(2)),
    strategy: "Competitive Value Pricing",
    explanation: `This price provides a healthy 40% margin while remaining competitive in the market. It positions the product as quality without being premium-priced.`
  };
}

function getMockAnswer(question: string): string {
  const answers = [
    "To improve your product listings, focus on high-quality images, detailed descriptions that highlight benefits, and competitive pricing. Use relevant keywords in your title and bullet points, and always respond promptly to customer questions and reviews. Regular analysis of your listing performance metrics will help you make continuous improvements.",
    "When choosing between Amazon and eBay, consider your product type, target audience, and business goals. Amazon offers higher traffic and trust but has stricter rules and higher fees. eBay provides more flexibility in listing formats and often lower fees, but may have less buyer traffic for certain categories. Many successful sellers use both platforms to maximize visibility.",
    "The best pricing strategy depends on your product positioning and competition. For unique products, value-based pricing allows you to charge based on perceived value. For commodity items, competitive pricing is essential. Consider starting slightly higher and using promotional discounts to test price sensitivity while maintaining your target profit margin.",
    "To reduce shipping costs, negotiate rates with multiple carriers, use lightweight packaging materials, and consider offering economy shipping options. For international sales, using fulfillment services like Amazon FBA can be cost-effective. Always compare dimensional weight versus actual weight pricing, and consider flat-rate shipping options for consistency.",
    "Effective inventory management requires accurate forecasting based on historical sales data and seasonal trends. Implement a reliable inventory tracking system, establish reorder points that account for lead times, and regularly review slow-moving items. Consider just-in-time inventory practices for popular items and bulk ordering for consistent sellers to balance cash flow and availability."
  ];
  
  // Simple algorithm to pick a relevant answer
  const lowerQuestion = question.toLowerCase();
  if (lowerQuestion.includes('listing') || lowerQuestion.includes('description')) {
    return answers[0];
  } else if (lowerQuestion.includes('amazon') || lowerQuestion.includes('ebay') || lowerQuestion.includes('platform')) {
    return answers[1];
  } else if (lowerQuestion.includes('price') || lowerQuestion.includes('pricing')) {
    return answers[2];
  } else if (lowerQuestion.includes('ship') || lowerQuestion.includes('delivery')) {
    return answers[3];
  } else {
    return answers[4];
  }
}
