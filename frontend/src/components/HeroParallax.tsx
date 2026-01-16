import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, MoveDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import heroBg from "@/assets/vr-cafe.jpg";

const HeroParallax = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={ref} className="relative h-screen w-full overflow-hidden bg-black grid place-items-center">
            {/* Parallax Background */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: backgroundY }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
                <img
                    src={heroBg}
                    alt="Hero Background"
                    className="w-full h-full object-cover scale-110"
                />
            </motion.div>

            {/* Main Content */}
            <motion.div
                className="relative z-20 container-custom text-center px-6"
                style={{ y: textY, opacity }}
            >
                <div className="mb-6 flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "backOut" }}
                        className="rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-4 py-1.5 text-sm text-accent font-medium uppercase tracking-widest"
                    >
                        Welcome to the Future
                    </motion.div>
                </div>

                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-none tracking-tight mb-8"
                >
                    RABUSTE <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-500">
                        COFFEE
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="text-lg md:text-2xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
                >
                    Where bold flavors meet immersive technology. <br className="hidden md:block" />
                    Experience coffee like never before.
                </motion.p>

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button variant="hero" size="xl" className="h-16 px-10 text-lg rounded-full" asChild>
                        <Link to="/menu">
                            Order Now
                        </Link>
                    </Button>
                    <Button variant="outline" size="xl" className="h-16 px-10 text-lg rounded-full border-white/20 text-white hover:bg-white/10" asChild>
                        <Link to="/virtual-tour" className="flex items-center gap-2">
                            Virtual Tour <ArrowRight className="w-5 h-5" />
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 z-20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <MoveDown className="w-5 h-5" />
            </motion.div>
        </div>
    );
};

export default HeroParallax;
