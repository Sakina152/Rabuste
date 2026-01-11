import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/rabuste-logo.png";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/* ================== SCHEMA ================== */

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10, "Phone number required"),
  address: z.string().optional(),
  password: z.string().min(6, "Minimum 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

/* ================== COMPONENT ================== */

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, data);

      toast({
        title: "Account created",
        description: "You can now log in",
        className: "bg-terracotta text-white",
      });

      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || "Try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card/95 backdrop-blur border-border shadow-xl">
          <CardHeader className="text-center space-y-4">
            <img src={logo} className="h-14 mx-auto" />
            <CardTitle className="text-3xl font-display">
              Create Account
            </CardTitle>
            <p className="text-muted-foreground">
              Join Rabuste Coffee today ☕
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <FormField label="Full Name" icon={<User size={16} />} error={errors.name?.message}>
                <Input placeholder="John Doe" {...register("name")} />
              </FormField>

              <FormField label="Email" icon={<Mail size={16} />} error={errors.email?.message}>
                <Input placeholder="you@email.com" {...register("email")} />
              </FormField>

              <FormField label="Phone Number" icon={<Phone size={16} />} error={errors.phoneNumber?.message}>
                <Input placeholder="9876543210" {...register("phoneNumber")} />
              </FormField>

              <FormField label="Address (Optional)" icon={<MapPin size={16} />}>
                <Input placeholder="Your address" {...register("address")} />
              </FormField>

              <FormField label="Password" icon={<Lock size={16} />} error={errors.password?.message}>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-terracotta hover:bg-terracotta/90"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-terracotta hover:underline"
                >
                  Sign in
                </button>
              </p>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

/* ================== FORM FIELD ================== */

function FormField({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>

        {/* THIS IS THE FIX */}
        <div className="pl-10">
          {children}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
