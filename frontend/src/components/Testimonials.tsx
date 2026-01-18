import React from 'react';
import { motion } from 'framer-motion';
import { Star, Check, Quote } from 'lucide-react';

// Mock Data as requested
const reviewsData = [
    {
        id: 1,
        name: "Harsh Tanawala",
        date: "3 months ago",
        rating: 5,
        text: "A great spot with a unique coffee! I recently visited Coffee Cafe and really enjoyed my experience. I tried the ROBCO house Special, which was unlike anything I've had before—it was smooth, rich, and had a delightful aftertaste that truly stood out.",
        image: "https://lh3.googleusercontent.com/a-/ALV-UjUGLsMtSIbTSBsmbMLhPc3CXmGmM2-6vzEww0IlQmjCKRQQdxCDCg=s64-c-rp-mo-ba2-br100",
    },
    {
        id: 2,
        name: "Krutarth Joshi",
        date: "2 months ago",
        rating: 5,
        text: "The best of the best bold robusta cappuccino. Surat city's best cappuccino you can get here. If you are real coffee lover and looking for some really good coffee then must visit Rabuste Coffee.",
        image: "https://lh3.googleusercontent.com/a-/ALV-UjWKm_P8pxZEwlEaKat-OhNFKsumJRK8NF9hWJDlOtKkXrv7RtGlEA=s64-c-rp-mo-ba5-br100",
    },
    {
        id: 3,
        name: "Viren Sanghavi",
        date: "1 year ago",
        rating: 5,
        text: "Rabuste Coffee offers a solid experience with their Red Bull espresso, which I found to be both good and decently priced. The service is impressively fast, and the ambiance adds to the appeal. The coffee was freshly brewed, delivering a clean and crisp taste.",
        image: "https://lh3.googleusercontent.com/a-/ALV-UjW676Bg3N1aiIP7Eq085J4uXM2AAuofetrFlWUh1cpsBPqdC_RG=s64-c-rp-mo-ba5-br100",
    },
    {
        id: 4,
        name: "VIVEK MISHRA",
        date: "4 months ago",
        rating: 5,
        text: "Its nice and cozy…. If you like dark roast coffee this is the place. The staff is very good, coffee on spot, and siders are also good, liked the desert too, i mostly visit here and i like the place.",
        image: "https://lh3.googleusercontent.com/a-/ALV-UjWshFNwZQqamz1UFvforoLXTl9q1ckal-1PvQSu45BdBjXvMYHE5A=s64-c-rp-mo-ba3-br100",
    },
    {
        id: 5,
        name: "Tiya Sukhrani",
        date: "4 months ago",
        rating: 5,
        text: "I’d like to share my experience visiting here, the staff is very good, coffee on spot, and siders are also good, liked the desert too, i mostly visit here and i like the place, good for people who work from cafe. MUST VISIT!!",
        image: "https://lh3.googleusercontent.com/a-/ALV-UjVFgb_Vmegl7zODhZ2eZIcZ9I-wO_f2S4zg6tgwzhmV2yiWzfxP=s64-c-rp-mo-br100",
    }
];

