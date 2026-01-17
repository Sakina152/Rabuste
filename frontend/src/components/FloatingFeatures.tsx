import { motion } from "framer-motion";
import espresso from '../assets/menu/robusta-espresso.jpg';
import frappe from '../assets/menu/robusta-frappe.jpg';
import cappuccino from '../assets/menu/robusta-cappuccino.jpg';
import tonic from '../assets/menu/espresso-tonic.jpg';

const FloatingFeatures = () => {
    return (
        <section className="py-32 relative overflow-hidden bg-[#251912]">
            {/* Background Pattern */}
            <motion.div
                className="absolute inset-0 opacity-[0.05]"
                animate={{
                    backgroundPosition: ["0px 0px", "60px 60px"]
                }}
                transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity
                }}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c2.2 0 3.5 2 2 4s-3 3-3 5c0 1.5 1.5 2 3 2v2c-2.5 0-4.5-1.5-4.5-4s3-3 3-5c0-1.5-1.5-2-3-2V5z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Refined Gradient Fade Overlay at Bottom (Matches Zinc-950 of Gallery) */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent via-[#251912]/50 to-[#09090b] z-[5] pointer-events-none" />

            <div className="container-custom relative z-10 px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="font-display text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                            Crafting <br />
                            <span className="text-[#BC653B] italic">Unique</span> <br />
                            Moments.
                        </h2>
                        <p className="text-xl text-white/80 leading-relaxed max-w-lg">
                            We're not just serving coffee; we're curating an atmosphere where creativity,
                            technology, and taste collide. Experience the difference in every cup.
                        </p>

                        <div className="mt-8">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 bg-[#BC653B] text-white rounded-full font-medium shadow-lg hover:shadow-[#BC653B]/20 transition-all"
                            >
                                Explore Menu
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Image Grid */}
                    <div className="grid grid-cols-2 gap-6 max-w-[75%] mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="aspect-[4/5] rounded-2xl overflow-hidden relative group"
                        >
                            <img src={espresso} alt="Espresso" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="aspect-[4/5] rounded-2xl overflow-hidden relative group mt-8"
                        >
                            <img src={frappe} alt="Frappe" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="aspect-[4/5] rounded-2xl overflow-hidden relative group -mt-8"
                        >
                            <img src={cappuccino} alt="Cappuccino" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="aspect-[4/5] rounded-2xl overflow-hidden relative group"
                        >
                            <img src={tonic} alt="Tonic" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FloatingFeatures;
