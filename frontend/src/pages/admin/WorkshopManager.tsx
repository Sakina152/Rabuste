import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { format } from 'date-fns';

interface Workshop {
  _id: string;
  title: string;
  date: string;
  time: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  image: string;
}

export default function WorkshopManager() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    price: '',
    maxParticipants: '',
    image: ''
  });

  // Fetch workshops
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch('/api/workshops');
        if (!response.ok) throw new Error('Failed to fetch workshops');
        const data = await response.json();
        setWorkshops(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/workshops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          maxParticipants: Number(formData.maxParticipants),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create workshop');
      }

      // Refresh the workshops list
      const updatedResponse = await fetch('/api/workshops');
      const updatedData = await updatedResponse.json();
      setWorkshops(updatedData.data);
      
      // Reset form and close modal
      setFormData({
        title: '',
        date: '',
        time: '',
        price: '',
        maxParticipants: '',
        image: ''
      });
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle workshop deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) return;

    try {
      const response = await fetch(`/api/workshops/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete workshop');

      // Update the workshops list
      setWorkshops(workshops.filter(workshop => workshop._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workshop');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  // Calculate progress percentage for the progress bar
  const getProgressPercentage = (current: number, max: number) => {
    return Math.min(100, Math.round((current / max) * 100));
  };

  if (isLoading && workshops.length === 0) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-stone-800 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-stone-800 rounded-lg p-4 h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Workshop Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Workshop</span>
          </button>
        </div>

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop) => (
            <div
              key={workshop._id}
              className="bg-stone-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Workshop Image */}
              <div className="h-48 bg-stone-700 relative">
                {workshop.image ? (
                  <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-700 to-stone-800">
                    <span className="text-stone-500">No image</span>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(workshop._id)}
                  className="absolute top-2 right-2 p-2 bg-red-600/90 hover:bg-red-700 rounded-full text-white"
                  aria-label="Delete workshop"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Workshop Details */}
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2 line-clamp-1">{workshop.title}</h3>
                
                <div className="space-y-3 text-stone-300 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-blue-400" />
                    <span>{formatDate(workshop.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-400" />
                    <span>{workshop.time || 'Time not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-green-400" />
                    <span>₹{workshop.price.toLocaleString()}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Seats</span>
                      <span>{workshop.currentParticipants}/{workshop.maxParticipants}</span>
                    </div>
                    <div className="w-full bg-stone-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${getProgressPercentage(
                            workshop.currentParticipants,
                            workshop.maxParticipants
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Workshop Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div 
              className="bg-stone-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Add New Workshop</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-stone-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium mb-1">
                        Time *
                      </label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium mb-1">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="maxParticipants" className="block text-sm font-medium mb-1">
                        Max Participants *
                      </label>
                      <input
                        type="number"
                        id="maxParticipants"
                        name="maxParticipants"
                        min="1"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        required
                        className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-stone-600 hover:bg-stone-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? 'Creating...' : 'Create Workshop'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}