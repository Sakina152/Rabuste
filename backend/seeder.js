// seeder.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import MenuCategory from './models/MenuCategory.js';
import MenuItem from './models/MenuItem.js';
import bcrypt from 'bcryptjs';

dotenv.config();

// Connect to DB
connectDB();

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      MenuCategory.deleteMany({}),
      MenuItem.deleteMany({}),
    ]);

    console.log('Data cleared!');

    // Create Super Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@rabuste.com',
      password: hashedPassword,
      role: 'super_admin',
    });

    console.log('Admin user created!');

    // Create Categories
    const categories = await MenuCategory.insertMany([
      { 
        name: 'Robusta Special (Cold)',
        description: 'Chilled Robusta coffee specials',
        icon: 'coffee',
        displayOrder: 1
      },
      { 
        name: 'Robusta Special (Hot)',
        description: 'Hot Robusta coffee specials',
        icon: 'coffee',
        displayOrder: 2
      },
      { 
        name: 'Blend Special (Cold)',
        description: 'Chilled Arabica-Robusta blend specials',
        icon: 'coffee',
        displayOrder: 3
      },
      { 
        name: 'Blend Special (Hot)',
        description: 'Hot Arabica-Robusta blend specials',
        icon: 'coffee',
        displayOrder: 4
      },
      { 
        name: 'Manual Brews & Tea',
        description: 'Specialty brews and tea selection',
        icon: 'mug-hot',
        displayOrder: 5
      },
      { 
        name: 'Food & Bakery',
        description: 'Delicious snacks and pastries',
        icon: 'utensils',
        displayOrder: 6
      }
    ]);

    console.log('Categories created!');

    // Create a map for category names to their IDs
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Create Menu Items
    const menuItems = [
      // Robusta Special (Cold)
      { name: 'Iced Americano', description: 'Bold Robusta shot topped with cold water and ice.', price: 160, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },
      { name: 'Iced Espresso', description: 'Chilled shot of pure, intense Robusta.', price: 130, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },
      { name: 'Iced Espresso (Tonic/Ginger/Orange)', description: 'Robusta espresso with your choice of refreshing mixer.', price: 250, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },
      { name: 'Iced Espresso (Red Bull)', description: 'High-energy mix of Robusta and Red Bull.', price: 290, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },
      { name: 'Cranberry Tonic', description: 'Fruity and bubbly coffee refresher.', price: 270, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },
      { name: 'Iced Latte', description: 'Classic cold coffee with Robusta and milk.', price: 220, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },
      { name: 'Affogato', description: 'Hot Robusta espresso poured over vanilla ice cream.', price: 250, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },
      { name: 'Classic Frappe', description: 'Creamy, blended cold coffee.', price: 250, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },
      { name: 'Hazelnut Frappe', description: 'Blended coffee with rich hazelnut flavor.', price: 260, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },
      { name: 'Caramel Frappe', description: 'Sweet and creamy caramel coffee blend.', price: 260, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },
      { name: 'Mocha Frappe', description: 'Chocolatey coffee frappe.', price: 270, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },
      { name: 'Biscoff Frappe', description: 'Indulgent frappe blended with Biscoff cookies.', price: 270, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },
      { name: 'Vietnamese', description: 'Traditional slow-drip Robusta with condensed milk.', price: 240, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },
      { name: 'Café Suda', description: 'Sweet and strong Vietnamese iced coffee.', price: 250, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },
      { name: 'Robco Signature', description: 'Our secret house special Robusta blend.', price: 290, category: categoryMap['Robusta Special (Cold)'], isVegetarian: true },

      // Robusta Special (Hot)
      { name: 'Hot Americano', description: 'A double shot of Robusta diluted with hot water.', price: 150, category: categoryMap['Robusta Special (Hot)'], isVegetarian: true },
      { name: 'Hot Espresso', description: 'A concentrated shot of pure Robusta strength.', price: 130, category: categoryMap['Robusta Special (Hot)'], isVegetarian: true },
      { name: 'Hot Latte', description: 'Espresso with steamed milk and a light layer of foam.', price: 190, category: categoryMap['Robusta Special (Hot)'], isVegetarian: true },
      { name: 'Flat White', description: 'Robusta espresso with velvety microfoam.', price: 180, category: categoryMap['Robusta Special (Hot)'], isVegetarian: true },
      { name: 'Cappuccino', description: 'Equal parts espresso, steamed milk, and foam.', price: 180, category: categoryMap['Robusta Special (Hot)'], isVegetarian: true },
      { name: 'Hot Mocha', description: 'Espresso mixed with rich chocolate and steamed milk.', price: 230, category: categoryMap['Robusta Special (Hot)'], isVegetarian: true },

      // Blend Special (Cold)
      { name: 'Iced Americano Blend', description: 'Smooth Arabica-Robusta blend over ice.', price: 150, category: categoryMap['Blend Special (Cold)'], isVegetarian: true },
      { name: 'Iced Espresso Blend', description: 'Chilled shot of our signature house blend.', price: 120, category: categoryMap['Blend Special (Cold)'], isVegetarian: true },
      { name: 'Iced Espresso Blend (Tonic/Ginger)', description: 'House blend espresso with a sparkling twist.', price: 230, category: categoryMap['Blend Special (Cold)'], isVegetarian: true },
      { name: 'Iced Latte Blend', description: 'Smooth and creamy cold coffee blend.', price: 210, category: categoryMap['Blend Special (Cold)'], isVegetarian: true },
      { name: 'Affogato Blend', description: 'House blend espresso over a scoop of ice cream.', price: 240, category: categoryMap['Blend Special (Cold)'], isVegetarian: true },
      { name: 'Classic Frappe Blend', description: 'Standard cold blended coffee.', price: 240, category: categoryMap['Blend Special (Cold)'], isVegetarian: true },

      // Blend Special (Hot)
      { name: 'Hot Americano Blend', description: 'Classic black coffee with our smooth blend.', price: 140, category: categoryMap['Blend Special (Hot)'], isVegetarian: true },
      { name: 'Hot Espresso Blend', description: 'Single shot of our balanced house blend.', price: 120, category: categoryMap['Blend Special (Hot)'], isVegetarian: true },
      { name: 'Hot Latte Blend', description: 'Creamy hot coffee with house blend beans.', price: 180, category: categoryMap['Blend Special (Hot)'], isVegetarian: true },
      { name: 'Flat White Blend', description: 'Smooth blend with thin microfoam.', price: 170, category: categoryMap['Blend Special (Hot)'], isVegetarian: true },
      { name: 'Cappuccino Blend', description: 'Frothy and balanced hot coffee.', price: 170, category: categoryMap['Blend Special (Hot)'], isVegetarian: true },
      { name: 'Mocha Blend', description: 'Chocolate infused house blend coffee.', price: 220, category: categoryMap['Blend Special (Hot)'], isVegetarian: true },

      // Manual Brews & Tea
      { name: 'Classic Cold Brew', description: 'Slow-steeped for 12 hours for a smooth finish.', price: 220, category: categoryMap['Manual Brews & Tea'], isVegetarian: true },
      { name: 'V60 Pour Over Hot', description: 'Hand-poured artisan coffee method.', price: 220, category: categoryMap['Manual Brews & Tea'], isVegetarian: true },
      { name: 'Cranberry Cold Brew Tonic', description: 'Cold brew topped with tonic and cranberry.', price: 280, category: categoryMap['Manual Brews & Tea'], isVegetarian: true },
      { name: 'Lemon Ice Tea', description: 'Zesty and refreshing chilled tea.', price: 210, category: categoryMap['Manual Brews & Tea'], isVegetarian: true },
      { name: 'Ginger Fizz', description: 'Spicy ginger ale with a tea base.', price: 250, category: categoryMap['Manual Brews & Tea'], isVegetarian: true },

      // Food & Bakery
      { name: 'Fries', description: 'Crispy golden salted fries.', price: 150, category: categoryMap['Food & Bakery'], isVegetarian: true },
      { name: 'Potato Wedges', description: 'Seasoned thick-cut potato wedges.', price: 170, category: categoryMap['Food & Bakery'], isVegetarian: true },
      { name: 'Veg Nuggets', description: 'Crispy breaded vegetable bites.', price: 190, category: categoryMap['Food & Bakery'], isVegetarian: true },
      { name: 'Pizza', description: 'Classic cheese and tomato base pizza.', price: 300, category: categoryMap['Food & Bakery'], isVegetarian: true },
      { name: 'Bagel', description: 'Toasted plain bagel.', price: 100, category: categoryMap['Food & Bakery'], isVegetarian: true },
      { name: 'Cream Cheese Bagel', description: 'Toasted bagel spread with cream cheese.', price: 150, category: categoryMap['Food & Bakery'], isVegetarian: true },
      { name: 'Pesto Bagel', description: 'Bagel with aromatic basil pesto spread.', price: 230, category: categoryMap['Food & Bakery'], isVegetarian: true },
      { name: 'Butter Croissant', description: 'Flaky, buttery French pastry.', price: 150, category: categoryMap['Food & Bakery'], isVegetarian: true },
      { name: 'Nutella Croissant', description: 'Croissant filled with rich Nutella.', price: 200, category: categoryMap['Food & Bakery'], isVegetarian: true }
    ];

    await MenuItem.insertMany(menuItems);
    console.log('Menu items created!');
    
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Run the import
importData();