'use client';

import React, { useState } from 'react';
import { Check, X, HelpCircle, CreditCard, Calendar, Zap, Shield, BarChart2, Code, Users } from 'lucide-react';

interface SubscriptionPlansProps {
  className?: string;
  onSelectPlan?: (plan: 'free' | 'basic' | 'pro' | 'enterprise') => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  className = '',
  onSelectPlan
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showFeatureInfo, setShowFeatureInfo] = useState<string | null>(null);
  
  // Feature information tooltips
  const featureInfo: Record<string, string> = {
    'product_search': 'Search for products across multiple e-commerce platforms to find the best deals.',
    'daily_searches': 'Number of product searches you can perform per day.',
    'platforms': 'E-commerce platforms that can be searched for products.',
    'price_comparison': 'Compare prices across different platforms to find the best deals.',
    'profit_analysis': 'Analyze potential profit margins based on sourcing and selling prices.',
    'listing_creation': 'Create listings on e-commerce platforms with one click.',
    'monthly_listings': 'Number of listings you can create per month.',
    'ai_optimization': 'AI-powered optimization for listings to improve visibility and conversion.',
    'email_notifications': 'Receive email notifications for important events like price changes and sales.',
    'analytics_dashboard': 'Access to the analytics dashboard with insights on your listings and sales.',
    'historical_data': 'Access to historical data for trend analysis.',
    'api_access': 'Programmatic access to SourceAndSell features via API.',
    'api_rate_limit': 'Number of API requests allowed per minute.',
    'priority_support': 'Priority customer support with faster response times.',
    'dedicated_account': 'Dedicated account manager for personalized support.',
    'custom_integration': 'Custom integration with your existing systems and workflows.',
    'white_label': 'White-label solution with your own branding.',
    'bulk_operations': 'Perform operations on multiple products or listings at once.',
    'team_members': 'Number of team members who can access your account.'
  };
  
  // Toggle feature info tooltip
  const toggleFeatureInfo = (feature: string) => {
    if (showFeatureInfo === feature) {
      setShowFeatureInfo(null);
    } else {
      setShowFeatureInfo(feature);
    }
  };
  
  // Plan details
  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'For individuals just getting started with e-commerce arbitrage',
      monthlyPrice: 0,
      annualPrice: 0,
      features: {
        product_search: true,
        daily_searches: '10',
        platforms: '3',
        price_comparison: true,
        profit_analysis: 'Basic',
        listing_creation: false,
        monthly_listings: '0',
        ai_optimization: false,
        email_notifications: 'Basic',
        analytics_dashboard: 'Limited',
        historical_data: '7 days',
        api_access: false,
        api_rate_limit: '0',
        priority_support: false,
        dedicated_account: false,
        custom_integration: false,
        white_label: false,
        bulk_operations: false,
        team_members: '1'
      },
      cta: 'Get Started',
      highlight: false
    },
    {
      id: 'basic',
      name: 'Basic',
      description: 'For individual sellers looking to scale their e-commerce business',
      monthlyPrice: 29.99,
      annualPrice: 299.90, // 2 months free
      features: {
        product_search: true,
        daily_searches: '100',
        platforms: '5',
        price_comparison: true,
        profit_analysis: 'Advanced',
        listing_creation: true,
        monthly_listings: '50',
        ai_optimization: 'Basic',
        email_notifications: 'Advanced',
        analytics_dashboard: 'Full',
        historical_data: '30 days',
        api_access: false,
        api_rate_limit: '0',
        priority_support: false,
        dedicated_account: false,
        custom_integration: false,
        white_label: false,
        bulk_operations: 'Limited',
        team_members: '1'
      },
      cta: 'Subscribe',
      highlight: false
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For professional sellers with high-volume e-commerce operations',
      monthlyPrice: 99.99,
      annualPrice: 999.90, // 2 months free
      features: {
        product_search: true,
        daily_searches: 'Unlimited',
        platforms: 'All',
        price_comparison: true,
        profit_analysis: 'Advanced',
        listing_creation: true,
        monthly_listings: '500',
        ai_optimization: 'Advanced',
        email_notifications: 'Advanced',
        analytics_dashboard: 'Full',
        historical_data: '1 year',
        api_access: true,
        api_rate_limit: '100',
        priority_support: true,
        dedicated_account: false,
        custom_integration: false,
        white_label: false,
        bulk_operations: 'Full',
        team_members: '3'
      },
      cta: 'Subscribe',
      highlight: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large businesses and agencies with custom requirements',
      monthlyPrice: 499.99,
      annualPrice: 4999.90, // 2 months free
      features: {
        product_search: true,
        daily_searches: 'Unlimited',
        platforms: 'All',
        price_comparison: true,
        profit_analysis: 'Advanced',
        listing_creation: true,
        monthly_listings: 'Unlimited',
        ai_optimization: 'Advanced',
        email_notifications: 'Advanced',
        analytics_dashboard: 'Full',
        historical_data: 'Unlimited',
        api_access: true,
        api_rate_limit: '500',
        priority_support: true,
        dedicated_account: true,
        custom_integration: true,
        white_label: true,
        bulk_operations: 'Full',
        team_members: '10+'
      },
      cta: 'Contact Sales',
      highlight: false
    }
  ];
  
  // Feature display order and grouping
  const featureGroups = [
    {
      title: 'Core Features',
      icon: <Zap size={18} className="mr-2 text-primary-600" />,
      features: [
        { id: 'product_search', label: 'Product Search' },
        { id: 'daily_searches', label: 'Daily Searches' },
        { id: 'platforms', label: 'Supported Platforms' },
        { id: 'price_comparison', label: 'Price Comparison' },
        { id: 'profit_analysis', label: 'Profit Analysis' }
      ]
    },
    {
      title: 'Listing Management',
      icon: <BarChart2 size={18} className="mr-2 text-primary-600" />,
      features: [
        { id: 'listing_creation', label: 'One-Click Listing' },
        { id: 'monthly_listings', label: 'Monthly Listings' },
        { id: 'ai_optimization', label: 'AI Listing Optimization' },
        { id: 'bulk_operations', label: 'Bulk Operations' }
      ]
    },
    {
      title: 'Analytics & Reporting',
      icon: <BarChart2 size={18} className="mr-2 text-primary-600" />,
      features: [
        { id: 'email_notifications', label: 'Email Notifications' },
        { id: 'analytics_dashboard', label: 'Analytics Dashboard' },
        { id: 'historical_data', label: 'Historical Data' }
      ]
    },
    {
      title: 'API & Integrations',
      icon: <Code size={18} className="mr-2 text-primary-600" />,
      features: [
        { id: 'api_access', label: 'API Access' },
        { id: 'api_rate_limit', label: 'API Rate Limit' },
        { id: 'custom_integration', label: 'Custom Integrations' },
        { id: 'white_label', label: 'White Labeling' }
      ]
    },
    {
      title: 'Support & Team',
      icon: <Users size={18} className="mr-2 text-primary-600" />,
      features: [
        { id: 'priority_support', label: 'Priority Support' },
        { id: 'dedicated_account', label: 'Dedicated Account Manager' },
        { id: 'team_members', label: 'Team Members' }
      ]
    }
  ];
  
  // Render feature value
  const renderFeatureValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check size={18} className="text-accent-success" />
      ) : (
        <X size={18} className="text-accent-danger" />
      );
    }
    return <span>{value}</span>;
  };
  
  return (
    <div className={`subscription-plans ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Select the plan that best fits your business needs. All plans include our core features, 
          with additional capabilities available in higher tiers.
        </p>
        
        {/* Billing cycle toggle */}
        <div className="mt-6 inline-flex items-center bg-neutral-100 p-1 rounded-lg">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              billingCycle === 'monthly' 
                ? 'bg-white shadow-sm text-primary-600' 
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              billingCycle === 'annual' 
                ? 'bg-white shadow-sm text-primary-600' 
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            onClick={() => setBillingCycle('annual')}
          >
            Annual <span className="text-accent-success text-xs">Save 16%</span>
          </button>
        </div>
      </div>
      
      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`card border ${
              plan.highlight 
                ? 'border-primary-500 ring-1 ring-primary-500' 
                : 'border-neutral-200'
            } relative`}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <div className="card-body">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-neutral-600 text-sm mb-4">{plan.description}</p>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">
                    {billingCycle === 'monthly' 
                      ? `$${plan.monthlyPrice.toFixed(2)}` 
                      : `$${plan.annualPrice.toFixed(2)}`}
                  </span>
                  <span className="text-neutral-500 ml-2">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                {billingCycle === 'annual' && plan.monthlyPrice > 0 && (
                  <div className="text-accent-success text-sm mt-1">
                    Save ${(plan.monthlyPrice * 12 - plan.annualPrice).toFixed(2)} per year
                  </div>
                )}
              </div>
              
              <button
                className={`btn w-full mb-6 ${
                  plan.highlight 
                    ? 'btn-primary' 
                    : 'btn-outline'
                }`}
                onClick={() => onSelectPlan && onSelectPlan(plan.id as any)}
              >
                {plan.cta}
              </button>
              
              <div className="space-y-3 text-sm">
                {/* Core features preview */}
                {featureGroups[0].features.slice(0, 3).map((feature) => (
                  <div key={feature.id} className="flex items-center">
                    {typeof plan.features[feature.id] === 'boolean' ? (
                      plan.features[feature.id] ? (
                        <Check size={16} className="text-accent-success mr-2 flex-shrink-0" />
                      ) : (
                        <X size={16} className="text-accent-danger mr-2 flex-shrink-0" />
                      )
                    ) : (
                      <span className="text-primary-600 font-medium mr-2 flex-shrink-0">✓</span>
                    )}
                    <span>
                      {feature.label}: <strong>{plan.features[feature.id]}</strong>
                    </span>
                  </div>
                ))}
                
                {/* More features indicator */}
                <div className="pt-2 text-primary-600 font-medium">
                  + More features
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Feature comparison table */}
      <div className="card border border-neutral-200 overflow-hidden">
        <div className="card-header bg-neutral-50">
          <h3 className="font-semibold">Feature Comparison</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50">
                <th className="py-4 px-6 text-left font-medium text-neutral-500 w-1/3">Feature</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="py-4 px-6 text-center font-medium text-neutral-500">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureGroups.map((group) => (
                <React.Fragment key={group.title}>
                  <tr className="bg-neutral-100">
                    <td colSpan={5} className="py-2 px-6 font-medium flex items-center">
                      {group.icon}
                      {group.title}
                    </td>
                  </tr>
                  
                  {group.features.map((feature) => (
                    <tr key={feature.id} className="border-t border-neutral-100">
                      <td className="py-3 px-6 flex items-center">
                        {feature.label}
                        <button
                          className="ml-2 text-neutral-400 hover:text-neutral-600"
                          onClick={() => toggleFeatureInfo(feature.id)}
                          aria-label={`Info about ${feature.label}`}
                        >
                          <HelpCircle size={14} />
                        </button>
                        
                        {showFeatureInfo === feature.id && (
                          <div className="absolute z-10 mt-2 ml-6 p-3 bg-white rounded-md shadow-lg border border-neutral-200 max-w-xs">
                            <p className="text-sm text-neutral-700">{featureInfo[feature.id]}</p>
                          </div>
                        )}
                      </td>
                      
                      {plans.map((plan) => (
                        <td key={plan.id} className="py-3 px-6 text-center">
                          {renderFeatureValue(plan.features[feature.id])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* FAQ section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-body">
              <h4 className="font-medium mb-2">Can I upgrade or downgrade my plan?</h4>
              <p className="text-neutral-600">
                Yes, you can upgrade your plan at any time. The price difference will be prorated. 
                Downgrades take effect at the end of your current billing cycle.
              </p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <h4 className="font-medium mb-2">Is there a free trial?</h4>
              <p className="text-neutral-600">
                Yes, all paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <h4 className="font-medium mb-2">What payment methods do you accept?</h4>
              <p className="text-neutral-600">
                We accept all major credit cards, PayPal, and bank transfers for annual Enterprise plans.
              </p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <h4 className="font-medium mb-2">Do you offer refunds?</h4>
              <p className="text-neutral-600">
                We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, 
                contact our support team for a full refund.
              </p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <h4 className="font-medium mb-2">What happens if I exceed my plan limits?</h4>
              <p className="text-neutral-600">
                You'll receive a notification when you're approaching your limits. You can upgrade 
                your plan or wait until the next billing cycle for your limits to reset.
              </p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <h4 className="font-medium mb-2">Do you offer custom plans?</h4>
              <p className="text-neutral-600">
                Yes, our Enterprise plan can be customized to meet your specific needs. Contact our 
                sales team to discuss your requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
        <p className="text-neutral-600 max-w-2xl mx-auto mb-6">
          Choose the plan that's right for you and start finding the best deals across multiple platforms.
        </p>
        <button className="btn btn-primary btn-lg">
          Start Your 14-Day Free Trial
        </button>
        <p className="text-sm text-neutral-500 mt-4">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
