// artSeeder.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Art from './models/Art.js';

dotenv.config();

// Connect to DB
connectDB();

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await Art.deleteMany({});
    console.log('Art collection cleared!');

    // Art pieces to insert
    const artPieces = [
      {
        title: "Midnight Roast",
        artist: "Elena V.",
        price: 12000,
        dimensions: "24x36 inches",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80",
        description: "An abstract expressionist piece capturing the dark, swirling depths of a perfect espresso pull."
      },
      {
        title: "The Robusta Farmer",
        artist: "Rajesh Kumar",
        price: 18000,
        dimensions: "30x40 inches",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1595434091143-b375ced5fe5c?auto=format&fit=crop&q=80",
        description: "A hyper-realistic portrait honoring the farmers of Coorg who cultivate our bold beans."
      },
      {
        title: "Steam & Solitude",
        artist: "Sarah Jenkins",
        price: 8500,
        dimensions: "18x24 inches",
        status: "Sold",
        imageUrl: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&q=80",
        description: "A cozy, melancholic oil painting featuring a steaming cup on a rainy window sill."
      },
      {
        title: "Caffeine Geometry",
        artist: "Unit 7 Collective",
        price: 15000,
        dimensions: "36x36 inches",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?auto=format&fit=crop&q=80",
        description: "Modern geometric shapes inspired by the chemical structure of caffeine molecule."
      },
      {
        title: "Golden Crema",
        artist: "Elena V.",
        price: 9500,
        dimensions: "20x20 inches",
        status: "Reserved",
        imageUrl: "https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&q=80",
        description: "A textured acrylic piece focusing on the rich golden hues of Robusta foam."
      },
      {
        title: "Urban Grind",
        artist: "Davide L.",
        price: 22000,
        dimensions: "40x50 inches",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
        description: "A gritty, street-style canvas depicting the hustle of city life fueled by coffee."
      }
    ];

    // Insert art pieces
    await Art.insertMany(artPieces);
    console.log('Art Collection Seeded!');
    process.exit();
  } catch (error) {
    console.error('Error seeding art data:', error);
    process.exit(1);
  }
};

// Run the import
importData();