import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface ProfileUser {
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
}

const Profile = () => {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        if (!userInfo) return;

        const parsed = JSON.parse(userInfo);

        const res = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${parsed.token}`,
            },
          }
        );

        setUser(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-16">
      <div className="container-custom px-6 max-w-5xl mx-auto space-y-10">

        {/* Back */}
        <Button variant="ghost" asChild className="flex items-center gap-2">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#5C3A21] flex items-center justify-center text-white">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-heading">My Profile</h1>
            <p className="text-muted-foreground text-sm">
              Manage your account information
            </p>
          </div>
        </div>

        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input className="pl-10" value={user.name} disabled />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input className="pl-10" value={user.email} disabled />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input className="pl-10" value={user.phoneNumber} disabled />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  value={user.address || "Not provided"}
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input type="password" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" />
            </div>

            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>

        {/* Activity Overview */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Items Purchased */}
  <Card>
    <CardHeader>
      <CardTitle>Items Purchased</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      No items purchased yet.
    </CardContent>
  </Card>

  {/* Art Purchased */}
  <Card>
    <CardHeader>
      <CardTitle>Art Purchased</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      No artworks purchased yet.
    </CardContent>
  </Card>

  {/* Workshops Enrolled */}
  <Card>
    <CardHeader>
      <CardTitle>Workshops Enrolled</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      No workshops enrolled yet.
    </CardContent>
  </Card>
</div>


      </div>
    </div>
  );
};

export default Profile;
