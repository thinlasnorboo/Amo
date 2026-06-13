import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetStats, useListServices } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: services, isLoading: servicesLoading } = useListServices();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-border">
        {/* Background gradient/pattern could go here */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        
        <div className="container px-4 md:px-8 relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-primary tracking-[0.3em] uppercase text-sm md:text-sm font-medium mb-6 block">
              Dubai Autodrome Circuit
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground mb-8 leading-tight tracking-tight">
              Precision. <br />
              <span className="text-muted-foreground italic">Passion.</span> <br />
              Coffee.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              An exclusive sanctuary where high-performance RC motorsport meets artisanal coffee culture.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/book">
                <Button size="lg" className="rounded-none uppercase tracking-widest px-10 h-14 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                  Reserve Track Time
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="rounded-none uppercase tracking-widest px-10 h-14 border-primary text-primary hover:bg-primary/10 w-full sm:w-auto">
                  Explore Experiences
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-border bg-card/50">
        <div className="container px-4 md:px-8 py-12">
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="h-10 w-24 bg-border/50" />
                  <Skeleton className="h-4 w-32 bg-border/50" />
                </div>
              ))}
            </div>
          ) : stats ? (
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-border"
            >
              <motion.div variants={fadeIn} className="flex flex-col items-center justify-center text-center px-4">
                <span className="text-4xl md:text-5xl font-serif text-primary mb-2">{stats.totalTracks}</span>
                <span className="text-xs tracking-widest uppercase text-muted-foreground">Pro Tracks</span>
              </motion.div>
              <motion.div variants={fadeIn} className="flex flex-col items-center justify-center text-center px-4">
                <span className="text-4xl md:text-5xl font-serif text-primary mb-2">{stats.coffeeVarieties}</span>
                <span className="text-xs tracking-widest uppercase text-muted-foreground">Single Origins</span>
              </motion.div>
              <motion.div variants={fadeIn} className="flex flex-col items-center justify-center text-center px-4">
                <span className="text-4xl md:text-5xl font-serif text-primary mb-2">{stats.memberCount}+</span>
                <span className="text-xs tracking-widest uppercase text-muted-foreground">Club Members</span>
              </motion.div>
              <motion.div variants={fadeIn} className="flex flex-col items-center justify-center text-center px-4">
                <span className="text-4xl md:text-5xl font-serif text-primary mb-2">{stats.yearsOpen}</span>
                <span className="text-xs tracking-widest uppercase text-muted-foreground">Years of Excellence</span>
              </motion.div>
            </motion.div>
          ) : null}
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 md:py-32">
        <div className="container px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-serif mb-8 text-foreground">The RC Track Café Experience</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-light">
                Founded on a shared obsession for mechanical perfection and exceptional coffee, RC Track Café is Dubai's first venue to bridge the gap between high-end motorsport and artisanal café culture.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed font-light">
                Our tracks are meticulously designed for 1:10 and 1:28 scale racing, featuring telemetry timing systems and VIP pit areas. Meanwhile, our baristas pull espresso shots from rare single-origin beans, ensuring that whether you're behind the transmitter or a cup of coffee, you experience nothing but the best.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Teaser */}
      <section className="py-24 md:py-32 bg-card border-t border-b border-border">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
              className="max-w-2xl"
            >
              <span className="text-primary tracking-widest uppercase text-xs font-medium mb-4 block">Our Offerings</span>
              <h2 className="text-4xl font-serif text-foreground">Curated Experiences</h2>
            </motion.div>
            <Link href="/services">
              <Button variant="link" className="text-primary hover:text-primary/80 uppercase tracking-widest text-xs p-0 h-auto">
                View All Services &rarr;
              </Button>
            </Link>
          </div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-80 w-full bg-border/50 rounded-none" />
              ))}
            </div>
          ) : services && services.length > 0 ? (
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {services.slice(0, 3).map(service => (
                <motion.div key={service.id} variants={fadeIn}>
                  <Card className="h-full bg-background border-border rounded-none hover:border-primary/50 transition-colors group cursor-pointer overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <CardContent className="p-8 h-full flex flex-col relative z-10">
                      <div className="mb-auto">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block">
                          {service.category}
                        </span>
                        <h3 className="text-2xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-muted-foreground font-light leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      </div>
                      <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                        <span className="text-foreground font-serif">
                          AED {service.priceFrom} <span className="text-xs text-muted-foreground font-sans uppercase tracking-widest">/ {service.priceUnit}</span>
                        </span>
                        <span className="text-primary">&rarr;</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container px-4 md:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-8">Ready to Race?</h2>
            <p className="text-lg text-muted-foreground font-light mb-10">
              Secure your track time or VIP pit space in advance. Members enjoy priority booking and exclusive track configurations.
            </p>
            <Link href="/book">
              <Button size="lg" className="rounded-none uppercase tracking-widest px-12 h-14 bg-primary text-primary-foreground hover:bg-primary/90">
                Book Your Experience
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
