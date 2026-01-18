import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntroAnimation from "@/components/IntroAnimation";
import HeroParallax from "@/components/HeroParallax";
import ScrollingGallery from "@/components/ScrollingGallery";
import FloatingFeatures from "@/components/FloatingFeatures";
import Testimonials from "@/components/Testimonials"; // Imported Testimonials
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import MobileStackedCards from "@/components/MobileStackedCards";

// Menu images
import frappeImg from "@/assets/menu/robusta-frappe.jpg";
import cappuccinoImg from "@/assets/menu/robusta-cappuccino.jpg";
import icedAmericanoImg from "@/assets/menu/robusta-iced-americano.jpg";

const FloatingBeansBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background Pattern replicated from FloatingFeatures */}
      <motion.div
        className="absolute inset-0 opacity-[0.05]"
        animate={{
          backgroundPosition: ["0px 0px", "60px 60px"]
        }}
        transition={{
          duration: 4,
          ease: "linear",
          repeat: Infinity
        }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c2.2 0 3.5 2 2 4s-3 3-3 5c0 1.5 1.5 2 3 2v2c-2.5 0-4.5-1.5-4.5-4s3-3 3-5c0-1.5-1.5-2-3-2V5z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />
      {/* Soft Overlays for Depth and Transitions */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#09090b] to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-coffee-dark opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
    </div>
  );
};

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
              <div className="-ml-16 md:ml-0">
                <span className="text-accent uppercase tracking-widest text-sm font-semibold mb-2 block">Our Menu</span>
                <h2 className="text-5xl md:text-7xl font-bold font-display tracking-tight leading-none text-white">
                  House <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-600">Specials</span>
                </h2>
              </div>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="mt-8 md:mt-0 hidden md:inline-flex rounded-full border-accent/50 text-accent hover:bg-accent hover:text-white px-12 h-14 text-lg tracking-widest backdrop-blur-sm bg-black/30 shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 transform hover:scale-105 uppercase"
              >
                <Link to="/menu">View Full Menu <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-8">
              {rabusteSpecials.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer border border-white/5"
                >
                  <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-3xl font-display font-bold">{item.name}</h3>
                      <span className="bg-accent px-3 py-1 rounded-full text-sm font-bold font-sans">{item.price}</span>
                    </div>
                    <p className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-light">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile Stacked Cards - Moved Upwards */}
            <div className="md:hidden mt-0 mb-8">
              <MobileStackedCards items={rabusteSpecials} />

              <div className="flex justify-center mt-[-20px] relative z-40">
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="rounded-full border-accent/50 text-accent hover:bg-accent hover:text-white px-12 h-14 text-lg tracking-widest backdrop-blur-sm bg-black/30 shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 transform hover:scale-105 uppercase"
                >
                  <Link to="/menu">View Full Menu <ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Testimonials Section */}
        <Testimonials />

        {/* 6. Visit Us Section (Map Restored) */}
        <section className="section-padding bg-coffee-dark relative overflow-hidden">
          <FloatingBeansBackground />
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
