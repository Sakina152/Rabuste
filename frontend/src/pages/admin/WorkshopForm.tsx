
import { useEffect, useState } from "react";
import { getToken } from "@/utils/getToken";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Image as ImageIcon,
  Save,
  X,
  CalendarIcon,
  Clock,
  User,
  Type
} from "lucide-react";
import { cn } from "@/lib/utils";
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface WorkshopFormProps {
  workshop?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function WorkshopForm({
  workshop,
  onSuccess,
  onCancel,
}: WorkshopFormProps) {
  const { toast } = useToast();
  const isEdit = Boolean(workshop);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    type: "coffee",
    instructorName: "",
    date: "",
    startTime: "",
    endTime: "",
    price: "",
    maxParticipants: "",
    status: "draft",
    isFeatured: false,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (!workshop) return;

    setFormData({
      title: workshop.title || "",
      description: workshop.description || "",
      shortDescription: workshop.shortDescription || "",
      type: workshop.type || "coffee",
      instructorName: workshop.instructor?.name || "",
      date: workshop.date ? new Date(workshop.date).toISOString().split('T')[0] : "",
      startTime: workshop.startTime || "",
      endTime: workshop.endTime || "",
      price: workshop.price !== undefined ? workshop.price : "",
      maxParticipants: workshop.maxParticipants !== undefined ? workshop.maxParticipants : "",
      status: workshop.status || "draft",
      isFeatured: workshop.isFeatured || false,
    });

    if (workshop.image) {
      // If image path doesn't start with http, assume it's relative
      setImagePreview(workshop.image.startsWith('http') ? workshop.image : `${API_URL}${workshop.image.startsWith('/uploads') ? '' : '/uploads/workshops/'}${workshop.image.replace('uploads/workshops/', '')}`);
    }
  }, [workshop]);

  /* ================= HANDLERS ================= */

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = await getToken();
    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to perform this action.",
      });
      setLoading(false);
      return;
    }

    // Basic Validation
    if (!formData.title || !formData.date || !formData.price || !formData.maxParticipants || !formData.instructorName || !formData.description) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields.",
      });
      setLoading(false);
      return;
    }

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      fd.append(key, String(value));
    });

    if (image) {
      fd.append("image", image);
    }

    try {
      const url = isEdit ? `${API_URL}/api/workshops/${workshop._id}` : `${API_URL}/api/workshops`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.errors?.[0] || "Operation failed");
      }

      toast({
        title: isEdit ? "Workshop Updated" : "Workshop Created",
        description: `Successfully ${isEdit ? "updated" : "created"} "${formData.title}"`,
      });

      onSuccess();
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <Card className="w-full max-w-4xl mx-auto bg-stone-900 border-stone-800 text-stone-100 shadow-2xl">
      <CardHeader className="border-b border-stone-800 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-display font-medium text-amber-500">
              {isEdit ? "Edit Workshop" : "New Workshop"}
            </CardTitle>
            <CardDescription className="text-stone-400 mt-1">
              Fill in the details to {isEdit ? "update" : "create"} a coffee experience.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel} className="text-stone-400 hover:text-stone-100 hover:bg-stone-800">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Section: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-stone-200 flex items-center gap-2">
              <Type className="w-4 h-4 text-amber-500" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-stone-300">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="bg-stone-800 border-stone-700 focus:border-amber-500 transition-colors"
                  placeholder="e.g. Latte Art Masterclass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-stone-300">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) => handleChange("type", val)}
                >
                  <SelectTrigger className="bg-stone-800 border-stone-700">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-stone-800 border-stone-700 text-stone-100">
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription" className="text-stone-300">Short Description</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleChange("shortDescription", e.target.value)}
                className="bg-stone-800 border-stone-700 focus:border-amber-500 min-h-[80px]"
                placeholder="Brief summary for cards (max 300 chars)..."
                maxLength={300}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-stone-300">Full Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="bg-stone-800 border-stone-700 focus:border-amber-500 min-h-[120px]"
                placeholder="Detailed workshop information..."
              />
            </div>
          </div>

          <div className="h-px bg-stone-800" />

          {/* Section: Instructor & Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-stone-200 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-500" />
              Instructor & Image
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instructorName" className="text-stone-300">Instructor Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="instructorName"
                    value={formData.instructorName}
                    onChange={(e) => handleChange("instructorName", e.target.value)}
                    className="bg-stone-800 border-stone-700 focus:border-amber-500"
                    placeholder="Who is leading this?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-stone-300">Price ($) <span className="text-red-500">*</span></Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      className="bg-stone-800 border-stone-700 focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants" className="text-stone-300">Capacity <span className="text-red-500">*</span></Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={(e) => handleChange("maxParticipants", e.target.value)}
                      className="bg-stone-800 border-stone-700 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-stone-300">Workshop Image</Label>
                <div className="border-2 border-dashed border-stone-700 rounded-lg p-4 flex flex-col items-center justify-center min-h-[160px] bg-stone-800/50 hover:bg-stone-800 transition-colors relative group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-full min-h-[140px]">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                    </div>
                  ) : (
                    <div className="text-center text-stone-500 group-hover:text-stone-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm">Click to upload image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-stone-800" />

          {/* Section: Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-stone-200 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-amber-500" />
              Schedule & Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-stone-300">Date <span className="text-red-500">*</span></Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="bg-stone-800 border-stone-700 text-stone-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-stone-300">Start Time <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleChange("startTime", e.target.value)}
                    className="bg-stone-800 border-stone-700 pl-9 text-stone-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-stone-300">End Time <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleChange("endTime", e.target.value)}
                    className="bg-stone-800 border-stone-700 pl-9 text-stone-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 mt-4 p-4 bg-stone-800/50 rounded-lg border border-stone-800">
              <div className="flex items-center gap-3">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleChange("isFeatured", checked)}
                />
                <Label htmlFor="isFeatured" className="cursor-pointer text-stone-300">
                  Feature on Homepage?
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Label htmlFor="status" className="text-stone-300">Status:</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => handleChange("status", val)}
                >
                  <SelectTrigger className="w-[140px] bg-stone-800 border-stone-700 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-stone-800 border-stone-700">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white min-w-[120px]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEdit ? "Update Workshop" : "Create Workshop"}
                </>
              )}
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
