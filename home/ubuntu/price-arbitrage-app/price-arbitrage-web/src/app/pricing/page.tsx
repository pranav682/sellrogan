import React from 'react';
import { SubscriptionPlans } from '@/components/SubscriptionPlans';
import { ApiDocumentation } from '@/components/ApiDocumentation';

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Pricing & Plans</h1>
      <SubscriptionPlans />
      <div className="mt-16">
        <ApiDocumentation />
      </div>
    </div>
  );
}
