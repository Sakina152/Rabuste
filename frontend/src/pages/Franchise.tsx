import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Franchise = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    investment: "",
    message: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inquiry Submitted!",
      description:
        "Thank you for your interest in Rabuste Coffee. Our team will contact you within 48 hours.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      investment: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-hero-gradient">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Requirements */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
                Requirements
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                What We're Looking For
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                We partner with passionate individuals who share our vision for
                exceptional coffee and community experiences.
              </p>

              <ul className="space-y-4">
                {[
                  "Passion for coffee and customer experience",
                  "Minimum investment capacity of $150K - $300K",
                  "Suitable retail location (500-1000 sq ft)",
                  "Commitment to brand standards and quality",
                  "Entrepreneurial mindset and local market knowledge",
                  "Willingness to complete our training program",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-coffee-medium to-espresso p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-display text-6xl font-bold text-accent mb-4">
                    $150K+
                  </div>
                  <p className="text-foreground text-lg">
                    Initial Investment Range
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Including franchise fee, build-out, and initial inventory
                  </p>
                </div>
              </div>
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
              onSubmit={handleSubmit}
              className="space-y-6 bg-card rounded-2xl p-8 border border-border"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
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
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Preferred Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="City, State/Country"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment">Available Investment Range</Label>
                <Input
                  id="investment"
                  value={formData.investment}
                  onChange={(e) =>
                    setFormData({ ...formData, investment: e.target.value })
                  }
                  placeholder="e.g., $150K - $200K"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Tell Us About Yourself</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Share your background, why you're interested in Rabuste Coffee, and any relevant experience..."
                  rows={4}
                />
              </div>

              <Button type="submit" variant="hero" size="xl" className="w-full">
                Submit Inquiry
                <ArrowRight className="ml-2" />
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
