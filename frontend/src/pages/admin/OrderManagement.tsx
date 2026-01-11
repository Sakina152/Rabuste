import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Package, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface OrderItem {
  product?: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

interface ArtItem {
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
}

interface Order {
  _id: string;
  orderType: 'MENU' | 'ART';
  orderItems?: OrderItem[];
  artItem?: ArtItem;
  totalPrice: number;
  status: 'pending' | 'in progress' | 'delivered' | 'cancelled';
  customerName?: string;
  customerEmail?: string;
  createdAt: string;
  isPaid: boolean;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/orders`, {
        params: filterStatus !== 'all' ? { status: filterStatus } : {}
      });
      setOrders(response.data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, API_BASE]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      const response = await axios.put(
        `${API_BASE}/api/orders/${orderId}/status`,
        { status: newStatus }
      );
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus as Order['status'] } : order
      ));
      
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'in progress':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <div className="min-h-screen bg-background pt-28 pb-16">
      <div className="container-custom px-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/admin/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-accent" />
                Order Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and update order statuses
              </p>
            </div>
          </div>
          <Button onClick={fetchOrders} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Filter by Status:</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <div className="ml-auto text-sm text-muted-foreground">
                Showing {filteredOrders.length} order(s)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {filterStatus === 'all' 
                  ? 'No orders have been placed yet.'
                  : `No orders with status "${filterStatus}".`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      {/* Order Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">
                                Order #{order._id.slice(-8).toUpperCase()}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>
                                <strong>Type:</strong> {order.orderType === 'MENU' ? 'Menu Order' : 'Art Purchase'}
                              </p>
                              <p>
                                <strong>Customer:</strong> {order.customerName || 'N/A'} ({order.customerEmail || 'N/A'})
                              </p>
                              <p>
                                <strong>Date:</strong> {new Date(order.createdAt).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              <p>
                                <strong>Payment:</strong> {order.isPaid ? (
                                  <span className="text-green-500">Paid</span>
                                ) : (
                                  <span className="text-red-500">Not Paid</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        {order.orderType === 'MENU' && order.orderItems && order.orderItems.length > 0 && (
                          <div className="mt-4 border-t pt-4">
                            <h4 className="font-medium mb-3">Order Items:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {order.orderItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                  {item.image && (
                                    <img 
                                      src={item.image} 
                                      alt={item.name} 
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Qty: {item.qty} × ₹{item.price} = ₹{item.price * item.qty}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {order.orderType === 'ART' && order.artItem && (
                          <div className="mt-4 border-t pt-4">
                            <h4 className="font-medium mb-3">Art Purchase:</h4>
                            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                              <img 
                                src={order.artItem.imageUrl} 
                                alt={order.artItem.title} 
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium">{order.artItem.title}</p>
                                <p className="text-sm text-muted-foreground">By {order.artItem.artist}</p>
                                <p className="text-sm font-medium mt-1">₹{order.artItem.price}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xl font-bold">
                            Total: ₹{order.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Status Update Section */}
                      <div className="w-64 space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Update Status:
                          </label>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusUpdate(order._id, value)}
                            disabled={updatingStatus === order._id}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in progress">In Progress</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          {updatingStatus === order._id && (
                            <p className="text-xs text-muted-foreground mt-2">Updating...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
