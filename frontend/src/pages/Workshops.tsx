import { useState, useEffect } from "react"; // Added useEffect
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

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Updated Interface to match your Mongoose Model
interface Workshop {
  _id: string; // Changed from id: number to match MongoDB _id
  title: string;
  description: string;
  type: "coffee" | "art" | "community" | "special"; // Matches model 'type'
  date: string;
  startTime: string; // Matches model
  endTime: string;   // Matches model
  duration: number;  // Matches model (minutes)
  maxParticipants: number; // Matches model
  currentParticipants: number; // Matches model
  availableSeats: number; // Virtual field from backend
  price: number; // Number in backend
  isFree: boolean;
}

const Workshops = () => {
  const { toast } = useToast();
  const [workshops, setWorkshops] = useState<Workshop[]>([]); // Dynamic state
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfSeats: 1, // Added this as your backend requires it
  });

  // 1. Fetch Workshops from Backend
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch(`${API_URL}/api/workshops`);
        const json = await response.json();
        if (json.success) {
          setWorkshops(json.data);
        }
      } catch (error) {
        console.error("Error fetching workshops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  // 2. Handle Registration Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkshop) return;

    try {
      const response = await fetch(`${API_URL}/api/workshops/${selectedWorkshop._id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantDetails: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          numberOfSeats: formData.numberOfSeats,
        }),
      });

      const json = await response.json();

      if (json.success) {
        toast({
          title: "Registration Successful!",
          description: `Booking ID: ${json.registrationNumber}. Check your email for confirmation.`,
        });
        setSelectedWorkshop(null);
        setFormData({ name: "", email: "", phone: "", numberOfSeats: 1 });

        // Optionally refresh workshops to update seat count
        const refreshRes = await fetch(`${API_URL}/api/workshops`);
        const refreshJson = await refreshRes.json();
        setWorkshops(refreshJson.data);
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: json.message || "Something went wrong.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not connect to server.",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "coffee": return Coffee;
      case "art": return Palette;
      case "community": return Sparkles;
      default: return Coffee;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "coffee": return "bg-accent/20 text-accent";
      case "art": return "bg-terracotta/20 text-terracotta";
      case "community": return "bg-cream/20 text-cream";
      default: return "bg-accent/20 text-accent";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Preserved Design */}
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

      {/* Workshops Grid - Now Dynamic */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading experiences...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workshops.map((workshop, index) => {
                const CategoryIcon = getCategoryIcon(workshop.type);
                return (
                  <motion.div
                    key={workshop._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-500 overflow-hidden"
                  >
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${getCategoryColor(workshop.type)}`}>
                          <CategoryIcon className="w-6 h-6" />
                        </div>
                        <span className="font-display text-2xl font-bold text-accent">
                          {workshop.price === 0 ? "Free" : `$${workshop.price}`}
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                        {workshop.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {workshop.description}
                      </p>
                    </div>

                    <div className="px-6 py-4 border-t border-border bg-coffee-dark/50">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Calendar size={14} className="text-accent" />
                          <span>{new Date(workshop.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Clock size={14} className="text-accent" />
                          <span>{workshop.startTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Sparkles size={14} className="text-accent" />
                          <span>{workshop.duration} mins</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Users size={14} className="text-accent" />
                          <span>{workshop.availableSeats} seats left</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{
                              width: `${(workshop.currentParticipants / workshop.maxParticipants) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <Button
                        variant="hero"
                        size="default"
                        className="w-full"
                        onClick={() => setSelectedWorkshop(workshop)}
                        disabled={workshop.availableSeats === 0}
                      >
                        {workshop.availableSeats === 0 ? "Sold Out" : "Register Now"}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal - Preserved Design with updated Fields */}
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                </div>

                {/* Added Seats input as per model requirement */}
                <div className="space-y-2">
                  <Label htmlFor="seats">Number of Seats (Max 5)</Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.numberOfSeats}
                    onChange={(e) => setFormData({ ...formData, numberOfSeats: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-display text-2xl font-bold text-accent">
                      {selectedWorkshop.price === 0 ? "Free" : `$${selectedWorkshop.price * formData.numberOfSeats}`}
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

      {/* Private Events Section - Preserved Design */}
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