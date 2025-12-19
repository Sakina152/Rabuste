import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Coffee, Heart, Lightbulb, Target, Users, Award, Leaf, Zap, Globe } from "lucide-react";
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

  const values = [
    {
      icon: Coffee,
      title: "Bold Excellence",
      description:
        "We believe in the power of Robusta coffee to deliver intense, memorable experiences.",
    },
    {
      icon: Heart,
      title: "Artful Living",
      description:
        "Coffee and art are both forms of expression. We celebrate creativity in every cup and canvas.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Our café is a gathering place for coffee lovers, artists, and curious minds alike.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We embrace technology and new ideas to enhance the café experience for everyone.",
    },
  ];

  const flavorNotes = [
    { name: "Dark Chocolate", percentage: 90 },
    { name: "Earthy & Woody", percentage: 85 },
    { name: "Tobacco", percentage: 60 },
    { name: "Nutty", percentage: 75 },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Higher Caffeine",
      description:
        "Robusta contains nearly twice the caffeine of Arabica, delivering a powerful energy boost.",
    },
    {
      icon: Award,
      title: "Bold Flavor Profile",
      description:
        "Rich, earthy, and intense with notes of dark chocolate and nuts.",
    },
    {
      icon: Leaf,
      title: "Sustainable Crop",
      description:
        "More resilient to pests and diseases, requiring fewer chemicals to grow.",
    },
    {
      icon: Globe,
      title: "Diverse Origins",
      description:
        "Sourced from Vietnam, Uganda, India, and other renowned Robusta regions.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-accent/5"
              style={{
                width: `${300 + i * 150}px`,
                height: `${300 + i * 150}px`,
                right: `${-100 + i * 50}px`,
                top: `${-50 + i * 100}px`,
              }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 5 + i,
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
              Our Story
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mt-4 mb-6">
              The Bold Journey of{" "}
              <span className="text-gradient">Rabuste Coffee</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Born from a passion for bold flavors and creative expression, Rabuste
              Coffee is more than a café—it's a movement celebrating the underrated
              Robusta bean and the art that surrounds us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="section-padding bg-background">
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
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-8 ${
                    index % 2 === 0 ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`lg:text-right ${
                      index % 2 === 0 ? "" : "lg:col-start-2 lg:text-left"
                    }`}
                  >
                    <div
                      className={`p-8 rounded-2xl bg-card border border-border ${
                        index % 2 === 0
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

      {/* Values Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
              What We Stand For
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
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
              While the world obsesses over Arabica, we've discovered the untapped potential of Robusta—a bean that delivers unmatched intensity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  Join a Tasting Workshop
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