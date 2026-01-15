import asyncHandler from 'express-async-handler';
import WorkshopInquiry from '../models/WorkshopInquiry.js';
import sendEmail from '../utils/emailSender.js';

// @desc    Submit workshop/event inquiry
// @route   POST /api/workshop-inquiries
// @access  Public
export const submitInquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, eventType, numberOfGuests, preferredDate, message } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !eventType || !numberOfGuests) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Create inquiry
  const inquiry = await WorkshopInquiry.create({
    name,
    email,
    phone,
    eventType,
    numberOfGuests,
    preferredDate: preferredDate || undefined,
    message: message || ''
  });

  // Format event type for display
  const eventTypeDisplay = eventType.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // Format preferred date for display
  const dateDisplay = preferredDate 
    ? new Date(preferredDate).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'Not specified';

  try {
    // Send email to admin (rabustecoffee@gmail.com)
    await sendEmail({
      email: 'rabustecoffee@gmail.com',
      subject: `New Event Inquiry - ${eventTypeDisplay}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #5C3A21; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #F5E6D3; margin: 0; font-size: 24px;">New Event Inquiry</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #5C3A21; margin-top: 0;">Inquiry Details</h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0;"><strong style="color: #5C3A21;">Inquiry Number:</strong> ${inquiry.inquiryNumber}</p>
              <p style="margin: 10px 0;"><strong style="color: #5C3A21;">Event Type:</strong> ${eventTypeDisplay}</p>
              <p style="margin: 10px 0;"><strong style="color: #5C3A21;">Number of Guests:</strong> ${numberOfGuests}</p>
              <p style="margin: 10px 0;"><strong style="color: #5C3A21;">Preferred Date:</strong> ${dateDisplay}</p>
            </div>

            <h3 style="color: #5C3A21; margin-top: 25px;">Customer Information</h3>
            <div style="margin: 15px 0;">
              <p style="margin: 10px 0;"><strong style="color: #5C3A21;">Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong style="color: #5C3A21;">Email:</strong> ${email}</p>
              <p style="margin: 10px 0;"><strong style="color: #5C3A21;">Phone:</strong> ${phone}</p>
            </div>

            ${message ? `
              <h3 style="color: #5C3A21; margin-top: 25px;">Additional Message</h3>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; border-left: 4px solid #5C3A21;">
                <p style="margin: 0; color: #333;">${message}</p>
              </div>
            ` : ''}

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #f0f0f0;">
              <p style="color: #666; font-size: 14px; margin: 0;">Please respond to this inquiry as soon as possible.</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>Rabuste Coffee - Event Management System</p>
          </div>
        </div>
      `
    });

    // Send confirmation email to customer
    await sendEmail({
      email: email,
      subject: 'Event Inquiry Received - Rabuste Coffee',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #5C3A21; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #F5E6D3; margin: 0; font-size: 24px;">Thank You for Your Inquiry!</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333;">Dear ${name},</p>
            
            <p style="color: #555; line-height: 1.6;">
              Thank you for your interest in hosting your event at Rabuste Coffee! We have received your inquiry 
              and our team will get back to you within 24-48 hours.
            </p>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #5C3A21; margin-top: 0;">Your Inquiry Summary</h3>
              <p style="margin: 10px 0;"><strong>Inquiry Number:</strong> ${inquiry.inquiryNumber}</p>
              <p style="margin: 10px 0;"><strong>Event Type:</strong> ${eventTypeDisplay}</p>
              <p style="margin: 10px 0;"><strong>Number of Guests:</strong> ${numberOfGuests}</p>
              <p style="margin: 10px 0;"><strong>Preferred Date:</strong> ${dateDisplay}</p>
            </div>

            <p style="color: #555; line-height: 1.6;">
              If you have any immediate questions, feel free to reach out to us at 
              <a href="mailto:rabustecoffee@gmail.com" style="color: #5C3A21;">rabustecoffee@gmail.com</a>
            </p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #f0f0f0;">
              <p style="color: #333; margin: 5px 0;">Best regards,</p>
              <p style="color: #5C3A21; font-weight: bold; margin: 5px 0;">The Rabuste Coffee Team</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>Rabuste Coffee | Dimpal Row House, 15, Gymkhana Rd, Piplod, Surat, Gujarat 395007</p>
          </div>
        </div>
      `
    });

    console.log('✅ Inquiry emails sent successfully');
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
    // Don't fail the request if email fails, just log it
  }

  res.status(201).json({
    success: true,
    data: inquiry,
    message: 'Inquiry submitted successfully! We will contact you soon.'
  });
});

// @desc    Get all inquiries (Admin)
// @route   GET /api/workshop-inquiries
// @access  Private/Admin
export const getAllInquiries = asyncHandler(async (req, res) => {
  const { status } = req.query;
  
  const query = status ? { status } : {};
  
  const inquiries = await WorkshopInquiry.find(query).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: inquiries.length,
    data: inquiries
  });
});

// @desc    Update inquiry status (Admin)
// @route   PUT /api/workshop-inquiries/:id/status
// @access  Private/Admin
export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'contacted', 'confirmed', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const inquiry = await WorkshopInquiry.findById(req.params.id);

  if (!inquiry) {
    res.status(404);
    throw new Error('Inquiry not found');
  }

  inquiry.status = status;
  await inquiry.save();

  res.json({
    success: true,
    data: inquiry
  });
});

// @desc    Delete inquiry (Admin)
// @route   DELETE /api/workshop-inquiries/:id
// @access  Private/Admin
export const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await WorkshopInquiry.findById(req.params.id);

  if (!inquiry) {
    res.status(404);
    throw new Error('Inquiry not found');
  }

  await inquiry.deleteOne();

  res.json({
    success: true,
    message: 'Inquiry deleted'
  });
});
