import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

// Define TypeScript interface for Razorpay options
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

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // 1. Check Login Status
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userInfo.token;

      if (!token) {
        toast({ 
          title: "Please Login", 
          description: "You need to be logged in to place an order.", 
          variant: "destructive" 
        });
        navigate("/admin"); // Or your user login route
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 2. Get Razorpay Key ID from Backend
      const { data: keyData } = await axios.get("http://localhost:5000/api/payment/config", config);

      // 3. Create Order on Backend (Calculates price securely on server)
      const { data: orderData } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { cartItems }, 
        config
      );

      // 4. Configure the Popup Options
      const options: RazorpayOptions = {
        key: keyData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Rabuste Coffee",
        description: "Fresh Coffee Order",
        image: "https://cdn-icons-png.flaticon.com/512/924/924514.png", // Generic coffee icon
        order_id: orderData.id, // This is the Order ID from Razorpay
        
        // 5. Handle Success
        handler: async (response: any) => {
          try {
            // Verify signature on backend
            await axios.post(
              "http://localhost:5000/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              config
            );

            // Save Order to Database
            await axios.post("http://localhost:5000/api/orders", {
               orderItems: cartItems.map(item => ({
                 product: item.id, // Ensure this ID matches backend Product ID
                 name: item.name,
                 image: item.image,
                 price: item.price,
                 qty: item.quantity
               })),
               shippingAddress: {
                 address: "SVNIT Campus", // Placeholder for now
                 city: "Surat",
                 postalCode: "395007",
                 country: "India"
               },
               paymentMethod: "Razorpay",
               itemsPrice: cartTotal,
               taxPrice: cartTotal * 0.05,
               totalPrice: cartTotal * 1.05,
               isPaid: true,
               paidAt: new Date(),
               paymentResult: {
                 id: response.razorpay_payment_id,
                 status: "success",
                 email_address: userInfo.email
               }
            }, config);

            // Clear Cart and Redirect
            clearCart();
            navigate("/order-success");
            toast({ 
              title: "Payment Successful!", 
              description: "Your coffee is being prepared.",
              className: "bg-green-600 text-white border-none" 
            });

          } catch (error) {
            toast({ 
              title: "Verification Failed", 
              description: "Payment succeeded but verification failed.", 
              variant: "destructive" 
            });
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: "9999999999", // You can update User model to store phone numbers later
        },
        theme: {
          color: "#D35400", // Your Terracotta Brand Color
        },
      };

      // 6. Open the Window
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