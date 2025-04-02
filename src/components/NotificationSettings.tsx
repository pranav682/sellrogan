'use client';

import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Check } from 'lucide-react';

interface NotificationSettingsProps {
  className?: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className = '' }) => {
  const [settings, setSettings] = useState({
    email: {
      orderUpdates: true,
      priceAlerts: true,
      marketingEmails: false,
      weeklyReports: true,
      securityAlerts: true
    },
    push: {
      orderUpdates: true,
      priceAlerts: true,
      marketingNotifications: false,
      weeklyReports: false,
      securityAlerts: true
    },
    sms: {
      orderUpdates: false,
      priceAlerts: false,
      marketingMessages: false,
      weeklyReports: false,
      securityAlerts: true
    }
  });
  
  // Toggle a specific notification setting
  const toggleSetting = (channel: 'email' | 'push' | 'sms', setting: string) => {
    setSettings({
      ...settings,
      [channel]: {
        ...settings[channel],
        [setting]: !settings[channel][setting as keyof typeof settings[typeof channel]]
      }
    });
  };
  
  // Toggle all settings for a channel
  const toggleAllForChannel = (channel: 'email' | 'push' | 'sms', value: boolean) => {
    const channelSettings = { ...settings[channel] };
    
    Object.keys(channelSettings).forEach(key => {
      channelSettings[key as keyof typeof channelSettings] = value;
    });
    
    setSettings({
      ...settings,
      [channel]: channelSettings
    });
  };
  
  return (
    <div className={`notification-settings ${className}`}>
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notification Settings
          </h2>
          <p className="text-gray-600 mt-1">
            Manage how you receive notifications and updates from SellRogan.
          </p>
        </div>
        
        <div className="mt-6">
          {/* Email Notifications */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <Mail className="mr-2 h-5 w-5 text-blue-600" />
                Email Notifications
              </h3>
              <div className="flex items-center">
                <button
                  onClick={() => toggleAllForChannel('email', true)}
                  className="text-sm text-blue-600 hover:text-blue-800 mr-4"
                >
                  Enable All
                </button>
                <button
                  onClick={() => toggleAllForChannel('email', false)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Disable All
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium">Order Updates</div>
                  <div className="text-sm text-gray-500">Receive updates about your orders and listings</div>
                </div>
                <div>
                  <button
                    onClick={() => toggleSetting('email', 'orderUpdates')}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                      settings.email.orderUpdates ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-1"></div>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium">Price Alerts</div>
                  <div className="text-sm text-gray-500">Get notified when prices change for tracked products</div>
                </div>
                <div>
                  <button
                    onClick={() => toggleSetting('email', 'priceAlerts')}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                      settings.email.priceAlerts ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-1"></div>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium">Marketing Emails</div>
                  <div className="text-sm text-gray-500">Receive promotional offers and marketing updates</div>
                </div>
                <div>
                  <button
                    onClick={() => toggleSetting('email', 'marketingEmails')}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                      settings.email.marketingEmails ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-1"></div>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium">Weekly Reports</div>
                  <div className="text-sm text-gray-500">Receive weekly performance reports for your listings</div>
                </div>
                <div>
                  <button
                    onClick={() => toggleSetting('email', 'weeklyReports')}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                      settings.email.weeklyReports ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-1"></div>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium">Security Alerts</div>
                  <div className="text-sm text-gray-500">Get notified about security-related events</div>
                </div>
                <div>
                  <button
                    onClick={() => toggleSetting('email', 'securityAlerts')}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                      settings.email.securityAlerts ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-1"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Push Notifications */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <Bell className="mr-2 h-5 w-5 text-purple-600" />
                Push Notifications
              </h3>
              <div className="flex items-center">
                <button
                  onClick={() => toggleAllForChannel('push', true)}
                  className="text-sm text-blue-600 hover:text-blue-800 mr-4"
                >
                  Enable All
                </button>
                <button
                  onClick={() => toggleAllForChannel('push', false)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Disable All
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Similar structure as email notifications, with push settings */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium">Order Updates</div>
                  <div className="text-sm text-gray-500">Receive updates about your orders and listings</div>
                </div>
                <div>
                  <button
                    onClick={() => toggleSetting('push', 'orderUpdates')}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                      settings.push.orderUpdates ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-1"></div>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium">Price Alerts</div>
                  <div className="text-sm text-gray-500">Get notified when prices change for tracked products</div>
                </div>
                <div>
                  <button
                    onClick={() => toggleSetting('push', 'priceAlerts')}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                      settings.push.priceAlerts ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-1"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* SMS Notifications */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <Smartphone className="mr-2 h-5 w-5 text-green-600" />
                SMS Notifications
              </h3>
              <div className="flex items-center">
                <button
                  onClick={() => toggleAllForChannel('sms', true)}
                  className="text-sm text-blue-600 hover:text-blue-800 mr-4"
                >
                  Enable All
                </button>
                <button
                  onClick={() => toggleAllForChannel('sms', false)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Disable All
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Similar structure as email notifications, with sms settings */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium">Order Updates</div>
                  <div className="text-sm text-gray-500">Receive updates about your orders and listings</div>
                </div>
                <div>
                  <button
                    onClick={() => toggleSetting('sms', 'orderUpdates')}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                      settings.sms.orderUpdates ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-1"></div>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium">Security Alerts</div>
                  <div className="text-sm text-gray-500">Get notified about security-related events</div>
                </div>
                <div>
                  <button
                    onClick={() => toggleSetting('sms', 'securityAlerts')}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                      settings.sms.securityAlerts ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-1"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
