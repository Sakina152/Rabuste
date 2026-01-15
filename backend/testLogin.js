// Script to test login credentials
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const testLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'rabustecoffee@gmail.com';
    const password = 'admin123456';

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('✅ User found!');
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🔑 Role: ${user.role}`);
    console.log(`🔐 Auth Method: ${user.authMethod}`);
    console.log(`📝 Password hash exists: ${!!user.password}`);
    
    // Test password match
    const isMatch = await user.matchPassword(password);
    console.log(`\n🔍 Testing password: ${password}`);
    console.log(`✅ Password match: ${isMatch ? 'YES ✓' : 'NO ✗'}`);
    
    if (!isMatch) {
      console.log('\n❌ Password does NOT match!');
      console.log('This means the password was not hashed correctly during creation.');
    } else {
      console.log('\n✅ Password matches! Login should work.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testLogin();
