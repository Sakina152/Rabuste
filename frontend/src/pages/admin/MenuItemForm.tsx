import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { getToken } from "@/utils/getToken";

interface Category {
  _id: string;
  name: string;
}

export default function MenuItemForm() {
  const { id } = useParams();
  const isEdit = Boolean(id); ``

  const navigate = useNavigate();
  const { toast } = useToast();
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const [form, setForm] = useState({
    category: "",
    name: "",
    description: "",
    price: "",
    tags: "",
    displayOrder: 0,
    isVegetarian: true,
    isAvailable: true,
  });

  /* ================= FETCH ================= */

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
            category: item.category._id,
            name: item.name,
            description: item.description || "",
            price: String(item.price),
            tags: item.tags?.join(", ") || "",
            displayOrder: item.displayOrder || 0,
            isVegetarian: item.isVegetarian,
            isAvailable: item.isAvailable,
          });

          setExistingImage(item.image);
        });
    }
  }, [id]);

  /* ================= SUBMIT ================= */

  const submit = async () => {
    const token = await getToken();

    if (!token) {
      toast({
        title: "Not logged in",
        description: "Please login again",
        variant: "destructive",
      });
      return;
    }

    if (!form.name || !form.price || !form.category) {
      toast({
        title: "Missing fields",
        description: "Name, price and category are required",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("category", form.category);
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append(
      "tags",
      form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .join(",")
    );
    formData.append("displayOrder", String(form.displayOrder));
    formData.append("isVegetarian", String(form.isVegetarian));
    formData.append("isAvailable", String(form.isAvailable));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch(
      isEdit
        ? `${API}/api/menu/items/${id}`
        : `${API}/api/menu/items`,
      {
        method: isEdit ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ THIS WAS MISSING
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(text);

      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isEdit ? "Updated" : "Created",
      description: "Menu item saved successfully",
    });

    navigate("/admin/dashboard/menu-management");
  };

  /* ================= UI ================= */

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
            <Label>Category</Label>
            <select
              className="w-full border border-input bg-background text-foreground rounded-md px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
            <Label>Tags</Label>
            <Input
              value={form.tags}
              onChange={(e) =>
                setForm({ ...form, tags: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Menu Item Image</Label>
            {existingImage && !imageFile && (
              <img
                src={`${API}/${existingImage.replace(/\\/g, "/")}`}
                className="w-32 h-32 object-cover rounded mb-2"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImageFile(e.target.files?.[0] || null)
              }
            />
          </div>

          <div className="flex justify-between">
            <Label>Vegetarian</Label>
            <Switch
              checked={form.isVegetarian}
              onCheckedChange={(v) =>
                setForm({ ...form, isVegetarian: v })
              }
            />
          </div>

          <div className="flex justify-between">
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
