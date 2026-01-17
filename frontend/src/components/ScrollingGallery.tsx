import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, Loader2, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Artwork {
    _id: string;
    title: string;
    artist: string;
    image?: string;
}

const ScrollingGallery = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    // Fetch Artworks
    useEffect(() => {
        const fetchArt = async () => {
            try {
                const res = await fetch(`${API_URL}/api/art`);
                if (res.ok) {
                    const data = await res.json();
                    // Take first 6 for the preview
                    setArtworks(Array.isArray(data) ? data.slice(0, 3) : []);
                }
            } catch (err) {
                console.error("Failed to fetch art for preview", err);
            } finally {
                setLoading(false);
            }
        };
        fetchArt();
    }, []);

    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Smooth scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const x = useTransform(smoothProgress, [0, 1], ["0%", "-75%"]);

    return (
        <section ref={targetRef} className={`relative bg-zinc-950 ${isMobile ? 'h-auto py-20' : 'h-[400vh]'}`}>
            <div className={isMobile ? "overflow-x-auto py-8 no-scrollbar" : "sticky top-0 flex h-screen items-center overflow-hidden"}>

                {/* Dynamic Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/30 via-zinc-950 to-zinc-950 z-0 pointer-events-none" />

                {/* Floating Abstract Elements */}
                <motion.div
                    className="absolute top-20 right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />

                {/* Main Scrolling Track */}
                <motion.div
                    style={{ x: isMobile ? 0 : x }}
                    className={`flex items-center z-10 w-max ${isMobile ? 'gap-6 px-6' : 'gap-16 px-12 md:px-24'}`}
                >

                    {/* Intro Card */}
                    <div className={`flex-shrink-0 px-8 ${isMobile ? 'w-[85vw]' : 'w-[80vw] md:w-[600px]'}`}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <span className="inline-block p-3 mb-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-accent">
                                <Palette size={32} />
                            </span>
                            <h2 className="text-4xl md:text-8xl font-black text-white leading-[0.9] mb-6 md:mb-8">
                                THE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">
                                    GALLERY
                                </span>
                            </h2>
                            <p className="text-base md:text-2xl text-zinc-400 max-w-md leading-relaxed">
                                A digital storefront for our tangible masterpieces. Discover, admire, and acquire
                                art directly from our café walls.
                            </p>
                            <div className="mt-12 flex gap-4">
                                <Button variant="hero" size="xl" asChild>
                                    <Link to="/gallery">Enter Gallery <ArrowUpRight className="ml-2" /></Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Gallery Items */}
                    {loading ? (
                        <div className="w-[300px] flex items-center justify-center text-white/50 gap-2">
                            <Loader2 className="animate-spin" /> Loading...
                        </div>
                    ) : artworks.length > 0 ? (
                        artworks.map((item, index) => (
                            <ArtCard key={item._id} item={item} index={index} API_URL={API_URL} />
                        ))
                    ) : (
                        // Fallback if no art found
                        <div className="w-[400px] text-zinc-500 italic">No artworks currently on display.</div>
                    )}

                    {/* Final Call to Action */}
                    <div className={`flex-shrink-0 flex items-center justify-center ${isMobile ? 'w-[300px] ml-6' : 'w-[600px] ml-12'}`}>
                        <Link to="/gallery" className="group relative flex flex-col items-center justify-center text-center">
                            <motion.div
                                className="w-40 h-40 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all duration-500"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <ArrowUpRight className="w-16 h-16 text-white group-hover:scale-125 transition-transform" />
                            </motion.div>
                            <h3 className="text-4xl font-bold text-white mt-8 group-hover:text-accent transition-colors">View All Artwork</h3>
                        </Link>
                    </div>

                </motion.div>
            </div>
        </section>
    );
};

const ArtCard = ({ item, index, API_URL }: { item: Artwork, index: number, API_URL: string }) => {
    return (
        <motion.div
            className="group relative h-[50vh] md:h-[60vh] w-[35vh] md:w-[60vh] flex-shrink-0 cursor-pointer perspective-1000"
            whileHover={{ scale: 1.05, rotateY: 5, zIndex: 50 }}
            transition={{ duration: 0.4 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl transform -rotate-2 scale-105 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />

            <div className="relative h-full w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
                {item.image ? (
                    <img
                        src={`${API_URL}/${item.image.replace(/\\/g, "/")}`}
                        alt={item.title}
                        className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-zinc-800">
                        <Palette className="text-zinc-700 w-20 h-20" />
                    </div>
                )}

                {/* Overlay Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-left">
                    <h4 className="text-2xl md:text-3xl font-bold text-white mb-1 leading-tight">{item.title}</h4>
                    <p className="text-accent font-medium text-base md:text-lg">{item.artist}</p>
                </div>

                {/* Index Number */}
                <div className="absolute top-6 right-6 font-display text-4xl font-bold text-white/10 group-hover:text-white/30 transition-colors">
                    0{index + 1}
                </div>
            </div>
        </motion.div>
    );
}

export default ScrollingGallery;
