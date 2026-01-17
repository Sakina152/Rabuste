import { useState, useRef, useLayoutEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Coffee, Target, Play, Pause } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RobustaWheel from "@/components/RobustaWheel";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Timeline item type
interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

// Mobile Card Shuffle Component
const MobileTimelineCards = ({ timeline }: { timeline: TimelineItem[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    // Only run on mobile (< 1024px)
    const mm = gsap.matchMedia();

    mm.add("(max-width: 1023px)", () => {
      const cards = cardsRef.current;
      const container = containerRef.current;

      if (!container || cards.length === 0) return;

      // Set initial stacked state - cards stacked with interesting offset
      gsap.set(cards, {
        y: (i) => i * 12,
        x: (i) => (i % 2 === 0 ? -8 : 8), // Alternating slight horizontal offset
        scale: (i) => 1 - i * 0.03,
        opacity: (i) => 1 - i * 0.15,
        rotation: (i) => (i % 2 === 0 ? -2 : 2), // Slight alternating rotation
        zIndex: (i) => timeline.length - i,
      });

      // Create timeline for card spread animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 60%", // Start when section enters view
          end: "top -20%", // End when section has scrolled up
          scrub: true, // Direct scroll-to-animation mapping
        },
      });

      // Animate each card sequentially - one by one as you scroll
      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            y: i * 200,
            x: 0,
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.4,
            ease: "power2.inOut",
          },
          i * 0.15 // Stagger - each card starts slightly after previous
        );
      });

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    });

    return () => mm.revert();
  }, [timeline]);

  return (
    <div ref={containerRef} className="lg:hidden relative" style={{ minHeight: `${timeline.length * 200 + 120}px` }}>
      <div className="relative px-4">
        {timeline.map((item, index) => (
          <div
            key={item.year}
            ref={(el) => {
              if (el) cardsRef.current[index] = el;
            }}
            className="absolute left-0 right-0 mx-4 will-change-transform"
            style={{ top: 0 }}
          >
            <div className="p-6 rounded-2xl bg-card border border-border shadow-lg backdrop-blur-sm">
              {/* Year badge */}
              <div className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
                <span className="font-display text-xl font-bold text-accent">
                  {item.year}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const About = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ctaRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const timeline = [
    {
      year: "2020",
      title: "The Spark",
      description:
        "A passionate coffee lover discovered the untapped potential of Robusta beans during travels through Southeast Asia.",
    },
    {
      year: "2021",
      title: "The Research",
      description:
        "Months of experimentation led to the perfect roasting techniques that unlock Robusta's bold, complex flavors.",
    },
    {
      year: "2022",
      title: "The Vision",
      description:
        "The idea of combining coffee culture with fine arts emerged, creating a unique grab-and-go experience.",
    },
    {
      year: "2023",
      title: "Rabuste Is Born",
      description:
        "The first Rabuste Coffee café opened, blending bold Robusta coffee, art galleries, and community workshops.",
    },
  ];

  const flavorNotes = [
    { name: "Dark Chocolate", percentage: 90 },
    { name: "Earthy & Woody", percentage: 85 },
    { name: "Tobacco", percentage: 60 },
    { name: "Nutty", percentage: 75 },
  ];

  // Benefits are now managed inside the RobustaWheel component

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/videos/about-hero.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-coffee-dark/80 via-coffee-dark/70 to-background/95" />
        </div>

        {/* Background decorative "coffee" text */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block">
          <div className="text-[180px] font-display font-bold text-accent/[0.07] leading-none tracking-tight">
            <div>coffee</div>
            <div>coffee</div>
            <div>coffee</div>
            <div>coffee</div>
          </div>
        </div>

        {/* Floating coffee beans decoration */}
        <motion.div
          className="absolute left-10 bottom-20 w-8 h-8 text-coffee-medium/30 hidden md:block"
          animate={{ y: [-10, 10, -10], rotate: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Coffee className="w-full h-full" />
        </motion.div>
        <motion.div
          className="absolute right-1/3 bottom-10 w-6 h-6 text-coffee-medium/20 hidden md:block"
          animate={{ y: [5, -5, 5], rotate: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Coffee className="w-full h-full" />
        </motion.div>

        <div className="container-custom relative z-10 px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
                Discover The Art
                <br />
                <span className="text-gradient">Of Bold Coffee.</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
                Experience the difference as we meticulously select and roast the finest
                Robusta beans to create a truly unforgettable cup of coffee. Join us on a journey of
                taste and awaken your senses, one sip at a time.
              </p>

              <Button variant="hero" size="xl" asChild className="group">
                <Link to="/menu">
                  Order Now
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              {/* Stats/Counters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex gap-8 md:gap-12 mt-12"
              >
                <AnimatedCounter value={500} suffix="+" label="Reviews" />
                <AnimatedCounter value={25} suffix="+" label="Coffee Blends" />
                <AnimatedCounter value={10} suffix="K+" label="Happy Customers" />
              </motion.div>
            </motion.div>

            {/* Right Content - Coffee Cup Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              {/* Main coffee cup circle */}
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Outer decorative ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-accent/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner gradient circle with Lottie animation */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-coffee-medium via-espresso to-coffee-dark flex items-center justify-center shadow-2xl overflow-hidden">
                  {/* Lottie coffee animation */}
                  <div className="w-52 h-52 md:w-72 md:h-72">
                    <DotLottieReact
                      src="https://lottie.host/d88be254-5262-4231-ba92-3a957eb11ea8/qsftjuydT3.lottie"
                      loop
                      autoplay
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>

                {/* Steam effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-8 bg-gradient-to-t from-accent/40 to-transparent rounded-full"
                      style={{ left: `${i * 12 - 12}px` }}
                      animate={{
                        y: [-10, -30],
                        opacity: [0.6, 0],
                        scale: [1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>

                {/* Floating coffee beans around the cup */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 rounded-full bg-coffee-dark"
                    style={{
                      top: `${20 + i * 20}%`,
                      left: i % 2 === 0 ? "-10%" : "100%",
                    }}
                    animate={{
                      y: [-10, 10, -10],
                      x: i % 2 === 0 ? [-5, 5, -5] : [5, -5, 5],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced gradient fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none">
          {/* Primary fade layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          {/* Secondary subtle fade layer for added depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          {/* Accent color hint for visual interest */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        </div>
      </section>

      {/* Story Timeline */}
      <section className="section-padding bg-background -mt-16 pt-8 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
              Our Journey
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
              How It All Started
            </h2>
          </motion.div>

          {/* Mobile Card Shuffle Animation */}
          <MobileTimelineCards timeline={timeline} />

          {/* Desktop Timeline - Hidden on mobile */}
          <div className="relative hidden lg:block">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-0">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative grid grid-cols-2 gap-8 ${index % 2 === 0 ? "" : "flex-row-reverse"
                    }`}
                >
                  <div
                    className={`text-right ${index % 2 === 0 ? "" : "col-start-2 text-left"
                      }`}
                  >
                    <div
                      className={`p-8 rounded-2xl bg-card border border-border ${index % 2 === 0
                        ? "mr-12"
                        : "ml-12 col-start-2"
                        }`}
                    >
                      <span className="font-display text-3xl font-bold text-accent">
                        {item.year}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-foreground mt-2 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 top-8 w-4 h-4 -ml-2 rounded-full bg-accent" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        {/* Dual-Shroud Transition: Bottom Fade to Coffee-Dark */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-transparent to-coffee-dark pointer-events-none z-10" />
      </section>

      {/* Philosophy Section */}
      <section className="bg-coffee-dark relative overflow-hidden pt-8 pb-20 px-6 md:pt-16 md:pb-32 md:px-12">
        {/* Dual-Shroud Transition: Top Fade from Coffee-Dark */}
        <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-coffee-dark via-coffee-dark/60 to-transparent pointer-events-none z-10" />
        <div className="container-custom relative z-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
                Philosophy
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                Bold Coffee, Cozy Space, Grab-and-Go
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  At Rabuste, we believe that great coffee shouldn't require a long
                  wait or a complicated order. Our philosophy centers on three
                  pillars: bold flavors from premium Robusta beans, a cozy
                  atmosphere that feels like a creative sanctuary, and the
                  convenience of grab-and-go service.
                </p>
                <p>
                  We've reimagined the café experience for the modern world—where
                  you can admire a painting, grab an exceptional coffee, and be on
                  your way in minutes, carrying that bold energy with you.
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <Target className="w-12 h-12 text-accent" />
                <div>
                  <h4 className="font-display text-lg font-semibold text-foreground">
                    Our Mission
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    To elevate Robusta coffee and make bold experiences accessible to
                    everyone.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[9/16] max-h-[500px] rounded-2xl overflow-hidden relative shadow-2xl mx-auto">
                {/* Video Player */}
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="https://res.cloudinary.com/dnk1a58sg/video/upload/v1768640558/Rabuste_bqabci.mp4" type="video/mp4" />
                </video>

                {/* Play/Pause Button Overlay */}
                <button
                  onClick={toggleVideo}
                  className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors duration-300 shadow-lg border border-accent/20"
                  aria-label={isVideoPlaying ? "Pause video" : "Play video"}
                >
                  {isVideoPlaying ? (
                    <Pause className="w-5 h-5 text-accent" />
                  ) : (
                    <Play className="w-5 h-5 text-accent ml-0.5" />
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Robusta Section */}
      <section className="bg-coffee-dark relative overflow-hidden pt-8 pb-20 px-6 md:pt-20 md:pb-32 md:px-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
              Pure Robusta
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
              Why We Choose Robusta
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
              While the world obsesses over Arabica, we've discovered the untapped potential of Robusta — a bean that delivers unmatched intensity.
            </p>
          </motion.div>

          <RobustaWheel />
        </div>
        {/* Dual-Shroud Transition: Bottom Fade to Espresso */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-transparent to-espresso pointer-events-none z-10" />
      </section>

      {/* Flavor Journey Section */}
      <section className="pt-12 pb-20 md:pt-16 md:pb-32 px-6 md:px-12 bg-gradient-to-br from-espresso via-coffee-dark to-espresso overflow-hidden relative">
        {/* Dual-Shroud Transition: Top Fade from Espresso */}
        <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-espresso via-espresso/60 to-transparent pointer-events-none z-10" />
        <div className="container-custom relative z-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
                Taste Profile
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                The Flavor Journey
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Every sip of premium Robusta takes you on an adventure. From the first bold hit to the lingering finish, experience a symphony of flavors that Arabica simply can't match.
              </p>

              {/* Flavor bars */}
              <div className="space-y-6">
                {flavorNotes.map((flavor, index) => (
                  <motion.div
                    key={flavor.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-body text-foreground font-medium">{flavor.name}</span>
                      <span className="font-display text-accent font-bold">{flavor.percentage}%</span>
                    </div>
                    <div className="h-3 bg-background/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent to-terracotta rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${flavor.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Full Body indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-4 rounded-xl bg-accent/10 border border-accent/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <span className="font-display text-lg font-bold text-foreground">Full Body</span>
                    <p className="text-muted-foreground text-sm">Rich, intense, and satisfying</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative flex items-center justify-center"
            >
              {/* Video styled as animation */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Glow effect behind video */}
                <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 via-transparent to-coffee-medium/30 blur-2xl" />

                {/* Video container */}
                <div className="relative aspect-[9/16] max-h-[400px] rounded-2xl overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ pointerEvents: 'none' }}
                  >
                    <source src="/videos/about-tasteflavor.mp4" type="video/mp4" />
                  </video>

                  {/* Subtle vignette overlay for animation feel */}
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/20 via-transparent to-espresso/10 pointer-events-none" />

                  {/* Soft inner glow border */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-accent/10 pointer-events-none" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Dual-Shroud Transition: Bottom Fade to Coffee-Dark */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-transparent to-coffee-dark pointer-events-none z-10" />
      </section>

      {/* CTA Section - Parallax Effect */}
      <section ref={ctaRef} className="relative overflow-hidden h-[90vh] flex items-center justify-center">
         {/* Parallax Video Background Layer - Moves Slow */}
         <motion.div 
            style={{ y: yBg }}
            className="absolute inset-0 z-0 h-[140%] -top-[20%]"
         >
            <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
            >
                <source src="/coffee_workshop.mp4" type="video/mp4" />
            </video>
            {/* Dark Aesthetic Overlay */}
            <div className="absolute inset-0 bg-[#1A1614]/70 backdrop-blur-[2px]" />
            {/* Subtle Gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-transparent to-[#1A1614]" />
        </motion.div>

        {/* Floating Content Layer - Moves Fast */}
        <motion.div 
            style={{ y: yText }}
            className="container-custom text-center relative z-20"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-10"
          >
            <h2 className="font-display text-5xl md:text-7xl font-bold text-[#E8DCC4] drop-shadow-2xl leading-tight">
              Ready to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BC653B] to-[#E8DCC4]">Experience the Bold?</span>
            </h2>
            <p className="text-[#E8DCC4]/80 text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto drop-shadow-md">
              Step into a world where coffee meets creativity. Visit our café, join a workshop, or explore partnership opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <Button 
                variant="hero" 
                size="xl" 
                asChild
                className="bg-[#BC653B] hover:bg-[#A05532] text-white border-none shadow-[0_10px_40px_rgba(188,101,59,0.3)] hover:shadow-[0_10px_50px_rgba(188,101,59,0.5)] transition-all duration-300 scale-100 hover:scale-105"
              >
                <Link to="/workshops">
                  Join a Workshop
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                asChild
                className="border-[#E8DCC4]/30 text-[#E8DCC4] hover:bg-[#E8DCC4]/10 hover:text-white backdrop-blur-md scale-100 hover:scale-105 transition-all duration-300"
              >
                <Link to="/gallery">Explore Art</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default About;