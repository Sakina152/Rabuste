import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

// Define generic interface for payment data
interface PaymentRequest {
  type: 'MENU' | 'ART' | 'WORKSHOP';
  items?: any[]; // For Menu
  itemId?: string; // For Art/Workshop
  price?: number; // For Art/Workshop display
}

interface RazorpayOptions {
  key: string;
  amount: string;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

export const useRazorpay = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cartItems, clearCart, cartTotal } = useCart();

  // Updated function accepts optional params
  const handlePayment = async (requestType: 'MENU' | 'ART' = 'MENU', artItem?: any) => {
    setIsProcessing(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userInfo.token;

      if (!token) {
        toast({ title: "Please Login", description: "You need to be logged in to purchase.", variant: "destructive" });
        navigate("/admin");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 1. Get Key ID
      const { data: keyData } = await axios.get("http://localhost:5000/api/payment/config", config);

      // 2. Prepare Payload for Backend
      let payload = {};
      if (requestType === 'MENU') {
        payload = { type: 'MENU', cartItems };
      } else if (requestType === 'ART') {
        payload = { type: 'ART', itemId: artItem._id };
      }

      // 3. Create Order on Backend
      const { data: orderData } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        payload,
        config
      );

      // 4. Configure Razorpay
      const options: RazorpayOptions = {
        key: keyData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Rabuste Art Gallery",
        description: requestType === 'ART' ? `Purchase: ${artItem.title}` : "Food Order",
        image: requestType === 'ART' ? artItem.image : "https://cdn-icons-png.flaticon.com/512/924/924514.png",
        order_id: orderData.id,
        
        handler: async (response: any) => {
          try {
            // Verify Signature
            await axios.post("http://localhost:5000/api/payment/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
            }, config);

            // SAVE SUCCESSFUL ORDER
            if (requestType === 'MENU') {
               // (Existing Menu Logic)
               await axios.post("http://localhost:5000/api/orders", {
                   orderItems: cartItems.map(item => ({ product: item.id, name: item.name, price: item.price, qty: item.quantity, image: item.image })),
                   paymentMethod: "Razorpay",
                   totalPrice: cartTotal,
                   isPaid: true,
                   paidAt: new Date(),
                   paymentResult: { id: response.razorpay_payment_id, status: "success", email_address: userInfo.email }
               }, config);
               clearCart();
               navigate("/order-success");

            } else if (requestType === 'ART') {
               // NEW ART LOGIC: Mark as Sold
               await axios.post(`http://localhost:5000/api/art/purchase/${artItem._id}`, {}, config);
               
               toast({ title: "Art Purchased!", description: "Congratulations on your new artwork.", className: "bg-green-600 text-white" });
               // Reload page to show "Sold" status
               window.location.reload(); 
            }

          } catch (error) {
            toast({ title: "Verification Failed", description: "Payment succeeded but verification failed.", variant: "destructive" });
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: "",
        },
        theme: {
          color: "#D35400",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();

    } catch (error: any) {
      console.error(error);
      toast({ 
        title: "Payment Error", 
        description: error.response?.data?.message || "Could not initiate payment", 
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { handlePayment, isProcessing };
};