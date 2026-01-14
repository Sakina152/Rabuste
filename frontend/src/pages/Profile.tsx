import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, Lock, ArrowLeft, TrendingUp, Heart, Coffee, Calendar, Package, Star, Award, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
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

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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

  // Analytics State
  const [favoriteItems, setFavoriteItems] = useState<Array<{ name: string; count: number; image: string }>>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

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
          `${API_URL}/api/auth/me`,
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
        const res = await axios.get(`${API_URL}/api/profile/data`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setOrders(res.data.orders || []);
        setArtPurchases(res.data.artPurchases || []);
        setWorkshops(res.data.workshops || []);

        // Calculate analytics
        const ordersData = res.data.orders || [];
        
        // Total spent
        const spent = ordersData.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
        setTotalSpent(spent);
        setTotalOrders(ordersData.length);

        // Calculate favorite items (most ordered)
        const itemCount: { [key: string]: { count: number; name: string; image: string } } = {};
        ordersData.forEach((order: Order) => {
          order.items.forEach(item => {
            const id = item.menuItem._id;
            if (!itemCount[id]) {
              itemCount[id] = {
                count: 0,
                name: item.menuItem.name,
                image: item.menuItem.image
              };
            }
            itemCount[id].count += item.quantity;
          });
        });

        // Get top 3 favorites
        const favorites = Object.values(itemCount)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        setFavoriteItems(favorites);
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
        `${API_URL}/api/auth/change-password`,
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

        {/* Order History & Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="favorites">Your Favorites</TabsTrigger>
            <TabsTrigger value="purchases">Art & Workshops</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-terracotta/10 to-terracotta/5 border-terracotta/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                        <p className="text-3xl font-bold text-terracotta">₹{totalSpent}</p>
                      </div>
                      <div className="w-12 h-12 bg-terracotta/20 rounded-full flex items-center justify-center">
                        <Coffee className="w-6 h-6 text-terracotta" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-3xl font-bold text-accent">{totalOrders}</p>
                      </div>
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Loyalty Status</p>
                        <p className="text-xl font-bold text-green-500">
                          {totalOrders >= 20 ? "☕ Coffee Master" : totalOrders >= 10 ? "☕ Regular" : totalOrders >= 5 ? "☕ Enthusiast" : "☕ Beginner"}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Your Favorites Preview */}
            {favoriteItems.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      <CardTitle>Your Favorites</CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-terracotta/20 text-terracotta">
                      Based on your orders
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {favoriteItems.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * idx }}
                        className="relative group"
                      >
                        <div className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all">
                          <div className="relative h-32">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-terracotta text-white px-2 py-1 rounded-full text-xs font-bold">
                              #{idx + 1}
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="font-semibold text-sm">{item.name}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Flame className="w-4 h-4 text-orange-500" />
                              <p className="text-xs text-muted-foreground">
                                Ordered {item.count} times
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ORDER HISTORY TAB */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-terracotta" />
                  <CardTitle>Complete Order History</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Coffee className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No orders yet. Start exploring our menu!</p>
                    <Button asChild className="mt-4">
                      <Link to="/menu">Browse Menu</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, idx) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border rounded-xl p-6 hover:shadow-md transition-shadow bg-card"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {order.orderNumber}
                              </Badge>
                              <Badge className={
                                order.status === 'Completed' ? 'bg-green-500' :
                                order.status === 'Pending' ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="mt-4 md:mt-0">
                            <p className="text-2xl font-bold text-terracotta">₹{order.totalAmount}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {order.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-center gap-4 bg-muted/30 rounded-lg p-3">
                              <img
                                src={item.menuItem.image}
                                alt={item.menuItem.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.menuItem.name}</p>
                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                              </div>
                              <p className="font-semibold">₹{item.price * item.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAVORITES TAB */}
          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <CardTitle>Your Most Loved Items</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on your ordering patterns, these are your go-to favorites
                </p>
              </CardHeader>
              <CardContent>
                {favoriteItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">Order more to discover your favorites!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteItems.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative"
                      >
                        <div className="bg-gradient-to-br from-terracotta/5 to-accent/5 border border-terracotta/20 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                          {/* Rank Badge */}
                          <div className="absolute top-4 left-4 z-10">
                            <div className={`
                              w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                              ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                'bg-gradient-to-br from-orange-400 to-orange-600'}
                            `}>
                              {idx + 1}
                            </div>
                          </div>

                          {/* Image */}
                          <div className="relative h-48">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                            <div className="flex items-center gap-2 text-terracotta">
                              <TrendingUp className="w-4 h-4" />
                              <span className="text-sm font-semibold">
                                Ordered {item.count} time{item.count > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="mt-4 flex gap-2">
                              {idx === 0 && (
                                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                                  🏆 Top Choice
                                </Badge>
                              )}
                              {item.count >= 5 && (
                                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                                  🔥 Hot Streak
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ART & WORKSHOPS TAB */}
          <TabsContent value="purchases" className="space-y-6">
            {/* Art Purchases */}
            <Card>
              <CardHeader>
                <CardTitle>Art Collection ({artPurchases.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : artPurchases.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No artworks purchased yet.</p>
                    <Button asChild className="mt-4" variant="outline">
                      <Link to="/gallery">Explore Gallery</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {artPurchases.map((purchase) => (
                      <motion.div
                        key={purchase._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <img
                          src={purchase.art.imageUrl}
                          alt={purchase.art.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-bold">{purchase.art.title}</h3>
                          <p className="text-sm text-muted-foreground">by {purchase.art.artist}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge variant="outline">{purchase.purchaseNumber}</Badge>
                            <p className="font-semibold text-terracotta">₹{purchase.purchasePrice}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Workshops */}
            <Card>
              <CardHeader>
                <CardTitle>Workshop Enrollments ({workshops.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : workshops.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No workshops enrolled yet.</p>
                    <Button asChild className="mt-4" variant="outline">
                      <Link to="/workshops">Browse Workshops</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workshops.map((workshop) => (
                      <div key={workshop._id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{workshop.workshop.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(workshop.workshop.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <Badge variant="outline" className="mt-2">{workshop.registrationNumber}</Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Seats: {workshop.numberOfSeats}</p>
                            <p className="font-bold text-terracotta text-lg">₹{workshop.totalAmount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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