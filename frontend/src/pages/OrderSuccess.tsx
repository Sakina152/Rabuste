import { Link } from "react-router-dom";
import { CheckCircle, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-6">
      <div className="bg-card/90 backdrop-blur-md p-10 rounded-2xl border border-white/10 text-center max-w-md w-full shadow-2xl">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="font-display text-3xl text-white mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. Your order has been sent to the kitchen.
        </p>

        <div className="space-y-3">
          <Link to="/menu">
            <Button className="w-full bg-terracotta hover:bg-terracotta/90">
              <Coffee className="w-4 h-4 mr-2" />
              Order More
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;