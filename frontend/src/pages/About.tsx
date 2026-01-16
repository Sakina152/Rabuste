import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Coffee, Target } from "lucide-react";
import RobustaWheel from "@/components/RobustaWheel";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
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
      <section className="relative pt-32 pb-32 overflow-hidden bg-gradient-to-b from-coffee-dark via-background to-background">
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

                {/* Inner gradient circle */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-coffee-medium via-espresso to-coffee-dark flex items-center justify-center shadow-2xl">
                  {/* Coffee cup icon */}
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Coffee className="w-24 h-24 md:w-32 md:h-32 text-cream" />
                  </motion.div>
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

        {/* Gradient fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      </section>

      {/* Story Timeline */}
      <section className="section-padding bg-background -mt-16 pt-8">
        <div className="container-custom">
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

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden lg:block" />

            <div className="space-y-12 lg:space-y-0">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-8 ${index % 2 === 0 ? "" : "lg:flex-row-reverse"
                    }`}
                >
                  <div
                    className={`lg:text-right ${index % 2 === 0 ? "" : "lg:col-start-2 lg:text-left"
                      }`}
                  >
                    <div
                      className={`p-8 rounded-2xl bg-card border border-border ${index % 2 === 0
                        ? "lg:mr-12"
                        : "lg:ml-12 lg:col-start-2"
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
                  <div className="absolute left-1/2 top-8 w-4 h-4 -ml-2 rounded-full bg-accent hidden lg:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding bg-coffee-dark">
        <div className="container-custom">
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
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-coffee-medium to-espresso overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Coffee className="w-24 h-24 text-accent mx-auto mb-4" />
                    <span className="font-display text-2xl font-bold text-foreground">
                      Robusta Only
                    </span>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-8 right-8 w-20 h-20 border-2 border-accent/20 rounded-full" />
                <div className="absolute bottom-12 left-12 w-32 h-32 border border-accent/10 rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Robusta Section */}
      <section className="section-padding bg-coffee-dark">
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
      </section>

      {/* Flavor Journey Section */}
      <section className="section-padding bg-gradient-to-br from-espresso via-coffee-dark to-espresso overflow-hidden">
        <div className="container-custom">
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
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-coffee-medium/50 to-espresso/80 p-8 flex items-center justify-center relative overflow-hidden">
                {/* Animated coffee bean */}
                <motion.div
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <svg className="w-48 h-48 text-accent" viewBox="0 0 100 100" fill="currentColor">
                    <ellipse cx="50" cy="50" rx="35" ry="45" />
                    <path d="M50 10 Q55 50 50 90" stroke="hsl(var(--espresso))" strokeWidth="4" fill="none" />
                  </svg>
                </motion.div>

                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-accent/40 rounded-full"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                    animate={{
                      y: [-10, 10, -10],
                      opacity: [0.3, 0.7, 0.3],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-accent/20 via-background to-coffee-medium">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Ready to Experience the Bold?
            </h2>
            <p className="text-muted-foreground text-lg">
              Visit our café, join a workshop, or explore partnership opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/workshops">
                  Join a Workshop
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button variant="accent" size="xl" asChild>
                <Link to="/gallery">Explore Art</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;