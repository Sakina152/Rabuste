import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  DollarSign,
  ShoppingBag,
  Building2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Coffee,
  Calendar,
  Clock,
  ChevronRight
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Import logo
import logo from "@/assets/rabuste-logo.png";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard", active: true },
  { title: "Orders", icon: ShoppingBag, href: "/admin/dashboard/orders" },
  { title: "Applications", icon: FileText, href: "/admin/applications" },
  { title: "Users", icon: Users, href: "/admin/users" },
];

// Stats will be loaded from API
const getStatsData = (dashboardStats: any) => {
  if (!dashboardStats) {
    return [
      { title: "Total Revenue", value: "₹0", icon: DollarSign, trend: "0%", trendUp: true, description: "Loading..." },
      { title: "Active Orders", value: "0", icon: ShoppingBag, trend: "0", trendUp: true, description: "Loading..." },
      { title: "Pending Franchises", value: "0", icon: Building2, trend: "0", trendUp: false, description: "Loading..." },
      { title: "Workshop Signups", value: "0", icon: Calendar, trend: "0%", trendUp: true, description: "Loading..." },
    ];
  }

  const revenueTrend = dashboardStats.revenueTrend || 0;
  const ordersTrend = dashboardStats.ordersTrend || 0;

  return [
    {
      title: "Total Revenue",
      value: `₹${(dashboardStats.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: DollarSign,
      trend: `${revenueTrend >= 0 ? '+' : ''}${revenueTrend}%`,
      trendUp: revenueTrend >= 0,
      description: "vs last week"
    },
    {
      title: "Active Orders",
      value: `${dashboardStats.paidOrders || 0}`,
      icon: ShoppingBag,
      trend: `${ordersTrend >= 0 ? '+' : ''}${ordersTrend}%`,
      trendUp: ordersTrend >= 0,
      description: "vs last week"
    },
    {
      title: "Pending Franchises",
      value: `${dashboardStats.pendingFranchises || 0}`,
      icon: Building2,
      trend: "-",
      trendUp: false,
      description: "awaiting review"
    },
    {
      title: "Workshop Signups",
      value: `${dashboardStats.confirmedWorkshops || 0}`,
      icon: Calendar,
      trend: `${dashboardStats.totalWorkshops || 0}`,
      trendUp: true,
      description: "total bookings"
    },
  ];
};

// Recent activity will be fetched from API
const getRecentActivity = (orders: any[]) => {
  if (!orders || orders.length === 0) {
    return [{ action: "No recent activity", time: "", type: "info" }];
  }

  return orders.slice(0, 5).map(order => {
    const timeAgo = new Date(order.createdAt).toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'short'
    });

    if (order.orderType === 'ART') {
      return {
        action: `Art purchase: ₹${order.totalPrice}`,
        time: timeAgo,
        type: "art"
      };
    } else {
      return {
        action: `Menu order: ₹${order.totalPrice} (${order.orderItems?.length || 0} items)`,
        time: timeAgo,
        type: "menu"
      };
    }
  });
};

const getQuickActions = (dashboardStats: any) => {
  return [
    { title: "View Menu", description: "Manage items", icon: Coffee, href: "/admin/dashboard/menu-management" },
    { title: "Workshops", description: "5 upcoming", icon: Calendar, href: "/admin/dashboard/workshops" },
    {
      title: "Gallery",
      description: dashboardStats ? `${dashboardStats.totalArtSold || 0} sold` : "Loading...",
      icon: TrendingUp,
      href: "/admin/gallery"
    },
  ];
};

export default function AdminDashboard() {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // Update active nav based on current route
  useEffect(() => {
    const currentItem = navItems.find(item => location.pathname === item.href);
    if (currentItem) {
      setActiveNav(currentItem.title);
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard stats
        const statsResponse = await axios.get(`${API_BASE}/api/admin/stats/dashboard`);
        setDashboardStats(statsResponse.data);

        // Fetch recent orders
        const ordersResponse = await axios.get(`${API_BASE}/api/orders?status=completed`);
        setRecentOrders(ordersResponse.data || []);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(interval);
  }, [API_BASE, toast]);

  const handleSignOut = () => {
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/admin");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
              <img src={logo} alt="Rabuste" className="w-6 h-6" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              Rabuste Admin
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              onClick={() => setActiveNav(item.title)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeNav === item.title
                ? "bg-accent/20 text-accent border border-accent/30"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
              {activeNav === item.title && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Link>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start gap-3 text-accent hover:text-accent hover:bg-accent/10"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border"
        >
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-semibold text-foreground">
                  Welcome back, <span className="text-accent">Jeet</span>
                </h1>
                <p className="text-muted-foreground mt-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Here's what's happening at Rabuste Coffee today.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="font-medium text-foreground">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Content */}
        <div className="p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getStatsData(dashboardStats).map((stat, index) => (
                <motion.div key={stat.title} variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-sm border-border hover:border-accent/30 transition-all duration-300 group hover:shadow-glow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground font-medium">
                            {stat.title}
                          </p>
                          <p className="text-3xl font-display font-bold text-foreground">
                            {stat.value}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`flex items-center text-sm font-medium ${stat.trendUp ? 'text-green-500' : 'text-red-400'
                              }`}>
                              {stat.trendUp ? (
                                <ArrowUpRight className="w-4 h-4" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4" />
                              )}
                              {stat.trend}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {stat.description}
                            </span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                          <stat.icon className="w-6 h-6 text-accent" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="bg-card/80 backdrop-blur-sm border-border h-full">
                  <CardHeader className="pb-4">
                    <CardTitle className="font-display text-xl flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading recent activity...</div>
                      ) : getRecentActivity(recentOrders).map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${activity.type === 'art' ? 'bg-green-500' :
                              activity.type === 'menu' ? 'bg-blue-500' :
                                'bg-accent'
                              }`} />
                            <span className="text-foreground font-medium">{activity.action}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{activity.time}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants}>
                <Card className="bg-card/80 backdrop-blur-sm border-border h-full">
                  <CardHeader className="pb-4">
                    <CardTitle className="font-display text-xl flex items-center gap-2">
                      <Coffee className="w-5 h-5 text-accent" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getQuickActions(dashboardStats).map((action, index) => (
                        <Link to={action.href || "#"} key={action.title}>
                          <motion.button
                            key={action.title}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full p-4 rounded-xl border border-border hover:border-accent/30 bg-muted/20 hover:bg-muted/40 transition-all flex items-center gap-4 group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                              <action.icon className="w-5 h-5 text-accent" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-foreground">{action.title}</p>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-accent transition-colors" />
                          </motion.button>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Module Selection Prompt */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <LayoutDashboard className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Select a Module
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Choose a section from the sidebar to manage your coffee shop.
                    View menu items, workshops, gallery, or franchise applications.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
