'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, BarChart2, DollarSign, ShoppingCart, ArrowRight, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would handle newsletter signup
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find the Best Deals, Maximize Your Profits
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                SourceAndSell helps you find the cheapest products online and discover where to sell them for maximum profit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/search" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                >
                  Start Searching
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/credentials" 
                  className="bg-blue-500 text-white hover:bg-blue-400 px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                >
                  Connect Platforms
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="bg-white rounded-lg shadow-xl p-6 text-gray-800">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">Find Products</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Search across multiple platforms to find the cheapest sources for any product.
                </p>
                
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <BarChart2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">Compare Prices</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Compare prices, shipping costs, and seller reliability across platforms.
                </p>
                
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">Analyze Profits</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Get recommendations on where to sell for maximum profit margins.
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">List Automatically</h3>
                </div>
                <p className="text-gray-600">
                  Create listings on your preferred platforms with just one click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Search Products</h3>
              <p className="text-gray-600">
                Enter any product you want to source. Our system searches across multiple e-commerce platforms to find the best deals.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Analyze Opportunities</h3>
              <p className="text-gray-600">
                Our system analyzes where you can sell the product for the highest profit margin, considering all platform fees.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mx-auto mb-4">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. List & Profit</h3>
              <p className="text-gray-600">
                With one click, create listings on your preferred platforms and start selling for profit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  <span className="text-xl font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-500 text-sm">E-commerce Entrepreneur</p>
                </div>
              </div>
              <p className="text-gray-600">
                "This app has revolutionized my arbitrage business. I've increased my profit margins by 35% since I started using it!"
              </p>
              <div className="flex mt-4 text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                  <span className="text-xl font-bold">M</span>
                </div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-gray-500 text-sm">Side Hustle Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I was spending hours manually comparing prices. Now I can find profitable products in minutes. Game changer!"
              </p>
              <div className="flex mt-4 text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                  <span className="text-xl font-bold">J</span>
                </div>
                <div>
                  <h4 className="font-semibold">Jessica Williams</h4>
                  <p className="text-gray-500 text-sm">Online Seller</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The one-click listing feature alone is worth the price. I've doubled my inventory without increasing my workload."
              </p>
              <div className="flex mt-4 text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Maximize Your Profits?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of sellers who are finding the best deals and maximizing their profits with our platform.
          </p>
          <Link 
            href="/search" 
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium inline-flex items-center text-lg"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for the latest arbitrage tips and platform updates.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
