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
import { getToken } from "@/utils/getToken";
import { useToast } from "@/hooks/use-toast";

interface ProfileUser {
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
}

const Profile = () => {
  const { toast } = useToast();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  /* ================= CHANGE PASSWORD ================= */
  const handleChangePassword = async () => {
    const token = getToken();
    if (!token) {
      toast({
        title: "Not logged in",
        description: "Please log in again",
        variant: "destructive",
      });
      return;
    }

    if (!currentPassword || !newPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill all password fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully",
        className: "bg-[#5C3A21] text-white border-none",
      });

      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast({
        title: "Update failed",
        description:
          err.response?.data?.message ||
          "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ================= STATES ================= */
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

  /* ================= UI ================= */
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
            <InfoField label="Full Name" icon={<User />} value={user.name} />
            <InfoField label="Email" icon={<Mail />} value={user.email} />
            <InfoField label="Phone Number" icon={<Phone />} value={user.phoneNumber} />
            <InfoField
              label="Address"
              icon={<MapPin />}
              value={user.address || "Not provided"}
            />
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 max-w-md">
            <PasswordField
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
            />

            <Button
              variant="outline"
              onClick={handleChangePassword}
              disabled={saving}
            >
              {saving ? "Updating..." : "Change Password"}
            </Button>
          </CardContent>
        </Card>

        {/* Activity Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActivityCard title="Items Purchased" />
          <ActivityCard title="Art Purchased" />
          <ActivityCard title="Workshops Enrolled" />
        </div>

      </div>
    </div>
  );
};

export default Profile;

/* ================= HELPERS ================= */

const InfoField = ({
  label,
  icon,
  value,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="relative">
      <span className="absolute left-3 top-3 w-4 h-4 text-muted-foreground">
        {icon}
      </span>
      <Input className="pl-10" value={value} disabled />
    </div>
  </div>
);

const PasswordField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="relative">
      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
      <Input
        type="password"
        className="pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

const ActivityCard = ({ title }: { title: string }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      No data yet.
    </CardContent>
  </Card>
);
