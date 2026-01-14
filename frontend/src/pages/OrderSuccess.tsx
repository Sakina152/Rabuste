import { Link } from "react-router-dom";
import { CheckCircle, Coffee, Home, Sparkles, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-terracotta/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-card/95 backdrop-blur-xl p-12 rounded-3xl border border-white/10 text-center max-w-lg w-full shadow-2xl relative z-10"
      >
        {/* Success icon with animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="relative w-24 h-24 mx-auto mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full blur-xl" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center border border-green-500/30">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          {/* Sparkle effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-display text-4xl text-white mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
        >
          Order Confirmed!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-base mb-6"
        >
          Thank you for your purchase. Your order has been sent to the kitchen.
        </motion.p>

        {/* Info box */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-terracotta/10 to-accent/10 rounded-2xl p-6 mb-8 border border-white/5"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Coffee className="w-5 h-5 text-terracotta" />
            <p className="text-white font-semibold">Your coffee is brewing!</p>
          </div>
          <p className="text-muted-foreground text-sm">
            Our baristas are crafting your order with love. We'll notify you when it's ready for pickup.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Link to="/menu" className="block">
            <Button className="w-full bg-gradient-to-r from-terracotta to-terracotta/90 hover:from-terracotta/90 hover:to-terracotta/80 shadow-lg shadow-terracotta/20 text-white font-semibold h-12 text-base">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Order More
            </Button>
          </Link>
          <Link to="/" className="block">
            <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 h-12 text-base">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        {/* Decorative coffee beans */}
        <div className="absolute top-8 right-8 opacity-10 pointer-events-none">
          <Coffee className="w-16 h-16 text-white rotate-12" />
        </div>
        <div className="absolute bottom-8 left-8 opacity-10 pointer-events-none">
          <Coffee className="w-12 h-12 text-white -rotate-12" />
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;