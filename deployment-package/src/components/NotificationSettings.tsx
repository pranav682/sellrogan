'use client';

import React, { useState } from 'react';
import { Bell, Mail, AlertCircle, Clock, BarChart, Settings } from 'lucide-react';
import { NotificationType } from '@/lib/emailService';

interface NotificationSettingsProps {
  className?: string;
  onSave?: (preferences: {
    email: string;
    notifications: Record<NotificationType, boolean>;
    frequency: 'instant' | 'daily' | 'weekly';
  }) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  className = '',
  onSave
}) => {
  const [email, setEmail] = useState<string>('');
  const [notifications, setNotifications] = useState<Record<NotificationType, boolean>>({
    listing_created: true,
    listing_sold: true,
    price_alert: true,
    traffic_report: true,
    weekly_summary: true,
    account_notification: true
  });
  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle notification toggle
  const handleNotificationToggle = (type: NotificationType) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setSuccess(false);
    setError(null);
    
    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    
    // In a real implementation, we would save to the backend
    setTimeout(() => {
      if (onSave) {
        onSave({
          email,
          notifications,
          frequency
        });
      }
      
      setSuccess(true);
      setIsLoading(false);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  return (
    <div className={`notification-settings ${className}`}>
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold flex items-center">
            <Bell size={20} className="mr-2 text-primary-600" />
            Notification Settings
          </h2>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className="form-control pl-10"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-neutral-400" />
                </div>
              </div>
              <p className="text-sm text-neutral-500 mt-1">
                We'll send notifications to this email address
              </p>
            </div>
            
            <div className="mb-6">
              <label className="form-label">
                Notification Frequency
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    frequency === 'instant' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-neutral-200 hover:border-primary-200 hover:bg-neutral-50'
                  }`}
                  onClick={() => setFrequency('instant')}
                >
                  <div className="flex items-start mb-2">
                    <div className="flex h-5 items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
                        checked={frequency === 'instant'}
                        onChange={() => setFrequency('instant')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-neutral-900">Instant</label>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 ml-7">
                    Receive notifications as events occur
                  </p>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    frequency === 'daily' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-neutral-200 hover:border-primary-200 hover:bg-neutral-50'
                  }`}
                  onClick={() => setFrequency('daily')}
                >
                  <div className="flex items-start mb-2">
                    <div className="flex h-5 items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
                        checked={frequency === 'daily'}
                        onChange={() => setFrequency('daily')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-neutral-900">Daily Digest</label>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 ml-7">
                    Receive a daily summary of all notifications
                  </p>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    frequency === 'weekly' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-neutral-200 hover:border-primary-200 hover:bg-neutral-50'
                  }`}
                  onClick={() => setFrequency('weekly')}
                >
                  <div className="flex items-start mb-2">
                    <div className="flex h-5 items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
                        checked={frequency === 'weekly'}
                        onChange={() => setFrequency('weekly')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-neutral-900">Weekly Digest</label>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 ml-7">
                    Receive a weekly summary of all notifications
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="form-label">
                Notification Types
              </label>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="listing_created"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      checked={notifications.listing_created}
                      onChange={() => handleNotificationToggle('listing_created')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="listing_created" className="font-medium text-neutral-900">
                      Listing Created
                    </label>
                    <p className="text-neutral-500">
                      Receive notifications when your listings are created
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="listing_sold"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      checked={notifications.listing_sold}
                      onChange={() => handleNotificationToggle('listing_sold')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="listing_sold" className="font-medium text-neutral-900">
                      Sales Notifications
                    </label>
                    <p className="text-neutral-500">
                      Receive notifications when your items are sold
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="price_alert"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      checked={notifications.price_alert}
                      onChange={() => handleNotificationToggle('price_alert')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="price_alert" className="font-medium text-neutral-900">
                      Price Alerts
                    </label>
                    <p className="text-neutral-500">
                      Receive notifications when prices change significantly
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="traffic_report"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      checked={notifications.traffic_report}
                      onChange={() => handleNotificationToggle('traffic_report')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="traffic_report" className="font-medium text-neutral-900">
                      Traffic Reports
                    </label>
                    <p className="text-neutral-500">
                      Receive notifications about significant changes in listing traffic
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="weekly_summary"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      checked={notifications.weekly_summary}
                      onChange={() => handleNotificationToggle('weekly_summary')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="weekly_summary" className="font-medium text-neutral-900">
                      Weekly Summary
                    </label>
                    <p className="text-neutral-500">
                      Receive a weekly summary of your account performance
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="account_notification"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      checked={notifications.account_notification}
                      onChange={() => handleNotificationToggle('account_notification')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="account_notification" className="font-medium text-neutral-900">
                      Account Notifications
                    </label>
                    <p className="text-neutral-500">
                      Receive notifications about your account status and billing
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-accent-danger bg-opacity-10 text-accent-danger rounded-md flex items-start">
                <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-accent-success bg-opacity-10 text-accent-success rounded-md flex items-start">
                <Bell size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                <p>Notification settings saved successfully!</p>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner-sm mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Settings size={18} className="mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold flex items-center">
              <Clock size={18} className="mr-2 text-primary-600" />
              Notification Preview
            </h3>
          </div>
          
          <div className="card-body">
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-white">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-accent-success"></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-neutral-900">Listing Created Successfully</p>
                    <p className="text-sm text-neutral-600">Your product "Wireless Earbuds" has been listed on Amazon</p>
                    <p className="text-xs text-neutral-500 mt-1">10 minutes ago</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-white">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-accent-info"></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-neutral-900">Weekly Performance Report</p>
                    <p className="text-sm text-neutral-600">Your listings received 245 views and 12 sales last week</p>
                    <p className="text-xs text-neutral-500 mt-1">2 days ago</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-white">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-accent-warning"></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-neutral-900">Price Alert</p>
                    <p className="text-sm text-neutral-600">Bluetooth Speaker price dropped by 15% on Walmart</p>
                    <p className="text-xs text-neutral-500 mt-1">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-neutral-500">
                These are examples of the notifications you'll receive based on your settings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
