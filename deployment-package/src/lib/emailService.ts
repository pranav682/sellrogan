import nodemailer from 'nodemailer';
import { ListingResult } from './aiListingAgent';

// Email notification types
export type NotificationType = 
  | 'listing_created'
  | 'listing_sold'
  | 'price_alert'
  | 'traffic_report'
  | 'weekly_summary'
  | 'account_notification';

// Email template data
export interface EmailTemplateData {
  userName: string;
  [key: string]: any;
}

// User notification preferences
export interface NotificationPreferences {
  email: string;
  notifications: {
    [key in NotificationType]: boolean;
  };
  frequency: 'instant' | 'daily' | 'weekly';
  unsubscribeToken: string;
}

// Default notification preferences
const defaultNotificationPreferences: NotificationPreferences = {
  email: '',
  notifications: {
    listing_created: true,
    listing_sold: true,
    price_alert: true,
    traffic_report: true,
    weekly_summary: true,
    account_notification: true
  },
  frequency: 'instant',
  unsubscribeToken: ''
};

// Email service class
export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;
  
  constructor() {
    // In a production environment, we would use real SMTP credentials
    // For development, we'll use a mock transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'user@example.com',
        pass: process.env.SMTP_PASS || 'password'
      }
    });
    
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@sourceandsell.com';
  }
  
  // Send email
  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      // In development, we'll just log the email
      if (process.env.NODE_ENV === 'development') {
        console.log('Sending email to:', to);
        console.log('Subject:', subject);
        console.log('Content:', html);
        return true;
      }
      
      // In production, we would send the actual email
      const info = await this.transporter.sendMail({
        from: `"SourceAndSell" <${this.fromEmail}>`,
        to,
        subject,
        html
      });
      
      console.log('Email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
  
  // Send listing created notification
  async sendListingCreatedNotification(
    email: string, 
    userName: string, 
    listingResult: ListingResult
  ): Promise<boolean> {
    const subject = `Your listing on ${listingResult.platform} has been created`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4338ca; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">SourceAndSell</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <h2>Hello ${userName},</h2>
          
          <p>Great news! Your listing has been successfully created on ${listingResult.platform}.</p>
          
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Listing Details</h3>
            <p><strong>Listing ID:</strong> ${listingResult.listingId}</p>
            <p><strong>Status:</strong> ${listingResult.status}</p>
            <p><strong>Created:</strong> ${new Date(listingResult.createdAt).toLocaleString()}</p>
            
            ${listingResult.analytics ? `
              <h3>Analytics Predictions</h3>
              <p><strong>Estimated Views (30d):</strong> ${listingResult.analytics.estimatedViews}</p>
              <p><strong>Estimated Sales (30d):</strong> ${listingResult.analytics.estimatedSales}</p>
              <p><strong>Competitors:</strong> ${listingResult.analytics.competitorCount}</p>
              <p><strong>Price Position:</strong> ${listingResult.analytics.pricePosition.replace(/_/g, ' ')}</p>
            ` : ''}
          </div>
          
          ${listingResult.listingUrl ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${listingResult.listingUrl}" style="background-color: #4338ca; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                View Your Listing
              </a>
            </div>
          ` : ''}
          
          <p>We'll keep you updated on the performance of your listing and notify you of any sales or significant traffic changes.</p>
          
          <p>Best regards,<br>The SourceAndSell Team</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>© 2025 SourceAndSell. All rights reserved.</p>
          <p>
            <a href="https://sourceandsell.com/settings/notifications" style="color: #4338ca; text-decoration: none;">Manage Notification Settings</a> | 
            <a href="https://sourceandsell.com/unsubscribe?token=TOKEN" style="color: #4338ca; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `;
    
    return this.sendEmail(email, subject, html);
  }
  
  // Send weekly performance report
  async sendWeeklyPerformanceReport(
    email: string, 
    userName: string, 
    listings: Array<{
      id: string;
      title: string;
      platform: string;
      views: number;
      sales: number;
      revenue: number;
      previousViews: number;
      previousSales: number;
    }>
  ): Promise<boolean> {
    const subject = 'Your Weekly SourceAndSell Performance Report';
    
    // Calculate totals
    const totalViews = listings.reduce((sum, listing) => sum + listing.views, 0);
    const totalSales = listings.reduce((sum, listing) => sum + listing.sales, 0);
    const totalRevenue = listings.reduce((sum, listing) => sum + listing.revenue, 0);
    const totalPreviousViews = listings.reduce((sum, listing) => sum + listing.previousViews, 0);
    const totalPreviousSales = listings.reduce((sum, listing) => sum + listing.previousSales, 0);
    
    // Calculate changes
    const viewsChange = totalPreviousViews > 0 
      ? ((totalViews - totalPreviousViews) / totalPreviousViews * 100).toFixed(1) 
      : '0';
    const salesChange = totalPreviousSales > 0 
      ? ((totalSales - totalPreviousSales) / totalPreviousSales * 100).toFixed(1) 
      : '0';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4338ca; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Weekly Performance Report</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <h2>Hello ${userName},</h2>
          
          <p>Here's your weekly performance report for your SourceAndSell listings.</p>
          
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Total Views</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                  ${totalViews} 
                  <span style="color: ${Number(viewsChange) >= 0 ? '#10b981' : '#ef4444'}; font-size: 12px;">
                    (${Number(viewsChange) >= 0 ? '+' : ''}${viewsChange}%)
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Total Sales</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                  ${totalSales}
                  <span style="color: ${Number(salesChange) >= 0 ? '#10b981' : '#ef4444'}; font-size: 12px;">
                    (${Number(salesChange) >= 0 ? '+' : ''}${salesChange}%)
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Total Revenue</strong></td>
                <td style="padding: 8px; text-align: right;">$${totalRevenue.toFixed(2)}</td>
              </tr>
            </table>
          </div>
          
          <h3>Listing Performance</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e5e7eb;">Listing</th>
              <th style="padding: 8px; text-align: center; border-bottom: 2px solid #e5e7eb;">Platform</th>
              <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e5e7eb;">Views</th>
              <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e5e7eb;">Sales</th>
              <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e5e7eb;">Revenue</th>
            </tr>
            ${listings.map(listing => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${listing.title}</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${listing.platform}</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${listing.views}</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${listing.sales}</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${listing.revenue.toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://sourceandsell.com/dashboard" style="background-color: #4338ca; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Full Dashboard
            </a>
          </div>
          
          <p>Best regards,<br>The SourceAndSell Team</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>© 2025 SourceAndSell. All rights reserved.</p>
          <p>
            <a href="https://sourceandsell.com/settings/notifications" style="color: #4338ca; text-decoration: none;">Manage Notification Settings</a> | 
            <a href="https://sourceandsell.com/unsubscribe?token=TOKEN" style="color: #4338ca; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `;
    
    return this.sendEmail(email, subject, html);
  }
  
  // Send price alert notification
  async sendPriceAlertNotification(
    email: string, 
    userName: string, 
    alerts: Array<{
      productTitle: string;
      platform: string;
      oldPrice: number;
      newPrice: number;
      percentChange: number;
      url: string;
    }>
  ): Promise<boolean> {
    const subject = `Price Alert: ${alerts.length} product${alerts.length > 1 ? 's' : ''} with significant price changes`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4338ca; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Price Alert</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <h2>Hello ${userName},</h2>
          
          <p>We've detected significant price changes for ${alerts.length} product${alerts.length > 1 ? 's' : ''} you're tracking:</p>
          
          ${alerts.map(alert => `
            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 5px; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${alert.productTitle}</h3>
              <p><strong>Platform:</strong> ${alert.platform}</p>
              <p>
                <strong>Price Change:</strong> 
                $${alert.oldPrice.toFixed(2)} → $${alert.newPrice.toFixed(2)}
                <span style="color: ${alert.percentChange < 0 ? '#10b981' : '#ef4444'}; font-weight: bold;">
                  (${alert.percentChange < 0 ? '' : '+'}${alert.percentChange.toFixed(1)}%)
                </span>
              </p>
              <div style="text-align: center; margin-top: 15px;">
                <a href="${alert.url}" style="background-color: #4338ca; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; font-size: 14px;">
                  View Product
                </a>
              </div>
            </div>
          `).join('')}
          
          <p>These price changes may affect your sourcing strategy or profit margins. Consider reviewing your listings and adjusting your prices accordingly.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://sourceandsell.com/search" style="background-color: #4338ca; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Search More Products
            </a>
          </div>
          
          <p>Best regards,<br>The SourceAndSell Team</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>© 2025 SourceAndSell. All rights reserved.</p>
          <p>
            <a href="https://sourceandsell.com/settings/notifications" style="color: #4338ca; text-decoration: none;">Manage Notification Settings</a> | 
            <a href="https://sourceandsell.com/unsubscribe?token=TOKEN" style="color: #4338ca; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `;
    
    return this.sendEmail(email, subject, html);
  }
  
  // Send traffic spike notification
  async sendTrafficSpikeNotification(
    email: string, 
    userName: string, 
    listing: {
      id: string;
      title: string;
      platform: string;
      url: string;
      currentViews: number;
      averageViews: number;
      percentIncrease: number;
    }
  ): Promise<boolean> {
    const subject = `Traffic Alert: Significant increase in views for your ${listing.platform} listing`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4338ca; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Traffic Alert</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <h2>Hello ${userName},</h2>
          
          <p>Great news! One of your listings is experiencing a significant increase in traffic:</p>
          
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${listing.title}</h3>
            <p><strong>Platform:</strong> ${listing.platform}</p>
            <p><strong>Current Views:</strong> ${listing.currentViews}</p>
            <p><strong>Average Views:</strong> ${listing.averageViews}</p>
            <p>
              <strong>Increase:</strong> 
              <span style="color: #10b981; font-weight: bold;">
                +${listing.percentIncrease.toFixed(1)}%
              </span>
            </p>
            <div style="text-align: center; margin-top: 15px;">
              <a href="${listing.url}" style="background-color: #4338ca; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; font-size: 14px;">
                View Listing
              </a>
            </div>
          </div>
          
          <p>This could be a good opportunity to:</p>
          <ul>
            <li>Check your inventory levels to ensure you can meet potential increased demand</li>
            <li>Consider optimizing your pricing strategy to maximize profit</li>
            <li>Review your listing to ensure all information is accurate and up-to-date</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://sourceandsell.com/dashboard" style="background-color: #4338ca; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Dashboard
            </a>
          </div>
          
          <p>Best regards,<br>The SourceAndSell Team</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>© 2025 SourceAndSell. All rights reserved.</p>
          <p>
            <a href="https://sourceandsell.com/settings/notifications" style="color: #4338ca; text-decoration: none;">Manage Notification Settings</a> | 
            <a href="https://sourceandsell.com/unsubscribe?token=TOKEN" style="color: #4338ca; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `;
    
    return this.sendEmail(email, subject, html);
  }
  
  // Get user notification preferences
  async getUserNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    // In a real implementation, we would fetch this from a database
    // For now, we'll return default preferences
    return {
      ...defaultNotificationPreferences,
      email: 'user@example.com',
      unsubscribeToken: this.generateUnsubscribeToken(userId)
    };
  }
  
  // Update user notification preferences
  async updateUserNotificationPreferences(
    userId: string, 
    preferences: Partial<NotificationPreferences>
  ): Promise<boolean> {
    // In a real implementation, we would update this in a database
    console.log('Updating notification preferences for user:', userId, preferences);
    return true;
  }
  
  // Generate unsubscribe token
  private generateUnsubscribeToken(userId: string): string {
    // In a real implementation, we would generate a secure token
    return `unsubscribe-${userId}-${Date.now()}`;
  }
}

// Export singleton instance
export const emailService = new EmailService();
