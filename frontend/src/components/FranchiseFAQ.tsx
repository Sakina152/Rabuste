import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Minus } from "lucide-react";

// FAQ Data
const faqs = [
  {
    id: 1,
    question: "Do I need prior experience in the coffee industry?",
    answer: "Experience can be helpful, but it’s not required. Rabuste provides a comprehensive, hands-on training program that covers everything — from coffee preparation and quality control to staff management, operations, and daily profitability. You don’t need to be a coffee expert to run a successful Rabuste Café."
  },
  {
    id: 2,
    question: "What is the estimated ROI?",
    answer: "ROI varies based on location, store format, and execution. However, well-positioned outlets often begin generating strong cash flow within the first few months, with expected ROI typically within 12 months. Detailed financial projections, break-even timelines, and unit economics are shared transparently during the discovery phase."
  },
  {
    id: 3,
    question: "How much time do I need to be involved in the business?",
    answer: "Active involvement is recommended during the initial phase. Once operations stabilize, many partners move into a semi-managed model while maintaining performance and brand standards."
  },
  {
    id: 4,
    question: "What support does Rabuste provide after launch?",
    answer: "You receive ongoing operational support, marketing guidance, performance reviews, and access to updated systems and brand initiatives. Our partnership continues well beyond opening day."
  },
  {
    id: 5,
    question: "What makes Rabuste a strong franchise opportunity?",
    answer: "Rabuste combines premium positioning, efficient store formats, strong unit economics, and a scalable operating model—designed for long-term growth, not short-term trends."
  }
];

const FranchiseFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#221813] relative overflow-hidden font-sans border-t border-[#3A2D26]">
       {/* Background Ambience similar to other espresso sections */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_transparent_0%,_#000000_100%)] opacity-40 pointer-events-none" />
       
       <div className="px-8 md:px-16 lg:px-20 relative z-10">
         
         <div className="max-w-4xl">
         {/* Header */}
         <div className="mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-[#F5F5F0] tracking-tight"
            >
              Frequently Asked Questions
            </motion.h2>
         </div>

         {/* Accordion */}
         <div className="space-y-4">
            {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                
                return (
                    <motion.div 
                      key={faq.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                      className={`border-b border-[#3A2D26] overflow-hidden transition-colors duration-300 ${isOpen ? "bg-[#2A1E17]/50 rounded-lg" : ""}`}
                    >
                        <button 
                          onClick={() => toggleFAQ(index)}
                          className="w-full text-left py-6 px-4 flex justify-between items-center group focus:outline-none"
                        >
                           <span className={`text-lg md:text-xl font-medium transition-colors duration-300 ${isOpen ? "text-[#9F6637]" : "text-[#E6E6E6] group-hover:text-white"}`}>
                             {faq.question}
                           </span>

                           <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? "bg-[#9F6637]/10 rotate-180" : "bg-transparent"}`}>
                             <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${isOpen ? "text-[#9F6637]" : "text-[#888]"}`} />
                           </div>
                        </button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="px-4 pb-8 pt-0">
                                         <p className="text-[#B0B0B0] text-base leading-relaxed max-w-3xl">
                                             {faq.answer}
                                         </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
         </div>
         </div>

       </div>
    </section>
  );
};

export default FranchiseFAQ;
