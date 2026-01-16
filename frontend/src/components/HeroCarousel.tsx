import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import vrImage from "@/assets/vr-cafe.jpg";
import frappeImg from "@/assets/menu/robusta-frappe.jpg";
import cappuccinoImg from "@/assets/menu/robusta-cappuccino.jpg";
import americanoImg from "@/assets/menu/robusta-iced-americano.jpg";

const slides = [
    {
        id: 1,
        image: vrImage,
        title: "Experience the Future of Coffee",
        subtitle: "Immersive VR tours & bold flavors",
        cta: "Take Virtual Tour",
        link: "/virtual-tour"
    },
    {
        id: 2,
        image: frappeImg,
        title: "Bold Robusta Blends",
        subtitle: "Awaken your senses with our signature roasts",
        cta: "View Menu",
        link: "/menu"
    },
    {
        id: 3,
        image: cappuccinoImg,
        title: "Artistry in Every Cup",
        subtitle: "Where fine art meets premium coffee",
        cta: "Visit Gallery",
        link: "/gallery"
    }
];

const HeroCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);

        // Auto-advance
        const interval = setInterval(() => {
            if (emblaApi.canScrollNext()) {
                emblaApi.scrollNext();
            } else {
                emblaApi.scrollTo(0);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [emblaApi, onSelect]);

    const scrollTo = useCallback(
        (index: number) => emblaApi && emblaApi.scrollTo(index),
        [emblaApi]
    );

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            <div className="absolute inset-0 z-0" ref={emblaRef}>
                <div className="flex h-full">
                    {slides.map((slide, index) => (
                        <div className="relative min-w-full h-full flex-[0_0_100%]" key={slide.id}>
                            {/* Background Image with Zoom Effect */}
                            <div className="absolute inset-0 overflow-hidden">
                                <motion.img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover opacity-60"
                                    initial={{ scale: 1 }}
                                    animate={{ scale: selectedIndex === index ? 1.1 : 1 }}
                                    transition={{ duration: 6, ease: "linear" }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/30" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 container-custom h-full flex flex-col justify-center px-6">
                                <AnimatePresence mode="wait">
                                    {selectedIndex === index && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                            className="max-w-3xl space-y-6"
                                        >
                                            <motion.span
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 }}
                                                className="inline-block text-accent font-medium tracking-[0.3em] uppercase backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full border border-white/10"
                                            >
                                                Rabuste Speciality Coffee
                                            </motion.span>

                                            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1]">
                                                {slide.title.split(' ').map((word, i) => (
                                                    <span key={i} className="inline-block mr-4">
                                                        {word === "Coffee" || word === "Robusta" || word === "Art" ? (
                                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-200">
                                                                {word}
                                                            </span>
                                                        ) : (
                                                            word
                                                        )}
                                                    </span>
                                                ))}
                                            </h1>

                                            <p className="text-xl md:text-2xl text-gray-200 max-w-xl leading-relaxed font-light">
                                                {slide.subtitle}
                                            </p>

                                            <div className="flex flex-wrap gap-4 pt-4">
                                                <Button size="xl" variant="hero" asChild className="text-lg px-8 py-6">
                                                    <Link to={slide.link}>
                                                        {slide.cta}
                                                        <ArrowRight className="ml-2 w-5 h-5" />
                                                    </Link>
                                                </Button>
                                                <Button size="xl" variant="outline" className="text-lg px-8 py-6 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md">
                                                    <Link to="/about">Our Story</Link>
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`w-16 h-1 rounded-full transition-all duration-300 ${selectedIndex === index ? "bg-accent scale-105" : "bg-white/30 hover:bg-white/50"
                            }`}
                    />
                ))}
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 right-12 z-20 flex flex-col items-center gap-2 hidden md:flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <span className="text-xs text-white/50 tracking-widest uppercase rotate-90 origin-right translate-x-2">Scroll</span>
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent relative overflow-hidden">
                    <motion.div
                        className="absolute top-0 w-full h-1/2 bg-accent"
                        animate={{ top: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default HeroCarousel;
