import { useState, useEffect } from "react"; // Added useEffect
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useRazorpay } from "@/hooks/useRazorpay";
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
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  const { handlePayment, isProcessing } = useRazorpay();
  const [workshops, setWorkshops] = useState<Workshop[]>([]); // Dynamic state
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const [registeredWorkshop, setRegisteredWorkshop] = useState<Workshop | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfSeats: 1, // Added this as your backend requires it
  });

  // Inquiry form state
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    numberOfGuests: 10,
    preferredDate: "",
    message: ""
  });
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

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

    const workshopToRegister = selectedWorkshop; // Store reference

    // Initiate Razorpay Payment Flow
    await handlePayment('WORKSHOP', {
      workshop: selectedWorkshop,
      quantity: formData.numberOfSeats,
      participantDetails: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      onSuccess: async (result: any) => {
        // onSuccess callback from useRazorpay (after successful verification)

        // Use stored reference
        setRegisteredWorkshop(workshopToRegister);

        // Note: success toast is already shown by useRazorpay, but we can show registration details
        toast({
          title: "Registration Confirmed!",
          description: `See you there! Check your email for details.`,
        });

        // Clear form and close registration modal
        setFormData({ name: "", email: "", phone: "", numberOfSeats: 1 });
        setSelectedWorkshop(null);

        // Show calendar options after a brief delay
        setTimeout(() => {
          setShowCalendarOptions(true);
        }, 300);

        // Refresh workshops to update seat count
        try {
          const refreshRes = await fetch(`${API_URL}/api/workshops`);
          const refreshJson = await refreshRes.json();
          if (refreshJson.success) {
            setWorkshops(refreshJson.data);
          }
        } catch (err) {
          console.error("Error refreshing workshop data:", err);
        }
      },
      onError: (err: any) => {
        // Error already handled in useRazorpay
      }
    });
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

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            src="/workshop_background_vid.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-90"
          />
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-black/60 z-10" />
        </div>

        {/* Content */}
        <div className="container-custom relative z-20 px-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto lg:mx-0"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-8 italic drop-shadow-xl"
            >
              Learn, Create,
              <br />
              <span className="text-[#BC653B]">Experience Coffee.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/90 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0 drop-shadow-md"
            >
              Immerse yourself in the art of coffee making and creative expression
              through our curated workshops and hands-on experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="xl"
                className="group shadow-2xl bg-[#BC653B] hover:bg-[#BC653B]/90 text-white border-none rounded-full px-8 py-6 text-lg"
                onClick={() => {
                  document.querySelector('#workshops-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Workshops
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Curved wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Workshops Grid - Now Dynamic */}
      <section id="workshops-section" className="section-padding bg-[#110F0D] -mt-1 relative overflow-hidden min-h-screen">
        {/* Subtle Coffee Bean Texture Background */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="coffee-beans" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <path d="M50 50 C20 20 80 20 50 50 C20 80 80 80 50 50" fill="none" stroke="#BC653B" strokeWidth="2" opacity="0.1" transform="rotate(45 50 50)" />
                {/* Large Abstract Bean Shapes */}
                <path d="M150 150 Q100 100 150 50 T150 150" fill="none" stroke="#BC653B" strokeWidth="150" opacity="0.05" strokeLinecap="round" />
              </pattern>
            </defs>
            {/* Large blurry organic shapes for atmosphere */}
            <circle cx="10%" cy="20%" r="400" fill="#3C2A21" filter="url(#blur1)" opacity="0.2" />
            <circle cx="90%" cy="80%" r="500" fill="#4E3426" filter="url(#blur2)" opacity="0.15" />

            {/* Coffee Bean Outlines - Decorative */}
            <g opacity="0.08" stroke="#BC653B" strokeWidth="2" fill="none">
              <path d="M -100 300 Q 100 100 300 300 T 700 300" transform="scale(1.5) rotate(-15)" />
              <ellipse cx="80%" cy="30%" rx="150" ry="250" transform="rotate(30)" />
              <path d="M 800 100 C 700 300 900 300 800 500" strokeWidth="4" />
            </g>

            <defs>
              <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="120" />
              </filter>
              <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="150" />
              </filter>
            </defs>
          </svg>
        </div>

        <div className="container-custom relative z-10 pt-10">
          {/* View Toggle and Filter */}
          <div className="flex flex-col items-center gap-8 mb-20 relative">

            {/* Centered Pill Toggle */}
            <div className="flex bg-[#12100E] p-1.5 rounded-full border border-white/5 shadow-2xl">
              <button
                onClick={() => setViewMode("list")}
                className={`px-8 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${viewMode === "list"
                  ? "bg-[#BC653B] text-[#1A1614] shadow-lg shadow-[#BC653B]/20"
                  : "text-[#9A8B7D] hover:text-[#E8DCC4]"
                  }`}
              >
                LIST VIEW
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-8 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${viewMode === "calendar"
                  ? "bg-[#BC653B] text-[#1A1614] shadow-lg shadow-[#BC653B]/20"
                  : "text-[#9A8B7D] hover:text-[#E8DCC4]"
                  }`}
              >
                CALENDAR VIEW
              </button>
            </div>

            {/* Filter - Pushed to Absolute Top Right */}
            <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 flex items-center gap-3">
              <Filter size={16} className="text-[#6D5A4B]" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px] bg-transparent border-none text-[#9A8B7D] hover:text-[#E8DCC4] text-right font-medium">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1614] border border-[#3C2A21] text-[#E8DCC4]">
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
            <div className="text-center text-[#A8A29E] py-20">Loading experiences...</div>
          ) : viewMode === "calendar" ? (
            /* Calendar View */
            <div className="grid lg:grid-cols-[400px,1fr] gap-16 lg:gap-32 items-center justify-center max-w-6xl mx-auto">
              {/* Left Side: Minimal Dark Calendar Card */}
              <div className="bg-[#12100E] border border-[#3C2A21]/40 rounded-3xl p-8 shadow-2xl relative shadow-black/50">

                <div className="relative z-10">
                  <div className="mb-8 flex items-center justify-between px-2">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-2 text-[#6D5A4B] hover:text-[#E8DCC4] transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <h3 className="font-sans font-medium text-lg text-[#E8DCC4] tracking-wide">
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>

                    <button
                      onClick={() => changeMonth(1)}
                      className="p-2 text-[#6D5A4B] hover:text-[#E8DCC4] transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-y-4 gap-x-2 mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div key={i} className="text-center text-xs font-sans text-[#5C4D44] py-1">
                        {day}
                      </div>
                    ))}

                    {(() => {
                      const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(selectedDate);
                      const days = [];

                      // Empty cells
                      for (let i = 0; i < startingDayOfWeek; i++) {
                        days.push(<div key={`empty-${i}`} className="aspect-square" />);
                      }

                      // Days
                      for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(year, month, day);
                        const hasWorkshop = hasWorkshopOnDate(date);
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const isToday = date.toDateString() === new Date().toDateString();

                        days.push(
                          <button
                            key={day}
                            onClick={() => setSelectedDate(date)}
                            className={`w-10 h-10 mx-auto flex flex-col items-center justify-center rounded-full text-sm transition-all duration-300 relative group
                                ${isSelected
                                ? 'text-white shadow-[0_0_20px_rgba(188,101,59,0.4)]'
                                : 'text-[#9A8B7D] hover:text-white'
                              }
                                ${isToday && !isSelected ? 'border border-[#BC653B]' : ''}
                            `}
                          >
                            {/* Selected Background Gradient glow */}
                            {isSelected && (
                              <div className="absolute inset-0 rounded-full bg-[#BC653B] opacity-100 -z-10" />
                            )}

                            {day}

                            {hasWorkshop && (
                              <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#BC653B]'}`} />
                            )}
                          </button>
                        );
                      }

                      return days;
                    })()}
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-4 text-[11px] text-[#6D5A4B]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#BC653B]"></div>
                      <span>Has workshops</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Centered Minimal Info */}
              <div className="flex flex-col justify-center items-center text-center">
                <div className="max-w-xl">
                  <h3 className="font-serif text-5xl md:text-6xl text-[#E8DCC4] mb-6 leading-tight">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>

                  <div className="w-full flex justify-center">
                    {getWorkshopsForDate(selectedDate).length === 0 ? (
                      <p className="text-[#A8A29E] text-xl font-sans font-light">
                        No workshops scheduled for <br /> this date
                      </p>
                    ) : (
                      <div className="space-y-6 w-full text-left">
                        <p className="text-[#BC653B] text-lg font-sans font-medium text-center mb-8">
                          {getWorkshopsForDate(selectedDate).length} workshop{getWorkshopsForDate(selectedDate).length !== 1 ? 's' : ''} available
                        </p>
                        {getWorkshopsForDate(selectedDate).map((workshop) => {
                          const CategoryIcon = getCategoryIcon(workshop.type);

                          // Determine image based on type (matching List View)
                          let imageUrl = "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800"; // Default coffee
                          if (workshop.type === "art") imageUrl = "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800";
                          if (workshop.type === "community") imageUrl = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800";
                          if (workshop.type === "special") imageUrl = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800";

                          return (
                            <motion.div
                              key={workshop._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="group flex flex-row relative bg-[#1A1614]/40 border border-[#3C2A21] rounded-xl overflow-hidden hover:bg-[#2C2420]/60 transition-colors duration-300 h-40"
                            >
                              {/* Left Side Image */}
                              <div className="w-40 relative overflow-hidden flex-shrink-0">
                                <img
                                  src={imageUrl}
                                  alt={workshop.title}
                                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A1614]/20 to-[#1A1614]/90" />
                              </div>

                              <div className="p-5 flex flex-col justify-center flex-grow pl-2">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-serif text-2xl text-[#E8DCC4] group-hover:text-white transition-colors leading-none">
                                    {workshop.title}
                                  </h4>
                                  <span className="text-[#BC653B] font-mono text-xs font-bold bg-[#1A1614]/80 px-2 py-0.5 rounded border border-[#BC653B]/20">
                                    {workshop.startTime}
                                  </span>
                                </div>
                                <p className="text-[#9A8B7D] mb-3 text-sm font-light line-clamp-2 leading-snug">
                                  {workshop.description}
                                </p>
                                <div className="mt-auto">
                                  <Button
                                    variant="link"
                                    className="text-[#BC653B] p-0 h-auto font-sans tracking-wide text-xs uppercase hover:text-white"
                                    onClick={() => setSelectedWorkshop(workshop)}
                                    disabled={workshop.availableSeats === 0}
                                  >
                                    Reserve Spot →
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* List View - Premium Card Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
              {filteredWorkshops.map((workshop, index) => {
                // Determine image based on type
                let imageUrl = "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800"; // Default coffee
                if (workshop.type === "art") imageUrl = "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800";
                if (workshop.type === "community") imageUrl = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800";
                if (workshop.type === "special") imageUrl = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800";

                return (
                  <motion.div
                    key={workshop._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group flex flex-col bg-[#1E1C1A]/90 backdrop-blur-sm border border-[#5C4033]/40 rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl shadow-black/20 hover:border-[#BC653B]/50 transition-all duration-500"
                  >
                    {/* Image Thumbnail */}
                    <div className="px-5 pt-5">
                      <div className="relative h-48 w-full overflow-hidden rounded-2xl">
                        <img
                          src={imageUrl}
                          alt={workshop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                        />
                        {/* Top Right Price Tag - Floating on Image */}
                        <div className="absolute top-3 right-3 bg-[#1A1614]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#BC653B]/30">
                          <span className="text-[#BC653B] font-serif font-bold tracking-wide">
                            {workshop.price === 0 ? "Free" : `₹${workshop.price}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="font-serif text-2xl text-[#F2EFE9] mb-3 leading-tight group-hover:text-[#BC653B] transition-colors duration-300">
                          {workshop.title}
                        </h3>
                        <p className="text-[#9A8B7D] text-sm font-sans font-light leading-relaxed line-clamp-2">
                          {workshop.description}
                        </p>
                      </div>

                      {/* Seats Progress Bar - Dynamic */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center text-xs mb-1.5 font-medium tracking-wide">
                          <span className="text-[#8C837D]">Capacity</span>
                          <span className="text-[#BC653B]">{workshop.currentParticipants} / {workshop.maxParticipants} Booked</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#2C2420] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#BC653B] rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${Math.min(((workshop.currentParticipants || 0) / workshop.maxParticipants) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Metadata Row */}
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-8 mt-auto pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2.5 text-[#8C837D] text-xs font-medium uppercase tracking-wider">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#BC653B]" />
                          <span>{new Date(workshop.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[#8C837D] text-xs font-medium uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5 text-[#BC653B]" />
                          <span>{workshop.startTime}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[#8C837D] text-xs font-medium uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-[#BC653B]" />
                          <span>{workshop.duration}m</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[#8C837D] text-xs font-medium uppercase tracking-wider">
                          <Users className="w-3.5 h-3.5 text-[#BC653B]" />
                          <span>{workshop.availableSeats} Left</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full bg-[#BC653B] hover:bg-[#A05532] text-white rounded-full h-12 text-sm font-medium tracking-wide shadow-lg shadow-[#BC653B]/10 transition-all duration-300 transform active:scale-[0.98]"
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
        {/* Dual-Shroud Transition: Bottom Fade to Coffee-Dark */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-transparent to-coffee-dark pointer-events-none z-10" />
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
                      <Button type="submit" variant="hero" className="flex-1" disabled={isProcessing}>
                        {isProcessing ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm & Pay
                          </>
                        )}
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
      <section className="section-padding bg-coffee-dark relative overflow-hidden">
        {/* Dual-Shroud Transition: Top Fade from Coffee-Dark */}
        <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-coffee-dark via-coffee-dark/60 to-transparent pointer-events-none z-10" />
        <div className="container-custom relative z-20">
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
              <Dialog open={inquiryDialogOpen} onOpenChange={setInquiryDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" size="lg">
                    Inquire About Events
                    <ArrowRight className="ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-display">Event Inquiry</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={async (e) => {
                    e.preventDefault();

                    // Validate required fields
                    if (!inquiryForm.eventType) {
                      toast({
                        title: "Error",
                        description: "Please select an event type",
                        variant: "destructive"
                      });
                      return;
                    }

                    setSubmittingInquiry(true);
                    try {
                      console.log('Submitting inquiry:', inquiryForm);
                      console.log('API URL:', `${API_URL}/api/workshop-inquiries`);

                      // Prepare data - convert empty strings to undefined
                      const submissionData = {
                        ...inquiryForm,
                        preferredDate: inquiryForm.preferredDate || undefined,
                        message: inquiryForm.message || undefined
                      };

                      const response = await fetch(`${API_URL}/api/workshop-inquiries`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(submissionData)
                      });

                      if (!response.ok) {
                        const errorData = await response.json().catch(() => ({ message: 'Server error' }));
                        throw new Error(errorData.message || `Server returned ${response.status}`);
                      }

                      const data = await response.json();
                      if (data.success) {
                        toast({
                          title: "Inquiry Submitted!",
                          description: data.message || "We'll contact you soon.",
                          className: "bg-green-600 text-white"
                        });
                        setInquiryDialogOpen(false);
                        setInquiryForm({
                          name: "",
                          email: "",
                          phone: "",
                          eventType: "",
                          numberOfGuests: 10,
                          preferredDate: "",
                          message: ""
                        });
                      } else {
                        throw new Error(data.message || 'Submission failed');
                      }
                    } catch (error: any) {
                      console.error('Inquiry submission error:', error);
                      toast({
                        title: "Error",
                        description: error.message || "Failed to submit inquiry. Please ensure the backend server is running.",
                        variant: "destructive"
                      });
                    } finally {
                      setSubmittingInquiry(false);
                    }
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name *</Label>
                        <Input
                          required
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input
                          required
                          type="email"
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Phone *</Label>
                        <Input
                          required
                          type="tel"
                          value={inquiryForm.phone}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div>
                        <Label>Number of Guests *</Label>
                        <Input
                          required
                          type="number"
                          min="1"
                          value={inquiryForm.numberOfGuests}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, numberOfGuests: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Event Type *</Label>
                      <Select
                        required
                        value={inquiryForm.eventType}
                        onValueChange={(value) => setInquiryForm({ ...inquiryForm, eventType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private-tasting">Private Coffee Tasting</SelectItem>
                          <SelectItem value="corporate-workshop">Corporate Team Workshop</SelectItem>
                          <SelectItem value="art-exhibition">Art Exhibition Launch</SelectItem>
                          <SelectItem value="community-gathering">Community Gathering</SelectItem>
                          <SelectItem value="birthday">Birthday Celebration</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Preferred Date (Optional)</Label>
                      <Input
                        type="date"
                        value={inquiryForm.preferredDate}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, preferredDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <Label>Additional Message (Optional)</Label>
                      <Textarea
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        placeholder="Tell us more about your event requirements..."
                        rows={4}
                        maxLength={1000}
                      />
                    </div>

                    <Button type="submit" variant="hero" className="w-full" disabled={submittingInquiry}>
                      {submittingInquiry ? "Submitting..." : "Submit Inquiry"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
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