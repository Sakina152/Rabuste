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
import Franchise from "./pages/Franchise";
import Menu from "./pages/Menu";
import AdminRegister from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";
// 👇 1. IMPORT THESE TWO
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute"; 

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          
          {/* Admin Auth Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/*. PROTECTED ADMIN ROUTES */}
          {/* Anything inside this wrapper requires Login + Admin Role */}
          <Route element={<ProtectedRoute />}>
             <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;