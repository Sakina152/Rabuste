import asyncHandler from 'express-async-handler';
import WorkshopInquiry from '../models/WorkshopInquiry.js';

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
