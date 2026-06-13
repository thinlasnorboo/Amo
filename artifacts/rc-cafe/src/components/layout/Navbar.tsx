import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Menu", path: "/menu" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/90 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-primary group-hover:border-primary/80 transition-colors flex-shrink-0">
            <img src="/logo.jpeg" alt="LA RC Hub & Cafe" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg font-serif tracking-widest text-primary">LA RC HUB &amp; CAFE</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm uppercase tracking-widest hover:text-primary transition-colors ${
                location === link.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/book">
            <Button variant="default" className="rounded-none uppercase tracking-widest text-xs px-8">
              Reserve Now
            </Button>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border py-4 px-4 flex flex-col gap-4 md:hidden h-screen">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg uppercase tracking-widest border-b border-border/50 pb-2 ${
                location === link.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/book" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="default" className="w-full rounded-none uppercase tracking-widest mt-4 py-6">
              Reserve Now
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
