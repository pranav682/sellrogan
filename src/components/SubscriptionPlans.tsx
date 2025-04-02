'use client';

import React, { useState } from 'react';
import { CreditCard, Check, X } from 'lucide-react';

interface SubscriptionPlansProps {
  className?: string;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ className = '' }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  // Define subscription plans
  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Basic features for individual sellers',
      priceMonthly: 0,
      priceAnnual: 0,
      features: [
        'Up to 10 product searches per day',
        'Basic price comparison',
        'Single platform listing',
        'Email support'
      ],
      limitations: [
        'No AI listing optimization',
        'No bulk operations',
        'Limited analytics'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Advanced features for growing sellers',
      priceMonthly: 29.99,
      priceAnnual: 299.99,
      features: [
        'Unlimited product searches',
        'Advanced price comparison',
        'Multi-platform listing',
        'AI listing optimization',
        'Basic analytics dashboard',
        'Priority email support'
      ],
      limitations: [
        'Limited bulk operations',
        'No API access'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Complete solution for professional sellers',
      priceMonthly: 79.99,
      priceAnnual: 799.99,
      features: [
        'Everything in Pro plan',
        'Unlimited bulk operations',
        'Advanced analytics dashboard',
        'Full API access',
        'Custom integrations',
        'Dedicated account manager',
        'Phone support'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false
    }
  ];
  
  // Calculate savings for annual billing
  const calculateSavings = (monthly: number, annual: number) => {
    if (monthly === 0) return 0;
    const monthlyCost = monthly * 12;
    const savings = ((monthlyCost - annual) / monthlyCost) * 100;
    return Math.round(savings);
  };
  
  return (
    <div className={`subscription-plans ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your selling needs. All plans include core features to help you find profitable products and sell them efficiently.
        </p>
        
        <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg mt-6">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              billingCycle === 'monthly'
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              billingCycle === 'annual'
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Annual
            <span className="ml-1 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
              Save up to 20%
            </span>
          </button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual;
          const savings = calculateSavings(plan.priceMonthly, plan.priceAnnual);
          
          return (
            <div
              key={plan.id}
              className={`border rounded-xl overflow-hidden ${
                plan.popular
                  ? 'border-blue-600 shadow-md relative'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">
                      ${price === 0 ? '0' : price.toFixed(2)}
                    </span>
                    {price > 0 && (
                      <span className="text-gray-500 ml-1">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    )}
                  </div>
                  {billingCycle === 'annual' && savings > 0 && (
                    <div className="text-green-600 text-sm mt-1">
                      Save {savings}% with annual billing
                    </div>
                  )}
                </div>
                
                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
              
              <div className="border-t border-gray-100 p-6">
                <h4 className="font-medium mb-3">What's included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  
                  {plan.limitations.map((limitation, index) => (
                    <li key={`limit-${index}`} className="flex items-start text-gray-500">
                      <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 bg-gray-50 rounded-lg p-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
            <h3 className="text-xl font-bold mb-2">Need a custom solution?</h3>
            <p className="text-gray-600">
              We offer custom enterprise plans for high-volume sellers and agencies. Contact our sales team to discuss your specific requirements.
            </p>
          </div>
          <div className="md:w-1/3 text-center md:text-right">
            <button className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
        <div className="max-w-3xl mx-auto">
          <div className="border-t border-gray-200 py-4">
            <h4 className="font-medium mb-2">Can I change plans later?</h4>
            <p className="text-gray-600 text-sm">
              Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle.
            </p>
          </div>
          <div className="border-t border-gray-200 py-4">
            <h4 className="font-medium mb-2">Is there a free trial?</h4>
            <p className="text-gray-600 text-sm">
              Yes, all paid plans come with a 14-day free trial. No credit card required to start.
            </p>
          </div>
          <div className="border-t border-gray-200 py-4">
            <h4 className="font-medium mb-2">What payment methods do you accept?</h4>
            <p className="text-gray-600 text-sm">
              We accept all major credit cards, PayPal, and bank transfers for annual plans.
            </p>
          </div>
          <div className="border-t border-gray-200 py-4">
            <h4 className="font-medium mb-2">Can I cancel anytime?</h4>
            <p className="text-gray-600 text-sm">
              Yes, you can cancel your subscription at any time. If you cancel, you'll have access to your plan until the end of your current billing period.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
