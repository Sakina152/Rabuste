import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Coffee, User, LogOut, LogIn, ShoppingBag } from "lucide-react"; // Added LogIn icon
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import rabusteLogo from "@/assets/rabuste-logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "About", path: "/about" },
  { name: "Art Gallery", path: "/gallery" },
  { name: "Workshops", path: "/workshops" },
  { name: "Franchise", path: "/franchise" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { cartCount } = useCart();

  // Auth State
  const [user, setUser] = useState<any>(null);


  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check login status on mount & route change
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      setUser(null);
    }
  }, [location]); // Re-check when URL changes (e.g. after login redirect)

  /* ---------------- Scroll effect ---------------- */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- Close menus on route change ---------------- */
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location]);

  /* ---------------- Close dropdown on outside click ---------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- Logout ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? "bg-background/95 backdrop-blur-md shadow-soft"
        : "bg-transparent"
        }`}
    >
      <nav className="container-custom flex items-center justify-between h-20 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={rabusteLogo} alt="Rabuste Coffee" className="h-12" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm transition-colors ${location.pathname === link.path
                ? "text-accent font-medium"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3 relative">
          <Button variant="hero" asChild>
            <Link to="/franchise" className="flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              Partner With Us
            </Link>
          </Button>

          {/* AUTH LOGIC: Show Dropdown OR Login Button */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Cart Icon - Only show when logged in */}
              <Link to="/checkout">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-terracotta text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Profile Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="w-10 h-10 rounded-full bg-[#5C3A21] text-white flex items-center justify-center hover:bg-[#6F4A2D] transition shadow-md"
                  aria-label="User menu"
                >
                  <User className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-48 rounded-xl overflow-hidden bg-[#5C3A21] text-white shadow-xl border border-[#6F4A2D]"
                    >
                      <div className="px-4 py-3 border-b border-[#6F4A2D]">
                        <p className="text-sm font-medium truncate">{user.name || "User"}</p>
                        <p className="text-xs text-white/70 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-3 hover:bg-[#6F4A2D] transition text-sm"
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[#6F4A2D] transition text-left text-sm text-red-200 hover:text-red-100"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            // IF NOT LOGGED IN
            <Button variant="outline" asChild className="gap-2">
              <Link to="/login">
                <LogIn className="w-4 h-4" /> Login
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-foreground"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t shadow-xl"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-lg text-muted-foreground hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-border" />

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-[#5C3A21] text-white flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/profile">My Profile</Link>
                  </Button>
                  <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-600 justify-start px-0">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </>
              ) : (
                <Button variant="default" asChild>
                  <Link to="/login">Login / Sign Up</Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;