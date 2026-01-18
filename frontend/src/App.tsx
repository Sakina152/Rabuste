import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { CartProvider } from "@/context/CartContext";
<<<<<<< Updated upstream
import { NotificationProvider } from "@/context/NotificationContext";
import GalleryManagement from "@/pages/admin/GalleryManagement";
=======
>>>>>>> Stashed changes
import AiBaristaBot from "./components/aiBaristaBot";
import ProtectedRoute from "./components/ProtectedRoute";
import CoffeeLoader from "./components/CoffeeLoader";

// Lazy Pages
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/UserLogin"));
const Register = lazy(() => import("./pages/UserRegister"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Workshops = lazy(() => import("./pages/Workshops"));
const WorkshopManager = lazy(() => import("@/pages/admin/WorkshopManager"));
const InquiryManagement = lazy(() => import("@/pages/admin/InquiryManagement"));
const Franchise = lazy(() => import("./pages/Franchise"));
const Menu = lazy(() => import("./pages/Menu"));
const VirtualTour = lazy(() => import("./pages/VirtualTour"));
const MenuManagement = lazy(() => import("./pages/admin/MenuManagement"));
const MenuItemForm = lazy(() => import("./pages/admin/MenuItemForm"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Profile = lazy(() => import("@/pages/Profile"));
const GalleryManagement = lazy(() => import("@/pages/admin/GalleryManagement"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const AdminRegister = lazy(() => import("./pages/admin/AdminRegister"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const OrderManagement = lazy(() => import("./pages/admin/OrderManagement"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />

<<<<<<< Updated upstream
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* 
=======
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<CoffeeLoader />}>
            <Routes>
            {/* 
>>>>>>> Stashed changes
              PUBLIC ROUTES - Accessible to everyone (logged in or not)
              "/" = Landing page with intro animation + full homepage
              All main pages are public for browsing
            */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/franchise" element={<Franchise />} />
              <Route path="/virtual-tour" element={<VirtualTour />} />

              {/* Checkout & Order Success - Works for both guests and logged-in users */}
              <Route path="/checkout" element={<Checkout />} />

              {/* Order Success */}
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* Admin Auth Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />

              {/* 
              PROTECTED ADMIN ROUTES - Requires admin authentication
              Uses ProtectedRoute component with Firebase/JWT verification
            */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/dashboard/menu-management" element={<MenuManagement />} />
                <Route path="/admin/dashboard/menu-management/new" element={<MenuItemForm />} />
                <Route path="/admin/dashboard/menu-management/edit/:id" element={<MenuItemForm />} />
                <Route path="/admin/dashboard/workshops" element={<WorkshopManager />} />
                <Route path="/admin/dashboard/inquiries" element={<InquiryManagement />} />
                <Route path="/admin/dashboard/orders" element={<OrderManagement />} />
                <Route path="/admin/dashboard/analytics" element={<Analytics />} />
                <Route path="/admin/gallery" element={<GalleryManagement />} />
              </Route>

              {/* 
              PROTECTED USER ROUTES - Requires user authentication
              Currently only /profile, but can add order history, saved items, etc.
            */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>

<<<<<<< Updated upstream
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AiBaristaBot />
          </BrowserRouter>
        </NotificationProvider>
=======
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          <AiBaristaBot />
        </BrowserRouter>
>>>>>>> Stashed changes
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;