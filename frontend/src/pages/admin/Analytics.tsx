import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    ArrowLeft,
    DollarSign,
    ShoppingBag,
    Palette,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    PieChart as PieIcon,
    BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from "recharts";
import { getToken } from "@/utils/getToken";

const COLORS = ["#8D6E63", "#D4AF37", "#4A3728", "#A67C52"];

export default function Analytics() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await axios.get(`${API_BASE}/api/analytics/comprehensive`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (error: any) {
            console.error("Error fetching analytics:", error);
            toast({
                title: "Error",
                description: "Failed to load analytics data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading && !data) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-background pt-32 px-6 text-center">
                <h2 className="text-2xl font-display text-foreground">No data available</h2>
                <Button onClick={fetchAnalytics} className="mt-4">Retry</Button>
            </div>
        );
    }

    const departmentData = [
        { name: "Menu Items", value: data?.art?.totalRevenue ? 0 : 1 }, // Fallback logic
        { name: "Art Gallery", value: data?.art?.totalRevenue || 0 },
        { name: "Workshops", value: data?.workshops?.stats?.reduce((acc: any, curr: any) => acc + curr.revenue, 0) || 0 }
    ];

    // Recalculate Menu value if we have more precise data, otherwise use a placeholder or sum best sellers
    const menuRevenue = data?.menu?.bestSellers?.reduce((acc: any, curr: any) => acc + curr.revenue, 0) || 0;
    departmentData[0].value = menuRevenue;

    return (
        <div className="min-h-screen bg-background pt-28 pb-16">
            <div className="container-custom px-6 max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" asChild className="p-0 md:p-4">
                            <Link to="/admin/dashboard">
                                <ArrowLeft className="w-4 h-4 mr-0 md:mr-2" />
                                <span className="hidden md:inline">Back to Dashboard</span>
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3 text-foreground">
                                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-accent" />
                                Analytics & Insights
                            </h1>
                            <p className="text-muted-foreground mt-1 text-xs md:text-sm">
                                A birds-eye view of Rabuste's performance across all departments.
                            </p>
                        </div>
                    </div>
                    <Button onClick={fetchAnalytics} variant="outline" disabled={loading} className="w-full md:w-auto">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </Button>
                </div>

                {/* Global Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Weekly Revenue"
                        value={`₹${data?.summary?.thisWeekRevenue?.toLocaleString('en-IN')}`}
                        trend={`${data?.summary?.revenueTrend}%`}
                        trendUp={data?.summary?.revenueTrend >= 0}
                        icon={DollarSign}
                        description="All departments this week"
                    />
                    <StatCard
                        title="Gallery Revenue"
                        value={`₹${data?.art?.totalRevenue?.toLocaleString('en-IN')}`}
                        trend="Total"
                        trendUp={true}
                        icon={Palette}
                        description="Lifetime art sales"
                    />
                    <StatCard
                        title="Workshop Earnings"
                        value={`₹${departmentData[2].value.toLocaleString('en-IN')}`}
                        trend="Active"
                        trendUp={true}
                        icon={Calendar}
                        description="Confirmed bookings"
                    />
                    <StatCard
                        title="Best Seller"
                        value={data?.menu?.bestSellers?.[0]?._id || "N/A"}
                        trend={data?.menu?.bestSellers?.[0]?.totalSold ? `${data?.menu?.bestSellers?.[0]?.totalSold} sold` : ""}
                        trendUp={true}
                        icon={ShoppingBag}
                        description="Top performing item"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Revenue Chart */}
                    <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-display">
                                <BarChart3 className="w-5 h-5 text-accent" />
                                Revenue Trend (Last 30 Days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] md:h-[350px] w-full min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data?.charts?.dailyRevenue}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                        <XAxis
                                            dataKey="_id"
                                            stroke="#888"
                                            fontSize={12}
                                            tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                        />
                                        <YAxis stroke="#888" fontSize={12} tickFormatter={(val) => `₹${val}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "#1A0F0A", border: "1px solid #4A3728", color: "#FDFCF0" }}
                                            itemStyle={{ color: "#D4AF37" }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#D4AF37"
                                            strokeWidth={3}
                                            dot={{ fill: "#D4AF37", r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Department Distribution */}
                    <Card className="bg-card/80 backdrop-blur-sm border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-display">
                                <PieIcon className="w-5 h-5 text-accent" />
                                Revenue by Department
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={departmentData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {departmentData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "#1A0F0A", border: "1px solid #4A3728", color: "#FDFCF0" }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-2">
                                {departmentData.map((dept, i) => (
                                    <div key={dept.name} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{dept.name}</span>
                                        <span className="font-medium">₹{dept.value.toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Menu Insights */}
                    <Card className="bg-card/50 border-border border-t-4 border-t-amber-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-display">Menu Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data?.menu?.bestSellers?.slice(0, 5).map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground group-hover:text-accent transition-colors">{item._id}</span>
                                        <span className="text-xs text-muted-foreground">{item.totalSold} units sold</span>
                                    </div>
                                    <span className="font-bold text-accent">₹{item.revenue.toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Art Insights */}
                    <Card className="bg-card/50 border-border border-t-4 border-t-yellow-600">
                        <CardHeader>
                            <CardTitle className="text-lg font-display">Gallery Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data?.art?.topArtists?.map((artist: any, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">{artist._id}</span>
                                        <span className="text-xs text-muted-foreground">{artist.count} pieces sold</span>
                                    </div>
                                    <span className="font-bold text-yellow-500">₹{artist.revenue.toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Workshop Insights */}
                    <Card className="bg-card/50 border-border border-t-4 border-t-emerald-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-display">Workshop Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data?.workshops?.stats?.slice(0, 5).map((ws: any, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground truncate max-w-[150px]">{ws.title}</span>
                                        <span className="text-xs text-muted-foreground">{ws.totalSeats} seats booked</span>
                                    </div>
                                    <span className="font-bold text-emerald-500">₹{ws.revenue.toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                </div>

            </div>
        </div>
    );
}

function StatCard({ title, value, trend, trendUp, icon: Icon, description }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="group"
        >
            <Card className="bg-card/80 backdrop-blur-sm border-border hover:border-accent/30 transition-all duration-300">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{title}</p>
                            <p className="text-2xl font-bold font-display text-foreground">{value}</p>
                            <div className="flex items-center gap-2">
                                <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-400'}`}>
                                    {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                    {trend}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium">{description}</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                            <Icon className="w-6 h-6 text-accent" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
