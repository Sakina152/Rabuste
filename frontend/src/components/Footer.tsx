import { Link } from "react-router-dom";
import { Coffee, Instagram, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-espresso border-t border-border">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <Coffee className="w-8 h-8 text-accent" />
              <span className="font-display text-2xl font-bold text-foreground">
                Rabuste
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The boldest Robusta coffee experience. Where coffee culture meets
              fine arts in a cozy, grab-and-go café.
            </p>
            <a
              href="https://www.instagram.com/rabuste.coffee/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-terracotta-dark transition-colors"
            >
              <Instagram size={20} />
              <span className="text-sm">@rabuste.coffee</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-display text-lg font-semibold text-foreground">
              Explore
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { name: "About Us", path: "/about" },
                { name: "Why Robusta", path: "/why-robusta" },
                { name: "Art Gallery", path: "/gallery" },
                { name: "Workshops", path: "/workshops" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-muted-foreground text-sm hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Business */}
          <div className="space-y-6">
            <h4 className="font-display text-lg font-semibold text-foreground">
              Business
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { name: "Franchise", path: "/franchise" },
                { name: "Partner With Us", path: "/franchise" },
                { name: "Careers", path: "/franchise" },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="text-muted-foreground text-sm hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-display text-lg font-semibold text-foreground">
              Contact
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <span>123 Coffee Street, Art District, City 12345</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail size={18} className="text-accent flex-shrink-0" />
                <span>hello@rabuste.coffee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            {/* Change 2024 to {new Date().getFullYear()} */}
            © {new Date().getFullYear()} Rabuste Coffee. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Crafted with ☕ and passion for bold coffee
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
