import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Coffee, Snowflake, UtensilsCrossed, Clock, Sparkles, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button"; // Import Button
import { useCart } from "@/context/CartContext"; // Import Cart Hook

// Section images
import espressoImg from "@/assets/menu/robusta-espresso.jpg";
import frappeImg from "@/assets/menu/robusta-frappe.jpg";
import espressoTonicImg from "@/assets/menu/espresso-tonic.jpg";
import bagelImg from "@/assets/menu/bagel.jpg";

console.log('ENV:', import.meta.env);
console.log('BASE URL:', import.meta.env.VITE_API_BASE_URL);

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string; // Added image property
  category: {
    name: string;
  };
  isVegetarian?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isSeasonal?: boolean;
}

interface MenuSection {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
  image?: string;
  highlight?: boolean;
}

// Map category names to their respective icons and images
const getCategoryConfig = (categoryName: string) => {
  const config: {
    icon: React.ReactNode;
    image: string;
  } = {
    icon: <Coffee className="w-5 h-5" />,
    image: espressoImg
  };

  const categoryConfig: Record<string, { icon: React.ReactNode; image: string }> = {
    'Robusta Special (Hot)': { icon: <Coffee className="w-5 h-5" />, image: espressoImg },
    'Robusta Special (Cold)': { icon: <Snowflake className="w-5 h-5" />, image: frappeImg },
    'Blend Special (Cold)': { icon: <Sparkles className="w-5 h-5" />, image: espressoTonicImg },
    'Blend Special (Hot)': { icon: <Coffee className="w-5 h-5" />, image: espressoImg },
    'Manual Brews & Tea': { icon: <Sparkles className="w-5 h-5" />, image: espressoTonicImg },
    'Food & Bakery': { icon: <UtensilsCrossed className="w-5 h-5" />, image: bagelImg }
  };

  return categoryConfig[categoryName] || config;
};

// Updated MenuItemCard to accept fallbackImage and include Add to Cart logic
const MenuItemCard = ({ item, index, fallbackImage }: { item: MenuItem; index: number; fallbackImage?: string }) => {
  const { addToCart } = useCart(); // Use the hook

  const tag = item.isBestSeller ? "House Favourite" :
    item.isNew ? "New" :
      item.isSeasonal ? "Seasonal" : undefined;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering any parent click events
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image ? `${import.meta.env.VITE_API_BASE_URL}/${item.image.replace(/\\/g, "/")}` : (fallbackImage || ""),
    });
  };

  const imageUrl = item.image
    ? `${import.meta.env.VITE_API_BASE_URL}/${item.image.replace(/\\/g, "/")}`
    : fallbackImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      viewport={{ once: true }}
      className="group flex flex-col h-full rounded-xl bg-card/50 border border-border/30 hover:bg-card hover:border-accent/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Image Section */}
      <div className="w-full h-48 overflow-hidden relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback if individual image fails
              if (fallbackImage && e.currentTarget.src !== fallbackImage) {
                e.currentTarget.src = fallbackImage;
              } else {
                e.currentTarget.style.display = 'none';
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-accent/5 flex items-center justify-center text-accent/20">
            <Coffee className="w-12 h-12" />
          </div>
        )}

        {/* Tag Overlay */}
        {tag && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-medium bg-accent text-white rounded-full shadow-sm backdrop-blur-md">
              {tag}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-body font-medium text-lg text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-1">
            {item.name}
          </h4>
          {item.isVegetarian && (
            <span className="flex-shrink-0 ml-2 text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              Veg
            </span>
          )}
        </div>

        {item.description && (
          <p className="text-muted-foreground text-sm opacity-80 line-clamp-2 mb-4 flex-grow">
            {item.description}
          </p>
        )}

        {/* Footer: Price & Add Button */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
          <span className="font-display text-xl text-accent">
            ₹{item.price}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="bg-accent hover:bg-accent/90 text-white shadow-sm hover:shadow-md transition-all"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const MenuSectionBlock = ({ section, sectionIndex }: { section: MenuSection; sectionIndex: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: sectionIndex * 0.1, duration: 0.5 }}
    viewport={{ once: true }}
    className="mb-16"
  >
    <div className="flex flex-col md:flex-row gap-6 mb-8 items-end border-b border-border/30 pb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10 text-accent">
          {section.icon}
        </div>
        <h3 className="font-display text-3xl text-foreground">{section.title}</h3>
      </div>
    </div>

    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {section.items.map((item, index) => (
        <MenuItemCard
          key={item._id}
          item={item}
          index={index}
          fallbackImage={section.image} // Pass image down as fallback
        />
      ))}
    </div>
  </motion.div>
);

const Menu = () => {
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/menu/items`);
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();

        // Group items by category
        const groupedItems = data.reduce((acc: Record<string, MenuItem[]>, item: MenuItem) => {
          const categoryName = item.category?.name || 'Other';
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(item);
          return acc;
        }, {});

        // Transform to match the MenuSection interface
        const sections = Object.entries(groupedItems).map(([categoryName, items]) => {
          const { icon, image } = getCategoryConfig(categoryName);
          return {
            title: categoryName,
            icon,
            items: items as MenuItem[],
            image
          };
        });

        setMenuSections(sections);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching menu items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-pulse">Loading Menu...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh] text-red-500">
          Error: {error}
        </div>
        <Footer />
      </div>
    );
  }

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