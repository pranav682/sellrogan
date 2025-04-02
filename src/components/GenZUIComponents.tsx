'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, ArrowRight, Star, TrendingUp, ShoppingBag } from 'lucide-react';

interface GenZUIComponentsProps {
  className?: string;
}

const GenZUIComponents: React.FC<GenZUIComponentsProps> = ({ className = '' }) => {
  // Demo state
  const [activeTab, setActiveTab] = useState('discover');
  const [showTooltip, setShowTooltip] = useState(false);
  const [likedItems, setLikedItems] = useState<number[]>([]);
  
  // Demo data
  const trendingItems = [
    { id: 1, name: 'Wireless Earbuds', price: 49.99, image: 'https://via.placeholder.com/150?text=Earbuds' },
    { id: 2, name: 'Smart Watch', price: 129.99, image: 'https://via.placeholder.com/150?text=Watch' },
    { id: 3, name: 'Portable Charger', price: 29.99, image: 'https://via.placeholder.com/150?text=Charger' },
    { id: 4, name: 'Bluetooth Speaker', price: 79.99, image: 'https://via.placeholder.com/150?text=Speaker' },
  ];
  
  // Toggle like
  const toggleLike = (id: number) => {
    if (likedItems.includes(id)) {
      setLikedItems(likedItems.filter(itemId => itemId !== id));
    } else {
      setLikedItems([...likedItems, id]);
    }
  };
  
  return (
    <div className={`gen-z-ui-components ${className}`}>
      <h2 className="text-2xl font-bold mb-6">Gen Z UI Components</h2>
      
      {/* Modern Tab Navigation */}
      <section className="mb-12">
        <h3 className="text-lg font-semibold mb-4">Modern Tab Navigation</h3>
        <div className="bg-white rounded-xl shadow-sm p-1 flex">
          {['discover', 'trending', 'saved', 'profile'].map((tab) => (
            <motion.button
              key={tab}
              className={`relative flex-1 py-3 px-4 rounded-lg text-sm font-medium ${
                activeTab === tab ? 'text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab(tab)}
              whileTap={{ scale: 0.95 }}
            >
              {activeTab === tab && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg"
                  layoutId="activeTab"
                  initial={false}
                />
              )}
              <span className="relative z-10 capitalize flex items-center justify-center">
                {tab === 'discover' && <Sparkles className="w-4 h-4 mr-1" />}
                {tab === 'trending' && <TrendingUp className="w-4 h-4 mr-1" />}
                {tab === 'saved' && <Star className="w-4 h-4 mr-1" />}
                {tab === 'profile' && <ShoppingBag className="w-4 h-4 mr-1" />}
                {tab}
              </span>
            </motion.button>
          ))}
        </div>
      </section>
      
      {/* Animated Cards */}
      <section className="mb-12">
        <h3 className="text-lg font-semibold mb-4">Animated Product Cards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {trendingItems.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
              whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-40 object-cover"
                />
                <motion.button
                  className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                    likedItems.includes(item.id) 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-400'
                  }`}
                  onClick={() => toggleLike(item.id)}
                  whileTap={{ scale: 1.2 }}
                >
                  <Star 
                    className={`w-4 h-4 ${likedItems.includes(item.id) ? 'fill-white' : ''}`} 
                  />
                </motion.button>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-blue-600 font-bold">${item.price}</span>
                  <motion.button
                    className="bg-blue-100 text-blue-600 p-2 rounded-full"
                    whileHover={{ scale: 1.1, backgroundColor: '#3B82F6', color: '#ffffff' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Micro-interactions */}
      <section className="mb-12">
        <h3 className="text-lg font-semibold mb-4">Micro-interactions</h3>
        <div className="flex flex-wrap gap-4">
          {/* Tooltip Button */}
          <div className="relative">
            <motion.button
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium"
              onHoverStart={() => setShowTooltip(true)}
              onHoverEnd={() => setShowTooltip(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Hover Me
            </motion.button>
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm py-1 px-3 rounded"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  Cool tooltip!
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Pulse Button */}
          <motion.button
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              Pulse Effect
            </span>
            <motion.div
              className="absolute inset-0 bg-green-400"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.5, 1], 
                opacity: [0, 0.5, 0] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                repeatDelay: 1
              }}
            />
          </motion.button>
          
          {/* Animated Toggle */}
          <ToggleSwitch />
        </div>
      </section>
      
      {/* Skeleton Loading */}
      <section className="mb-12">
        <h3 className="text-lg font-semibold mb-4">Skeleton Loading</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="animate-pulse">
                <div className="bg-gray-200 h-40 w-full"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Dark Mode UI */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Dark Mode UI</h3>
        <div className="bg-gray-900 text-white rounded-xl p-6">
          <h4 className="text-xl font-bold mb-4">Dark Mode Experience</h4>
          <p className="text-gray-300 mb-4">
            Dark mode reduces eye strain and saves battery life on OLED screens.
            It's also preferred by many Gen Z users for its aesthetic appeal.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h5 className="ml-2 font-medium">Feature One</h5>
              </div>
              <p className="text-gray-400 text-sm">
                Description of this amazing feature that users will love.
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h5 className="ml-2 font-medium">Feature Two</h5>
              </div>
              <p className="text-gray-400 text-sm">
                Another great feature that makes this app stand out.
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h5 className="ml-2 font-medium">Feature Three</h5>
              </div>
              <p className="text-gray-400 text-sm">
                The third amazing feature that users can't live without.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch: React.FC = () => {
  const [isOn, setIsOn] = useState(false);
  
  return (
    <div className="flex items-center">
      <motion.div
        className="w-12 h-6 bg-gray-200 rounded-full p-1 cursor-pointer flex items-center"
        onClick={() => setIsOn(!isOn)}
        style={{ justifyContent: isOn ? 'flex-end' : 'flex-start' }}
      >
        <motion.div
          className="w-4 h-4 rounded-full"
          animate={{
            backgroundColor: isOn ? '#4F46E5' : '#FFFFFF',
            boxShadow: isOn 
              ? '0px 0px 0px 2px #4F46E5' 
              : '0px 0px 0px 2px #E5E7EB'
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
      <span className="ml-2 text-sm font-medium">
        {isOn ? 'On' : 'Off'}
      </span>
    </div>
  );
};

export default GenZUIComponents;
