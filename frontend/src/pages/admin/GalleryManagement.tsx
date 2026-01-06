import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Image, CheckCircle } from "lucide-react";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";


interface Art {
  _id: string;
  title: string;
  artist: string;
  price: number;
  status: string;
  imageUrl?: string;
}


export default function GalleryManagement() {
  const [artworks, setArtworks] = useState<Art[]>([]);
  const [stats, setStats] = useState({
    totalSold: 0,
    totalRevenue: 0,
  });

  const [weeklyStats, setWeeklyStats] = useState({
    thisWeekSales: 0,
    lastWeekSales: 0,
    percentageChange: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchData = async () => {
    try {
      // Public API – always allowed
      const artRes = await fetch("http://localhost:5000/api/art");
      setArtworks(await artRes.json());

      // 🔒 Protected APIs – only if token exists
      if (!token) return;

      const [overviewRes, weeklyRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/stats/overview", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:5000/api/admin/stats/weekly-sales", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setStats(await overviewRes.json());
      setWeeklyStats(await weeklyRes.json());
    } catch (err) {
      console.error("GalleryManagement fetch error:", err);
    }
  };

  fetchData();
}, [token]);



  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Gallery Management
        </h1>
        <p className="text-muted-foreground">
          Overview of all artworks and sales performance
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <DollarSign className="text-accent mb-2" />
            <p className="text-muted-foreground text-sm">Total Revenue</p>
            <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <CheckCircle className="text-accent mb-2" />
            <p className="text-muted-foreground text-sm">Paintings Sold</p>
            <p className="text-2xl font-bold">{stats.totalSold}</p>
          </CardContent>
        </Card>

        <Card>
  <CardContent className="p-6">
    <TrendingUp className="text-accent mb-2" />
    <p className="text-muted-foreground text-sm">Weekly Sales Trend</p>

    <div className="flex items-center gap-2">
      <p className="text-2xl font-bold">
        {weeklyStats.percentageChange}%
      </p>

      {weeklyStats.percentageChange >= 0 ? (
        <ArrowUpRight className="text-green-500" />
      ) : (
        <ArrowDownRight className="text-red-400" />
      )}
    </div>

    <p className="text-xs text-muted-foreground mt-1">
      vs last week
    </p>
  </CardContent>
</Card>

      </div>

      {/* Art List */}
      <Card>
        <CardHeader>
          <CardTitle>All Paintings ({artworks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {artworks.map((art) => (
              <div
                key={art._id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
              >
                <div>
                  <p className="font-medium">{art.title}</p>
                  <p className="text-sm text-muted-foreground">{art.artist}</p>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-accent font-semibold">₹{art.price}</span>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      art.status === "Sold"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-accent/20 text-accent"
                    }`}
                  >
                    {art.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
