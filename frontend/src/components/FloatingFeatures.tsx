import { motion } from "framer-motion";
import { Coffee, Palette, Sparkles, Users } from "lucide-react";

const features = [
    {
        icon: Coffee,
        title: "Bold Flavors",
        description: "Premium Robusta beans sourced directly for maximum intensity.",
        color: "bg-orange-500/10 text-orange-500"
    },
    {
        icon: Palette,
        title: "Art Gallery",
        description: "A rotating showcase of fine art within our cafe space.",
        color: "bg-purple-500/10 text-purple-500"
    },
    {
        id: 3,
        icon: Users,
        title: "Community",
        description: "Workshops and events that bring coffee lovers together.",
        color: "bg-blue-500/10 text-blue-500"
    },
    {
        icon: Sparkles,
        title: "Innovation",
        description: "AI Baristas and VR tours redefining the cafe experience.",
        color: "bg-emerald-500/10 text-emerald-500"
    },
];

const FloatingFeatures = () => {
    return (
        <section className="py-32 bg-background relative overflow-hidden">
            <div className="container-custom relative z-10 px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="font-display text-5xl md:text-7xl font-bold mb-6 text-foreground">
                            Crafting <br />
                            <span className="text-accent italic">Unique</span> <br />
                            Moments.
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            We're not just serving coffee; we're curating an atmosphere where creativity,
                            technology, and taste collide.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="p-8 rounded-3xl bg-card border border-border shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FloatingFeatures;
