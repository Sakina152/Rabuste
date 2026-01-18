import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FranchiseInquiryModal from "./FranchiseInquiryModal";

const FranchiseCTA = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="py-32 md:py-40 bg-[#1E140F] relative overflow-hidden font-sans border-t border-[#3A2D26]">
        {/* Background Ambience */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] opacity-60 pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#F5F5F0] mb-8 leading-tight tracking-tight"
          >
            Build something exceptional<br />
            with <span className="text-[#BC653B]">Rabuste.</span>
          </motion.h2>

          <motion.button
            onClick={() => setIsModalOpen(true)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative inline-flex items-center gap-3 bg-[#BC653B] text-white px-8 py-5 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(188,101,59,0.4)] hover:-translate-y-1"
          >
            Apply for Franchise Partnership
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-[#8A8A8A] text-sm md:text-base"
          >
            Join a growing community of passionate café owners
          </motion.p>

        </div>
      </section>

      <FranchiseInquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default FranchiseCTA;
