import React from 'react';
import Link from 'next/link';
import { Search, BarChart2, DollarSign, ShoppingCart, ArrowRight } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find, Source, and Sell Products for Maximum Profit
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            SellRogan helps you find the cheapest products online and discover where to sell them for maximum profit.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/search" className="btn btn-primary">
              Start Searching
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 rounded-lg my-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">
                Find products across multiple platforms with our powerful search engine.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compare</h3>
              <p className="text-gray-600">
                Compare prices and features to find the best deals and opportunities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze</h3>
              <p className="text-gray-600">
                Analyze profit potential and market trends to make informed decisions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sell</h3>
              <p className="text-gray-600">
                Create optimized listings and sell products for maximum profit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-12 my-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">AI-Powered Features</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our advanced AI helps you make better decisions and maximize your profits.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Smart Product Recommendations</h3>
                    <p className="text-gray-600">Get personalized product recommendations based on your preferences and market trends.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Automated Price Analysis</h3>
                    <p className="text-gray-600">Our AI analyzes price history and competition to help you find the best deals.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Optimized Listing Creation</h3>
                    <p className="text-gray-600">Create high-converting listings with AI-generated titles, descriptions, and keywords.</p>
                  </div>
                </li>
              </ul>
              <Link href="/search" className="btn btn-primary mt-8">
                Try It Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">AI Assistant Demo</h3>
                <p className="text-gray-600 mb-6">
                  Ask our AI assistant about product sourcing, pricing strategies, or selling tips.
                </p>
                <div className="border rounded-lg p-4 h-64 overflow-y-auto mb-4 bg-gray-50">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-2 mr-2">
                        <span className="text-blue-600 font-bold">AI</span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 max-w-[80%]">
                        <p>Hello! I'm your SellRogan assistant. How can I help you today?</p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end">
                      <div className="bg-gray-200 rounded-lg p-3 max-w-[80%]">
                        <p>What are the best products to sell online right now?</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-2 mr-2">
                        <span className="text-blue-600 font-bold">AI</span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 max-w-[80%]">
                        <p>Based on current trends, electronics, home fitness equipment, and eco-friendly products are performing well. Would you like specific recommendations in any of these categories?</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  This is a demo. Try the full AI assistant by signing up!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-600 rounded-lg my-12 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Maximize Your Profits?</h2>
          <p className="text-xl mb-8">
            Join thousands of sellers who are using SellRogan to find the best products and maximize their profits.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/search" className="btn btn-white">
              Start for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/pricing" className="btn btn-outline-white">
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Floating AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <AIAssistant />
      </div>
    </div>
  );
}
