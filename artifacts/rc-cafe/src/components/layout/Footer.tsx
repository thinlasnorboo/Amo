import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-2xl font-serif tracking-widest text-primary flex items-center gap-2 mb-6">
            <span className="w-8 h-8 rounded-full border border-primary flex items-center justify-center">R</span>
            RC TRACK CAFÉ
          </Link>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
            Dubai's premier luxury RC racing venue and artisan café. 
            Where the precision of motorsport meets the craft of specialty coffee.
          </p>
        </div>
        
        <div>
          <h4 className="text-foreground uppercase tracking-widest text-sm mb-6">Explore</h4>
          <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
            <li><Link href="/services" className="hover:text-primary transition-colors">Experiences</Link></li>
            <li><Link href="/menu" className="hover:text-primary transition-colors">Menu</Link></li>
            <li><Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
            <li><Link href="/book" className="hover:text-primary transition-colors">Reservations</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-foreground uppercase tracking-widest text-sm mb-6">Contact</h4>
          <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
            <li>Dubai Autodrome Circuit</li>
            <li>Motor City, Dubai, UAE</li>
            <li>+971 4 123 4567</li>
            <li>concierge@rctrackcafe.com</li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          &copy; {new Date().getFullYear()} RC Track Café. All rights reserved.
        </p>
        <div className="flex gap-4">
          {/* Social icons could go here */}
          <a href="#" className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all">
            <span className="sr-only">Instagram</span>
            Ig
          </a>
        </div>
      </div>
    </footer>
  );
}