const ReviewCard = ({ review }: { review: typeof reviewsData[0] }) => {
    return (
        <div className="w-[400px] flex-shrink-0 bg-[#281b15] rounded-2xl p-6 mx-4 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300 border border-white/5">
            {/* Decorative Quote Icon */}
            <div className="absolute top-4 right-4 text-white/5">
                <Quote size={48} fill="currentColor" />
            </div>

            <div className="flex flex-col h-full justify-between gap-4 relative z-10">
                <div className="space-y-4">
                    {/* Stars & Date */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className="fill-[#FFB800] text-[#FFB800]" />
                            ))}
                        </div>
                        <span className="text-white/40 text-xs font-medium">{review.date}</span>
                    </div>

                    {/* Review Text */}
                    <p className="text-white/90 text-sm leading-relaxed line-clamp-4">
                        "{review.text}"
                    </p>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex items-center justify-center text-white font-bold shrink-0">
                        {review.image ? (
                            <img src={review.image} alt={review.name} className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
                        ) : null}
                        <span className={`${review.image ? 'hidden' : ''}`}>{review.name.charAt(0)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-semibold text-sm">{review.name}</span>
                        <div className="flex items-center gap-1 text-[#4CAF50]">
                            <div className="bg-[#4CAF50] rounded-full p-[2px]">
                                <Check size={8} className="text-black stroke-[4]" />
                            </div>
                            <span className="text-[10px] font-medium tracking-wide text-white/60">Verified Google Reviewer</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Testimonials = () => {
    // Duplicate data to create seamless infinite loop aspect
    const marqueeData = [...reviewsData, ...reviewsData, ...reviewsData];

    return (
        <section className="py-20 bg-background overflow-hidden relative">
            <div className="container-custom px-6 mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-accent text-sm tracking-[0.3em] uppercase font-body mb-2 block">
                        Community Love
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                        What Our Customers Say
                    </h2>
                </motion.div>
            </div>

            <div className="relative w-full overflow-hidden">
                {/* Gradient Masks for smooth fade out at edges */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

                {/* Marquee Container */}
                <div className="flex w-max hover:[animation-play-state:paused] animate-marquee"
                    style={{ animation: 'marquee 60s linear infinite' }}
                >
                    {marqueeData.map((review, index) => (
                        <ReviewCard key={`${review.id}-${index}`} review={review} />
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } 
          /* We move -50% because we tripled the data, but effectively we just need to move enough for the loop. 
             Actually, 33.33% would be one full set. 
             Better approach for perfect loop:
             If we have 2 sets of data, we move -50%.
             If we have 3, we move -33.33%? 
             Let's stick to a simpler standard marquee CSS approach or Framer Motion for precision.
             
             Let's use a dual-container approach for smoother CSS loops without complex calculations.
           */
        }
      `}</style>

            {/* 
        Better CSS Marquee implementation:
        We will render two identical rows.
      */}
        </section>
    );
};

// Refined Infinite Scroll Implementation using Framer Motion or pure CSS
// Let's go with a pure CSS approach that is robust.
// Re-writing the return to use a marquee helper.

const TestimonialsFinal = () => {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container-custom px-6 mb-12 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-accent text-sm tracking-[0.3em] uppercase font-body mb-3 block">
                        Testimonials
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                        What Our Customers Say
                    </h2>
                </motion.div>
            </div>

            <div className="relative w-full">
                {/* Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

                {/* Marquee Track */}
                <div className="flex overflow-hidden group">
                    {/* First Copy */}
                    <div className="flex animate-loop-scroll group-hover:paused gap-6 py-4 px-3">
                        {reviewsData.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                        {/* Provide enough duplicates to fill screen if list is short, or just repeat list */}
                        {reviewsData.map((review) => (
                            <ReviewCard key={`dup-${review.id}`} review={review} />
                        ))}
                    </div>
                    {/* Second Copy for seamless loop (aria-hidden) */}
                    <div className="flex animate-loop-scroll group-hover:paused gap-6 py-4 px-3" aria-hidden="true">
                        {reviewsData.map((review) => (
                            <ReviewCard key={`${review.id}- copy`} review={review} />
                        ))}
                        {reviewsData.map((review) => (
                            <ReviewCard key={`dup-${review.id}-copy`} review={review} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Powered by Google Footer */}
            <div className="text-center mt-8 pb-4 opacity-70 hover:opacity-100 transition-opacity duration-500">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium flex items-center justify-center gap-2">
                    powered by
                    <span className="text-sm font-bold tracking-tighter normal-case flex items-center drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                        <span className="text-[#4285F4]">G</span>
                        <span className="text-[#DB4437]">o</span>
                        <span className="text-[#F4B400]">o</span>
                        <span className="text-[#4285F4]">g</span>
                        <span className="text-[#0F9D58]">l</span>
                        <span className="text-[#DB4437]">e</span>
                    </span>
                </span>
            </div>
        </section>
    );
};

export default TestimonialsFinal;
