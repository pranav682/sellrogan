'use client';

import React from 'react';
import AIListingCreator from '@/components/AIListingCreator';

export default function ListingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create AI-Optimized Listing</h1>
      
      <div className="max-w-4xl mx-auto">
        <AIListingCreator />
      </div>
    </div>
  );
}
