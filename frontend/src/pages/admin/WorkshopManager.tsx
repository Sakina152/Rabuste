import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Ban,
  Calendar,
  Clock,
  Users,
  Coffee,
  Palette,
  Sparkles,
  Search,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { getToken } from "@/utils/getToken";
import { useToast } from "@/hooks/use-toast";
import WorkshopForm from "./WorkshopForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface Workshop {
  _id: string;
  title: string;
  description: string;
  type: "coffee" | "art" | "community" | "special";
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  image?: string;
  status: "draft" | "published" | "completed" | "cancelled";
  isFeatured: boolean;
}

export default function WorkshopManager() {
  const { toast } = useToast();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editWorkshop, setEditWorkshop] = useState<Workshop | null>(null);

  /* ================= FETCH ================= */

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/workshops`);
      const data = await res.json();
      if (data.success) {
        setWorkshops(data.data || []);
        setFilteredWorkshops(data.data || []);
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load workshops",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    const filtered = workshops.filter(w =>
      w.title.toLowerCase().includes(lower) ||
      w.status.toLowerCase().includes(lower)
    );
    setFilteredWorkshops(filtered);
  }, [searchQuery, workshops]);

  const auth = () => ({
    Authorization: `Bearer ${getToken()}`,
  });

  /* ================= ACTIONS ================= */

  const cancelWorkshop = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to cancel "${title}"? This will cancel all bookings.`)) return;

    try {
      const res = await fetch(`${API_URL}/workshops/${id}/cancel`, {
        method: "PUT",
        headers: auth(),
      });

      if (res.ok) {
        toast({ title: "Workshop Cancelled", description: `"${title}" has been cancelled.` });
        fetchWorkshops();
      } else {
        throw new Error();
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to cancel workshop." });
    }
  };

  const deleteWorkshop = async (id: string, title: string) => {
    if (!confirm(`PERMANENTLY DELETE "${title}"? This cannot be undone and deletes all booking history.`)) return;

    try {
      const res = await fetch(`${API_URL}/workshops/${id}/force`, {
        method: "DELETE",
        headers: auth(),
      });

      if (res.ok) {
        toast({ title: "Workshop Deleted", description: `"${title}" has been permanently removed.` });
        fetchWorkshops();
      } else {
        throw new Error();
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete workshop." });
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case "coffee": return <Coffee className="w-4 h-4" />;
      case "art": return <Palette className="w-4 h-4" />;
      case "community": return <Sparkles className="w-4 h-4" />;
      default: return <Coffee className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "draft": return "bg-stone-500/20 text-stone-400 border-stone-500/50";
      case "cancelled": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-stone-500/20 text-stone-400";
    }
  };

  if (loading && workshops.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 p-6 md:p-8 space-y-8 font-body">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-800 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-stone-100">Workshop Manager</h1>
          <p className="text-stone-400 mt-1">Create and manage your coffee experiences</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
            <Input
              placeholder="Search workshops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-600 focus:ring-amber-600/20"
            />
          </div>
          <Button
            onClick={() => { setEditWorkshop(null); setShowForm(true); }}
            className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-900/20 transition-all font-medium"
          >
            <Plus className="w-4 h-4 mr-2" /> New Workshop
          </Button>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredWorkshops.map((w, index) => (
            <motion.div
              key={w._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <Card className="bg-stone-900 border-stone-800 overflow-hidden hover:border-amber-500/30 transition-all group h-full flex flex-col">
                {/* Image Area */}
                <div className="relative h-48 w-full bg-stone-800 overflow-hidden">
                  {w.image ? (
                    <img
                      src={w.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={w.title}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-stone-600">
                      <Coffee className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={`backdrop-blur-md shadow-sm capitalize ${getStatusColor(w.status)}`}>
                      {w.status}
                    </Badge>
                    {w.isFeatured && (
                      <Badge className="bg-amber-500/90 text-white border-none shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Featured
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur text-xs px-2 py-1 rounded text-stone-300 border border-stone-700/50 flex items-center gap-1 capitalize">
                    {getCategoryIcon(w.type)} {w.type}
                  </div>
                </div>

                <CardContent className="p-5 flex-grow space-y-4">
                  <div>
                    <h3 className="text-xl font-display font-semibold text-stone-100 mb-1 leading-tight">{w.title}</h3>
                    <p className="text-sm text-stone-400 line-clamp-2">{w.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-sm text-stone-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      {w.date ? format(new Date(w.date), "MMM d, yyyy") : "No Date"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      {w.startTime} - {w.endTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-600" />
                      <span className={w.currentParticipants >= w.maxParticipants ? "text-red-400" : ""}>
                        {w.currentParticipants} / {w.maxParticipants}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-stone-200">
                      <span className="text-amber-600">$</span>
                      {w.price}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 border-t border-stone-800 bg-stone-900/50 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setEditWorkshop(w); setShowForm(true); }}
                    className="text-stone-300 hover:text-white hover:bg-stone-800"
                  >
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>

                  <div className="flex gap-1">
                    {w.status !== "cancelled" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => cancelWorkshop(w._id, w.title)}
                        className="text-yellow-600 hover:text-yellow-500 hover:bg-yellow-950/20"
                        title="Cancel Workshop"
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteWorkshop(w._id, w.title)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-950/20"
                      title="Force Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredWorkshops.length === 0 && (
          <div className="col-span-full py-12 text-center text-stone-500 bg-stone-900/50 rounded-xl border border-stone-800 border-dashed">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No workshops found</p>
            <p className="text-sm mt-1">Try adjusting your search or create a new one.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <WorkshopForm
            workshop={editWorkshop}
            onCancel={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              fetchWorkshops();
            }}
          />
        </div>
      )}
    </div>
  );
}