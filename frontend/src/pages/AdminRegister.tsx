import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, User, Coffee, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import logo from "@/assets/rabuste-logo.png";

// 1. Zod Schema with "Confirm Password" check
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const AdminRegister = () => {
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
      // TODO: Connect to MERN Backend (Register API)
      console.log("Register Data:", data);
      
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Account Created!",
        description: "Welcome to the team. Please sign in.",
      });
      
      navigate('/admin'); // Redirect to login after success
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* --- BACKGROUND ANIMATION (Same as Login) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-terracotta/20"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: [null, -20, 20, -10, 10, 0],
              rotate: [null, 10, -10, 5, -5, 0]
            }}
            transition={{ 
              duration: 8 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <Coffee size={40 + i * 15} />
          </motion.div>
        ))}
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-card/95 backdrop-blur-md border-terracotta/20 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-2">
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <img src={logo} alt="Rabuste Coffee" className="h-12 w-auto" />
            </motion.div>
            
            <div>
              <CardTitle className="font-display text-2xl text-foreground">
                Join the Team
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Create a new admin account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Jake Thomas"
                    className="pl-10 bg-background/50 border-border/50 focus:border-terracotta"
                    {...register("name")}
                  />
                </div>
                {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@rabuste.com"
                    className="pl-10 bg-background/50 border-border/50 focus:border-terracotta"
                    {...register("email")}
                  />
                </div>
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-terracotta"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-background/50 border-border/50 focus:border-terracotta"
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
              </div>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-terracotta hover:bg-terracotta/90 text-white font-medium py-5 mt-2"
                >
                  {isLoading ? "Creating Account..." : "Register"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </motion.div>
            </form>

            {/* Link to Login */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <button
                onClick={() => navigate("/admin")}
                className="text-terracotta hover:underline font-medium"
              >
                Sign in
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <button onClick={() => navigate("/")} className="text-xs text-muted-foreground hover:text-foreground">
                ← Back to website
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminRegister;