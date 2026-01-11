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
      // Check if Razorpay script is loaded
      if (typeof window === 'undefined' || !(window as any).Razorpay) {
        toast({ 
          title: "Payment Error", 
          description: "Payment gateway is not loaded. Please refresh the page and try again.", 
          variant: "destructive" 
        });
        setIsProcessing(false);
        return;
      }

      // Get user info (optional - auth not set up yet)
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userInfo.token;

      // Validate inputs
      if (requestType === 'MENU' && (!cartItems || cartItems.length === 0)) {
        toast({ title: "Cart Empty", description: "Your cart is empty. Please add items before checkout.", variant: "destructive" });
        setIsProcessing(false);
        return;
      }

      if (requestType === 'ART' && (!artItem || !artItem._id)) {
        toast({ title: "Invalid Item", description: "Art item information is missing. Please try again.", variant: "destructive" });
        setIsProcessing(false);
        return;
      }

      // Create config with optional auth header (not required since auth not set up)
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      // 1. Get Key ID (no auth required)
      const { data: keyData } = await axios.get(`${API_BASE}/api/payment/config`, config);

      if (!keyData || !keyData.keyId) {
        throw new Error('Payment gateway configuration error. Please contact support.');
      }

      // 2. Prepare Payload for Backend
      // 3. Prepare Payload for Backend
      let payload: any;
      let orderAmount: number;

      if (requestType === 'MENU') {
        payload = { type: 'MENU', cartItems };
        orderAmount = cartTotal;
      } else if (requestType === 'ART') {
        payload = { type: 'ART', itemId: artItem._id };
        orderAmount = artItem.price || 0;
      }

      // 3. Create Order on Backend (no auth required)
      const { data: orderData } = await axios.post(
        `${API_BASE}/api/payment/create-order`,
        payload,
        config
      );

      if (!orderData || !orderData.id || !orderData.amount) {
        throw new Error('Failed to create payment order. Invalid response from server.');
      }

      // 4. Configure Razorpay
      const options: RazorpayOptions = {
        key: keyData.keyId,
        amount: String(orderData.amount), // Razorpay requires amount as string
        currency: orderData.currency || 'INR',
        name: "Rabuste Art Gallery",
        description: requestType === 'ART' ? `Purchase: ${artItem.title || 'Artwork'}` : "Food Order",
        image: requestType === 'ART' ? (artItem.imageUrl || artItem.image || "https://cdn-icons-png.flaticon.com/512/924/924514.png") : "https://cdn-icons-png.flaticon.com/512/924/924514.png",
        order_id: orderData.id,
        
        handler: async (response: any) => {
          try {
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            
            // Log full payment response for debugging
            console.log('Razorpay Payment Response (Full):', response);
            
            // Extract fields - Razorpay response can have different field name formats
            const orderId = response.razorpay_order_id || response.order_id;
            const paymentId = response.razorpay_payment_id || response.payment_id;
            const signature = response.razorpay_signature || response.signature;
            
            // Validate response has all required fields
            if (!orderId || !paymentId || !signature) {
              console.error('Missing fields in Razorpay response:', {
                has_order_id: !!orderId,
                has_payment_id: !!paymentId,
                has_signature: !!signature,
                response_keys: Object.keys(response),
                full_response: response
              });
              throw new Error('Incomplete payment response from Razorpay. Missing required fields.');
            }
            
            // Verify Signature with backend (no auth required)
            console.log('Sending verification request:', {
              order_id: orderId,
              payment_id: paymentId,
              signature_length: signature.length
            });
            
            const verifyResponse = await axios.post(
              `${API_BASE}/api/payment/verify`, 
              {
                razorpay_order_id: orderId,
                razorpay_payment_id: paymentId,
                razorpay_signature: signature,
                orderData: {
                  type: requestType,
                  cartItems: requestType === 'MENU' ? cartItems : undefined,
                  itemId: requestType === 'ART' ? artItem?._id : undefined,
                  amount: orderAmount  // Use the stored amount instead of orderData.amount
                }
              },
              config
            );
            
            console.log('Verification response:', verifyResponse.data);
            
            if (verifyResponse.data.status !== 'success') {
              throw new Error(verifyResponse.data.message || 'Payment verification failed');
            }

            // Payment verified successfully!
            toast({ 
              title: "Payment Successful!", 
              description: "Your payment has been verified and processed.", 
              className: "bg-green-600 text-white" 
            });

            // SAVE SUCCESSFUL ORDER
            if (requestType === 'MENU') {
               // Save menu order to database
               try {
                 await axios.post(`${API_BASE}/api/orders`, {
                     orderType: 'MENU',
                     orderItems: cartItems.map(item => ({ 
                       product: item.id, 
                       name: item.name, 
                       price: item.price, 
                       qty: item.quantity, 
                       image: item.image 
                     })),
                     totalPrice: cartTotal,
                     paymentMethod: "Razorpay",
                     isPaid: true,
                     paidAt: new Date(),
                     paymentResult: { 
                       id: paymentId, 
                       status: "success", 
                       email_address: userInfo.email || "",
                       razorpay_order_id: orderId,
                       razorpay_payment_id: paymentId
                     },
                     customerEmail: userInfo.email || "",
                     customerName: userInfo.name || ""
                 }, config);
                 console.log('Order saved successfully');
               } catch (orderError: any) {
                 console.error('Error saving order:', orderError);
                 // Still show success since payment was verified
               }
               clearCart();
               navigate("/order-success");

            } else if (requestType === 'ART') {
               // Save art purchase order and mark art as sold
               try {
                 // First save the order
                 await axios.post(`${API_BASE}/api/orders`, {
                     orderType: 'ART',
                     artItem: artItem._id,
                     totalPrice: artItem.price,
                     paymentMethod: "Razorpay",
                     isPaid: true,
                     paidAt: new Date(),
                     paymentResult: { 
                       id: paymentId, 
                       status: "success", 
                       email_address: userInfo.email || "",
                       razorpay_order_id: orderId,
                       razorpay_payment_id: paymentId
                     },
                     customerEmail: userInfo.email || "",
                     customerName: userInfo.name || ""
                 }, config);
                 
                 // Also try to mark art as sold directly (if endpoint exists)
                 try {
                   await axios.post(`${API_BASE}/api/art/purchase/${artItem._id}`, {}, config);
                 } catch (purchaseError) {
                   console.warn('Art purchase endpoint not available, order saved anyway');
                 }
                 
                 toast({ title: "Art Purchased!", description: "Congratulations on your new artwork.", className: "bg-green-600 text-white" });
                 // Reload page to show "Sold" status
                 setTimeout(() => window.location.reload(), 2000);
               } catch (orderError: any) {
                 console.error('Error saving art order:', orderError);
                 toast({ 
                   title: "Payment Successful!", 
                   description: "Payment verified. Please contact support to complete the purchase.", 
                   className: "bg-green-600 text-white" 
                 });
               }
            }

          } catch (error: any) {
            console.error('Payment verification error:', error);
            toast({ 
              title: "Verification Failed", 
              description: error.response?.data?.message || "Payment succeeded but verification failed. Please contact support.", 
              variant: "destructive" 
            });
          }
        },
        prefill: {
          name: userInfo.name || "",
          email: userInfo.email || "",
          contact: userInfo.phone || "",
        },
        theme: {
          color: "#D35400",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response);
        toast({ 
          title: "Payment Failed", 
          description: response.error?.description || "Your payment could not be processed. Please try again.", 
          variant: "destructive" 
        });
        setIsProcessing(false);
      });
      
      rzp1.open();

    } catch (error: any) {
      console.error('Payment initiation error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Could not initiate payment. Please try again.";
      toast({ 
        title: "Payment Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
      setIsProcessing(false);
    }
  };

  return { handlePayment, isProcessing };
};