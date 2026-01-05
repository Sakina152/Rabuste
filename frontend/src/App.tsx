import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Workshops from "./pages/Workshops";
import WorkshopManager from "@/pages/admin/WorkshopManager";
import Franchise from "./pages/Franchise";
import Menu from "./pages/Menu";
import MenuManagement from "./pages/admin/MenuManagement";
import MenuItemForm from "./pages/admin/MenuItemForm";
import Checkout from "./pages/Checkout";

import { CartProvider } from "@/context/CartContext";
import FloatingCart from "./components/FloatingCart";

import OrderSuccess from "./pages/OrderSuccess";

import AdminRegister from "./pages/admin/AdminRegister";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute"; 
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
      
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/franchise" element={<Franchise />} />
          
          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />

          {/*Order success*/}
          <Route path="/order-success" element={<OrderSuccess />} />
          {/* Admin Auth Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          <Route path="/checkout" element={<Checkout />} />
          {/*. PROTECTED ADMIN ROUTES */}
          {/* Anything inside this wrapper requires Login + Admin Role */}
          <Route element={<ProtectedRoute />}>
             <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="/admin/dashboard/menu-management" element={<MenuManagement />} />
          <Route path="/admin/dashboard/menu-management/new" element={<MenuItemForm />} />
          <Route path="/admin/dashboard/menu-management/edit/:id" element={<MenuItemForm />} />
          <Route path="/admin/dashboard/workshops" element={<WorkshopManager />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingCart />
      </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;