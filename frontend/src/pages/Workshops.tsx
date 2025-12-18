import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Coffee,
  Palette,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

interface Workshop {
  id: number;
  title: string;
  description: string;
  category: "coffee" | "art" | "community";
  date: string;
  time: string;
  duration: string;
  seats: number;
  seatsLeft: number;
  price: string;
  icon: typeof Coffee;
}

const Workshops = () => {
  const { toast } = useToast();
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const workshops: Workshop[] = [
    {
      id: 1,
      title: "Robusta Brewing Masterclass",
      description:
        "Learn the art of brewing the perfect Robusta coffee with our expert baristas. Discover extraction techniques, grind sizes, and brewing methods.",
      category: "coffee",
      date: "Dec 28, 2024",
      time: "10:00 AM",
      duration: "2 hours",
      seats: 12,
      seatsLeft: 5,
      price: "$45",
      icon: Coffee,
    },
    {
      id: 2,
      title: "Coffee & Canvas: Painting Workshop",
      description:
        "Express your creativity with a brush in one hand and coffee in the other. No experience needed—just bring your imagination!",
      category: "art",
      date: "Jan 4, 2025",
      time: "2:00 PM",
      duration: "3 hours",
      seats: 15,
      seatsLeft: 8,
      price: "$65",
      icon: Palette,
    },
    {
      id: 3,
      title: "Latte Art Fundamentals",
      description:
        "Master the basics of latte art from heart patterns to rosettas. Perfect for home baristas and coffee enthusiasts.",
      category: "coffee",
      date: "Jan 11, 2025",
      time: "11:00 AM",
      duration: "2.5 hours",
      seats: 10,
      seatsLeft: 3,
      price: "$55",
      icon: Coffee,
    },
    {
      id: 4,
      title: "Coffee Tasting Journey",
      description:
        "Explore the world of specialty Robusta through a guided cupping session. Learn to identify flavor notes and origins.",
      category: "coffee",
      date: "Jan 18, 2025",
      time: "3:00 PM",
      duration: "1.5 hours",
      seats: 20,
      seatsLeft: 12,
      price: "$35",
      icon: Coffee,
    },
    {
      id: 5,
      title: "Community Coffee Morning",
      description:
        "A relaxed gathering for coffee lovers to connect, share stories, and enjoy complimentary brews. Free to attend!",
      category: "community",
      date: "Every Saturday",
      time: "9:00 AM",
      duration: "2 hours",
      seats: 30,
      seatsLeft: 20,
      price: "Free",
      icon: Sparkles,
    },
    {
      id: 6,
      title: "Abstract Art with Coffee Stains",
      description:
        "Create unique artwork using coffee as your medium. An innovative workshop blending art and our favorite beverage.",
      category: "art",
      date: "Jan 25, 2025",
      time: "1:00 PM",
      duration: "2.5 hours",
      seats: 12,
      seatsLeft: 7,
      price: "$50",
      icon: Palette,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWorkshop) {
      toast({
        title: "Registration Successful!",
        description: `You've been registered for ${selectedWorkshop.title}. Check your email for confirmation.`,
      });
      setSelectedWorkshop(null);
      setFormData({ name: "", email: "", phone: "" });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "coffee":
        return Coffee;
      case "art":
        return Palette;
      case "community":
        return Sparkles;
      default:
        return Coffee;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "coffee":
        return "bg-accent/20 text-accent";
      case "art":
        return "bg-terracotta/20 text-terracotta";
      case "community":
        return "bg-cream/20 text-cream";
      default:
        return "bg-accent/20 text-accent";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-hero-gradient">
        <div className="container-custom relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
              Learn & Create
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mt-4 mb-6">
              Workshops &{" "}
              <span className="text-gradient">Experiences</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Immerse yourself in the world of coffee and art through our curated
              workshops. From brewing techniques to creative sessions, there's
              something for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshops.map((workshop, index) => {
              const CategoryIcon = getCategoryIcon(workshop.category);
              return (
                <motion.div
                  key={workshop.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-500 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl ${getCategoryColor(
                          workshop.category
                        )}`}
                      >
                        <CategoryIcon className="w-6 h-6" />
                      </div>
                      <span className="font-display text-2xl font-bold text-accent">
                        {workshop.price}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {workshop.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {workshop.description}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="px-6 py-4 border-t border-border bg-coffee-dark/50">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar size={14} className="text-accent" />
                        <span>{workshop.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Clock size={14} className="text-accent" />
                        <span>{workshop.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Sparkles size={14} className="text-accent" />
                        <span>{workshop.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Users size={14} className="text-accent" />
                        <span>{workshop.seatsLeft} seats left</span>
                      </div>
                    </div>

                    {/* Seats indicator */}
                    <div className="mb-4">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all"
                          style={{
                            width: `${
                              ((workshop.seats - workshop.seatsLeft) /
                                workshop.seats) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <Button
                      variant="hero"
                      size="default"
                      className="w-full"
                      onClick={() => setSelectedWorkshop(workshop)}
                      disabled={workshop.seatsLeft === 0}
                    >
                      {workshop.seatsLeft === 0 ? "Sold Out" : "Register Now"}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {selectedWorkshop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedWorkshop(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-lg w-full bg-card rounded-2xl overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Register for Workshop
              </h2>
              <p className="text-accent font-medium mb-6">
                {selectedWorkshop.title}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-display text-2xl font-bold text-accent">
                      {selectedWorkshop.price}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="subtle"
                      className="flex-1"
                      onClick={() => setSelectedWorkshop(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="hero" className="flex-1">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Private Events */}
      <section className="section-padding bg-coffee-dark">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
                Private Events
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                Host Your Event at Rabuste
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Looking for a unique venue for your corporate team-building,
                birthday celebration, or private coffee tasting? Our café space can
                be transformed for your special occasion.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Private coffee tasting sessions",
                  "Corporate team workshops",
                  "Art exhibition launches",
                  "Community gatherings",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero" size="lg" asChild>
                <Link to="/franchise">
                  Inquire About Events
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-coffee-medium to-espresso overflow-hidden border border-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-accent mx-auto mb-4" />
                    <span className="font-display text-xl font-semibold text-foreground">
                      Private Events Welcome
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Workshops;