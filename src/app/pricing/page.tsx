'use client';

import React, { useState } from 'react';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import ApiDocumentation from '@/components/ApiDocumentation';

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState('pricing');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Pricing & API</h1>
      
      <div className="mb-6 border-b border-gray-200 flex justify-center">
        <div className="flex flex-wrap -mb-px">
          <button
            className={`mr-2 py-2 px-4 font-medium text-sm ${
              activeTab === 'pricing'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pricing')}
          >
            Subscription Plans
          </button>
          <button
            className={`mr-2 py-2 px-4 font-medium text-sm ${
              activeTab === 'api'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('api')}
          >
            API Documentation
          </button>
        </div>
      </div>
      
      <div>
        {activeTab === 'pricing' && <SubscriptionPlans />}
        {activeTab === 'api' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ApiDocumentation />
          </div>
        )}
      </div>
    </div>
  );
}
