import { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Import logo
import logo from "@/assets/rabuste-logo.png";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard", active: true },
  { title: "Applications", icon: FileText, href: "/admin/applications" },
  { title: "Users", icon: Users, href: "/admin/users" },
];

const statsData = [
  { 
    title: "Total Revenue", 
    value: "₹12,450", 
    icon: DollarSign, 
    trend: "+12.5%", 
    trendUp: true,
    description: "vs last month"
  },
  { 
    title: "Active Orders", 
    value: "24", 
    icon: ShoppingBag, 
    trend: "+8", 
    trendUp: true,
    description: "this week"
  },
  { 
    title: "Pending Franchises", 
    value: "3", 
    icon: Building2, 
    trend: "-1", 
    trendUp: false,
    description: "awaiting review"
  },
  { 
    title: "Workshop Signups", 
    value: "47", 
    icon: Calendar, 
    trend: "+23%", 
    trendUp: true,
    description: "this month"
  },
];

const recentActivity = [
  { action: "New franchise inquiry", time: "2 min ago", type: "franchise" },
  { action: "Workshop booking confirmed", time: "15 min ago", type: "workshop" },
  { action: "Menu item updated", time: "1 hour ago", type: "menu" },
  { action: "New user registered", time: "3 hours ago", type: "user" },
];

const quickActions = [
  { title: "View Menu", description: "Manage items", icon: Coffee },
  { title: "Workshops", description: "5 upcoming", icon: Calendar },
  { title: "Analytics", description: "View reports", icon: TrendingUp },
];

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();

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
            <button
              key={item.title}
              onClick={() => setActiveNav(item.title)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeNav === item.title
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
              {activeNav === item.title && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
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
                  Welcome back, <span className="text-accent">Jake</span>
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
              {statsData.map((stat, index) => (
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
                            <span className={`flex items-center text-sm font-medium ${
                              stat.trendUp ? 'text-green-500' : 'text-red-400'
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
                      {recentActivity.map((activity, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-accent" />
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
                      {quickActions.map((action, index) => (
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
