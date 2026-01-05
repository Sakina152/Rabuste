import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const FloatingCart = () => {
  const { cartCount } = useCart();

  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Link to="/checkout">
            <Button 
              size="lg" 
              className="rounded-full h-16 w-16 bg-terracotta hover:bg-terracotta/90 shadow-lg shadow-terracotta/20 relative flex items-center justify-center"
            >
              <ShoppingBag className="h-6 w-6 text-white" />
              <span className="absolute -top-2 -right-2 bg-white text-terracotta text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full border-2 border-background">
                {cartCount}
              </span>
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCart;