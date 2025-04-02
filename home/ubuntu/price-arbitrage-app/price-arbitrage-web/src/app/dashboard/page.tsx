import React from 'react';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { NotificationSettings } from '@/components/NotificationSettings';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold">Quick Stats</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-neutral-500 text-sm">Active Listings</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <div className="text-center">
                  <p className="text-neutral-500 text-sm">Total Sales</p>
                  <p className="text-2xl font-bold">142</p>
                </div>
                <div className="text-center">
                  <p className="text-neutral-500 text-sm">Revenue</p>
                  <p className="text-2xl font-bold">$12,450</p>
                </div>
                <div className="text-center">
                  <p className="text-neutral-500 text-sm">Profit</p>
                  <p className="text-2xl font-bold">$5,280</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold">Account Status</h2>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <p className="text-neutral-500 text-sm">Current Plan</p>
                <p className="font-medium">Pro Plan</p>
              </div>
              <div className="mb-4">
                <p className="text-neutral-500 text-sm">Renewal Date</p>
                <p className="font-medium">May 2, 2025</p>
              </div>
              <div>
                <p className="text-neutral-500 text-sm">API Usage</p>
                <div className="w-full bg-neutral-200 rounded-full h-2.5 mt-2">
                  <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-xs text-neutral-500 mt-1">45% of monthly limit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <AnalyticsDashboard />
      </div>
      
      <div>
        <NotificationSettings />
      </div>
    </div>
  );
}
