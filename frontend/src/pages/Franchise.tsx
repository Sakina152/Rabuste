import { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; // Added for form handling
import axios from "axios"; // Added for API calls
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Building,
  TrendingUp,
  Users,
  Coffee,
  Palette,
  Zap,
  Loader2,
  Heart,
  Wallet,
  MapPin,
  Award,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Define the shape of data sending to Backend
interface FranchiseFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  budget: string; // Changed from 'investment' to match Backend
  experience: string; // Changed from 'message' to match Backend
}

// Benefit type for carousel
interface Benefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

// Mobile Auto-Rotating Carousel Component
const MobileBenefitsCarousel = ({ benefits }: { benefits: Benefit[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % benefits.length);
    }, 1600); // Rotate every 1.6 seconds

    return () => clearInterval(interval);
  }, [benefits.length]);

  return (
    <div className="md:hidden relative overflow-hidden">
      {/* Cards Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="w-full flex-shrink-0 px-2"
          >
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {benefits.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
              ? "bg-accent w-6"
              : "bg-muted-foreground/30"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const Franchise = () => {
  const { toast } = useToast();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FranchiseFormData>();

  const benefits = [
    {
      icon: Coffee,
      title: "Unique Concept",
      description:
        "A differentiated café model focusing exclusively on premium Robusta coffee.",
    },
    {
      icon: Palette,
      title: "Art Integration",
      description:
        "Built-in revenue stream through art sales and gallery partnerships.",
    },
    {
      icon: TrendingUp,
      title: "Scalable Model",
      description:
        "Compact footprint designed for efficient operations and quick scaling.",
    },
    {
      icon: Users,
      title: "Community Focus",
      description:
        "Workshop programs that build loyal customer communities and recurring revenue.",
    },
    {
      icon: Building,
      title: "Full Support",
      description:
        "Comprehensive training, marketing support, and operational guidance.",
    },
    {
      icon: Zap,
      title: "Tech-Enabled",
      description:
        "AI-enhanced customer experience and modern operational systems.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Initial Inquiry",
      description: "Submit your application and tell us about yourself.",
    },
    {
      number: "02",
      title: "Discovery Call",
      description: "We'll discuss the opportunity and answer your questions.",
    },
    {
      number: "03",
      title: "Business Review",
      description: "Review financials, location requirements, and terms.",
    },
    {
      number: "04",
      title: "Agreement",
      description: "Sign the franchise agreement and begin training.",
    },
    {
      number: "05",
      title: "Launch",
      description: "Open your Rabuste Coffee café with full support.",
    },
  ];

  // The Actual Submit Function
  const onSubmit = async (data: FranchiseFormData) => {
    try {
      // Send data to your backend
      await axios.post(`${API}/api/franchise`, data);

      toast({
        title: "Inquiry Submitted!",
        description: "Thank you! We have received your application and emailed you a confirmation.",
        variant: "default",
      });

      reset(); // Clear the form
    } catch (error: any) {
      console.error("Submission failed:", error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/dnk1a58sg/image/upload/v1768628528/Gemini_Generated_Image_2d7pmd2d7pmd2d7p_g5ve4x.png')`,
            }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-coffee-dark/70 via-coffee-dark/50 to-background" />
        </div>

        {/* Animated circles overlay */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-accent/5"
              style={{
                width: `${300 + i * 150}px`,
                height: `${300 + i * 150}px`,
                right: `${-100 + i * 80}px`,
                top: `${-100 + i * 60}px`,
              }}
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.05, 0.12, 0.05],
              }}
              transition={{
                duration: 5 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container-custom relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
              Partner With Us
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mt-4 mb-6">
              Bring Rabuste Coffee to{" "}
              <span className="text-gradient">Your City</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Join the bold coffee movement. Our franchise model combines premium
              Robusta coffee, art gallery experiences, and community workshops in a
              scalable, profitable café concept.
            </p>
          </motion.div>
        </div>

        {/* Flowing Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            {/* Bottom wave layer */}
            <path
              d="M0,120 L0,80 Q180,40 360,60 T720,50 T1080,70 T1440,50 L1440,120 Z"
              className="fill-background"
            />
            {/* Middle wave layer */}
            <path
              d="M0,120 L0,90 Q240,50 480,70 T960,55 T1440,75 L1440,120 Z"
              className="fill-background/80"
            />
            {/* Top accent wave */}
            <motion.path
              d="M0,120 L0,100 Q360,70 720,90 T1440,80 L1440,120 Z"
              className="fill-accent/10"
              animate={{
                d: [
                  "M0,120 L0,100 Q360,70 720,90 T1440,80 L1440,120 Z",
                  "M0,120 L0,95 Q360,80 720,85 T1440,90 L1440,120 Z",
                  "M0,120 L0,100 Q360,70 720,90 T1440,80 L1440,120 Z",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
              Why Partner With Us
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
              The Rabuste Advantage
            </h2>
          </motion.div>

          {/* Mobile Auto-Rotating Carousel */}
          <MobileBenefitsCarousel benefits={benefits} />

          {/* Desktop Grid - Hidden on mobile */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-500 hover:shadow-glow"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <benefit.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-padding bg-coffee-dark">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
              The Process
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
              Your Journey to Ownership
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-border hidden lg:block" />

            <div className="grid lg:grid-cols-5 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground font-display text-xl font-bold flex items-center justify-center mx-auto mb-6 relative z-10">
                    {step.number}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements - Immersive Split Layout */}
      <section className="bg-background overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">

          {/* Left Column: Content */}
          <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center bg-background z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent text-sm tracking-[0.3em] uppercase font-body font-bold mb-3 block">
                Requirements
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                What We're Looking For
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg">
                We partner with passionate individuals who share our vision for
                exceptional coffee and community experiences.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: Heart,
                    text: "Passion for coffee and customer experience"
                  },
                  {
                    icon: Wallet,
                    text: "Minimum investment capacity of ₹150K - ₹300K"
                  },
                  {
                    icon: MapPin,
                    text: "Suitable retail location (500-1000 sq ft)"
                  },
                  {
                    icon: Award,
                    text: "Commitment to brand standards and quality"
                  },
                  {
                    icon: Users, // Entrepreneurial mindset
                    text: "Entrepreneurial mindset and local market knowledge"
                  },
                  {
                    icon: GraduationCap,
                    text: "Willingness to complete our training program"
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-black transition-colors duration-300">
                      <item.icon className="w-6 h-6 text-accent group-hover:text-black transition-colors duration-300" />
                    </div>
                    <span className="text-stone-300 font-medium text-lg border-b border-transparent group-hover:border-accent/50 transition-colors pb-1">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Collage & Glass Card */}
          <div className="relative h-[450px] lg:h-auto w-full overflow-hidden lg:overflow-visible mt-8 lg:mt-0">

            {/* Image 1: Main Environment - Top Right */}
            {/* Mobile: Dominant top-right, giving breath */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 right-0 w-[85%] h-[60%] lg:w-[65%] lg:h-[65%] z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop"
                alt="Rabuste Cafe Interior"
                className="w-full h-full object-cover rounded-l-2xl lg:rounded-2xl shadow-xl"
              />
            </motion.div>

            {/* Image 3: Meeting - Middle Left Floating */}
            {/* Mobile: Smaller badge style on left edge */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="absolute top-[35%] left-0 w-[35%] aspect-square lg:top-12 lg:left-12 lg:w-[35%] lg:aspect-[4/3] z-20"
            >
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop"
                alt="Partnership Meeting"
                className="w-full h-full object-cover rounded-r-2xl lg:rounded-2xl shadow-2xl border-2 lg:border-4 border-background"
              />
            </motion.div>

            {/* Image 2: Barista - Bottom Left */}
            {/* Mobile: Anchored bottom-left, vertical */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="absolute bottom-0 left-[10%] w-[40%] h-[40%] lg:bottom-12 lg:left-0 lg:w-[45%] lg:h-[55%] z-30"
            >
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop"
                alt="Barista Craft"
                className="w-full h-full object-cover rounded-t-2xl lg:rounded-2xl shadow-2xl border-2 lg:border-4 border-background"
              />
            </motion.div>

            {/* Floating Glass Card - Bottom Right */}
            {/* Mobile: Compact, aligned right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              className="absolute bottom-4 right-4 z-40 bg-black/60 lg:bg-black/40 backdrop-blur-md border border-white/10 p-4 lg:p-8 rounded-2xl shadow-2xl w-[50%] lg:w-auto lg:max-w-xs text-right"
            >
              <span className="text-accent/80 text-[10px] lg:text-xs font-bold tracking-widest uppercase mb-1 block">
                Investment
              </span>
              <div className="font-display text-2xl lg:text-5xl font-bold text-white mb-1 lg:mb-2 drop-shadow-lg">
                ₹150K<span className="text-accent">+</span>
              </div>
              <p className="text-white/80 text-[10px] lg:text-xs leading-relaxed hidden lg:block">
                Complete franchise setup including equipment & inventory.
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section-padding bg-coffee-dark">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
                Get Started
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
                Franchise Inquiry
              </h2>
              <p className="text-muted-foreground text-lg mt-4">
                Ready to bring Rabuste Coffee to your community? Fill out the form
                below and our franchise team will be in touch.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit(onSubmit)} // Use Hook Form submit
              className="space-y-6 bg-card rounded-2xl p-8 border border-border"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Your name"
                  />
                  {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone", { required: "Phone is required" })}
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Preferred Location *</Label>
                  <Input
                    id="location"
                    {...register("location", { required: "Location is required" })}
                    placeholder="City, State/Country"
                  />
                  {errors.location && <span className="text-red-500 text-xs">{errors.location.message}</span>}
                </div>
              </div>

              {/* UPDATED: Dropdown to match Backend Schema */}
              <div className="space-y-2">
                <Label htmlFor="budget">Available Investment Range *</Label>
                <select
                  id="budget"
                  {...register("budget", { required: "Please select a budget" })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a range...</option>
                  <option value="10k-50k">₹10,000 - ₹50,000</option>
                  <option value="50k-100k">₹50,000 - ₹100,000</option>
                  <option value="100k+">₹100,000+</option>
                </select>
                {errors.budget && <span className="text-red-500 text-xs">{errors.budget.message}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Tell Us About Yourself</Label>
                <Textarea
                  id="experience"
                  {...register("experience", { required: "This field is required" })}
                  placeholder="Share your background, why you're interested in Rabuste Coffee, and any relevant experience..."
                  rows={4}
                />
                {errors.experience && <span className="text-red-500 text-xs">{errors.experience.message}</span>}
              </div>

              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={isSubmitting} // Disable while sending
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Inquiry...
                  </>
                ) : (
                  <>
                    Submit Inquiry
                    <ArrowRight className="ml-2" />
                  </>
                )}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Franchise;