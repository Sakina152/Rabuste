import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile = () => {
  // 🔒 Temporary frontend-only state (later connect to auth model)
  const [user, setUser] = useState({
    username: "Hatim",
    email: "hatim@example.com",
    phone: "+91 9876543210",
  });

  return (
    <div className="min-h-screen bg-background pt-28 pb-16">
      <div className="container-custom px-6 max-w-5xl mx-auto space-y-10">

        {/* Back to Home */}
        <div>
          <Button variant="ghost" asChild className="flex items-center gap-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Profile Header */}
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

        {/* Profile Details */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  value={user.email}
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  value={user.phone}
                  onChange={(e) =>
                    setUser({ ...user, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button variant="hero">Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
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

        {/* Activity Sections */}
        <div className="grid md:grid-cols-3 gap-6">

          <Card>
            <CardHeader>
              <CardTitle>Past Orders</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              No orders yet.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Artworks Purchased</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              No artworks purchased.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workshops Participated</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              No workshops joined.
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default Profile;
