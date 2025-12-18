import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, Heart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Artwork {
  id: number;
  title: string;
  artist: string;
  description: string;
  price: string;
  status: "available" | "sold";
  category: string;
}

const Gallery = () => {
  const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);

  const artworks: Artwork[] = [
    {
      id: 1,
      title: "Morning Brew",
      artist: "Elena Martinez",
      description:
        "An abstract representation of the first sip of coffee, capturing the warmth and awakening of morning rituals.",
      price: "$1,200",
      status: "available",
      category: "abstract",
    },
    {
      id: 2,
      title: "Coffee Fields at Dusk",
      artist: "Marcus Chen",
      description:
        "A stunning landscape depicting coffee plantations in Vietnam as the sun sets behind the mountains.",
      price: "$2,400",
      status: "available",
      category: "landscape",
    },
    {
      id: 3,
      title: "The Barista's Dance",
      artist: "Sofia Anderson",
      description:
        "A dynamic portrait capturing the artistry and precision of coffee making in fluid brush strokes.",
      price: "$1,800",
      status: "sold",
      category: "portrait",
    },
    {
      id: 4,
      title: "Robusta Rising",
      artist: "James Okonkwo",
      description:
        "A bold mixed-media piece celebrating the underrated Robusta bean in vibrant earth tones.",
      price: "$3,200",
      status: "available",
      category: "abstract",
    },
    {
      id: 5,
      title: "Café Conversations",
      artist: "Luna Park",
      description:
        "An intimate scene of strangers connecting over coffee, rendered in warm impressionistic style.",
      price: "$1,600",
      status: "available",
      category: "portrait",
    },
    {
      id: 6,
      title: "Bean to Cup",
      artist: "Alessandro Rossi",
      description:
        "A series of connected canvases showing the journey of coffee from harvest to your cup.",
      price: "$4,500",
      status: "available",
      category: "landscape",
    },
  ];

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
              Micro Art Gallery
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mt-4 mb-6">
              Where Coffee Meets{" "}
              <span className="text-gradient">Fine Art</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Our café doubles as a curated gallery showcasing emerging and
              established artists. Each piece is available for purchase, bringing
              bold creativity into your home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {artworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative"
                >
                  <div
                    className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-coffee-medium to-espresso overflow-hidden cursor-pointer border border-border hover:border-accent/50 transition-all duration-500"
                    onClick={() => setSelectedArt(artwork)}
                  >
                    {/* Placeholder Art Pattern */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full p-8">
                        <div
                          className={`w-full h-full rounded-lg ${
                            artwork.category === "abstract"
                              ? "bg-gradient-to-br from-accent/30 via-coffee-light to-terracotta/20"
                              : artwork.category === "landscape"
                              ? "bg-gradient-to-b from-coffee-light/50 via-coffee-medium to-espresso"
                              : "bg-gradient-to-tr from-cream/10 via-coffee-medium to-accent/20"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-espresso/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Eye className="w-12 h-12 text-accent" />
                    </div>

                    {/* Status Badge */}
                    {artwork.status === "sold" && (
                      <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-medium">
                        Sold
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mt-4 space-y-2">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {artwork.title}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <User size={14} />
                      <span>{artwork.artist}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xl font-bold text-accent">
                        {artwork.price}
                      </span>
                      {artwork.status === "available" && (
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-accent transition-colors text-sm">
                          <Heart size={14} />
                          <span>Save</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Art Modal */}
      <AnimatePresence>
        {selectedArt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedArt(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full bg-card rounded-2xl overflow-hidden border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                {/* Art Preview */}
                <div className="aspect-square bg-gradient-to-br from-coffee-medium to-espresso p-8">
                  <div
                    className={`w-full h-full rounded-lg ${
                      selectedArt.category === "abstract"
                        ? "bg-gradient-to-br from-accent/30 via-coffee-light to-terracotta/20"
                        : selectedArt.category === "landscape"
                        ? "bg-gradient-to-b from-coffee-light/50 via-coffee-medium to-espresso"
                        : "bg-gradient-to-tr from-cream/10 via-coffee-medium to-accent/20"
                    }`}
                  />
                </div>

                {/* Details */}
                <div className="p-8 space-y-6">
                  <button
                    onClick={() => setSelectedArt(null)}
                    className="absolute top-4 right-4 md:relative md:top-0 md:right-0 md:float-right p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={24} />
                  </button>

                  <div>
                    <span className="text-accent text-sm tracking-wider uppercase">
                      {selectedArt.category}
                    </span>
                    <h2 className="font-display text-3xl font-bold text-foreground mt-2">
                      {selectedArt.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        {selectedArt.artist}
                      </p>
                      <p className="text-muted-foreground text-sm">Artist</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {selectedArt.description}
                  </p>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-display text-3xl font-bold text-accent">
                        {selectedArt.price}
                      </span>
                    </div>

                    {selectedArt.status === "available" ? (
                      <Button variant="hero" size="lg" className="w-full">
                        Inquire About This Piece
                        <ArrowRight className="ml-2" />
                      </Button>
                    ) : (
                      <Button variant="subtle" size="lg" className="w-full" disabled>
                        This Piece Has Been Sold
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Artist Feature */}
      <section className="section-padding bg-coffee-dark">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
              For Artists
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Showcase Your Art at Rabuste
            </h2>
            <p className="text-muted-foreground text-lg">
              We're always looking for emerging and established artists to feature
              in our café gallery. If you're interested in showcasing your work,
              we'd love to hear from you.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/franchise">
                Submit Your Portfolio
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;