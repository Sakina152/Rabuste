import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getToken } from "@/utils/getToken";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/* ================= TYPES ================= */

interface Art {
  _id: string;
  title: string;
  artist: string;
  price: number;
  status: "Available" | "Reserved" | "Sold";
  image?: string; // Renamed from imageUrl
}

/* ================= COMPONENT ================= */

export default function GalleryManagement() {
  /* ---------- STATE ---------- */
  const [artworks, setArtworks] = useState<Art[]>([]);
  const [stats, setStats] = useState({ totalSold: 0, totalRevenue: 0 });
  const [weeklyStats, setWeeklyStats] = useState({
    percentageChange: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [editingArt, setEditingArt] = useState<Art | null>(null);

  const token = getToken();

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const artRes = await fetch(`${API_URL}/api/art`);
        setArtworks(await artRes.json());

        // Wait for token to be available if it's a promise (although here it seems synchronous based on usage,
        // but previous context suggested it might be async. 
        // Based on the code viewed previously, getToken() returns the token string directly if using localStorage, 
        // or a promise? Let's check imports. It imports getToken from utils.
        // Assuming synchronous usage based on existing code, but best to be safe if it was async earlier.
        // The existing code was : const token = getToken(); then using it in useEffect.
        // If it's async, we should await it.
        const resolvedToken = await Promise.resolve(token);

        if (!resolvedToken) return;

        const [overviewRes, weeklyRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/stats/overview`, {
            headers: { Authorization: `Bearer ${resolvedToken}` },
          }),
          fetch(`${API_URL}/api/admin/stats/weekly-sales`, {
            headers: { Authorization: `Bearer ${resolvedToken}` },
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

  /* ---------- ACTION HANDLERS ---------- */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this artwork?")) return;

    const resolvedToken = await Promise.resolve(token);

    const res = await fetch(`${API_URL}/api/art/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${resolvedToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to delete artwork");
      return;
    }

    setArtworks((prev) => prev.filter((a) => a._id !== id));
  };

  const handleStatusChange = async (
    id: string,
    status: "Available" | "Reserved" | "Sold"
  ) => {
    const resolvedToken = await Promise.resolve(token);
    if (!resolvedToken) return;

    const res = await fetch(
      `${API_URL}/api/art/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resolvedToken}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) {
      alert("Failed to update status");
      return;
    }

    const updatedArt = await res.json();

    setArtworks((prev) =>
      prev.map((art) =>
        art._id === updatedArt._id ? updatedArt : art
      )
    );
  };

  const openAddModal = () => {
    setEditingArt(null);
    setShowModal(true);
  };

  const openEditModal = (art: Art) => {
    setEditingArt(art);
    setShowModal(true);
  };

  /* ================= UI ================= */

  return (
    <div className="p-8 space-y-8">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-semibold">
            Gallery Management
          </h1>
          <p className="text-muted-foreground">
            Manage artworks, pricing and availability
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90"
        >
          <Plus size={16} /> Add Art
        </button>
      </motion.div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<DollarSign />}
          label="Total Revenue"
          value={`₹${stats.totalRevenue}`}
        />
        <StatCard
          icon={<CheckCircle />}
          label="Paintings Sold"
          value={stats.totalSold}
        />
        <StatCard
          icon={<TrendingUp />}
          label="Weekly Sales Trend"
          value={`${weeklyStats.percentageChange}%`}
          trend={weeklyStats.percentageChange}
        />
      </div>

      {/* All Paintings */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Paintings ({artworks.length})</CardTitle>

            <Button
              variant="hero"
              size="sm"
              onClick={openAddModal}
              className="flex gap-2"
            >
              <Plus size={16} />
              Add Art
            </Button>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((art) => (
            <motion.div
              key={art._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="relative overflow-hidden bg-card/80 border-border">

                {/* Image */}
                <div className="aspect-[4/5] bg-muted/40 overflow-hidden">
                  {art.image ? (
                    <img
                      src={`${API_URL}/${art.image.replace(/\\/g, "/")}`}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => openEditModal(art)}
                    className="p-2 bg-black/60 rounded-full hover:bg-black"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    onClick={() => handleDelete(art._id)}
                    className="p-2 bg-red-600/80 rounded-full hover:bg-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold">{art.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {art.artist}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-accent font-bold">
                      ₹{art.price ? Number(art.price).toLocaleString("en-IN") : "0"}
                    </span>

                    <span
                      className={`px-3 py-1 text-xs rounded-full ${art.status === "Sold"
                        ? "bg-red-500 text-white"
                        : art.status === "Reserved"
                          ? "bg-yellow-500 text-black"
                          : "bg-accent/20 text-accent"
                        }`}
                    >
                      {art.status}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>


      {/* ================= MODAL ================= */}
      {showModal && (
        <ArtModal
          art={editingArt}
          onClose={() => setShowModal(false)}
          onSuccess={(savedArt) => {
            setArtworks((prev) =>
              editingArt
                ? prev.map((a) => (a._id === savedArt._id ? savedArt : a))
                : [...prev, savedArt]
            );
            setShowModal(false);
          }}

        />
      )}

    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function StatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
  trend?: number;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-accent mb-2">{icon}</div>
        <p className="text-muted-foreground text-sm">{label}</p>

        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold">{value}</p>
          {trend !== undefined &&
            (trend >= 0 ? (
              <ArrowUpRight className="text-green-500" />
            ) : (
              <ArrowDownRight className="text-red-400" />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ArtModal({
  art,
  onClose,
  onSuccess,
}: {
  art: Art | null;
  onClose: () => void;
  onSuccess: (art: Art) => void;
}) {
  const token = getToken();

  const [title, setTitle] = useState(art?.title || "");
  const [artist, setArtist] = useState(art?.artist || "");
  const [price, setPrice] = useState(art?.price?.toString() || "");
  const [status, setStatus] = useState(art?.status || "Available");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    art?.image ? `${API_URL}/${art.image.replace(/\\/g, "/")}` : null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedToken = await Promise.resolve(token);

    if (!resolvedToken) {
      alert("Not authenticated");
      return;
    }

    const url = art
      ? `${API_URL}/api/art/${art._id}`
      : `${API_URL}/api/art`;

    const method = art ? "PUT" : "POST";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("price", price);
    formData.append("status", status);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${resolvedToken}`,
      },
      body: formData,
    });


    if (!res.ok) {
      const err = await res.json();
      console.error("Backend error:", err);
      alert(err.message || "Failed to save artwork");
      return;
    }

    const savedArt = await res.json();
    onSuccess(savedArt);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold">
            {art ? "Edit Artwork" : "Add New Artwork"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter artwork details below
          </p>
        </div>

        {/* Form */}
        <form className="px-6 py-5 space-y-4" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Artwork title"
              className="w-full rounded-xl bg-muted/40 border border-border px-4 py-2"
            />
          </div>

          {/* Artist */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Artist</label>
            <input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Artist name"
              className="w-full rounded-xl bg-muted/40 border border-border px-4 py-2"
            />
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price (₹)"
              className="w-full rounded-xl bg-muted/40 border border-border px-4 py-2"
            />
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Available" | "Reserved" | "Sold")}
              className="w-full rounded-xl bg-muted/40 border border-border px-4 py-2"
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Artwork Image</label>

            {imagePreview && (
              <div className="mb-2 h-40 w-full rounded-xl overflow-hidden border border-border">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-xl bg-muted/40 border border-border px-4 py-2"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm bg-muted hover:bg-muted/70 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl px-5 py-2 text-sm bg-accent text-accent-foreground hover:bg-accent/90 transition"
            >
              {art ? "Update Art" : "Create Art"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

