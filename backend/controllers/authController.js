import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';
import firebaseAdmin from '../firebase.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, phoneNumber, address, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    phoneNumber,
    address,
    email,
    password,
    role: role || 'user',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // ⚠️ CRITICAL FIX:
  // Because we set "select: false" in the User model, we MUST explicitly
  // ask for the password here using .select('+password')
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    address: user.address,
    role: user.role,
  });
});


// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Update user role
// @route   PUT /api/auth/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = role;
  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  });
});

// @desc    Update user profile (Name, Phone, Address)
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.address = req.body.address || user.address;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});



// @desc    Register/Login user with Firebase
// @route   POST /api/auth/firebase-login
// @access  Public
const firebaseAuth = asyncHandler(async (req, res) => {
  const { idToken, name, phoneNumber, address } = req.body;
  if (!idToken) {
    res.status(400);
    throw new Error('Firebase ID token is required');
  }
  try {
    // Verify Firebase ID token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { uid, email, email_verified } = decodedToken;
    // For development, allow unverified emails. For production, you might want to require verification.
    if (!email_verified && process.env.NODE_ENV === 'production') {
      res.status(400);
      throw new Error('Email not verified in Firebase');
    }
    // Check if user exists in our database
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      // Create new user in our database
      user = await User.create({
        firebaseUid: uid,
        name: name || decodedToken.name || email.split('@')[0],
        email,
        phoneNumber: phoneNumber || '', // Make phone number optional
        address: address || '',
        authMethod: 'firebase',
        role: 'user'
      });
    } else {
      // Update user info if needed
      if (name && user.name !== name) user.name = name;
      if (phoneNumber !== undefined && user.phoneNumber !== phoneNumber) user.phoneNumber = phoneNumber;
      if (address && user.address !== address) user.address = address;
      await user.save();
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.role,
      firebaseUid: user.firebaseUid,
      authMethod: user.authMethod,
    });
  } catch (error) {
    console.error('Firebase auth error:', error);
    res.status(401);
    throw new Error('Firebase authentication failed');
  }
});

export { registerUser, loginUser, getMe, getAllUsers, updateUserRole, firebaseAuth, updateUserProfile };