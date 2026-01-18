import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, ArrowLeft, TrendingUp, Heart, Coffee, Calendar, Package, Star, Award, Flame, Edit2, Save, X, Bookmark } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Camera } from "lucide-react";
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

// AVATAR OPTIONS
const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Willow",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Midnight",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Jack",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Sofia",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Luna",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Buster",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Daisy",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Misty",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Rocky",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Toby",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Ginger",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Coco",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Lola",
];

interface ProfileUser {
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  avatar?: string;
}

interface Order {
  _id: string;
  orderItems: Array<{
    product: {
      _id: string;
      name: string;
      image: string;
    };
    name: string;
    image: string;
    qty: number;
    price: number;
  }>;
  totalPrice: number;
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
    imageUrl: string; // Backend uses imageUrl, not image
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

  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    avatar: ""
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [artPurchases, setArtPurchases] = useState<ArtPurchase[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [savedArtworks, setSavedArtworks] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

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
        setEditForm({
          name: res.data.name,
          phoneNumber: res.data.phoneNumber || "",
          address: res.data.address || "",
          avatar: res.data.avatar || ""
        });
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
        setSavedArtworks(res.data.savedArtworks || []);

        console.log('Profile data loaded:', {
          orders: res.data.orders?.length || 0,
          artPurchases: res.data.artPurchases?.length || 0,
          workshops: res.data.workshops?.length || 0
        });
        console.log('Art purchases data:', res.data.artPurchases);

        // Calculate analytics
        const ordersData = res.data.orders || [];
        const artPurchasesData = res.data.artPurchases || [];

        // Total spent (menu orders + art purchases)
        const menuSpent = ordersData.reduce((sum: number, order: any) => {
          // Use totalPrice (legacy/art) or totalAmount (new schema)
          const amount = order.totalPrice || order.totalAmount || 0;
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        const artSpent = artPurchasesData.reduce((sum: number, purchase: ArtPurchase) => {
          const amount = purchase.purchasePrice || 0;
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        const totalSpentAmount = Math.round((menuSpent + artSpent) * 100) / 100;
        setTotalSpent(isNaN(totalSpentAmount) ? 0 : totalSpentAmount);
        setTotalOrders(ordersData.length);

        // Calculate favorite items (most ordered)
        const itemCount: { [key: string]: { count: number; name: string; image: string } } = {};
        ordersData.forEach((order: any) => {
          // Check both orderItems (legacy) and items (new schema)
          const itemsToProcess = order.orderItems || order.items || [];

          itemsToProcess.forEach((item: any) => {
            // New schema uses 'menuItem', legacy uses 'product'
            const productId = item.product?._id || item.product || item.menuItem?._id || item.menuItem;

            if (productId) {
              const id = productId.toString();
              if (!itemCount[id]) {
                itemCount[id] = {
                  count: 0,
                  name: item.name || (item.menuItem?.name) || 'Unknown Item',
                  image: item.image || (item.menuItem?.image) || '/placeholder-coffee.png'
                };
              }
              itemCount[id].count += (item.qty || item.quantity || 0);
            }
          });
        });

        // Get top 3 favorites
        const favorites = Object.values(itemCount)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        setFavoriteItems(favorites);
      } catch (err: any) {
        console.error("Failed to load profile data", err);
        // Only show error if it's an actual server error, not auth issue
        if (err.response && err.response.status !== 401) {
          toast({
            title: "Error",
            description: "Failed to load purchase history",
            variant: "destructive",
          });
        }
      } finally {
        setDataLoading(false);
      }
    };
    fetchProfileData();
  }, [toast]);



  /* ================= UPDATE PROFILE ================= */
  const handleUpdateProfile = async (updatedData?: Partial<ProfileUser>) => {
    const token = await getToken();
    if (!token) return;

    try {
      setSaving(true);
      const dataToSend = updatedData ? { ...editForm, ...updatedData } : editForm;

      const res = await axios.put(
        `${API_URL}/api/auth/profile`,
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUser(res.data);
      if (updatedData?.avatar) {
        setEditForm(prev => ({ ...prev, avatar: updatedData.avatar! }));
      }
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile details have been saved",
        className: "bg-[#5C3A21] text-white border-none",
      });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSelect = async (avatarUrl: string) => {
    setAvatarDialogOpen(false);
    await handleUpdateProfile({ avatar: avatarUrl });
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
    <div className="min-h-screen bg-hero-gradient pt-24 pb-16">
      <div className="container-custom px-4 md:px-6 max-w-7xl mx-auto space-y-8">

        {/* Back Button */}
        <Button variant="ghost" asChild className="flex items-center gap-2 hover:bg-white/5 text-white">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-terracotta/30 to-accent/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-terracotta/90 to-accent/90 flex items-center justify-center text-white shadow-2xl ring-2 ring-white/20 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 md:w-14 md:h-14" />
                )}
              </div>

              {/* Avatar Edit Button */}
              <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 bg-terracotta hover:bg-terracotta/90 border-2 border-background shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-white/10">
                  <DialogHeader>
                    <DialogTitle>Choose your Avatar</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[300px] mt-4 pr-4">
                    <div className="grid grid-cols-3 gap-4">
                      {AVATAR_OPTIONS.map((avatar, idx) => (
                        <button
                          key={idx}
                          className="relative group rounded-xl overflow-hidden border-2 border-transparent hover:border-terracotta transition-all aspect-square"
                          onClick={() => handleAvatarSelect(avatar)}
                        >
                          <img
                            src={avatar}
                            alt={`Avatar ${idx + 1}`}
                            className="w-full h-full object-cover bg-white/5"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <div className="absolute -bottom-1 -left-1 bg-emerald-500 w-8 h-8 rounded-full border-4 border-background flex items-center justify-center shadow-lg pointer-events-none">
                <Award className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-2 tracking-tight">{user.name}</h1>
                <p className="text-white/60 text-sm md:text-base font-medium">{user.email}</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Badge className={`
                  ${totalOrders >= 20 ? 'bg-gradient-to-r from-amber-600 to-amber-500' :
                    totalOrders >= 10 ? 'bg-gradient-to-r from-blue-600 to-blue-500' :
                      totalOrders >= 5 ? 'bg-gradient-to-r from-emerald-600 to-emerald-500' :
                        'bg-gradient-to-r from-slate-600 to-slate-500'}
                  text-white border-none px-4 py-1.5 text-sm font-medium shadow-lg
                `}>
                  <Coffee className="w-3.5 h-3.5 mr-1.5" />
                  {totalOrders >= 20 ? "Coffee Master" :
                    totalOrders >= 10 ? "Regular Member" :
                      totalOrders >= 5 ? "Enthusiast" :
                        "Beginner"}
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white/90 px-4 py-1.5 text-sm font-medium bg-white/5">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  Member since 2026
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards - AT THE TOP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-terracotta/50 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-terracotta/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="pt-6 pb-6 relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center ring-1 ring-terracotta/20 group-hover:scale-110 transition-transform duration-300">
                    <Coffee className="w-6 h-6 text-terracotta" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-white/50 font-medium uppercase tracking-wider">Total Spent</p>
                  <p className="text-3xl md:text-4xl font-bold text-white">₹{totalSpent.toFixed(2)}</p>
                  <p className="text-xs text-white/40">Lifetime purchases</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-accent/50 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="pt-6 pb-6 relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center ring-1 ring-accent/20 group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-white/50 font-medium uppercase tracking-wider">Orders</p>
                  <p className="text-3xl md:text-4xl font-bold text-white">{totalOrders}</p>
                  <p className="text-xs text-white/40">Successfully delivered</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="pt-6 pb-6 relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center ring-1 ring-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-white/50 font-medium uppercase tracking-wider">Favorites</p>
                  <p className="text-3xl md:text-4xl font-bold text-white">{favoriteItems.length}</p>
                  <p className="text-xs text-white/40">Most ordered items</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="pt-6 pb-6 relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center ring-1 ring-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-white/50 font-medium uppercase tracking-wider">Collection</p>
                  <p className="text-3xl md:text-4xl font-bold text-white">{artPurchases.length + workshops.length}</p>
                  <p className="text-xs text-white/40">Art pieces & events</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Sidebar - Personal Info & Security */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-card/90 backdrop-blur-md border-white/10 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-terracotta/20 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-terracotta" />
                      </div>
                      <CardTitle className="text-lg">Personal Info</CardTitle>
                    </div>
                    {!isEditing ? (
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 w-8 p-0 text-white/70 hover:text-white">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20">
                          <X className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleUpdateProfile()} disabled={saving} className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20">
                          <Save className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <InfoField
                    label="Full Name"
                    icon={<User className="w-4 h-4" />}
                    value={isEditing ? editForm.name : user.name}
                    isEditing={isEditing}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                  <InfoField label="Email" icon={<Mail className="w-4 h-4" />} value={user.email} disabled />
                  <InfoField
                    label="Phone"
                    icon={<Phone className="w-4 h-4" />}
                    value={isEditing ? editForm.phoneNumber : user.phoneNumber}
                    isEditing={isEditing}
                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  />
                  <InfoField
                    label="Address"
                    icon={<MapPin className="w-4 h-4" />}
                    value={isEditing ? editForm.address : (user.address || "Not provided")}
                    isEditing={isEditing}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  />
                  {isEditing && (
                    <Button className="w-full mt-4 bg-terracotta hover:bg-terracotta/90" onClick={() => handleUpdateProfile()} disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>


          </div>

          {/* Right Main Content - Order History Tabs */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Tabs defaultValue="orders" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-card/80 backdrop-blur-md border border-white/10 p-1">
                  <TabsTrigger value="orders" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-terracotta data-[state=active]:to-accent">
                    Order History
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-terracotta data-[state=active]:to-accent">
                    Favorites
                  </TabsTrigger>
                  <TabsTrigger value="collection" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-terracotta data-[state=active]:to-accent">
                    Collection
                  </TabsTrigger>
                </TabsList>

                {/* ORDER HISTORY TAB */}
                <TabsContent value="orders" className="space-y-4">
                  <Card className="bg-card/90 backdrop-blur-md border-white/10 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-terracotta" />
                        <CardTitle>Order History</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {dataLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading...</div>
                      ) : orders.length === 0 ? (
                        <div className="text-center py-12">
                          <Coffee className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                          <p className="text-muted-foreground mb-4">No orders yet!</p>
                          <Button asChild className="bg-gradient-to-r from-terracotta to-accent">
                            <Link to="/menu">Browse Menu</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                          {orders.map((order, idx) => (
                            <motion.div
                              key={order._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="border border-white/10 rounded-xl p-4 md:p-5 hover:shadow-lg hover:shadow-terracotta/10 transition-all bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm"
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className="font-mono text-xs border-white/20">
                                      {order.orderNumber}
                                    </Badge>
                                    <Badge className={
                                      order.status === 'Completed' ? 'bg-green-500' :
                                        order.status === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'
                                    }>
                                      {order.status}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-terracotta to-accent bg-clip-text text-transparent">
                                  ₹{order.totalPrice}
                                </p>
                              </div>

                              <div className="space-y-2">
                                {/* Use orderItems (legacy) or items (new schema) */}
                                {(order.orderItems?.length > 0 ? order.orderItems : (order as any).items || []).map((item: any, itemIdx: number) => (
                                  <div key={itemIdx} className="flex items-center gap-3 bg-background/50 rounded-lg p-2 border border-white/5">
                                    <img
                                      src={item.image || item.menuItem?.image || '/placeholder-coffee.png'}
                                      alt={item.name || item.menuItem?.name || 'Item'}
                                      className="w-12 h-12 object-cover rounded-md"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm truncate">{item.name || item.menuItem?.name || 'Unknown Item'}</p>
                                      <p className="text-xs text-muted-foreground">Qty: {item.qty || item.quantity || 0}</p>
                                    </div>
                                    <p className="font-semibold text-sm whitespace-nowrap">₹{(item.price || 0) * (item.qty || item.quantity || 0)}</p>
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
                <TabsContent value="favorites" className="space-y-4">
                  <Card className="bg-card/90 backdrop-blur-md border-white/10 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <CardTitle>Your Favorites</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Most ordered items based on your history
                      </p>
                    </CardHeader>
                    <CardContent>
                      {favoriteItems.length === 0 ? (
                        <div className="text-center py-12">
                          <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                          <p className="text-muted-foreground">Order more to see your favorites!</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          {favoriteItems.map((item, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                              className="group"
                            >
                              <div className="bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-terracotta/30 transition-all">
                                {/* Rank Badge */}
                                <div className="absolute top-3 left-3 z-10">
                                  <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg text-sm
                                    ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                      idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                        'bg-gradient-to-br from-orange-400 to-orange-600'}
                                  `}>
                                    #{idx + 1}
                                  </div>
                                </div>

                                {/* Image */}
                                <div className="relative h-40">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="p-4 md:p-5">
                                  <h3 className="font-bold text-base md:text-lg mb-2">{item.name}</h3>
                                  <div className="flex items-center gap-2 text-terracotta mb-3">
                                    <Flame className="w-4 h-4" />
                                    <span className="text-sm font-semibold">
                                      Ordered {item.count}x
                                    </span>
                                  </div>
                                  <div className="flex gap-2 flex-wrap">
                                    {idx === 0 && (
                                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-none text-xs">
                                        🏆 Top Choice
                                      </Badge>
                                    )}
                                    {item.count >= 5 && (
                                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-none text-xs">
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

                  {/* Saved Artworks Section */}
                  <Card className="bg-card/90 backdrop-blur-md border-white/10 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-5 h-5 text-accent" />
                        <CardTitle>Saved Artworks</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Pieces you've bookmarked in the Gallery
                      </p>
                    </CardHeader>
                    <CardContent>
                      {savedArtworks.length === 0 ? (
                        <div className="text-center py-12">
                          <Bookmark className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                          <p className="text-muted-foreground">No artworks saved yet!</p>
                          <Button asChild variant="ghost" className="mt-4 text-accent hover:text-accent/80">
                            <Link to="/gallery">Explore Gallery</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          {savedArtworks.map((art, idx) => {
                            const imageUrl = art.imageUrl
                              ? (art.imageUrl.startsWith('http') ? art.imageUrl : `${API_URL}/${art.imageUrl.replace(/\\/g, "/")}`)
                              : '/placeholder-art.png';

                            return (
                              <motion.div
                                key={art._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group"
                              >
                                <Link to="/gallery">
                                  <div className="bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-accent/30 transition-all">
                                    <div className="relative h-40">
                                      <img
                                        src={imageUrl}
                                        alt={art.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                      <div className="absolute bottom-3 left-3">
                                        <Badge className="bg-accent/80 backdrop-blur-md text-white border-none text-[10px] uppercase tracking-wider">
                                          {art.category}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="p-4">
                                      <h3 className="font-bold text-lg mb-1 group-hover:text-accent transition-colors">{art.title}</h3>
                                      <p className="text-sm text-white/60 mb-3">by {art.artist}</p>
                                      <div className="flex items-center justify-between">
                                        <span className="font-display text-lg text-accent font-bold">₹{art.price?.toLocaleString('en-IN')}</span>
                                        <div className="p-2 rounded-full bg-accent/10 text-accent">
                                          <Bookmark className="w-4 h-4 fill-current" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* COLLECTION TAB */}
                <TabsContent value="collection" className="space-y-6">
                  {/* Art Purchases */}
                  <Card className="bg-card/90 backdrop-blur-md border-white/10 shadow-xl">
                    <CardHeader>
                      <CardTitle>Art Collection ({artPurchases.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dataLoading ? (
                        <p className="text-center py-8 text-muted-foreground">Loading...</p>
                      ) : artPurchases.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">No art purchases yet</p>
                          <Button asChild variant="outline">
                            <Link to="/gallery">Explore Gallery</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {artPurchases.map((purchase) => (
                            <motion.div
                              key={purchase._id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="border border-white/10 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                            >
                              <img
                                src={purchase.art.imageUrl?.startsWith('http') ? purchase.art.imageUrl : `${API_URL}${purchase.art.imageUrl}`}
                                alt={purchase.art.title}
                                className="w-full h-40 object-cover"
                              />
                              <div className="p-4">
                                <h3 className="font-bold text-sm">{purchase.art.title}</h3>
                                <p className="text-xs text-muted-foreground mb-2">by {purchase.art.artist}</p>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs">{purchase.purchaseNumber}</Badge>
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
                  <Card className="bg-card/90 backdrop-blur-md border-white/10 shadow-xl">
                    <CardHeader>
                      <CardTitle>Workshop Enrollments ({workshops.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dataLoading ? (
                        <p className="text-center py-8 text-muted-foreground">Loading...</p>
                      ) : workshops.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">No workshops enrolled</p>
                          <Button asChild variant="outline">
                            <Link to="/workshops">Browse Workshops</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {workshops.map((item) => (
                            <motion.div
                              key={item._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border border-white/10 rounded-xl p-4 md:p-5 hover:shadow-lg transition-all bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm"
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                                <div>
                                  <h3 className="text-lg font-bold text-white">{item.workshop?.title || "Workshop"}</h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {item.workshop?.date ? new Date(item.workshop.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      }) : "Date TBD"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className="font-mono text-xs border-white/20">
                                    {item.registrationNumber}
                                  </Badge>
                                  <Badge className={
                                    item.status === 'Confirmed' ? 'bg-green-500' :
                                      item.status === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'
                                  }>
                                    {item.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex justify-between items-center bg-background/50 rounded-lg p-3 border border-white/5">
                                <span className="text-sm text-muted-foreground">
                                  {item.numberOfSeats} seat{item.numberOfSeats > 1 ? 's' : ''} reserved
                                </span>
                                <span className="font-bold text-terracotta">₹{item.totalAmount}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
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
  isEditing = false,
  onChange,
  disabled = false
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  isEditing?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="relative">
      <span className="absolute left-3 top-3 w-4 h-4 text-muted-foreground">
        {icon}
      </span>
      <Input
        className={`pl-10 ${isEditing && !disabled ? 'bg-white/10 border-white/20 text-white' : ''}`}
        value={value}
        disabled={!isEditing || disabled}
        onChange={onChange}
      />
    </div>
  </div>
);