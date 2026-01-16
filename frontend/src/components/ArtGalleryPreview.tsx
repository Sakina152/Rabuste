import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Eye, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Using placeholder data since we might not have dynamic art data immediately available
// ideally this would fetch from the API
const artworks = [
    {
        id: 1,
        title: "Abstract Mornings",
        artist: "Jane Doe",
        color: "bg-[#2A2A2A]",
        aspect: "aspect-[3/4]"
    },
    {
        id: 2,
        title: "Coffee Stain Theory",
        artist: "John Smith",
        color: "bg-[#1F1F1F]",
        aspect: "aspect-square"
    },
    {
        id: 3,
        title: "Urban Solitude",
        artist: "Alex Ray",
        color: "bg-[#333333]",
        aspect: "aspect-[4/3]"
    },
    {
        id: 4,
        title: "Golden Hour",
        artist: "Sarah Lee",
        color: "bg-[#222222]",
        aspect: "aspect-[3/4]"
    }
];

const ArtGalleryPreview = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    // Disabled horizontal scroll transform for now to ensure simpler layout first, 
    // can re-enable for a more complex 'pin' effect if requested.
    // const { scrollYProgress } = useScroll({ target: containerRef });
    // const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

    return (
        <section className="py-24 bg-zinc-950 text-white overflow-hidden relative" ref={containerRef}>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="container-custom relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="p-2 bg-accent/10 rounded-lg text-accent">
                                <Palette size={20} />
                            </span>
                            <span className="text-accent uppercase tracking-widest text-sm font-semibold">The Gallery</span>
                        </div>
                        <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
                            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-accent">Masterpieces</span>
                        </h2>
                        <p className="text-zinc-400 mt-4 max-w-lg text-lg">
                            Discover local talent showcased on our walls. Rotate exhibitions featuring painting, photography, and digital art.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Button variant="outline" size="lg" className="border-zinc-700 hover:bg-accent hover:border-accent text-white" asChild>
                            <Link to="/gallery">
                                View All Collection
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* Gallery Grid/Scroll */}
                <div className="grid md:grid-cols-4 gap-6">
                    {artworks.map((art, i) => (
                        <motion.div
                            key={art.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`relative group cursor-pointer ${art.color} rounded-xl overflow-hidden shadow-xl border border-white/5`}
                        >
                            {/* Art Placeholder */}
                            <div className={`${art.aspect} w-full relative`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />

                                {/* Simulated Art Content */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-zinc-700 font-display text-6xl opacity-20 select-none">ART</span>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-center">
                                        <h3 className="text-white font-bold text-xl">{art.title}</h3>
                                        <p className="text-white/80 text-sm mb-4">by {art.artist}</p>
                                        <div className="inline-flex items-center gap-2 border border-white/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-accent transition-colors">
                                            <Eye size={16} /> View Details
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ArtGalleryPreview;
