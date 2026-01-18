import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CardItem {
    name: string;
    desc: string;
    price: string;
    image: string;
}

export default function MobileStackedCards({ items }: { items: CardItem[] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % items.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [items.length]);

    return (
        <div className="relative h-[450px] w-full mt-0 mb-10 md:hidden flex justify-center items-end px-4">
            {items.map((item, i) => {
                // Calculate dynamic offset based on activeIndex
                // We want 3 positions:
                // 0: Front (Active)
                // 1: Middle (Next) -> appears behind active
                // 2: Back (Last) -> appears furthest behind

                let offset = (i - activeIndex + items.length) % items.length;

                // Visual properties based on offset
                // offset 0 (Front): y=0, z=30, scale=1, opacity=1
                // offset 1 (Middle): y=-30, z=20, scale=0.95, opacity=1
                // offset 2 (Back): y=-60, z=10, scale=0.9, opacity=1
                // If > 2 (shouldn't happen with 3 items), hide it.

                const isFront = offset === 0;
                const isMiddle = offset === 1;
                const isBack = offset === 2;

                // Custom variants for smooth transition
                // When activeIndex increases:
                // Old Front (offset 0) becomes Back (offset 2). 
                //   Needed animation: slide out right/fade, then reappear at back? 
                //   OR just strict z-index/y swap? A swap looks jarring.
                //   Let's simulate a "Stack" behavior.
                //   If we become offset 2 (Back) from offset 0 (Front), we are "recycling".
                //   We should probably fade out briefly or slide away.

                let animate = {
                    y: -65 * offset,
                    scale: 1 - (offset * 0.05),
                    zIndex: 30 - (offset * 10),
                    opacity: 1,
                    boxShadow: offset === 0
                        ? "0 0 20px rgba(245, 222, 179, 0.25)" // Subtle Golden-creamish glow
                        : "0 0 0px rgba(0,0,0,0)"
                };

                // If we are currently the "recycling" card (going from Front to Back), 
                // we might want a different transition or key. 
                // But simpler: just animate closely.

                // Handling the "Swipe Away" effect for the one leaving the front:
                // If this item WAS front (active-1), and IS now back? 
                // Need previous state? 
                // Let's stick to a robust layout animation where they simply reshuffle depth.
                // To make it look "stacked", the Y offset (negative) pushes them UP visually.

                // If this is the card moving from Front (0) to Back (2)
                // We want it to "fall behind" gracefully.
                // We can check if it was previously front? 
                // Actually, standard layout animation with corrected offset should slide it 'up' behind the others
                // as the others slide 'down' to the front.

                return (
                    <motion.div
                        key={item.name}
                        layout
                        animate={animate}
                        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }} // smooth ease-out-quint like curve
                        className="absolute bottom-0 w-full max-w-sm h-[400px] rounded-3xl overflow-hidden shadow-2xl origin-bottom border border-white/10"
                        style={{
                            // Fix for safari/mobile glitches with 3d
                            WebkitBackfaceVisibility: 'hidden',
                            perspective: 1000
                        }}
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="absolute inset-0 w-full h-full object-cover brightness-75"
                        />
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 ${isFront ? 'opacity-90' : 'opacity-60'}`} />

                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-2xl font-display font-bold text-white tracking-wide">{item.name}</h3>
                                <span className="bg-accent px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg font-sans">
                                    {item.price}
                                </span>
                            </div>

                            <AnimatePresence>
                                {isFront && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }} // Fast text fade
                                        className="text-gray-300 text-sm leading-relaxed overflow-hidden font-light"
                                    >
                                        {item.desc}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
