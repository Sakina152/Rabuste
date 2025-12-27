import { useState } from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, Heart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Artwork {
  _id: string;
  title: string;
  artist: string;
  price: number;
  status: "Available" | "Reserved" | "Sold";
  imageUrl?: string;
  dimensions?: string;
  description?: string;
  category?: "abstract" | "landscape" | "portrait";
}


const Gallery = () => {
  const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchArtworks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/art`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch artworks");
      }

      const rawData = await res.json();

      const adaptedData = rawData.map((art: any) => ({
      ...art,
        category: "abstract", // temp default
        description: "Beautiful coffee-inspired artwork",
      }));

      setArtworks(adaptedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchArtworks();
}, []);

  

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-hero-gradient">
        <div className="container-custom relative z-10 px-6">

          {loading && (
  <p className="text-center text-muted-foreground">
    Loading artwork...
  </p>
)}

  {error && (
  <p className="text-center text-red-500">
    {error}
  </p>
)}
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
                  key={artwork._id}
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
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-border hover:border-accent/50 transition-all duration-500 cursor-pointer">
  {artwork.imageUrl ? (
    <img
      src={artwork.imageUrl}
      alt={artwork.title}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-coffee-medium to-espresso flex items-center justify-center">
      <span className="text-muted-foreground text-sm">
        No Image
      </span>
    </div>
  )}

  {/* Hover overlay */}
  <div className="absolute inset-0 bg-espresso/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
    <Eye className="w-12 h-12 text-accent" />
  </div>

  {/* Status badge */}
  {artwork.status === "Sold" && (
    <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-medium">
      Sold
    </div>
  )}
</div>
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
                      {artwork.status === "Available" && (
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
              <div className="aspect-square overflow-hidden">
              {selectedArt.imageUrl ? (
              <img
                src={selectedArt.imageUrl}
                alt={selectedArt.title}
                className="w-full h-full object-cover"
              />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-coffee-medium to-espresso flex items-center justify-center">
                <span className="text-muted-foreground text-sm">
                No Image
                </span>
                </div>
              )}
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

                    {selectedArt.status === "Available" ? (
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