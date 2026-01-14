import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Coffee, Palette, Users, Sparkles, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntroAnimation from "@/components/IntroAnimation";

// Menu images
import frappeImg from "@/assets/menu/robusta-frappe.jpg";
import cappuccinoImg from "@/assets/menu/robusta-cappuccino.jpg";
import icedAmericanoImg from "@/assets/menu/robusta-iced-americano.jpg";

const Index = () => {
  const [showIntro, setShowIntro] = useState(() => {
    // Only show intro if user hasn't seen it before
    return !localStorage.getItem('introAnimationSeen');
  });

  useEffect(() => {
    if (showIntro) {
      // Mark intro as seen after it starts playing
      localStorage.setItem('introAnimationSeen', 'true');
    }
  }, [showIntro]);

  const features = [
    {
      icon: Coffee,
      title: "Bold Robusta",
      description:
        "Experience the intense, full-bodied flavor of premium Robusta coffee, crafted for the true coffee enthusiast.",
    },
    {
      icon: Palette,
      title: "Art Gallery",
      description:
        "A micro gallery showcasing fine arts, turning your coffee break into a cultural experience.",
    },
    {
      icon: Users,
      title: "Workshops",
      description:
        "Join our coffee and art workshops to learn, create, and connect with like-minded individuals.",
    },
    {
      icon: Sparkles,
      title: "AI Innovation",
      description:
        "Where coffee culture meets technology, enhancing your café experience with smart solutions.",
    },
  ];

  const rabusteSpecials = [
    { 
      name: "Robusta Frappe", 
      desc: "Our signature cold blend with creamy froth and bold Robusta kick",
      price: "₹240",
      image: frappeImg
    },
    { 
      name: "Robusta Cappuccino", 
      desc: "Velvety foam meets intense espresso perfection",
      price: "₹180",
      image: cappuccinoImg
    },
    { 
      name: "Robusta Iced Americano", 
      desc: "Smooth, refreshing, and powerfully bold",
      price: "₹150",
      image: icedAmericanoImg
    },
  ];

  // const menuHighlights = [
  //   { name: "Espresso Forte", desc: "Double shot, pure intensity", price: "₹110" },
  //   { name: "Robusta Latte", desc: "Smooth, creamy, bold", price: "₹190" },
  //   { name: "Classic Matcha", desc: "Premium green tea perfection", price: "₹250" },
  //   { name: "Belgium Chocolate Cake", desc: "Rich, decadent indulgence", price: "₹280" },
  // ];

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      
      <motion.div 
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Navbar />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-accent/5"
                style={{
                  width: `${200 + i * 100}px`,
                  height: `${200 + i * 100}px`,
                  left: `${10 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="container-custom relative z-10 px-6 pt-32 pb-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: showIntro ? 0 : 1, x: showIntro ? -60 : 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 20 : 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="inline-block text-accent font-body text-sm tracking-[0.3em] uppercase"
                  >
                    Specialty Coffee Experience
                  </motion.span>
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 30 : 0 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
                  >
                    Where{" "}
                    <span className="text-gradient">Bold Coffee</span>{" "}
                    Meets Fine Art
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 30 : 0 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl"
                  >
                    Discover the intense, full-bodied taste of premium Robusta coffee
                    in a cozy café that doubles as an art gallery. Bold flavors,
                    creative inspiration, grab-and-go convenience.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 30 : 0 }}
                  transition={{ delay: 0.7, duration: 0.7 }}
                  className="flex flex-wrap gap-4"
                >
                  <Button variant="hero" size="xl" asChild>
                    <Link to="/about">
                      Explore Our Story
                      <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                  <Button variant="accent" size="xl" asChild>
                    <Link to="/gallery">View Gallery</Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Hero Visual - Coffee Cup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: showIntro ? 0 : 1, scale: showIntro ? 0.9 : 1, x: showIntro ? 50 : 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative flex justify-center"
              >
                <div className="relative">
                  {/* Glowing background */}
                  <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full" />
                  
                  {/* Main Cup Illustration */}
                  <div className="relative float">
                    {/* Steam */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 bg-gradient-to-t from-cream/60 to-transparent rounded-full"
                          style={{
                            left: `${i * 20 - 20}px`,
                            height: "50px",
                          }}
                          animate={{
                            y: [-10, -40, -10],
                            opacity: [0.4, 0.8, 0.4],
                            scaleY: [1, 1.5, 1],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: i * 0.4,
                          }}
                        />
                      ))}
                    </div>

                    {/* Cup */}
                    <div className="w-48 h-40 md:w-64 md:h-52 bg-gradient-to-b from-cream to-cream-dark rounded-b-[45%] relative overflow-hidden shadow-2xl">
                      {/* Coffee */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-espresso via-coffee-dark to-coffee-medium rounded-b-[45%]"
                        initial={{ height: "0%" }}
                        animate={{ height: showIntro ? "0%" : "70%" }}
                        transition={{ duration: 1.5, delay: 0.6 }}
                      />
                      {/* Rim */}
                      <div className="absolute top-0 left-0 right-0 h-3 bg-cream-dark" />
                      {/* Highlight */}
                      <div className="absolute top-4 left-4 w-8 h-16 bg-white/10 rounded-full blur-sm" />
                    </div>

                    {/* Handle */}
                    <div className="absolute right-[-30px] top-8 w-10 h-20 md:w-12 md:h-24 border-[6px] border-cream-dark rounded-r-full bg-transparent" />

                    {/* Saucer */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-60 md:w-80 h-4 bg-gradient-to-r from-cream-dark via-cream to-cream-dark rounded-full shadow-xl" />
                  </div>

                  {/* Decorative beans */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-coffee-light"
                      style={{
                        left: `${-20 + i * 80}px`,
                        top: `${180 + Math.sin(i) * 30}px`,
                      }}
                      animate={{
                        y: [-5, 5, -5],
                        rotate: [0, 10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    >
                      <Coffee size={24} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center pt-2">
              <motion.div
                className="w-1.5 h-3 bg-accent rounded-full"
                animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
                The Experience
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
                More Than Just Coffee
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-500 hover:shadow-glow"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Rabuste Specials Section */}
        <section className="section-padding bg-gradient-to-b from-background to-coffee-dark/30">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
                House Favourites
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
                Rabuste Specials
              </h2>
              <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
                Our most loved creations, crafted with premium Robusta for the ultimate café experience
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {rabusteSpecials.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group relative rounded-2xl bg-card border border-border overflow-hidden hover:border-accent/50 transition-all duration-500 hover:shadow-glow cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent text-background font-display font-bold text-sm">
                      {item.price}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <Button variant="hero" size="lg" asChild>
                <Link to="/menu">
                  View Full Menu
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Menu Preview Section */}
        {/* <section className="section-padding bg-coffee-dark">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
                  Our Menu
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                  Signature Brews
                </h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  A curated selection of Robusta-only coffee, each crafted to
                  deliver maximum flavor and bold character. Perfect for grab-and-go.
                </p>
                <Button variant="hero" asChild>
                  <Link to="/menu">
                    View Full Menu
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                {menuHighlights.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-6 rounded-xl bg-card border border-border hover:border-accent/30 transition-all group"
                  >
                    <div>
                      <h4 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                    <span className="font-display text-2xl font-bold text-accent">
                      {item.price}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section> */}

        {/* Visit Section */}
        <section className="section-padding bg-coffee-dark">
          <div className="container-custom grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
                Visit Us
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Experience Rabuste in Person
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Drop by our Surat flagship to enjoy bold Robusta brews, browse the micro
                art gallery, and connect with the community.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-muted-foreground">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Rabuste Coffee</p>
                    <p>Dimpal Row House, 15, Gymkhana Rd, Piplod</p>
                    <p>Surat, Gujarat 395007</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    <Phone className="w-5 h-5" />
                  </div>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    <Mail className="w-5 h-5" />
                  </div>
                  <p>hello@rabuste.coffee</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-xl bg-background">
                <iframe
                  title="Rabuste Coffee Location"
                  src="https://www.google.com/maps?q=21.1614147,72.7711702&z=17&output=embed"
                  className="w-full h-[320px]"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <a
                href="https://www.google.com/maps/place/RABUSTE/@21.1614147,72.7711702,17z/data=!3m1!4b1!4m6!3m5!1s0x3be04d00111b19b5:0xba45eb84da00c79f!8m2!3d21.1614147!4d72.7711702!16s%2Fg%2F11w4td8150?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden border border-border shadow-xl bg-card p-6 block hover:shadow-2xl hover:border-accent/50 transition-all duration-500"
              >
                <div className="space-y-3">
                  <h3 className="font-display text-2xl font-bold text-foreground">RABUSTE</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Dimpal Row House, 15, Gymkhana Rd, Piplod, Surat, Gujarat 395007
                  </p>
                  <div className="flex items-center gap-2 text-accent">
                    <span className="font-semibold text-lg">4.8</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-accent">★</span>
                      ))}
                    </div>
                    <span className="text-muted-foreground text-sm ml-2">41 reviews</span>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <span className="text-accent text-sm font-semibold hover:underline">
                      Directions
                    </span>
                    <span className="text-accent text-sm font-semibold hover:underline">
                      View larger map
                    </span>
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-br from-accent/20 via-background to-coffee-medium">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Ready to Experience{" "}
                <span className="text-gradient">Bold Coffee?</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Visit us today or explore franchise opportunities to bring Rabuste
                Coffee to your city.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/franchise">
                    Franchise Inquiry
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button variant="accent" size="xl" asChild>
                  <Link to="/workshops">Join a Workshop</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </motion.div>
    </>
  );
};

export default Index;
