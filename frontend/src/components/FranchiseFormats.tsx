import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// Format Data
const formats = [
  {
    id: "express",
    title: "Express Counter",
    size: "200–500 SQ FT",
    tagline: "Efficient. Compact. High-Return.",
    description: "Designed for malls, tech parks, and high-footfall locations. Lower investment, streamlined operations, and fast turnaround.",
    image: "/franchise_1.png",
    recommended: true,
    features: ["Low Capex", "High Footfall", "Quick Service"]
  },
  {
    id: "premium",
    title: "Premium Destination",
    size: "800+ SQ FT",
    tagline: "The complete Rabuste experience.",
    description: "A full-scale café and community hub featuring our complete food and beverage menu, built for brand presence and long stays.",
    image: "/images/gallery-hero.jpg",
    recommended: false,
    features: ["Full Menu", "Community Hub", "Brand Flagship"]
  }
];

const FranchiseFormats = () => {
  return (
    <section className="py-20 px-4 md:px-8 bg-[#221813] relative overflow-hidden font-sans">
      {/* Background Ambience: Subtle vignettes and noise */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] opacity-80 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />

      <div className="max-w-md mx-auto md:max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <span className="text-[#9F6637] uppercase tracking-widest text-xs font-bold mb-2 block">Investment Format Options</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-[#9F6637]">Format</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
            Select the model that fits your investment goals and location strategy.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {formats.map((format) => (
            <motion.div
              key={format.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`bg-[#18181B] rounded-3xl overflow-hidden border transition-all duration-300 group hover:shadow-2xl hover:shadow-[#9F6637]/10 ${
                format.recommended ? "border-[#9F6637] ring-1 ring-[#9F6637]/20 relative" : "border-white/5 hover:border-[#9F6637]/50"
              }`}
            >
              {format.recommended && (
                <div className="absolute top-4 right-4 z-20 bg-[#9F6637] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  Recommended
                </div>
              )}

              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181B] to-transparent z-10 opacity-80" />
                <img 
                  src={format.image} 
                  alt={format.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                />
              </div>

              {/* Content */}
              <div className="p-6 relative pt-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-2xl font-bold text-white">{format.title}</h3>
                </div>
                
                <div className="text-right absolute top-0 right-6 -mt-8 z-20">
                    <span className="bg-[#27272A] text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 shadow-sm backdrop-blur-md">
                        {format.size}
                    </span>
                </div>

                <p className={`text-sm font-medium mb-4 italic ${format.recommended ? "text-[#9F6637]" : "text-gray-400"}`}>
                  {format.tagline}
                </p>

                <p className="text-gray-400 text-sm leading-relaxed mb-6 border-b border-white/5 pb-6">
                  {format.description}
                </p>

                <div className="space-y-3 mb-8">
                    {format.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#9F6637]" />
                            <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                    ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Smooth Gradient Faint at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#1a110d] opacity-80 pointer-events-none" />
    </section>
  );
};

export default FranchiseFormats;
