'use client';

// Mock email service for SellRogan platform
// This is a client-side mock implementation that doesn't require nodemailer

export class EmailService {
  private fromEmail: string;
  
  constructor() {
    this.fromEmail = 'notifications@sellrogan.com';
  }
  
  // Send welcome email to new users
  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    try {
      console.log(`[MOCK] Sending welcome email to ${to} for ${name}`);
      // In a real implementation, this would send an actual email
      // For now, we just log it and return success
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }
  
  // Send weekly performance report
  async sendWeeklyReport(to: string, name: string, data: any): Promise<boolean> {
    try {
      console.log(`[MOCK] Sending weekly report to ${to} for ${name}`);
      // In a real implementation, this would send an actual email with the report data
      // For now, we just log it and return success
      return true;
    } catch (error) {
      console.error('Error sending weekly report email:', error);
      return false;
    }
  }
  
  // Send price alert email
  async sendPriceAlert(to: string, name: string, product: any): Promise<boolean> {
    try {
      console.log(`[MOCK] Sending price alert to ${to} for product ${product.name}`);
      // In a real implementation, this would send an actual email with the price alert
      // For now, we just log it and return success
      return true;
    } catch (error) {
      console.error('Error sending price alert email:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const emailService = new EmailService();
