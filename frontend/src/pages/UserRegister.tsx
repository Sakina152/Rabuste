import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//auth-services firebase
import { signUpWithEmail, signInWithGoogle } from '../services/authService';

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

  const handleGoogleSignUp = async () => {
  setIsLoading(true);
  try {
    const userData = await signInWithGoogle();
    localStorage.setItem("userInfo", JSON.stringify(userData));
    toast({
      title: "Account created",
      description: "You've successfully signed up with Google",
      className: "bg-terracotta text-white",
    });
    navigate("/");
  } catch (err: any) {
    toast({
      title: "Google signup failed",
      description: err.message || "Failed to sign up with Google",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

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
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            {/* Google Sign Up */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.31-4.47 3.31-7.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>
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
