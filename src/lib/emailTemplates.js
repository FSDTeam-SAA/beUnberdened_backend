// ✅ ESM
const verificationCodeTemplate = (code) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
    <h1 style="color: #333; text-align: center;">Verification Code</h1>
    <p style="font-size: 16px; color: #555;">Hello,</p>
    <p style="font-size: 16px; color: #555;">Thank you for using our services. Your verification code is:</p>
    <p style="font-size: 24px; font-weight: bold; text-align: center; color: #007BFF;">${code}</p>
    <p style="font-size: 16px; color: #555;">Please enter this code within 5 minutes to verify your account.</p>
    <p style="font-size: 16px; color: #555;">If you did not request this code, please ignore this email.</p>
    <footer style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
      &copy; 2023 Your Company Name. All rights reserved.
    </footer>
  </div>
`;

export default verificationCodeTemplate;


export const getPaymentSuccessTemplate = ({ name, eventId, slots }) => {
  const slotDetails = slots
    .map(
      (slot, index) =>
        `<li><strong>Slot ${index + 1}:</strong> ${slot.date} from ${slot.startTime} to ${slot.endTime}</li>`
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>✅ Booking Confirmed</h2>
      <p>Dear ${name},</p>
      <p>Your payment has been successfully received and your booking has been confirmed.</p>
      <p><strong>Event ID:</strong> ${eventId}</p>
      <p><strong>Slot(s) Booked:</strong></p>
      <ul>
        ${slotDetails}
      </ul>
      <br />
      <p>Thank you for choosing our service.</p>
      <p>We look forward to seeing you at the event.</p>
      <br />
    
      
    </div>
  `;
};

export const getContractResponseTemplate = ({ fullName, email, occupation, message, responseMessage }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      
      <table role="presentation" style="width: 100%; border-collapse: collapse; padding: 40px 20px;">
        <tr>
          <td align="center">
            
            <!-- Main Container -->
            <table role="presentation" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;">
              
              <!-- Header with Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11L12 14L22 4" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Response Sent!</h1>
                  <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">We've received your inquiry</p>
                </td>
              </tr>
              
              <!-- Content Section -->
              <tr>
                <td style="padding: 40px 30px;">
                  
                  <!-- Greeting -->
                  <p style="margin: 0 0 25px; font-size: 18px; color: #2d3748; line-height: 1.6;">
                    Hello <strong style="color: #667eea;">${fullName}</strong>,
                  </p>
                  
                  <!-- Response Message Box -->
                  <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-left: 4px solid #667eea; padding: 20px; border-radius: 12px; margin: 0 0 30px;">
                    <p style="margin: 0; font-size: 16px; color: #2d3748; line-height: 1.8;">
                      <strong style="color: #667eea; font-size: 18px;">Our Response:</strong><br/>
                      ${responseMessage}
                    </p>
                  </div>
                  
                  <!-- Details Card -->
                  <div style="background: #f7fafc; border-radius: 16px; padding: 25px; margin: 0 0 30px;">
                    <h2 style="margin: 0 0 20px; color: #2d3748; font-size: 20px; font-weight: 600;">Your Inquiry Details</h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #718096; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                        </td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                          <span style="color: #2d3748; font-size: 15px;">${email}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #718096; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Occupation</span>
                        </td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                          <span style="color: #2d3748; font-size: 15px;">${occupation}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <span style="color: #718096; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Your Message</span>
                        </td>
                        <td style="padding: 12px 0; text-align: right;">
                          <span style="color: #2d3748; font-size: 15px;">${message}</span>
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  
                  <!-- Footer Message -->
                  <p style="margin: 30px 0 0; font-size: 15px; color: #718096; line-height: 1.6; text-align: center;">
                    Thank you for reaching out to us. We appreciate your interest and look forward to working with you!
                  </p>
                  
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
      
    </body>
    </html>
  `;
};

// auto refunded template

export const getConflictAfterPaymentTemplate = ({
  name,
  email,
  phone,
  eventId,
  eventTitle,
  selectedDate,
  selectedSlots = [],
  sessionId,
  paymentIntentId,
  refundAmount,
}) => {
  const slotDetails = selectedSlots
    .map(
      (slot, index) =>
        `<li><strong>Slot ${index + 1}:</strong> ${slot.date} from ${slot.startTime} to ${slot.endTime}</li>`
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>⚠️ Booking Conflict Detected After Payment</h2>

      <p><strong>Customer Details:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
      </ul>

      <p><strong>Event Details:</strong></p>
      <ul>
        <li><strong>Event ID:</strong> ${eventId}</li>
        <li><strong>Event Title:</strong> ${eventTitle || 'N/A'}</li>
        <li><strong>Date:</strong> ${selectedDate}</li>
      </ul>

      <p><strong>Attempted Slot(s):</strong></p>
      <ul>
        ${slotDetails}
      </ul>

      <p><strong>Stripe Info:</strong></p>
      <ul>
        <li><strong>Session ID:</strong> ${sessionId}</li>
        <li><strong>Payment Intent ID:</strong> ${paymentIntentId}</li>
        ${
          refundAmount
            ? `<li><strong>Refund Amount:</strong> $${(refundAmount / 100).toFixed(2)}</li>`
            : ''
        }
        <li><strong>Refund Status:</strong> Refund automatically processed</li>
      </ul>

      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>

      <br />
      <p style="color: red;">
        ⚠️ Some of the selected slots were already booked by the time payment completed.<br/>
        The booking was not created, and the payment has been refunded.
      </p>
    </div>
  `;
};

export const getPaymentSuccessForAdminTemplate = ({ name, email, phone, eventId, slots }) => {
  const slotDetails = slots
    .map(
      (slot, index) =>
        `<li><strong>Slot ${index + 1}:</strong> ${slot.date} from ${slot.startTime} to ${slot.endTime}</li>`
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>📥 New Booking Received</h2>
      <p><strong>User Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Event ID:</strong> ${eventId}</p>
      <p><strong>Slot(s) Booked:</strong></p>
      <ul>
        ${slotDetails}
      </ul>
      <br />
      <p>This booking has been paid and confirmed via Stripe.</p>
      <p>Please make necessary arrangements for the event.</p>
    </div>
  `;
};
