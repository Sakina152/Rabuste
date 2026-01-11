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
import { getToken } from "@/utils/getToken";


interface MenuItem {
    _id: string;
    name: string;
    price: number;
    image: string;
    isAvailable: boolean;
    category: {
        _id: string;
        name: string;
    };
}

export default function MenuManagement() {
    const [groupedItems, setGroupedItems] = useState<
        Record<string, { categoryName: string; items: MenuItem[] }>
    >({});

    const navigate = useNavigate();
    const { toast } = useToast();
    const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    const fetchMenuItems = async () => {
        const res = await fetch(`${API}/api/menu/items`);
        const data: MenuItem[] = await res.json();

        const grouped: Record<
            string,
            { categoryName: string; items: MenuItem[] }
        > = {};

        data.forEach((item) => {
            const catId = item.category._id;
            if (!grouped[catId]) {
                grouped[catId] = {
                    categoryName: item.category.name,
                    items: [],
                };
            }
            grouped[catId].items.push(item);
        });

        setGroupedItems(grouped);
    };

    const deleteItem = async (id: string) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this item?"
        );
        if (!confirmDelete) return;
        const token = await getToken();
        if (!token) {
            alert("Not logged in. Please login again.");
            return;
        }

        try {
            const res = await fetch(`${API}/api/menu/items/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("DELETE ERROR:", errorText);
                alert("Delete failed. Check console.");
                return;
            }

            toast({
                title: "Deleted",
                description: "Menu item removed successfully",
            });

            fetchMenuItems();

        } catch (err) {
            console.error("DELETE FAILED:", err);
            alert("Something went wrong");
        }
    };


    useEffect(() => {
        fetchMenuItems();
    }, []);

    return (
        <div className="p-8 space-y-10">
            {/* Header */}
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

            {/* Category Sections */}
            {Object.values(groupedItems).map((group) => (
                <div key={group.categoryName} className="space-y-4">
                    {/* Category Heading */}
                    <h2 className="text-xl font-display text-foreground">
                        {group.categoryName}
                    </h2>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.items.map((item) => (
                            <Card
                                key={item._id}
                                className="hover:shadow-md transition"
                            >
                                <CardContent className="p-4 space-y-3">
                                    {/* Thumbnail */}
                                    <div className="w-full h-40 rounded-lg overflow-hidden bg-muted">
                                        {item.image && item.image !== "null" ? (
                                            <img
                                                src={`${API}/${item.image.replace(/\\/g, "/")}`}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.error("Image load failed:", e.currentTarget.src);
                                                    // e.currentTarget.style.display = "none"; 
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <h3 className="font-medium text-lg">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            ₹{item.price}
                                        </p>
                                        <p
                                            className={`text-xs mt-1 ${item.isAvailable
                                                ? "text-green-500"
                                                : "text-red-400"
                                                }`}
                                        >
                                            {item.isAvailable ? "Available" : "Hidden"}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-2 pt-2">
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
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
