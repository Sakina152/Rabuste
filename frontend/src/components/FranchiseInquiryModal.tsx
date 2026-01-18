import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface FranchiseFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  budget: string;
  experience: string;
}

interface FranchiseInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FranchiseInquiryModal = ({ isOpen, onClose }: FranchiseInquiryModalProps) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FranchiseFormData>();

  const onSubmit = async (data: FranchiseFormData) => {
    try {
      await axios.post(`${API}/api/franchise`, data);

      toast({
        title: "Inquiry Submitted!",
        description: "Thank you! We have received your application and emailed you a confirmation.",
        variant: "default",
      });

      reset();
      onClose(); // Close modal on success
    } catch (error: any) {
      console.error("Submission failed:", error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[51] flex items-center justify-center p-4 pointer-events-none">
             <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl bg-[#1E140F] border border-[#BC653B]/20 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#3A2D26] flex justify-between items-center sticky top-0 bg-[#1E140F] z-10">
                <div>
                  <h3 className="text-2xl font-display font-bold text-[#F5F5F0]">Application Form</h3>
                  <p className="text-[#8A8A8A] text-sm mt-1">Start your journey with Rabuste</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-[#3A2D26] text-[#8A8A8A] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#BC653B]">Full Name</label>
                      <input
                        {...register("name", { required: "Name is required" })}
                        className="w-full bg-[#2A1E17] border border-[#3A2D26] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BC653B]/50 focus:ring-1 focus:ring-[#BC653B]/50 transition-all placeholder:text-white/20"
                        placeholder="John Doe"
                      />
                      {errors.name && <span className="text-red-400 text-xs">{errors.name.message}</span>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#BC653B]">Email Address</label>
                      <input
                        {...register("email", { required: "Email is required" })}
                        type="email"
                        className="w-full bg-[#2A1E17] border border-[#3A2D26] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BC653B]/50 focus:ring-1 focus:ring-[#BC653B]/50 transition-all placeholder:text-white/20"
                        placeholder="john@example.com"
                      />
                      {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#BC653B]">Phone Number</label>
                      <input
                        {...register("phone", { required: "Phone is required" })}
                        className="w-full bg-[#2A1E17] border border-[#3A2D26] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BC653B]/50 focus:ring-1 focus:ring-[#BC653B]/50 transition-all placeholder:text-white/20"
                        placeholder="+91 00000 00000"
                      />
                      {errors.phone && <span className="text-red-400 text-xs">{errors.phone.message}</span>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#BC653B]">Proposed Location</label>
                      <input
                        {...register("location", { required: "Location is required" })}
                        className="w-full bg-[#2A1E17] border border-[#3A2D26] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BC653B]/50 focus:ring-1 focus:ring-[#BC653B]/50 transition-all placeholder:text-white/20"
                        placeholder="City, State"
                      />
                      {errors.location && <span className="text-red-400 text-xs">{errors.location.message}</span>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#BC653B]">Investment Capacity</label>
                    <select
                      {...register("budget", { required: "Please select a budget" })}
                      className="w-full bg-[#2A1E17] border border-[#3A2D26] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BC653B]/50 focus:ring-1 focus:ring-[#BC653B]/50 transition-all"
                    >
                      <option value="" className="bg-[#2A1E17]">Select investment range...</option>
                      <option value="15L-25L" className="bg-[#2A1E17]">₹15 Lakh - ₹25 Lakh (Express)</option>
                      <option value="40L+" className="bg-[#2A1E17]">₹40 Lakh+ (Premium)</option>
                    </select>
                    {errors.budget && <span className="text-red-400 text-xs">{errors.budget.message}</span>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#BC653B]">Experience & Background</label>
                    <textarea
                      {...register("experience", { required: "This field is required" })}
                      rows={4}
                      className="w-full bg-[#2A1E17] border border-[#3A2D26] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BC653B]/50 focus:ring-1 focus:ring-[#BC653B]/50 transition-all placeholder:text-white/20 resize-none"
                      placeholder="Briefly describe your background and why you want to partner with Rabuste..."
                    />
                    {errors.experience && <span className="text-red-400 text-xs">{errors.experience.message}</span>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#BC653B] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#A65530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FranchiseInquiryModal;
