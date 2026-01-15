// Script to check a user's role
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get email from command line argument
    const email = process.argv[2];
    
    if (!email) {
      console.log('❌ Please provide an email address');
      console.log('Usage: node checkUser.js <email>');
      process.exit(1);
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`❌ User with email ${email} not found`);
      console.log('\n📋 Listing all users:');
      const allUsers = await User.find({}).select('name email role');
      allUsers.forEach(u => {
        console.log(`   - ${u.email} (${u.name}) - Role: ${u.role}`);
      });
      process.exit(1);
    }

    console.log('✅ User found!');
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🔑 Role: ${user.role}`);
    console.log(`📅 Created: ${user.createdAt}`);
    console.log(`🔐 Auth Method: ${user.authMethod}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkUser();
