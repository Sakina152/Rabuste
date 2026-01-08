import { useCart } from "@/context/CartContext";
import { useRazorpay } from "@/hooks/useRazorpay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

const Checkout = () => {
  const { cartItems, cartTotal, removeFromCart } = useCart();
  const { handlePayment, isProcessing } = useRazorpay();

  if (cartItems.length === 0) {
    return <div className="p-10 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="min-h-screen bg-hero-gradient p-8 text-foreground flex justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Item List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-3xl font-display text-white mb-6">Your Order</h2>
          {cartItems.map((item) => (
            <Card key={item.id} className="bg-card/80 backdrop-blur-sm border-white/10">
              <CardContent className="p-4 flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  {/* 👇 CHANGED HERE: ₹ symbol */}
                  <p className="font-bold text-xl">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right: Payment Summary */}
        <div>
          <Card className="bg-card/90 backdrop-blur-md border-terracotta/20 sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                {/* 👇 CHANGED HERE */}
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (5%)</span>
                {/* 👇 CHANGED HERE */}
                <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-xl text-white">
                <span>Total</span>
                {/* 👇 CHANGED HERE */}
                <span>₹{(cartTotal * 1.05).toFixed(2)}</span>
              </div>


              <Button 
                onClick={() => handlePayment('MENU')}                 disabled={isProcessing}
                className="w-full bg-terracotta hover:bg-terracotta/90 h-12 text-lg mt-6"
              >
                {/* 👇 CHANGED HERE */}
                {isProcessing ? "Processing..." : `Pay ₹${(cartTotal * 1.05).toFixed(2)}`}
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Checkout;