import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Coffee, Snowflake, UtensilsCrossed, Croissant, Cake, Clock, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Section images
import espressoImg from "@/assets/menu/robusta-espresso.jpg";
import frappeImg from "@/assets/menu/robusta-frappe.jpg";
import espressoTonicImg from "@/assets/menu/espresso-tonic.jpg";
import bagelImg from "@/assets/menu/bagel.jpg";
import sandwichImg from "@/assets/menu/sandwich.jpg";
import croissantImg from "@/assets/menu/croissant.jpg";
import cakeImg from "@/assets/menu/chocolate-cake.jpg";

interface MenuItem {
  name: string;
  price: number;
  tag?: string;
  desc?: string;
}

interface MenuSection {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
  image?: string;
  highlight?: boolean;
}

const menuSections: MenuSection[] = [
  {
    title: "Rabuste Special – Hot",
    icon: <Coffee className="w-5 h-5" />,
    image: espressoImg,
    items: [
      { name: "Robusta Espresso", price: 110, desc: "Pure, intense, and bold" },
      { name: "Robusta Americano", price: 140, desc: "Smooth and full-bodied" },
      { name: "Robusta Cappuccino", price: 180, desc: "Velvety foam perfection" },
      { name: "Robusta Latte", price: 190, desc: "Creamy, smooth, comforting" },
    ],
  },
  {
    title: "Rabuste Special – Cold",
    icon: <Snowflake className="w-5 h-5" />,
    image: frappeImg,
    items: [
      { name: "Robusta Iced Espresso", price: 120, desc: "Chilled intensity" },
      { name: "Robusta Iced Americano", price: 150, desc: "Refreshingly bold" },
      { name: "Robusta Iced Latte", price: 220, desc: "Cool, creamy delight" },
      { name: "Robusta Classic Frappe", price: 240, tag: "House Favourite", desc: "Signature frozen blend" },
      { name: "Cafe Suda", price: 240, tag: "House Special", desc: "Unique sparkling coffee" },
      { name: "Robco", price: 290, tag: "House Special", desc: "Our secret recipe" },
    ],
  },
  {
    title: "Artisan Iced Brews & Tonics",
    icon: <Sparkles className="w-5 h-5" />,
    image: espressoTonicImg,
    items: [
      { name: "Espresso Tonic", price: 220, desc: "Sparkling coffee refresher" },
      { name: "Iced Mocha", price: 240, desc: "Chocolate meets coffee" },
      { name: "Classic Matcha", price: 250, desc: "Premium green tea" },
      { name: "Iced Teas", price: 180, desc: "Refreshing fruit infusions" },
      { name: "Mojitos (Non-Alcoholic)", price: 200, desc: "Minty fresh coolness" },
    ],
  },
  {
    title: "Savoury Bites – Bagels",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    image: bagelImg,
    items: [
      { name: "Cream Cheese", price: 220, desc: "Classic creamy delight" },
      { name: "Pesto", price: 240, desc: "Herby, aromatic goodness" },
      { name: "Classic Veggie", price: 250, desc: "Fresh garden flavors" },
    ],
  },
  {
    title: "Savoury Bites – Sourdough Sandwiches",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    image: sandwichImg,
    items: [
      { name: "Peri Peri Paneer", price: 280, desc: "Spicy cottage cheese" },
      { name: "Pesto", price: 290, desc: "Fresh basil and pine nuts" },
    ],
  },
  {
    title: "Croissants",
    icon: <Croissant className="w-5 h-5" />,
    image: croissantImg,
    items: [
      { name: "Butter", price: 180, desc: "Flaky, golden layers" },
      { name: "Nutella", price: 220, desc: "Chocolate hazelnut heaven" },
      { name: "Cream Cheese", price: 240, desc: "Rich, tangy filling" },
    ],
  },
  {
    title: "Café Comfort Food",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    image: sandwichImg,
    items: [
      { name: "Cheese Chilli Toast", price: 180, desc: "Spicy cheesy goodness" },
      { name: "Cheese Garlic Bread", price: 160, desc: "Aromatic and savory" },
      { name: "French Fries (Golden Fries)", price: 150, desc: "Crispy perfection" },
      { name: "Classic Italiano Pizza", price: 320, desc: "Authentic Italian flavors" },
    ],
  },
  {
    title: "Desserts & Cakes",
    icon: <Cake className="w-5 h-5" />,
    image: cakeImg,
    items: [
      { name: "Belgium Chocolate Cake", price: 280, desc: "Rich, decadent layers" },
      { name: "Orange Chocolate Cake (Almond Flour)", price: 300, desc: "Citrus meets chocolate" },
    ],
  },
];

const MenuItemCard = ({ item, index }: { item: MenuItem; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.4 }}
    viewport={{ once: true }}
    className="group flex justify-between items-start p-4 rounded-xl bg-card/50 border border-border/30 hover:bg-card hover:border-accent/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
  >
    <div className="flex-1">
      <h4 className="font-body font-medium text-foreground group-hover:text-accent transition-colors duration-300">
        {item.name}
      </h4>
      {item.desc && (
        <p className="text-muted-foreground text-xs mt-1 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
          {item.desc}
        </p>
      )}
      {item.tag && (
        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded-full">
          {item.tag}
        </span>
      )}
    </div>
    <span className="font-display text-lg text-accent ml-4 group-hover:scale-110 transition-transform duration-300">₹{item.price}</span>
  </motion.div>
);

const MenuSectionBlock = ({ section, sectionIndex }: { section: MenuSection; sectionIndex: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: sectionIndex * 0.1, duration: 0.5 }}
    viewport={{ once: true }}
    className="mb-16"
  >
    {/* Section Header with Image */}
    <div className="flex flex-col md:flex-row gap-6 mb-6">
      {section.image && (
        <div className="w-full md:w-32 h-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img 
            src={section.image} 
            alt={section.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10 text-accent">
          {section.icon}
        </div>
        <h3 className="font-display text-2xl text-foreground">{section.title}</h3>
      </div>
    </div>
    
    <div className="grid gap-3 md:grid-cols-2">
      {section.items.map((item, index) => (
        <MenuItemCard key={item.name} item={item} index={index} />
      ))}
    </div>
  </motion.div>
);

const Menu = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent font-body text-sm tracking-wide mb-6">
              Our Menu
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
              Crafted with <span className="text-accent">Passion</span>
            </h1>
            <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
              From bold Robusta brews to artisan bites, every item is crafted to elevate your café experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Black Coffee Special Offer Banner */}
      <section className="px-6 pb-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 border border-accent/30 p-8 md:p-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,196,168,0.1),transparent_50%)]" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-accent/20">
                  <Clock className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground">
                    Black Coffee at <span className="text-accent">₹99</span>
                  </h3>
                  <p className="font-body text-muted-foreground mt-1">
                    Special Offer • Available daily from 9:30 AM to 12:00 PM
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-block px-6 py-3 rounded-full bg-accent text-background font-body font-medium">
                  Limited Time Offer
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Menu Sections */}
      <section className="px-6 pb-24">
        <div className="container-custom max-w-5xl">
          {menuSections.map((section, sectionIndex) => (
            <MenuSectionBlock key={section.title} section={section} sectionIndex={sectionIndex} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Menu;
