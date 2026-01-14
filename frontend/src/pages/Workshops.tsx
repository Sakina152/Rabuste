import { useState, useEffect } from "react"; // Added useEffect
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Coffee,
  Palette,
  Sparkles,
  CheckCircle,
  List,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Updated Interface to match your Mongoose Model
interface Workshop {
  _id: string; // Changed from id: number to match MongoDB _id
  title: string;
  description: string;
  type: "coffee" | "art" | "community" | "special"; // Matches model 'type'
  date: string;
  startTime: string; // Matches model
  endTime: string;   // Matches model
  duration: number;  // Matches model (minutes)
  maxParticipants: number; // Matches model
  currentParticipants: number; // Matches model
  availableSeats: number; // Virtual field from backend
  price: number; // Number in backend
  isFree: boolean;
}

const Workshops = () => {
  const { toast } = useToast();
  const [workshops, setWorkshops] = useState<Workshop[]>([]); // Dynamic state
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const [registeredWorkshop, setRegisteredWorkshop] = useState<Workshop | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfSeats: 1, // Added this as your backend requires it
  });

  // 1. Fetch Workshops from Backend
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch(`${API_URL}/api/workshops`);
        const json = await response.json();
        if (json.success) {
          setWorkshops(json.data);
        }
      } catch (error) {
        console.error("Error fetching workshops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  // 2. Handle Registration Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkshop) return;

    const workshopToRegister = selectedWorkshop; // Store reference before state changes

    try {
      const response = await fetch(`${API_URL}/api/workshops/${selectedWorkshop._id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantDetails: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          numberOfSeats: formData.numberOfSeats,
        }),
      });

      const json = await response.json();

      if (json.success) {
        // Use stored reference to avoid state timing issues
        setRegisteredWorkshop(workshopToRegister);
        
        toast({
          title: "Registration Successful!",
          description: `Booking ID: ${json.registrationNumber}. Check your email for confirmation.`,
        });
        
        // Clear form and close registration modal
        setFormData({ name: "", email: "", phone: "", numberOfSeats: 1 });
        setSelectedWorkshop(null);
        
        // Show calendar options after a brief delay to ensure smooth transition
        setTimeout(() => {
          setShowCalendarOptions(true);
        }, 300);

        // Refresh workshops to update seat count
        const refreshRes = await fetch(`${API_URL}/api/workshops`);
        const refreshJson = await refreshRes.json();
        setWorkshops(refreshJson.data);
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: json.message || "Something went wrong.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not connect to server.",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "coffee": return Coffee;
      case "art": return Palette;
      case "community": return Sparkles;
      default: return Coffee;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "coffee": return "bg-accent/20 text-accent";
      case "art": return "bg-terracotta/20 text-terracotta";
      case "community": return "bg-cream/20 text-cream";
      default: return "bg-accent/20 text-accent";
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getWorkshopsForDate = (date: Date) => {
    return workshops.filter(workshop => {
      const workshopDate = new Date(workshop.date);
      return workshopDate.toDateString() === date.toDateString();
    });
  };

  const hasWorkshopOnDate = (date: Date) => {
    return getWorkshopsForDate(date).length > 0;
  };

  const changeMonth = (increment: number) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + increment, 1));
  };

  const generateGoogleCalendarLink = (workshop: Workshop) => {
    try {
      // Parse date and time more reliably
      const workshopDate = new Date(workshop.date);
      const [hours, minutes] = workshop.startTime.split(':').map(Number);
      
      const startDate = new Date(workshopDate);
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate.getTime() + workshop.duration * 60000);
      
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const sec = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}T${hour}${min}${sec}`;
      };

      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: workshop.title,
        dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
        details: workshop.description,
        location: 'Rabuste Coffee, Dimpal Row House, 15, Gymkhana Rd, Piplod, Surat, Gujarat 395007',
      });

      return `https://calendar.google.com/calendar/render?${params.toString()}`;
    } catch (error) {
      console.error('Error generating Google Calendar link:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate calendar link. Please try downloading the .ics file instead.",
      });
      return '';
    }
  };

  const downloadICSFile = (workshop: Workshop) => {
    try {
      // Parse date and time more reliably
      const workshopDate = new Date(workshop.date);
      const [hours, minutes] = workshop.startTime.split(':').map(Number);
      
      const startDate = new Date(workshopDate);
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate.getTime() + workshop.duration * 60000);
      
      const formatICSDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const sec = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}T${hour}${min}${sec}`;
      };

      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Rabuste Coffee//Workshops//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${workshop._id}@rabuste.coffee
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${workshop.title}
DESCRIPTION:${workshop.description.replace(/\n/g, '\\n')}
LOCATION:Rabuste Coffee\\, Dimpal Row House\\, 15\\, Gymkhana Rd\\, Piplod\\, Surat\\, Gujarat 395007
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `rabuste-${workshop.title.toLowerCase().replace(/\s+/g, '-')}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      
      toast({
        title: "Calendar File Downloaded!",
        description: "Open the file to add this workshop to your calendar app.",
      });
    } catch (error) {
      console.error('Error downloading ICS file:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not create calendar file. Please try again.",
      });
    }
  };

  const filteredWorkshops = categoryFilter === "all" 
    ? workshops 
    : workshops.filter(w => w.type === categoryFilter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Preserved Design */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-hero-gradient">
        <div className="container-custom relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
              Learn & Create
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mt-4 mb-6">
              Workshops &{" "}
              <span className="text-gradient">Experiences</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Immerse yourself in the world of coffee and art through our curated
              workshops. From brewing techniques to creative sessions, there's
              something for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Workshops Grid - Now Dynamic */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* View Toggle and Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex gap-2 bg-card border border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === "list" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List size={16} />
                <span className="text-sm font-medium uppercase tracking-wide">List View</span>
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === "calendar" 
                    ? "bg-accent text-background shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CalendarIcon size={16} />
                <span className="text-sm font-medium uppercase tracking-wide">Calendar View</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={16} className="text-accent" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] bg-card border-border">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="coffee">Coffee</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="special">Special</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground">Loading experiences...</div>
          ) : viewMode === "calendar" ? (
            /* Calendar View */
            <div className="grid lg:grid-cols-[1fr,1.5fr] gap-8">
              {/* Calendar */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="mb-6">
                  <h3 className="text-accent text-sm tracking-[0.3em] uppercase font-body mb-2">
                    Select Date
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <h4 className="font-display text-xl font-bold text-foreground">
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                    <button
                      onClick={() => changeMonth(1)}
                      className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                  
                  {(() => {
                    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(selectedDate);
                    const days = [];
                    
                    // Empty cells before first day
                    for (let i = 0; i < startingDayOfWeek; i++) {
                      days.push(<div key={`empty-${i}`} className="aspect-square" />);
                    }
                    
                    // Days of month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(year, month, day);
                      const hasWorkshop = hasWorkshopOnDate(date);
                      const isSelected = date.toDateString() === selectedDate.toDateString();
                      const isToday = date.toDateString() === new Date().toDateString();
                      
                      days.push(
                        <button
                          key={day}
                          onClick={() => setSelectedDate(date)}
                          className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all relative
                            ${isSelected ? 'bg-accent text-background' : 'text-foreground hover:bg-accent/10'}
                            ${isToday && !isSelected ? 'ring-2 ring-accent/50' : ''}
                          `}
                        >
                          {day}
                          {hasWorkshop && (
                            <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? 'bg-background' : 'bg-accent'}`} />
                          )}
                        </button>
                      );
                    }
                    
                    return days;
                  })()}
                </div>

                <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span>Has workshops</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full ring-2 ring-accent/50"></div>
                    <span>Today</span>
                  </div>
                </div>
              </div>

              {/* Selected Date Workshops */}
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-1">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {getWorkshopsForDate(selectedDate).length} workshop{getWorkshopsForDate(selectedDate).length !== 1 ? 's' : ''} scheduled
                </p>

                <div className="space-y-4">
                  {getWorkshopsForDate(selectedDate).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No workshops scheduled for this date
                    </div>
                  ) : (
                    getWorkshopsForDate(selectedDate).map((workshop) => {
                      const CategoryIcon = getCategoryIcon(workshop.type);
                      return (
                        <motion.div
                          key={workshop._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-card border border-border rounded-2xl p-6 hover:border-accent/50 transition-all"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-xl ${getCategoryColor(workshop.type)}`}>
                              <CategoryIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-display text-xl font-semibold text-foreground">
                                  {workshop.title}
                                </h4>
                                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-2 py-1 bg-accent/10 rounded">
                                  {workshop.type}
                                </span>
                              </div>
                              <p className="text-muted-foreground text-sm mb-4">
                                {workshop.description}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <CalendarIcon size={14} className="text-accent" />
                              <span>{new Date(workshop.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <Clock size={14} className="text-accent" />
                              <span>{workshop.startTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <MapPin size={14} className="text-accent" />
                              <span>Surat</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <Users size={14} className="text-accent" />
                              <span>Instructor: Sam</span>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-4 border-t border-border">
                            <Button
                              variant="subtle"
                              size="default"
                              className="flex-1"
                              onClick={() => window.open(generateGoogleCalendarLink(workshop), '_blank')}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              Add to Calendar
                            </Button>
                            <Button
                              variant="hero"
                              size="default"
                              className="flex-1"
                              onClick={() => setSelectedWorkshop(workshop)}
                              disabled={workshop.availableSeats === 0}
                            >
                              Book Now
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* List View */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWorkshops.map((workshop, index) => {
                const CategoryIcon = getCategoryIcon(workshop.type);
                return (
                  <motion.div
                    key={workshop._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-500 overflow-hidden"
                  >
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${getCategoryColor(workshop.type)}`}>
                          <CategoryIcon className="w-6 h-6" />
                        </div>
                        <span className="font-display text-2xl font-bold text-accent">
                          {workshop.price === 0 ? "Free" : `₹${workshop.price}`}
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                        {workshop.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {workshop.description}
                      </p>
                    </div>

                    <div className="px-6 py-4 border-t border-border bg-coffee-dark/50">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <CalendarIcon size={14} className="text-accent" />
                          <span>{new Date(workshop.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Clock size={14} className="text-accent" />
                          <span>{workshop.startTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Sparkles size={14} className="text-accent" />
                          <span>{workshop.duration} mins</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Users size={14} className="text-accent" />
                          <span>{workshop.availableSeats} seats left</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{
                              width: `${(workshop.currentParticipants / workshop.maxParticipants) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <Button
                        variant="hero"
                        size="default"
                        className="w-full"
                        onClick={() => setSelectedWorkshop(workshop)}
                        disabled={workshop.availableSeats === 0}
                      >
                        {workshop.availableSeats === 0 ? "Sold Out" : "Register Now"}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal - Preserved Design with updated Fields */}
      <AnimatePresence>
        {selectedWorkshop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedWorkshop(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-lg w-full bg-card rounded-2xl overflow-hidden border border-border"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="p-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Register for Workshop
              </h2>
              <p className="text-accent font-medium mb-6">
                {selectedWorkshop.title}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                </div>

                {/* Added Seats input as per model requirement */}
                <div className="space-y-2">
                  <Label htmlFor="seats">Number of Seats (Max 5)</Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.numberOfSeats}
                    onChange={(e) => setFormData({ ...formData, numberOfSeats: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-display text-2xl font-bold text-accent">
                      {selectedWorkshop.price === 0 ? "Free" : `₹${selectedWorkshop.price * formData.numberOfSeats}`}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="subtle"
                      className="flex-1"
                      onClick={() => setSelectedWorkshop(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="hero" className="flex-1">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Options Modal - After Registration */}
      <AnimatePresence>
        {showCalendarOptions && registeredWorkshop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => {
              setShowCalendarOptions(false);
              setRegisteredWorkshop(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full bg-card rounded-2xl overflow-hidden border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    Registration Confirmed!
                  </h2>
                  <p className="text-muted-foreground">
                    Add this workshop to your calendar
                  </p>
                </div>

                <div className="bg-coffee-dark/50 rounded-xl p-4 mb-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {registeredWorkshop.title}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={14} className="text-accent" />
                      <span>{new Date(registeredWorkshop.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-accent" />
                      <span>{registeredWorkshop.startTime} ({registeredWorkshop.duration} mins)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-accent" />
                      <span>Rabuste Coffee, Surat</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Google Calendar button clicked', registeredWorkshop);
                      const calendarLink = generateGoogleCalendarLink(registeredWorkshop);
                      if (calendarLink) {
                        window.open(calendarLink, '_blank', 'noopener,noreferrer');
                        toast({
                          title: "Opening Google Calendar",
                          description: "Add this workshop to your Google Calendar.",
                        });
                      }
                    }}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Add to Google Calendar
                  </Button>

                  <Button
                    variant="subtle"
                    size="lg"
                    className="w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Download ICS button clicked', registeredWorkshop);
                      downloadICSFile(registeredWorkshop);
                    }}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Download Calendar File (.ics)
                  </Button>

                  <Button
                    variant="subtle"
                    size="default"
                    className="w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowCalendarOptions(false);
                      setRegisteredWorkshop(null);
                    }}
                  >
                    Skip for Now
                  </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                  A confirmation email with calendar file has been sent to your email.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Private Events Section - Preserved Design */}
      <section className="section-padding bg-coffee-dark">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent text-sm tracking-[0.3em] uppercase font-body">
                Private Events
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                Host Your Event at Rabuste
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Looking for a unique venue for your corporate team-building,
                birthday celebration, or private coffee tasting? Our café space can
                be transformed for your special occasion.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Private coffee tasting sessions",
                  "Corporate team workshops",
                  "Art exhibition launches",
                  "Community gatherings",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero" size="lg" asChild>
                <Link to="/franchise">
                  Inquire About Events
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-coffee-medium to-espresso overflow-hidden border border-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-accent mx-auto mb-4" />
                    <span className="font-display text-xl font-semibold text-foreground">
                      Private Events Welcome
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Workshops;