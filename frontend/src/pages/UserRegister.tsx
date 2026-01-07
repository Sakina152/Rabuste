import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, User, Mail, Lock, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import logo from "@/assets/rabuste-logo.png";
import axios from "axios";

const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email(),
  password: z.string().min(6),
});

type RegisterFormData = z.infer<typeof registerSchema>;

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
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );
      localStorage.setItem("userInfo", JSON.stringify(res.data));

      toast({
        title: "Account created 🎉",
        description: "Welcome to Rabuste",
        className: "bg-terracotta text-white border-none",
      });

      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div className="w-full max-w-md z-10">
        <Card className="bg-card/95 backdrop-blur-md shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <img src={logo} alt="Rabuste" className="h-14 mx-auto" />
            <div>
              <CardTitle className="text-3xl font-display">
                Join Rabuste
              </CardTitle>
              <CardDescription>
                Create your account to get started
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <Label>Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                  <Input className="pl-10" {...register("name")} />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                  <Input className="pl-10" {...register("email")} />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-terracotta text-white py-5"
              >
                {isLoading ? "Creating account…" : "Create Account"}
              </Button>
            </form>

            <p className="text-sm text-center mt-6 text-muted-foreground">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-terracotta cursor-pointer hover:underline"
              >
                Sign in
              </span>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
