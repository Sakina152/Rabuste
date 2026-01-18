import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { getToken } from "@/utils/getToken";

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
  const handlePayment = async (requestType: 'MENU' | 'ART' | 'WORKSHOP' = 'MENU', data?: any) => {
    setIsProcessing(true);
    // Authentication check logic...
    const userInfoStr = localStorage.getItem("userInfo");
    // For workshops, we might allow guest checkout if we don't strictly require login, 
    // but the backend payment controller requires userId for referencing if passed.
    // However, existing logic enforces login. We'll stick to that for now.
    if (!userInfoStr) {
      toast({
        title: "Authentication Required",
        description: "Please login to proceed with payment",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

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

      const userInfo = JSON.parse(userInfoStr || "{}");
      const token = await getToken();

      // Validate inputs
      if (requestType === 'MENU' && (!cartItems || cartItems.length === 0)) {
        toast({ title: "Cart Empty", description: "Your cart is empty. Please add items before checkout.", variant: "destructive" });
        setIsProcessing(false);
        return;
      }

      if (requestType === 'ART' && (!data || !data._id)) {
        toast({ title: "Invalid Item", description: "Art item information is missing. Please try again.", variant: "destructive" });
        setIsProcessing(false);
        return;
      }

      if (requestType === 'WORKSHOP') {
        if (!data || !data.workshop || !data.participantDetails) {
          toast({ title: "Invalid Request", description: "Workshop details missing.", variant: "destructive" });
          setIsProcessing(false);
          return;
        }
      }

      // Create config
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      // 1. Get Key ID
      const { data: keyData } = await axios.get(`${API_BASE}/api/payment/config`, config);

      if (!keyData || !keyData.keyId) {
        throw new Error('Payment gateway configuration error. Please contact support.');
      }

      // 2. Prepare Payload for Backend
      let payload: any;
      let orderAmount: number;

      if (requestType === 'MENU') {
        payload = { type: 'MENU', cartItems };
        // Include 5% Tax to match backend and Checkout display
        orderAmount = cartTotal * 1.05;
      } else if (requestType === 'ART') {
        payload = { type: 'ART', itemId: data._id };
        orderAmount = data.price || 0;
      } else if (requestType === 'WORKSHOP') {
        payload = {
          type: 'WORKSHOP',
          itemId: data.workshop._id,
          quantity: data.quantity || 1
        };
        // Expect backend to calculate price, but we need it for verification payload potentially
        // Actually backend verify uses the amount passed in orderData to record it, but trusts the signature.
        orderAmount = (data.workshop.price || 0) * (data.quantity || 1);
      }

      // 3. Create Order on Backend
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
        amount: String(orderData.amount),
        currency: orderData.currency || 'INR',
        name: "Rabuste",
        description: requestType === 'ART' ? `Art: ${data.title}` : (requestType === 'WORKSHOP' ? `Workshop: ${data.workshop.title}` : "Food Order"),
        image: requestType === 'ART' ? (data.image || "https://cdn-icons-png.flaticon.com/512/924/924514.png") : "https://cdn-icons-png.flaticon.com/512/924/924514.png",
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            // Verify Signature
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                type: requestType,
                cartItems: requestType === 'MENU' ? cartItems : undefined,
                itemId: requestType === 'ART' ? data?._id : (requestType === 'WORKSHOP' ? data?.workshop._id : undefined),
                amount: orderAmount,
                // Additional fields for Workshop
                participantDetails: requestType === 'WORKSHOP' ? data.participantDetails : undefined,
                quantity: requestType === 'WORKSHOP' ? data.quantity : undefined
              }
            };

            const verifyResponse = await axios.post(
              `${API_BASE}/api/payment/verify`,
              verifyPayload,
              config
            );

            if (verifyResponse.data.status !== 'success') {
              throw new Error(verifyResponse.data.message || 'Payment verification failed');
            }

            toast({
              title: "Payment Successful!",
              description: "Your payment has been verified and processed.",
              className: "bg-green-600 text-white"
            });

            // Post-success actions
            if (requestType === 'MENU') {
              // Menu logic (clearing cart, navigating) handled by Payment Controller saving order?
              // Checkout.tsx logic was: "SAVE SUCCESSFUL ORDER" separately?
              // Wait, useRazorpay.ts ORIGINAL logic had a block "if (requestType === 'MENU') { save order... }"
              // BUT verifyPayment in backend ALSO saves order now.
              // We should avoid double saving.
              // The backend verifyPayment now handles saving for MENU, ART, and WORKSHOP.
              // So we just need to clean up UI.

              clearCart();
              navigate("/order-success");
            } else if (requestType === 'ART') {
              setTimeout(() => window.location.reload(), 2000);
            } else if (requestType === 'WORKSHOP') {
              // Call optional success callback if passed in data, or just return true?
              // Since this hook is void, we'll assume we need to trigger UI update.
              // For workshops, we probably want to signal parent component.
              if (data.onSuccess) data.onSuccess(verifyResponse.data);
            }

          } catch (error: any) {
            console.error('Payment verification error:', error);
            toast({
              title: "Verification Failed",
              description: error.response?.data?.message || "Payment succeeded but verification failed.",
              variant: "destructive"
            });
            if (data.onError) data.onError(error);
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
        toast({
          title: "Payment Failed",
          description: response.error?.description || "Payment failed",
          variant: "destructive"
        });
        setIsProcessing(false);
      });

      rzp1.open();

    } catch (error: any) {
      console.error('Payment initiation error:', error);
      toast({
        title: "Payment Error",
        description: error.response?.data?.message || error.message || "Could not initiate payment.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return { handlePayment, isProcessing };
};