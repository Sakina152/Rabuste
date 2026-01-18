import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Coffee, Snowflake, UtensilsCrossed, Clock, Sparkles, ShoppingBag, Search, X, Mic, MicOff, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button"; // Import Button
import { useCart } from "@/context/CartContext"; // Import Cart Hook
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Import Dialog components
import { cn } from "@/lib/utils"; // Import cn utility

// ... imports ...

// Helper for Speech Recognition Type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// Section images
import espressoImg from "@/assets/menu/robusta-espresso.jpg";
import frappeImg from "@/assets/menu/robusta-frappe.jpg";
import espressoTonicImg from "@/assets/menu/espresso-tonic.jpg";
import bagelImg from "@/assets/menu/bagel.jpg";
import rabusteCup from "@/assets/rabuste-cup.png";
import blackCoffeeSpecialImg from "@/assets/menu/black-coffee-special.jpg";

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
const MenuItemCard = ({ item, index, fallbackImage, onClick }: { item: MenuItem; index: number; fallbackImage?: string; onClick: () => void }) => {
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
      className="group flex flex-col h-full rounded-xl bg-card/50 border border-border/30 hover:bg-card hover:border-accent/30 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
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

const MenuSectionBlock = ({ section, sectionIndex, onItemClick }: { section: MenuSection; sectionIndex: number; onItemClick: (item: MenuItem) => void }) => (
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
          onClick={() => onItemClick(item)}
        />
      ))}
    </div>
  </motion.div>
);

