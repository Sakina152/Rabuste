import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Ban } from "lucide-react";
import { format } from "date-fns";
import { getToken } from "@/utils/getToken";
import WorkshopForm from "./WorkshopForm";

export default function WorkshopManager() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editWorkshop, setEditWorkshop] = useState<any>(null);

  /* ================= FETCH ================= */

  const fetchWorkshops = async () => {
    try {
      const res = await fetch("/api/workshops");
      const data = await res.json();
      setWorkshops(data.data || []);
    } catch {
      setError("Failed to load workshops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const auth = () => ({
    Authorization: `Bearer ${getToken()}`,
  });

  /* ================= ACTIONS ================= */

  const cancelWorkshop = async (id: string) => {
    await fetch(`/api/workshops/${id}/cancel`, {
      method: "PUT",
      headers: auth(),
    });
    fetchWorkshops();
  };

  const deleteWorkshop = async (id: string) => {
    await fetch(`/api/workshops/${id}/force`, {
      method: "DELETE",
      headers: auth(),
    });
    fetchWorkshops();
  };

  if (loading) return <div className="p-8">Loading…</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 bg-stone-900 text-white min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Workshop Manager</h1>
        <button
          onClick={() => { setEditWorkshop(null); setShowForm(true); }}
          className="bg-blue-600 px-4 py-2 rounded flex gap-2"
        >
          <Plus size={18} /> Add Workshop
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map(w => (
          <div key={w._id} className="bg-stone-800 rounded-xl overflow-hidden">
            <div className="h-40 bg-stone-700 flex items-center justify-center">
              {w.image ? (
                <img src={w.image} className="w-full h-full object-cover" />
              ) : (
                <span className="text-stone-400">No image</span>
              )}
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-xl font-semibold">{w.title}</h3>
              <p className="text-sm text-stone-400">
                {format(new Date(w.date), "dd MMM yyyy")} • {w.startTime}-{w.endTime}
              </p>

              <div className="flex flex-wrap gap-2 pt-3">
                <button onClick={() => { setEditWorkshop(w); setShowForm(true); }}
                  className="bg-stone-600 px-3 py-2 rounded flex gap-1">
                  <Pencil size={16} /> Edit
                </button>

                {w.status !== "cancelled" && (
                  <button onClick={() => cancelWorkshop(w._id)}
                    className="bg-yellow-600 px-3 py-2 rounded flex gap-1">
                    <Ban size={16} /> Cancel
                  </button>
                )}

                <button onClick={() => deleteWorkshop(w._id)}
                  className="bg-red-600 px-3 py-2 rounded flex gap-1">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
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