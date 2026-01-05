import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  isAvailable: boolean;
}

export default function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const API = import.meta.env.VITE_API_BASE_URL;

  const fetchMenuItems = async () => {
    const res = await fetch(`${API}/api/menu/items`);
    const data = await res.json();
    setItems(data);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;

    await fetch(`${API}/api/menu/items/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    toast({
      title: "Deleted",
      description: "Menu item removed",
    });

    fetchMenuItems();
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display">Menu Management</h1>

        <Button
          onClick={() =>
            navigate("/admin/dashboard/menu-management/new")
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-muted-foreground">
                <th className="text-left py-2">Name</th>
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
                  className="border-b hover:bg-muted/30"
                >
                  <td className="py-3 font-medium">{item.name}</td>
                  <td>{item.category?.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    {item.isAvailable ? "Active" : "Hidden"}
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
                      onClick={() => deleteItem(item._id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
