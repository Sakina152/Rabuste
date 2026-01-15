// Script to create a new admin user
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'rabustecoffee@gmail.com';
    const adminPassword = 'admin123456'; // Change this password after first login!
    const adminName = 'Rabuste Admin';

    // Check if admin already exists
    const existingUser = await User.findOne({ email: adminEmail });
    
    if (existingUser) {
      console.log('⚠️  User with this email already exists!');
      console.log(`📧 Email: ${existingUser.email}`);
      console.log(`🔑 Current Role: ${existingUser.role}`);
      
      if (existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        await existingUser.save();
        console.log('✅ Updated existing user to admin role!');
      } else {
        console.log('✅ User is already an admin!');
      }
      process.exit(0);
    }

    // Create new admin user
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      phoneNumber: '+918484831261', // You can change this
      role: 'admin',
      authMethod: 'local',
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('═══════════════════════════════════════');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`👤 Name: ${adminUser.name}`);
    console.log(`🔑 Role: ${adminUser.role}`);
    console.log(`🔐 Password: ${adminPassword}`);
    console.log('═══════════════════════════════════════');
    console.log('⚠️  IMPORTANT: Please change the password after first login!');
    console.log('   Go to Profile > Change Password in the admin panel');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
