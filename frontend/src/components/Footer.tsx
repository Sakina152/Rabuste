import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const exploreLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Art Gallery", path: "/gallery" },
    { name: "Workshops", path: "/workshops" },
    { name: "Franchise", path: "/franchise" },
  ];

  return (
    <footer style={{ backgroundColor: "#110F0D" }}>
      <div className="container-custom py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          {/* Left Section - Logo, Description & Instagram */}
          <div className="flex flex-col items-center md:items-start space-y-5 md:ml-12 lg:ml-20">
            <Link to="/">
              <img 
                src="/rabuste-logo.png" 
                alt="Rabuste Coffee" 
                className="h-20 w-auto"
              />
            </Link>
            <p 
              className="text-sm leading-relaxed text-center md:text-left max-w-xs"
              style={{ color: "#F5F5DC", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
            >
              The boldest Robusta coffee experience. Where coffee culture meets fine arts in a cozy, grab-and-go café.
            </p>
            <a
              href="https://www.instagram.com/rabuste.coffee/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
              style={{ color: "#F5F5DC" }}
            >
              <Instagram size={22} />
              <span className="text-sm" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
                @rabuste.coffee
              </span>
            </a>
          </div>

          {/* Middle Section - Explore & Contact */}
          <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-16">
            {/* Explore */}
            <div className="space-y-4">
              <h4 
                className="text-lg font-semibold tracking-wide"
                style={{ color: "#BC653B", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
              >
                Explore
              </h4>
              <nav className="flex flex-col gap-2">
                {exploreLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-sm hover:opacity-80 transition-opacity"
                    style={{ color: "#F5F5DC", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 
                className="text-lg font-semibold tracking-wide"
                style={{ color: "#BC653B", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
              >
                Contact
              </h4>
              <div className="flex flex-col gap-3">
                <div 
                  className="flex items-start gap-3 text-sm"
                  style={{ color: "#F5F5DC", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
                >
                  <MapPin size={18} className="mt-0.5 flex-shrink-0" style={{ color: "#BC653B" }} />
                  <span className="max-w-[180px]">Dimpal Row House, 15, Gymkhana Rd, Piplod, Surat, Gujarat 395007</span>
                </div>
                <div 
                  className="flex items-center gap-3 text-sm"
                  style={{ color: "#F5F5DC", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
                >
                  <Phone size={18} className="flex-shrink-0" style={{ color: "#BC653B" }} />
                  <span>+91 9574006100</span>
                </div>
                <div 
                  className="flex items-center gap-3 text-sm"
                  style={{ color: "#F5F5DC", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
                >
                  <Mail size={18} className="flex-shrink-0" style={{ color: "#BC653B" }} />
                  <span>rabustecoffee@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Decorative Image (Symmetrical to Left) */}
          <div className="flex flex-col items-center md:items-end md:mr-12 lg:mr-20">
            <img 
              src="/futer-removebg-preview.png" 
              alt="Rabuste Coffee Art" 
              className="h-40 w-auto object-contain"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/20 flex justify-center">
          <p 
            className="text-sm"
            style={{ color: "#F5F5DC", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
          >
            © 2026 Rabuste Coffee. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
