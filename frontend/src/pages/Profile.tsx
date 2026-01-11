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

interface Order {
  _id: string;
  items: Array<{
    menuItem: {
      _id: string;
      name: string;
      image: string;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderNumber: string;
}

interface ArtPurchase {
  _id: string;
  art: {
    _id: string;
    title: string;
    artist: string;
    imageUrl: string;
    price: number;
  };
  purchasePrice: number;
  status: string;
  createdAt: string;
  purchaseNumber: string;
}

interface Workshop {
  _id: string;
  workshop: {
    _id: string;
    title: string;
    date: string;
    price: number;
  };
  status: string;
  numberOfSeats: number;
  totalAmount: number;
  registrationNumber: string;
}

const Profile = () => {
  const { toast } = useToast();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [artPurchases, setArtPurchases] = useState<ArtPurchase[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  /* ================= FETCH USER PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getToken();
      if (!token) {
        setLoading(false);
        setDataLoading(false);
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

  /* ================= FETCH PROFILE DATA ================= */
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = await getToken();
      if (!token) {
        setDataLoading(false);
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/profile/data", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setOrders(res.data.orders || []);
        setArtPurchases(res.data.artPurchases || []);
        setWorkshops(res.data.workshops || []);
      } catch (err: any) {
        console.error("Failed to load profile data", err);
        toast({
          title: "Error",
          description: "Failed to load purchase history",
          variant: "destructive",
        });
      } finally {
        setDataLoading(false);
      }
    };
    fetchProfileData();
  }, [toast]);

  /* ================= CHANGE PASSWORD ================= */
  const handleChangePassword = async () => {
    const token = await getToken();
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
          {/* Items Purchased */}
          <Card>
            <CardHeader>
              <CardTitle>Items Purchased ({orders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {dataLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items purchased yet.</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-xs">{order.orderNumber}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm">
                            {item.menuItem.name} x {item.quantity}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 font-medium">₹{order.totalAmount}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Art Purchased */}
          <Card>
            <CardHeader>
              <CardTitle>Art Purchased ({artPurchases.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {dataLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : artPurchases.length === 0 ? (
                <p className="text-sm text-muted-foreground">No artworks purchased yet.</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {artPurchases.map((purchase) => (
                    <div key={purchase._id} className="border rounded p-3">
                      <div className="flex gap-3">
                        <img 
                          src={purchase.art.imageUrl} 
                          alt={purchase.art.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{purchase.art.title}</div>
                          <div className="text-xs text-muted-foreground">
                            by {purchase.art.artist}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {purchase.purchaseNumber}
                          </div>
                          <div className="mt-1 font-medium text-sm">₹{purchase.purchasePrice}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workshops Enrolled */}
          <Card>
            <CardHeader>
              <CardTitle>Workshops Enrolled ({workshops.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {dataLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : workshops.length === 0 ? (
                <p className="text-sm text-muted-foreground">No workshops enrolled yet.</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {workshops.map((workshop) => (
                    <div key={workshop._id} className="border rounded p-3">
                      <div className="font-medium text-sm">{workshop.workshop.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(workshop.workshop.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {workshop.registrationNumber}
                      </div>
                      <div className="text-sm">Seats: {workshop.numberOfSeats}</div>
                      <div className="mt-1 font-medium text-sm">₹{workshop.totalAmount}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
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