const Menu = () => {
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { addToCart } = useCart();
  const [isOfferActive, setIsOfferActive] = useState(false);
  const [currentBlackCoffeePrice, setCurrentBlackCoffeePrice] = useState(135);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkOfferStatus = () => {
      const now = new Date();

      const startTime = new Date(now);
      startTime.setHours(9, 30, 0, 0);

      const endTime = new Date(now);
      endTime.setHours(12, 0, 0, 0);

      const active = now >= startTime && now < endTime;

      setIsOfferActive(active);
      setCurrentBlackCoffeePrice(active ? 99 : 135);

      console.log(`[Offer Check] Time: ${now.toLocaleTimeString()}, Active: ${active}, Price: ${active ? 99 : 135}`);
    };

    checkOfferStatus();
    const interval = setInterval(checkOfferStatus, 10000); // Check every 10s for more responsiveness
    return () => clearInterval(interval);
  }, []);

  const handleOrderBlackCoffee = () => {
    addToCart({
      id: "black-coffee-special-item",
      name: "Black Coffee",
      price: currentBlackCoffeePrice,
      image: blackCoffeeSpecialImg,
    });
  };

  // Voice Search Handler
  const toggleVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (!SpeechRecognition) {
      alert("Your browser does not support voice search. Please try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const categories = ["All", ...menuSections.map((s) => s.title)];

  // Filter by category first
  const categorizedSections = activeCategory === "All"
    ? menuSections
    : menuSections.filter((s) => s.title === activeCategory);

  // Then filter by search query (name only)
  const filteredSections = searchQuery.trim() === ""
    ? categorizedSections
    : categorizedSections.map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(section => section.items.length > 0);

  const totalResults = filteredSections.reduce((sum, section) => sum + section.items.length, 0);

  const handleAddToCartFromModal = () => {
    if (!selectedItem) return;

    addToCart({
      id: selectedItem._id,
      name: selectedItem.name,
      price: selectedItem.price,
      image: selectedItem.image ? `${import.meta.env.VITE_API_BASE_URL}/${selectedItem.image.replace(/\\/g, "/")}` : "",
    });
    // Optional: Close modal after adding
    // setSelectedItem(null);
  };

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
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Full Background Image with Parallax-like effect */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="w-full h-full"
          >
            <img
              src={rabusteCup}
              alt="Rabuste Background"
              className="w-full h-full object-cover opacity-45"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
          </motion.div>
        </div>

        <div className="container-custom relative z-10 text-center max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-body text-sm tracking-wide mb-6 border border-accent/20 backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              <span>Premium Quality</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 leading-tight">
              Crafted with <span className="text-accent italic">Passion</span>
            </h1>

            <p className="font-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Experience the perfect balance of bold flavors and artisanal care in every cup we serve
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

            <div className={cn(
              "relative flex flex-col md:flex-row items-center gap-8",
              (mounted && isOfferActive) ? "justify-between" : "justify-center"
            )}>
              <div className="flex items-center gap-6">
                {/* Visual Thumbnail */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border border-accent/20 flex-shrink-0 shadow-lg relative">
                  <img
                    src={blackCoffeeSpecialImg}
                    alt="Black Coffee Special"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div>
                  <h3 className="font-display text-3xl md:text-5xl text-foreground">
                    Black Coffee at <span className="text-accent">
                      {mounted && isOfferActive ? (
                        <>
                          <span className="line-through text-muted-foreground/40 text-2xl md:text-3xl mr-2">₹135</span>
                          ₹99
                        </>
                      ) : "₹135"}
                    </span>
                  </h3>
                  {mounted && isOfferActive && (
                    <p className="font-body text-muted-foreground mt-2 text-sm md:text-base italic">
                      Special Offer • Available daily from 9:30 AM to 12:00 PM
                    </p>
                  )}
                </div>
              </div>

              <div className={cn(
                "flex flex-col items-center gap-4",
                (!mounted || !isOfferActive) && "md:ml-20"
              )}>
                {mounted && isOfferActive && (
                  <div className="px-5 py-2 border border-accent/40 bg-accent/5 rounded-lg">
                    <span className="text-accent text-[11px] font-bold tracking-[0.2em] uppercase">
                      Limited Time Offer
                    </span>
                  </div>
                )}

                <Button
                  onClick={handleOrderBlackCoffee}
                  className="rounded-full bg-accent hover:bg-accent/90 text-white px-8 h-12 text-base font-medium shadow-md hover:shadow-xl transition-all scale-100 hover:scale-105"
                >
                  Order Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Menu Sections */}
      <section className="px-6 pb-24">
        <div className="container-custom max-w-5xl">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={isListening ? "Listening..." : "Search for an item"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-12 pr-20 py-3 rounded-full bg-card/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all",
                  isListening && "ring-2 ring-accent/50 border-accent/50 bg-accent/5"
                )}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 hover:bg-accent/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-accent" />
                  </button>
                )}

                <button
                  onClick={toggleVoiceSearch}
                  className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    isListening
                      ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 animate-pulse"
                      : "hover:bg-accent/10 text-muted-foreground hover:text-accent"
                  )}
                  title="Search by voice"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {isListening && (
              <p className="text-center text-xs text-accent mt-2 animate-pulse">
                Try saying "Espresso" or "Cappuccino"...
              </p>
            )}
          </div>
          {/* Category Filter - Two-Row Horizontal Scroll */}
          <div className="relative mb-10 -mx-6 px-6 md:mx-0 md:px-0">
            <div
              className="overflow-x-auto scrollbar-hide pb-2"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <div
                className="grid auto-cols-max gap-3 md:flex md:flex-wrap md:justify-center"
                style={{
                  gridAutoFlow: 'column',
                  gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
                  gridTemplateColumns: 'none',
                }}
              >
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "rounded-full px-6 py-2 h-auto text-base transition-all duration-300 whitespace-nowrap",
                      activeCategory === category
                        ? "bg-accent text-white shadow-md hover:bg-accent/90 hover:text-white"
                        : "bg-accent/5 text-muted-foreground hover:bg-accent/10 hover:text-accent border border-transparent hover:border-accent/20"
                    )}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            {/* Scroll Indicator - Only visible on mobile */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
          </div>

          {/* No Results Message */}
          {searchQuery && totalResults === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                <Search className="w-8 h-8 text-accent/50" />
              </div>
              <h3 className="text-xl font-display text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">We couldn't find any items matching "{searchQuery}"</p>
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="border-accent/30 text-accent hover:bg-accent/10"
              >
                Clear Search
              </Button>
            </div>
          )}

          {filteredSections.map((section, sectionIndex) => (
            <MenuSectionBlock
              key={section.title}
              section={section}
              sectionIndex={sectionIndex}
              onItemClick={setSelectedItem}
            />
          ))}
        </div>
      </section>

      <Footer />

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background border-border">
          {selectedItem && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Image Side */}
              <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-accent/5">
                {selectedItem.image ? (
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/${selectedItem.image.replace(/\\/g, "/")}`}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-accent/20">
                    <Coffee className="w-16 h-16" />
                  </div>
                )}
                {selectedItem.isBestSeller && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-medium bg-accent text-white rounded-full shadow-lg">
                      House Favourite
                    </span>
                  </div>
                )}
              </div>

              {/* Content Side */}
              <div className="flex-1 p-6 flex flex-col">
                <DialogHeader className="mb-4 text-left">
                  <div className="flex justify-between items-start gap-2">
                    <DialogTitle className="text-2xl font-display text-foreground">
                      {selectedItem.name}
                    </DialogTitle>
                    {selectedItem.isVegetarian && (
                      <span className="flex-shrink-0 text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full mt-1">
                        Veg
                      </span>
                    )}
                  </div>
                  <DialogDescription className="text-muted-foreground/80 mt-2 text-base">
                    {selectedItem.description || "No description available for this item."}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-auto pt-6 border-t border-border/30 flex items-center justify-between">
                  <span className="font-display text-3xl text-accent">
                    ₹{selectedItem.price}
                  </span>
                  <Button
                    onClick={handleAddToCartFromModal}
                    className="bg-accent hover:bg-accent/90 text-white gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;