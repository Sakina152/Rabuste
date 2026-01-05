import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Category {
  _id: string;
  name: string;
}

export default function MenuItemForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const navigate = useNavigate();
  const { toast } = useToast();
  const API = import.meta.env.VITE_API_BASE_URL;

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isVegetarian: false,
    isAvailable: true,
  });

  useEffect(() => {
    fetch(`${API}/api/menu/categories`)
      .then((res) => res.json())
      .then(setCategories);

    if (isEdit) {
      fetch(`${API}/api/menu/items`)
        .then((res) => res.json())
        .then((items) => {
          const item = items.find((i: any) => i._id === id);
          if (!item) return;

          setForm({
            name: item.name,
            description: item.description || "",
            price: item.price,
            category: item.category._id,
            isVegetarian: item.isVegetarian,
            isAvailable: item.isAvailable,
          });
        });
    }
  }, [id]);

  const submit = async () => {
    const res = await fetch(
      isEdit
        ? `${API}/api/menu/items/${id}`
        : `${API}/api/menu/items`,
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      }
    );

    if (!res.ok) {
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isEdit ? "Updated" : "Added",
      description: "Menu item saved successfully",
    });

    navigate("/admin/dashboard/menu-management");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? "Edit Menu Item" : "Add Menu Item"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Price</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Category</Label>
            <select
              className="w-full border rounded p-2"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <Label>Vegetarian</Label>
            <Switch
              checked={form.isVegetarian}
              onCheckedChange={(v) =>
                setForm({ ...form, isVegetarian: v })
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Available</Label>
            <Switch
              checked={form.isAvailable}
              onCheckedChange={(v) =>
                setForm({ ...form, isAvailable: v })
              }
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={submit}>
              {isEdit ? "Update" : "Create"}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                navigate("/admin/dashboard/menu-management")
              }
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
