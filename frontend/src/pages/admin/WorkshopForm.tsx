import { useEffect, useState } from "react";
import { getToken } from "@/utils/getToken";

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
  const isEdit = Boolean(workshop);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    type: "coffee",
    instructorName: "", // ✅ REQUIRED
    date: "",
    startTime: "",
    endTime: "",
    price: "",
    maxParticipants: "",
    status: "draft",
    isFeatured: false,
  });

  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ================= PREFILL (EDIT MODE) ================= */

  useEffect(() => {
    if (!workshop) return;

    setFormData({
      title: workshop.title || "",
      description: workshop.description || "",
      shortDescription: workshop.shortDescription || "",
      type: workshop.type || "coffee",
      instructorName: workshop.instructor?.name || "", // ✅ PREFILL
      date: workshop.date?.slice(0, 10) || "",
      startTime: workshop.startTime || "",
      endTime: workshop.endTime || "",
      price: workshop.price || "",
      maxParticipants: workshop.maxParticipants || "",
      status: workshop.status || "draft",
      isFeatured: workshop.isFeatured || false,
    });
  }, [workshop]);

  /* ================= CHANGE HANDLER ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
  setError(null);

  const token = getToken();
  if (!token) {
    setError("Not authenticated");
    return;
  }

  const fd = new FormData();

  fd.append("title", formData.title);
  fd.append("description", formData.description);
  fd.append("shortDescription", formData.shortDescription);
  fd.append("type", formData.type);
  fd.append("date", formData.date);
  fd.append("startTime", formData.startTime);
  fd.append("endTime", formData.endTime);
  fd.append("price", formData.price);
  fd.append("maxParticipants", formData.maxParticipants);
  fd.append("status", formData.status || "published");
  fd.append("isFeatured", String(formData.isFeatured));

  // 🔥 THIS IS THE FIX
  fd.append("instructorName", formData.instructorName);



  if (image) {
    fd.append("image", image);
  }

  try {
    const res = await fetch(
      isEdit ? `/api/workshops/${workshop._id}` : `/api/workshops`,
      {
        method: isEdit ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Validation failed");

    onSuccess();
  } catch (err: any) {
    setError(err.message);
  }
};


  /* ================= UI ================= */

  return (
    <div className="bg-stone-800 text-white p-6 rounded-xl w-full max-w-xl">
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? "Edit Workshop" : "Add Workshop"}
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <div className="space-y-3">
        <input
          name="title"
          placeholder="Title *"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 bg-stone-700 rounded"
        />

        <textarea
          name="description"
          placeholder="Description *"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 bg-stone-700 rounded"
        />

        <input
          name="instructorName"
          placeholder="Instructor Name *"
          value={formData.instructorName}
          onChange={handleChange}
          className="w-full p-2 bg-stone-700 rounded"
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 bg-stone-700 rounded"
        >
          <option value="coffee">Coffee</option>
          <option value="art">Art</option>
          <option value="community">Community</option>
          <option value="special">Special</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 bg-stone-700 rounded"
        />

        <div className="flex gap-2">
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-2 bg-stone-700 rounded"
          />
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full p-2 bg-stone-700 rounded"
          />
        </div>

        <input
          type="number"
          name="price"
          placeholder="Price *"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 bg-stone-700 rounded"
        />

        <input
          type="number"
          name="maxParticipants"
          placeholder="Max Participants *"
          value={formData.maxParticipants}
          onChange={handleChange}
          className="w-full p-2 bg-stone-700 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files?.[0] || null)}
        />

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onCancel} className="px-4 py-2 bg-stone-600 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 rounded"
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}