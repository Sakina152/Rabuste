import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, Heart, User, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRazorpay } from "@/hooks/useRazorpay";
import ArtistSubmissionForm from "@/components/ArtistSubmissionForm"; // <--- Import New Component

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

  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false); // <--- State for new form
  const [inquiryData, setInquiryData] = useState({
    customerName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const token = localStorage.getItem("token");

  // Razorpay Hook
  const { handlePayment, isProcessing } = useRazorpay(); // <--- 2. Use Hook

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/api/art`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Expected an array of artworks');
        }

        // Map the backend data to our frontend Artwork type
        const formattedArtworks = data.map((art: any) => ({
          _id: art._id,
          title: art.title,
          artist: art.artist,
          price: art.price,
          status: art.status,
          imageUrl: art.imageUrl,
          dimensions: art.dimensions,
          description: art.description,
          category: art.category || 'abstract'
        }));

        setArtworks(formattedArtworks);
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setError(err instanceof Error ? err.message : 'Failed to load artworks');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArt) return;

    setSubmitting(true);
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_URL}/api/art/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artId: selectedArt._id,
          ...inquiryData,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit inquiry");

      setSuccessMsg("Your inquiry has been sent. We'll get back to you soon!");
      setInquiryData({ customerName: "", email: "", phone: "", message: "" });

      setTimeout(() => {
        setShowInquiryForm(false);
      }, 1500);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[400px]">
        {/* Background Image with smooth fade */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/gallery-hero.jpg"
            alt="Gallery Hero"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Hero image failed to load");
              e.currentTarget.src = ""; // Fallback or handle accordingly
            }}
          />
          {/* Top overlay for navbar contrast and bottom overlay for smooth page transition */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
        </div>

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
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16"
          >
            <AnimatePresence mode="popLayout">
              {artworks.map((artwork, index) => (
                <motion.div
                  key={artwork._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  className="group relative"
                >
                  {/* Heavy Ornate Frame Container */}
                  <div
                    className="relative p-[14px] bg-gradient-to-br from-[#1A0F0A] via-[#8D6E63] to-[#F5F5DC] rounded-sm transform transition-all duration-500 group-hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] cursor-pointer shadow-[20px_20px_60px_rgba(0,0,0,0.6),_inset_0_2px_15px_rgba(255,255,255,0.1)] overflow-visible"
                    onClick={() => setSelectedArt(artwork)}
                  >
                    {/* Frame Interior Edge (Bevel) */}
                    <div className="absolute inset-[10px] border border-black/30 pointer-events-none" />

                    {/* Artwork Container (No matting) */}
                    <div className="relative aspect-[4/5] overflow-hidden shadow-[inset_0_4px_20px_rgba(0,0,0,0.6)] bg-espresso">
                      {artwork.imageUrl ? (
                        <img
                          src={`${API_URL}/${artwork.imageUrl.replace(/\\/g, "/")}`}
                          alt={artwork.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-espresso/40">
                          No Image
                        </div>
                      )}

                      {/* Hover glaze effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    {/* SOLD Gold Plaque (Bottom Center) */}
                    {artwork.status === "Sold" && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
                        <div className="bg-gradient-to-b from-[#91672C] via-[#B8860B] to-[#705206] px-6 py-1.5 rounded-sm border border-[#F5F5DC]/20 shadow-2xl scale-110">
                          <p className="text-[#FDFCF0] text-[12px] font-display font-black uppercase tracking-[0.4em] drop-shadow-md">
                            SOLD
                          </p>
                        </div>
                        {/* Shadow for plate */}
                        <div className="absolute -bottom-1 left-[10%] right-[10%] h-2 bg-black/40 blur-md -z-10" />
                      </div>
                    )}

                    {/* Frame Highlights/Texture details */}
                    <div className="absolute inset-0 border-t border-white/10 pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-[3px] bg-black/20 pointer-events-none" />
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
                        ₹{artwork.price.toLocaleString('en-IN')}
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
                      src={`${API_URL}/${selectedArt.imageUrl.replace(/\\/g, "/")}`}
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

                  <div className="pt-4 border-t border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-display text-3xl font-bold text-accent">
                        ₹{selectedArt.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* ACTION BUTTONS (Updated) */}
                    {selectedArt.status === "Available" ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          variant="hero"
                          size="lg"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white border-none"
                          onClick={() => handlePayment('ART', selectedArt)} // <--- 3. Call Payment Hook
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Buy Now"}
                          {!isProcessing && <ShoppingBag className="ml-2 w-4 h-4" />}
                        </Button>

                        <Button
                          variant="outline"
                          size="lg"
                          className="flex-1"
                          onClick={() => setShowInquiryForm(true)}
                        >
                          Inquire
                        </Button>
                      </div>

                    ) : (
                      <Button variant="subtle" size="lg" className="w-full bg-gray-600 text-gray-300 cursor-not-allowed" disabled>
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

      <AnimatePresence>
        {showInquiryForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowInquiryForm(false)}
          >
            <motion.form
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleInquirySubmit}
              className="w-full max-w-lg bg-card border border-border rounded-2xl p-8 space-y-5"
            >
              <h3 className="font-display text-2xl text-foreground">
                Inquire about <span className="text-accent">{selectedArt?.title}</span>
              </h3>

              <input
                required
                placeholder="Your Name"
                className="w-full bg-background border border-border rounded-lg px-4 py-2"
                value={inquiryData.customerName}
                onChange={(e) =>
                  setInquiryData({ ...inquiryData, customerName: e.target.value })
                }
              />

              <input
                required
                type="email"
                placeholder="Email Address"
                className="w-full bg-background border border-border rounded-lg px-4 py-2"
                value={inquiryData.email}
                onChange={(e) =>
                  setInquiryData({ ...inquiryData, email: e.target.value })
                }
              />

              <input
                placeholder="Phone (optional)"
                className="w-full bg-background border border-border rounded-lg px-4 py-2"
                value={inquiryData.phone}
                onChange={(e) =>
                  setInquiryData({ ...inquiryData, phone: e.target.value })
                }
              />

              <textarea
                required
                rows={4}
                placeholder="Your message"
                className="w-full bg-background border border-border rounded-lg px-4 py-2"
                value={inquiryData.message}
                onChange={(e) =>
                  setInquiryData({ ...inquiryData, message: e.target.value })
                }
              />

              {successMsg && (
                <p className="text-green-500 text-sm">{successMsg}</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  variant="hero"
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Send Inquiry"}
                </Button>

                <Button
                  type="button"
                  variant="subtle"
                  onClick={() => setShowInquiryForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Artist Feature */}
      <section className="section-padding bg-gradient-to-b from-background to-coffee-medium">
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
            <Button variant="hero" size="xl" onClick={() => setShowSubmissionForm(true)}> {/* <--- Updated Button Action */}
              Submit Your Portfolio
              <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Artist Submission Modal */}
      <ArtistSubmissionForm
        isOpen={showSubmissionForm}
        onClose={() => setShowSubmissionForm(false)}
      />

      <Footer />
    </div>
  );
};

export default Gallery;