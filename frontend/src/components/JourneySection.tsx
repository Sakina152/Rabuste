import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Images
import espressoImg from "@/assets/menu/robusta-espresso.jpg";
import cappuccinoImg from "@/assets/menu/robusta-cappuccino.jpg";
import vrCafeImg from "@/assets/vr-cafe.jpg";
import frappeImg from "@/assets/menu/robusta-frappe.jpg";

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
    {
        year: "2020",
        title: "The Spark",
        description: "A passionate coffee lover discovered the untapped potential of Robusta beans during travels through Southeast Asia, realizing that bold coffee didn't have to be bitter.",
        image: espressoImg
    },
    {
        year: "2021",
        title: "The Research",
        description: "Months of meticulous experimentation led to the perfect roasting techniques that unlock Robusta's bold, complex chocolatey notes while eliminating harshness.",
        image: cappuccinoImg
    },
    {
        year: "2022",
        title: "The Vision",
        description: "The idea of combining coffee culture with fine arts emerged. We designed a space that serves as both a caffeine sanctuary and a gallery for local creators.",
        image: vrCafeImg
    },
    {
        year: "2023",
        title: "Rabuste Is Born",
        description: "The first Rabuste Coffee café opened its doors, blending bold Robusta coffee, art galleries, and community workshops into a unique grab-and-go experience.",
        image: frappeImg
    },
];

const JourneySection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const mobileLineRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const path = pathRef.current;
            const section = sectionRef.current;
            const mobileLine = mobileLineRef.current;

            if (!section) return;

            // Desktop Animation
            if (path) {
                const length = path.getTotalLength();
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top center",
                        end: "bottom bottom",
                        scrub: 1,
                    }
                });

                tl.to(path, {
                    strokeDashoffset: 0,
                    ease: "none"
                });
            }

            // Mobile Animation
            if (mobileLine) {
                gsap.fromTo(mobileLine,
                    { height: "0%" },
                    {
                        height: "100%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            start: "top center",
                            end: "bottom bottom",
                            scrub: 1
                        }
                    }
                );
            }

            // Item Animation
            const items = gsap.utils.toArray<HTMLElement>('.timeline-item');
            items.forEach((item, i) => {
                gsap.fromTo(item,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 md:py-32 bg-background relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="container-custom relative z-10 px-6">
                <div className="text-center mb-12 md:mb-20">
                    <span className="text-accent text-sm tracking-[0.3em] uppercase font-body font-semibold">
                        Our Journey
                    </span>
                    <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mt-4 tracking-tight">
                        How It All Started
                    </h2>
                </div>

                <div className="relative max-w-5xl mx-auto min-h-[1800px]">
                    {/* Curvy Line SVG (Desktop) */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block">
                        <svg ref={svgRef} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#D35400" /> {/* Accent */}
                                    <stop offset="50%" stopColor="#A05532" /> {/* Terracotta */}
                                    <stop offset="100%" stopColor="#D35400" />
                                </linearGradient>
                            </defs>
                            <path
                                ref={pathRef}
                                d="M 512 0 
                                   C 512 112, 250 112, 250 225 
                                   C 250 338, 512 338, 512 450 
                                   C 512 562, 924 562, 924 675 
                                   C 924 788, 512 788, 512 900
                                   C 512 1012, 100 1012, 100 1125
                                   C 100 1238, 512 1238, 512 1350
                                   C 512 1462, 924 1462, 924 1575
                                   C 924 1688, 512 1688, 512 1800"
                                fill="none"
                                stroke="url(#line-gradient)"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {/* Straight Glowing Line (Mobile) */}
                    <div className="absolute top-0 left-[2px] w-[2px] h-full pointer-events-none md:hidden z-0">
                        {/* Background guide line */}
                        <div className="absolute top-0 left-0 w-full h-full bg-border/20" />
                        {/* Animated Glowing Line */}
                        <div
                            ref={mobileLineRef}
                            className="absolute top-0 left-0 w-full bg-gradient-to-b from-accent to-terracotta shadow-[0_0_15px_rgba(211,84,0,0.6)]"
                        />
                    </div>

                    {/* Timeline Items */}
                    <div className="relative pl-6 md:pl-0">
                        {timelineData.map((item, index) => {
                            const isLeftCurve = index % 2 === 0;

                            // Absolute positioning for desktop
                            const topPosition = 225 + (index * 450);

                            const desktopStyle = window.innerWidth >= 768 ? {
                                top: `${topPosition}px`,
                                left: 0,
                                width: '100%',
                                position: 'absolute' as const,
                                transform: 'translateY(-50%)'
                            } : {};

                            // Special spacing for first curve (Index 0) which is narrower
                            const yearPaddingLeft = index === 0 ? "md:pl-[240px]" : "md:pl-[60px]";

                            return (
                                <div key={item.year} className="timeline-item relative md:absolute w-full mb-16 md:mb-0" style={desktopStyle}>
                                    <div className={cn(
                                        "flex flex-col md:flex-row items-center w-full",
                                        isLeftCurve ? "md:flex-row" : "md:flex-row-reverse"
                                    )}>

                                        {/* GLOWING DOT / CONNECTOR NODE */}
                                        {/* Desktop Position: Based on SVG Path Peaks (250/1024 ~ 24.4%, 924/1024 ~ 90.2%) */}
                                        {/* Mobile Position: On the left line */}
                                        <div
                                            className={cn(
                                                "absolute w-4 h-4 rounded-full bg-accent z-20 shadow-[0_0_20px_rgba(211,84,0,1)] ring-4 ring-background",
                                                // Mobile: Left aligned on the straight line (approx 1px left of the 2px line to center)
                                                "left-[-5px] top-0 md:top-1/2 md:-translate-y-1/2",
                                                // Desktop: Position based on curve
                                                index % 2 === 0
                                                    ? "md:left-[24.4%] md:translate-x-[-50%]" // Left Curve Peak
                                                    : "md:left-[90.2%] md:translate-x-[-50%]" // Right Curve Peak
                                            )}
                                        >
                                            <div className="absolute inset-0 rounded-full animate-ping bg-accent opacity-75 duration-3000" />
                                        </div>

                                        {/* Year Section - ON THE CURVE */}
                                        <div className={cn(
                                            "relative md:w-1/2 flex md:hidden lg:flex",
                                            isLeftCurve ? `justify-start ${yearPaddingLeft}` : "justify-end md:pr-[60px]"
                                        )}>
                                            {/* Year Text placed near the curve peak */}
                                            <span className="text-[100px] md:text-[140px] font-display font-bold text-accent/20 leading-none select-none">
                                                {item.year}
                                            </span>
                                        </div>

                                        {/* Card Section - OPPOSITE TO CURVE */}
                                        <div className={cn(
                                            "w-full md:w-1/2 px-2 md:px-12",
                                        )}>
                                            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-card hover:shadow-glow transition-all duration-500 group">
                                                <div className="h-56 w-full overflow-hidden relative">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    {/* Mobile Year Badge */}
                                                    <div className="absolute bottom-4 left-4 z-20 md:hidden">
                                                        <span className="inline-block px-3 py-1 rounded-full bg-accent text-white font-display text-sm font-bold shadow-lg">
                                                            {item.year}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-6 md:p-8">
                                                    <h3 className="text-2xl font-display font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JourneySection;
