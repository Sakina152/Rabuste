import { useCart } from "@/context/CartContext";
import { useRazorpay } from "@/hooks/useRazorpay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Lock,
  CreditCard,
  Package,
  Minus,
  Plus,
  ShieldCheck,
  ArrowLeft,
  Store
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { getToken } from "@/utils/getToken";

const Checkout = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { handlePayment, isProcessing: isRazorpayProcessing } = useRazorpay();
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'counter'>('razorpay');
  const [isCounterProcessing, setIsCounterProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const subtotal = cartTotal;
  const tax = cartTotal * 0.05; // 5% GST
  const total = subtotal + tax;

  const isProcessing = isRazorpayProcessing || isCounterProcessing;

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'razorpay') {
      handlePayment('MENU');
    } else {
      setIsCounterProcessing(true);
      try {
        const userInfoString = localStorage.getItem("userInfo");
        if (!userInfoString) {
          toast({
            title: "Authentication Required",
            description: "Please login to place an order.",
            variant: "destructive"
          });
          setIsCounterProcessing(false);
          return;
        }

        const userInfo = JSON.parse(userInfoString);
        const token = await getToken();
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const orderData = {
          user: userInfo._id || userInfo.id,
          orderType: 'MENU',
          orderItems: cartItems.map(item => ({
            product: item.id,
            name: item.name,
            price: item.price,
            qty: item.quantity,
            image: item.image
          })),
          totalPrice: total,
          paymentMethod: 'Pay at Counter',
          isPaid: false,
          paymentResult: { status: 'pending_payment' },
          customerEmail: userInfo.email,
          customerName: userInfo.name
        };

        await axios.post(`${API_BASE}/api/orders`, orderData, config);

        toast({
          title: "Order Placed!",
          description: "Please pay at the counter to confirm your order.",
          className: "bg-green-600 text-white"
        });

        clearCart();
        navigate("/order-success");

      } catch (error: any) {
        console.error("Order placement failed:", error);
        toast({
          title: "Order Failed",
          description: error.response?.data?.message || "Failed to place order. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsCounterProcessing(false);
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-accent" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/menu">Browse Menu</Link>
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-hero-gradient">
        <div className="container-custom relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
              Secure Payment
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mt-4 mb-6">
              Check<span className="text-gradient">out</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete your order securely
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left: Shopping Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-accent/10">
                    <ShoppingBag className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      Shopping Cart
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>

                <Button
                  variant="subtle"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border rounded-2xl p-6 hover:border-accent/50 transition-all duration-300"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-coffee-dark">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                            {item.name}
                          </h3>
                          <p className="text-accent font-medium text-sm">
                            ₹{item.price} <span className="text-muted-foreground">each</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-coffee-dark/50 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-2 hover:bg-accent/10 rounded-md transition-colors"
                            >
                              <Minus className="w-4 h-4 text-accent" />
                            </button>
                            <span className="font-medium text-foreground w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-2 hover:bg-accent/10 rounded-md transition-colors"
                            >
                              <Plus className="w-4 h-4 text-accent" />
                            </button>
                          </div>

                          {/* Price & Delete */}
                          <div className="flex items-center gap-4">
                            <span className="font-display text-xl font-bold text-accent">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                            >
                              <Trash2 className="w-5 h-5 text-muted-foreground group-hover:text-red-500 transition-colors" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Back to Menu */}
              <Button variant="subtle" size="lg" asChild className="w-full sm:w-auto">
                <Link to="/menu">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">

                {/* Order Summary Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-accent/20 to-accent/5 p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Package className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground">
                        Order Summary
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Price Breakdown */}
                    <div className="space-y-4">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tax (5% GST)</span>
                        <span className="font-medium">₹{tax.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground italic">
                        All prices are inclusive of taxes
                      </div>

                      {/* Total */}
                      <div className="pt-4 border-t border-border">
                        <div className="flex justify-between items-center">
                          <span className="font-display text-lg font-semibold text-foreground">
                            Total
                          </span>
                          <span className="font-display text-3xl font-bold text-accent">
                            ₹{total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="space-y-3 pt-2">
                      <p className="text-sm font-medium text-foreground">Select Payment Method</p>

                      <div
                        className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-accent bg-accent/10' : 'border-border bg-card hover:bg-muted/50'}`}
                        onClick={() => setPaymentMethod('razorpay')}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === 'razorpay' ? 'border-accent' : 'border-muted-foreground'}`}>
                          {paymentMethod === 'razorpay' && <div className="w-2 h-2 rounded-full bg-accent" />}
                        </div>
                        <CreditCard className="w-5 h-5 mr-3 text-accent" />
                        <span className="font-medium">Pay Online</span>
                      </div>

                      <div
                        className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'counter' ? 'border-accent bg-accent/10' : 'border-border bg-card hover:bg-muted/50'}`}
                        onClick={() => setPaymentMethod('counter')}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === 'counter' ? 'border-accent' : 'border-muted-foreground'}`}>
                          {paymentMethod === 'counter' && <div className="w-2 h-2 rounded-full bg-accent" />}
                        </div>
                        <Store className="w-5 h-5 mr-3 text-accent" />
                        <span className="font-medium">Pay at Counter</span>
                      </div>
                    </div>

                    {/* Payment Button */}
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      variant="hero"
                      size="lg"
                      className="w-full h-14 text-lg"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {paymentMethod === 'razorpay' ? <CreditCard className="w-5 h-5 mr-2" /> : <Store className="w-5 h-5 mr-2" />}
                          {paymentMethod === 'razorpay' ? `Pay ₹${total.toFixed(2)}` : 'Place Order'}
                        </>
                      )}
                    </Button>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
                      <ShieldCheck className="w-4 h-4 text-accent" />
                      <span>Secure & encrypted payment</span>
                    </div>
                  </div>
                </motion.div>

                {/* Payment Method Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Lock className="w-5 h-5 text-accent" />
                    </div>
                    <h4 className="font-display font-semibold text-foreground">
                      Payment Method
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {paymentMethod === 'razorpay'
                      ? "Secure payment powered by Razorpay. Your payment information is encrypted and safe."
                      : "Order now and pay when you collect your items at the counter. Perfect for cash payments."
                    }
                  </p>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;