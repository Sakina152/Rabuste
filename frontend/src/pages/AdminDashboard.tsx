import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Users, Coffee, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    setAdminName(userInfo.name || "Admin");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex text-foreground">
      
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-black/40 backdrop-blur-md border-r border-white/10 p-6 hidden md:flex flex-col">
        <div className="mb-10 flex items-center gap-3">
          <div className="h-10 w-10 bg-terracotta rounded-full flex items-center justify-center">
             <Coffee className="text-white" size={20} />
          </div>
          <span className="font-display text-xl text-white">Rabuste Admin</span>
        </div>

        <nav className="space-y-2 flex-1">
          <Button variant="ghost" className="w-full justify-start text-terracotta bg-white/10">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-white hover:bg-white/5">
            <FileText className="mr-2 h-4 w-4" /> Applications
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-white hover:bg-white/5">
            <Users className="mr-2 h-4 w-4" /> Users
          </Button>
        </nav>

        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display text-white">Welcome back, {adminName}</h1>
            <p className="text-muted-foreground">Here is what's happening at Rabuste Coffee today.</p>
          </div>
          <div className="md:hidden">
            <Button size="sm" onClick={handleLogout} variant="destructive">Logout</Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Revenue", value: "$12,450", icon: Coffee, color: "text-terracotta" },
            { label: "Active Orders", value: "+24", icon: Users, color: "text-blue-400" },
            { label: "Pending Franchises", value: "3", icon: FileText, color: "text-yellow-400" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-card/40 backdrop-blur-md border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Placeholder Content Area */}
        <div className="rounded-xl border border-dashed border-white/20 h-64 flex items-center justify-center text-muted-foreground bg-white/5">
          Select a module from the sidebar to view details
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;