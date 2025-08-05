import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export interface EmailParams {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  private readonly fromEmail = 'noreply@medlink.ca'; // Update with your verified sender

  async sendEmail(params: EmailParams): Promise<boolean> {
    try {
      await sgMail.send({
        to: params.to,
        from: params.from || this.fromEmail,
        subject: params.subject,
        text: params.text,
        html: params.html,
      });
      return true;
    } catch (error) {
      console.error('SendGrid email error:', error);
      return false;
    }
  }

  async sendBookingConfirmation(
    patientEmail: string,
    patientName: string,
    providerName: string,
    serviceName: string,
    scheduledDate: Date,
    bookingId: number
  ): Promise<boolean> {
    const subject = `Booking Confirmation - ${serviceName} with ${providerName}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">MedLink House Calls</h1>
          <p style="margin: 10px 0 0; font-size: 16px;">Your booking has been confirmed</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${patientName},</h2>
          
          <p style="color: #555; line-height: 1.6;">
            Your in-home healthcare appointment has been successfully booked. Here are the details:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">Appointment Details</h3>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Provider:</strong> ${providerName}</p>
            <p><strong>Date & Time:</strong> ${scheduledDate.toLocaleDateString('en-CA', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p><strong>Booking ID:</strong> #${bookingId}</p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            Your healthcare provider will contact you shortly to confirm the appointment details and answer any questions you may have.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://medlink.ca/bookings/${bookingId}" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Booking Details
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px; line-height: 1.5;">
            If you need to make changes to your appointment, please contact us at support@medlink.ca or call our support line.
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">© 2025 MedLink House Calls. Quality healthcare at your doorstep.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: patientEmail,
      from: this.fromEmail,
      subject,
      html,
    });
  }

  async sendProviderNotification(
    providerEmail: string,
    providerName: string,
    patientName: string,
    serviceName: string,
    scheduledDate: Date,
    bookingId: number
  ): Promise<boolean> {
    const subject = `New Booking Request - ${serviceName}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">MedLink House Calls</h1>
          <p style="margin: 10px 0 0; font-size: 16px;">New booking request received</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${providerName},</h2>
          
          <p style="color: #555; line-height: 1.6;">
            You have received a new booking request through MedLink. Please review and confirm the appointment:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">Booking Details</h3>
            <p><strong>Patient:</strong> ${patientName}</p>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Requested Date & Time:</strong> ${scheduledDate.toLocaleDateString('en-CA', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p><strong>Booking ID:</strong> #${bookingId}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://medlink.ca/provider/bookings/${bookingId}" 
               style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
              Accept Booking
            </a>
            <a href="https://medlink.ca/provider/bookings/${bookingId}" 
               style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Details
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px; line-height: 1.5;">
            Please respond to this booking request within 24 hours to maintain your response rate rating.
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">© 2025 MedLink House Calls. Quality healthcare at your doorstep.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: providerEmail,
      from: this.fromEmail,
      subject,
      html,
    });
  }

  async sendBookingStatusUpdate(
    patientEmail: string,
    patientName: string,
    providerName: string,
    serviceName: string,
    status: string,
    bookingId: number
  ): Promise<boolean> {
    const statusMessages = {
      confirmed: 'Your appointment has been confirmed',
      cancelled: 'Your appointment has been cancelled',
      completed: 'Your appointment has been completed',
      rescheduled: 'Your appointment has been rescheduled'
    };

    const subject = `Booking Update - ${statusMessages[status as keyof typeof statusMessages] || 'Status Updated'}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">MedLink House Calls</h1>
          <p style="margin: 10px 0 0; font-size: 16px;">Booking status update</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${patientName},</h2>
          
          <p style="color: #555; line-height: 1.6;">
            ${statusMessages[status as keyof typeof statusMessages] || 'Your booking status has been updated'}.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">Booking Details</h3>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Provider:</strong> ${providerName}</p>
            <p><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
            <p><strong>Booking ID:</strong> #${bookingId}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://medlink.ca/bookings/${bookingId}" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Booking Details
            </a>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">© 2025 MedLink House Calls. Quality healthcare at your doorstep.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: patientEmail,
      from: this.fromEmail,
      subject,
      html,
    });
  }
}

export const emailService = new EmailService();