import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntroAnimation from "@/components/IntroAnimation";
import HeroParallax from "@/components/HeroParallax";
import ScrollingGallery from "@/components/ScrollingGallery";
import FloatingFeatures from "@/components/FloatingFeatures";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";

// Menu images
import frappeImg from "@/assets/menu/robusta-frappe.jpg";
import cappuccinoImg from "@/assets/menu/robusta-cappuccino.jpg";
import icedAmericanoImg from "@/assets/menu/robusta-iced-americano.jpg";

const Index = () => {
  const [showIntro, setShowIntro] = useState(() => {
    return !localStorage.getItem('introAnimationSeen');
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (showIntro) {
      localStorage.setItem('introAnimationSeen', 'true');
    }
  }, [showIntro]);

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

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-[100]"
        style={{ scaleX }}
      />

      <motion.div
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Navbar />

        {/* 1. Hero Parallax */}
        <HeroParallax />

        {/* 2. Floating Features (Asymmetrical Grid) */}
        <FloatingFeatures />

        {/* 3. Horizontal Scrolling Gallery */}
        <ScrollingGallery />

        {/* 4. Interactive Menu Spotlight */}
        <section className="py-32 bg-zinc-950 text-white relative">
          <div className="container-custom px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
              <div>
                <span className="text-accent uppercase tracking-widest text-sm font-semibold mb-2 block">Our Menu</span>
                <h2 className="text-5xl md:text-7xl font-bold font-display">House Specials</h2>
              </div>
              <Button variant="hero" size="lg" asChild className="mt-8 md:mt-0">
                <Link to="/menu">View Full Menu <ArrowRight className="ml-2" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rabusteSpecials.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer"
                >
                  <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-3xl font-bold">{item.name}</h3>
                      <span className="bg-accent px-3 py-1 rounded-full text-sm font-bold">{item.price}</span>
                    </div>
                    <p className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Visit Us Section (Map Restored) */}
        <section className="section-padding bg-coffee-dark relative">
          <div className="container-custom grid lg:grid-cols-2 gap-12 items-start relative z-10">
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
                Experience Rabuste <span className="text-gradient">In Person</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Drop by our Surat flagship to enjoy bold Robusta brews, browse the micro
                art gallery, and connect with the community.
              </p>
              <div className="space-y-4 mt-8">
                <div className="flex items-start gap-4 text-muted-foreground group">
                  <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg">Rabuste Coffee</p>
                    <p>Dimpal Row House, 15, Gymkhana Rd, Piplod</p>
                    <p>Surat, Gujarat 395007</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground group">
                  <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <p className="text-lg">+91 9574006100</p>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground group">
                  <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <p className="text-lg">rabustecoffee@gmail.com</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-background group h-[400px]">
                <iframe
                  title="Rabuste Coffee Location"
                  src="https://www.google.com/maps?q=21.1614147,72.7711702&z=17&output=embed"
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <a
                href="https://www.google.com/maps/place/RABUSTE/@21.1614147,72.7711702,17z/data=!3m1!4b1!4m6!3m5!1s0x3be04d00111b19b5:0xba45eb84da00c79f!8m2!3d21.1614147!4d72.7711702!16s%2Fg%2F11w4td8150?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden border border-border shadow-soft bg-card/80 backdrop-blur p-6 block hover:shadow-glow hover:border-accent/50 transition-all duration-500"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display text-2xl font-bold text-foreground">RABUSTE</h3>
                    <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold uppercase tracking-wider">Open Now</div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Dimpal Row House, 15, Gymkhana Rd, Piplod, Surat, Gujarat 395007
                  </p>
                  <div className="flex items-center gap-2 text-accent">
                    <span className="font-semibold text-lg">4.8</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-accent fill-accent">★</span>
                      ))}
                    </div>
                    <span className="text-muted-foreground text-sm ml-2">41 reviews</span>
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </section>

        <Footer />
      </motion.div>
    </>
  );
};

export default Index;
