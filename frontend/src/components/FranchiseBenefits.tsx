import { motion } from "framer-motion";

const features = [
  {
    title: "Unique Concept",
    description: "A differentiated café model focusing exclusively on premium Rabusta coffee.",
    accent: "Stand out in a crowded market."
  },
  {
    title: "Art Integration",
    description: "Built-in revenue streams through curated art sales and gallery partnerships.",
    accent: "Creative revenue."
  },
  {
    title: "Scalable Model",
    description: "Compact footprint designed for efficient operations and rapid expansion.",
    accent: "Grow with confidence."
  },
  {
    title: "Community Focus",
    description: "Workshops and programs that build loyal communities and recurring revenue.",
    accent: "Loyalty built-in."
  },
  {
    title: "Full Support",
    description: "Comprehensive training, marketing assistance, and operational guidance.",
    accent: "We've got your back."
  },
  {
    title: "Tech-Enabled",
    description: "AI-enhanced customer experience and modern operational systems.",
    accent: "Future-ready operations."
  }
];

const FranchiseBenefits = () => {
  return (
    <section className="py-24 bg-[#221813] relative overflow-hidden font-sans">
      {/* Background Ambience: Subtle vignettes and noise */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] opacity-80 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#AF632A] text-xs font-bold tracking-[0.2em] uppercase mb-4 block"
          >
            Partnership Excellence
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            Why Partner with <span className="text-[#AF632A]">Rabuste</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg font-light max-w-2xl mx-auto leading-relaxed"
          >
            A franchise designed for consistency, scale, and long-term profitability.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-[#151518] rounded-2xl p-8 border border-white/5 hover:border-[#AF632A]/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#AF632A]/5"
            >
              {/* Left Accent Line */}
              <div className="absolute left-0 top-8 bottom-8 w-[2px] bg-[#AF632A] opacity-60 group-hover:opacity-100 group-hover:shadow-[0_0_10px_#AF632A] transition-all duration-500 rounded-r-full" />
              
              <div className="pl-6">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#AF632A] transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 text-base leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>

                {feature.accent && (
                   <span className="text-[#AF632A] text-xs font-medium tracking-wide italic opacity-80 group-hover:opacity-100 transition-opacity">
                     {feature.accent}
                   </span>
                )}
              </div>

               {/* Soft Inner Glow on Hover */}
               <div className="absolute inset-0 bg-gradient-to-br from-[#AF632A]/0 to-[#AF632A]/0 group-hover:from-[#AF632A]/5 group-hover:to-transparent rounded-2xl transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FranchiseBenefits;
