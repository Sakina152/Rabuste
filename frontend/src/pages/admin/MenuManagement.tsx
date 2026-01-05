import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Coffee,
  Plus,
  Pencil,
  Trash2,
  IndianRupee
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

interface Category {
  _id: string;
  name: string;
}

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category: Category;
  isAvailable: boolean;
}

/* ================= COMPONENT ================= */

export default function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_BASE_URL;

  /* ================= FETCH DATA ================= */

  const fetchCategories = async () => {
    const res = await fetch(`${API}/api/menu/categories`);
    const data = await res.json();
    setCategories(data);
  };

  const fetchMenuItems = async () => {
    const res = await fetch(`${API}/api/menu/items`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    Promise.all([fetchCategories(), fetchMenuItems()])
      .finally(() => setLoading(false));
  }, []);

  /* ================= ACTIONS ================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;

    await fetch(`${API}/api/menu/items/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    toast({
      title: "Deleted",
      description: "Menu item removed successfully"
    });

    fetchMenuItems();
  };

  /* ================= UI ================= */

  if (loading) {
    return <div className="p-10">Loading menu...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">
            Menu Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage categories & menu items
          </p>
        </div>

        <Button
          className="gap-2"
          onClick={() => navigate("/admin/dashboard/menu-management/new")}
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Menu Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-accent" />
            Menu Items
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="py-3 text-left">Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-muted/30 transition"
                  >
                    <td className="py-3 font-medium">
                      {item.name}
                    </td>
                    <td>{item.category?.name}</td>
                    <td className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {item.price}
                    </td>
                    <td>
                      {item.isAvailable ? (
                        <span className="text-green-500">Active</span>
                      ) : (
                        <span className="text-red-400">Hidden</span>
                      )}
                    </td>
                    <td className="text-right space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          navigate(
                            `/admin/dashboard/menu-management/edit/${item._id}`
                          )
                        }
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
