import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getToken } from "@/utils/getToken";
import {
  Calendar,
  Users,
  Mail,
  Phone,
  MessageSquare,
  Trash2,
  Filter
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface WorkshopInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  numberOfGuests: number;
  preferredDate?: string;
  message?: string;
  status: 'pending' | 'contacted' | 'confirmed' | 'rejected';
  inquiryNumber: string;
  createdAt: string;
}

const eventTypeLabels: Record<string, string> = {
  'private-tasting': 'Private Coffee Tasting',
  'corporate-workshop': 'Corporate Team Workshop',
  'art-exhibition': 'Art Exhibition Launch',
  'community-gathering': 'Community Gathering',
  'birthday': 'Birthday Celebration',
  'other': 'Other'
};

const statusColors: Record<string, string> = {
  'pending': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
  'contacted': 'bg-blue-500/20 text-blue-500 border-blue-500/50',
  'confirmed': 'bg-green-500/20 text-green-500 border-green-500/50',
  'rejected': 'bg-red-500/20 text-red-500 border-red-500/50'
};

const InquiryManagement = () => {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<WorkshopInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchInquiries = async () => {
    try {
      const token = await getToken();
      const url = filterStatus === "all" 
        ? `${API_URL}/api/workshop-inquiries`
        : `${API_URL}/api/workshop-inquiries?status=${filterStatus}`;
        
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast({
        title: "Error",
        description: "Failed to load inquiries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [filterStatus]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/workshop-inquiries/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Status updated successfully",
          className: "bg-green-600 text-white",
        });
        fetchInquiries();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/workshop-inquiries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Inquiry deleted successfully",
          className: "bg-green-600 text-white",
        });
        fetchInquiries();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete inquiry",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">
            Event Inquiries
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage workshop and event inquiries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['pending', 'contacted', 'confirmed', 'rejected'].map((status) => (
          <Card key={status}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground capitalize">{status}</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {inquiries.filter((i) => i.status === status).length}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inquiries List */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading inquiries...</p>
          </CardContent>
        </Card>
      ) : inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No inquiries found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((inquiry, index) => (
            <motion.div
              key={inquiry._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{inquiry.name}</CardTitle>
                        <Badge variant="outline" className={statusColors[inquiry.status]}>
                          {inquiry.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {inquiry.inquiryNumber} • {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={inquiry.status}
                        onValueChange={(value) => updateStatus(inquiry._id, value)}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteInquiry(inquiry._id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="text-sm text-accent hover:underline"
                        >
                          {inquiry.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="text-sm text-accent hover:underline"
                        >
                          {inquiry.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Guests</p>
                        <p className="text-sm font-medium">{inquiry.numberOfGuests}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Preferred Date</p>
                        <p className="text-sm font-medium">
                          {inquiry.preferredDate
                            ? new Date(inquiry.preferredDate).toLocaleDateString()
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Event Type</p>
                      <Badge variant="secondary">{eventTypeLabels[inquiry.eventType]}</Badge>
                    </div>
                    {inquiry.message && (
                      <div className="bg-muted/30 rounded-lg p-3 mt-3">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Message</p>
                            <p className="text-sm">{inquiry.message}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiryManagement;
