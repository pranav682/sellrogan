import nodemailer from 'nodemailer';

// Email service for SellRogan platform

export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;
  
  constructor() {
    // In a real application, these would be environment variables
    this.fromEmail = 'notifications@sellrogan.com';
    
    // Create reusable transporter object using SMTP transport
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'username', // would be an environment variable
        pass: 'password', // would be an environment variable
      },
    });
  }
  
  // Send welcome email to new users
  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `"SellRogan" <${this.fromEmail}>`,
        to,
        subject: 'Welcome to SellRogan!',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">SellRogan</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <h2>Welcome, ${name}!</h2>
            <p>Thank you for joining SellRogan. We're excited to help you find the best products to source and sell for maximum profit.</p>
            <p>Here are some things you can do to get started:</p>
            <ul>
              <li>Search for products across multiple platforms</li>
              <li>Compare prices to find the best deals</li>
              <li>Analyze profit potential</li>
              <li>Create optimized listings</li>
            </ul>
            <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
            <p>Best regards,<br>The SellRogan Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>© 2025 SellRogan. All rights reserved.</p>
            <p>You're receiving this email because you signed up for SellRogan.</p>
          </div>
        </div>
        `,
      });
      
      console.log('Welcome email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }
  
  // Send weekly performance report
  async sendWeeklyReport(to: string, name: string, data: any): Promise<boolean> {
    try {
      const subject = 'Your Weekly SellRogan Performance Report';
      
      // Format the data for the email
      const totalSales = data.sales.reduce((sum: number, sale: any) => sum + sale.amount, 0);
      const totalProfit = data.sales.reduce((sum: number, sale: any) => sum + sale.profit, 0);
      
      const info = await this.transporter.sendMail({
        from: `"SellRogan" <${this.fromEmail}>`,
        to,
        subject,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Weekly Report</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <h2>Hello, ${name}!</h2>
            <p>Here's your weekly performance report for your SellRogan listings.</p>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Summary</h3>
              <p><strong>Period:</strong> ${data.startDate} to ${data.endDate}</p>
              <p><strong>Total Sales:</strong> $${totalSales.toFixed(2)}</p>
              <p><strong>Total Profit:</strong> $${totalProfit.toFixed(2)}</p>
              <p><strong>Conversion Rate:</strong> ${data.conversionRate}%</p>
            </div>
            
            <h3>Top Performing Products</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb;">Product</th>
                  <th style="padding: 8px; text-align: right; border: 1px solid #e5e7eb;">Sales</th>
                  <th style="padding: 8px; text-align: right; border: 1px solid #e5e7eb;">Profit</th>
                </tr>
              </thead>
              <tbody>
                ${data.topProducts.map((product: any) => `
                  <tr>
                    <td style="padding: 8px; text-align: left; border: 1px solid #e5e7eb;">${product.name}</td>
                    <td style="padding: 8px; text-align: right; border: 1px solid #e5e7eb;">$${product.sales.toFixed(2)}</td>
                    <td style="padding: 8px; text-align: right; border: 1px solid #e5e7eb;">$${product.profit.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <p style="margin-top: 20px;">Log in to your dashboard for more detailed analytics and insights.</p>
            
            <p>Best regards,<br>The SellRogan Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>© 2025 SellRogan. All rights reserved.</p>
            <p>You're receiving this email because you signed up for SellRogan.</p>
          </div>
        </div>
        `,
      });
      
      console.log('Weekly report email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending weekly report email:', error);
      return false;
    }
  }
  
  // Send price alert email
  async sendPriceAlert(to: string, name: string, product: any): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `"SellRogan" <${this.fromEmail}>`,
        to,
        subject: `Price Alert: ${product.name}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Price Alert</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <h2>Hello, ${name}!</h2>
            <p>We've detected a significant price change for a product you're tracking.</p>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${product.name}</h3>
              <p><strong>Current Price:</strong> $${product.currentPrice.toFixed(2)}</p>
              <p><strong>Previous Price:</strong> $${product.previousPrice.toFixed(2)}</p>
              <p><strong>Price Change:</strong> ${product.priceChange > 0 ? '+' : ''}${product.priceChange.toFixed(2)}%</p>
              <p><strong>Platform:</strong> ${product.platform}</p>
              <p><a href="${product.url}" style="color: #4f46e5; text-decoration: none;">View Product</a></p>
            </div>
            
            <p>This might be a good opportunity to ${product.priceChange < 0 ? 'purchase this item' : 'adjust your selling strategy'}.</p>
            
            <p>Best regards,<br>The SellRogan Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>© 2025 SellRogan. All rights reserved.</p>
            <p>You're receiving this email because you signed up for SellRogan.</p>
          </div>
        </div>
        `,
      });
      
      console.log('Price alert email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending price alert email:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const emailService = new EmailService();
