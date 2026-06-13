import { motion } from "framer-motion";
import { useListServices } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Services() {
  const { data: services, isLoading } = useListServices();

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
    <div className="w-full flex flex-col bg-background pb-32">
      {/* Header */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 border-b border-border relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container px-4 md:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary tracking-[0.2em] uppercase text-xs font-medium mb-6 block">
              The Club
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-8">Experiences</h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
              From casual open practice to full telemetry-enabled private sessions. 
              Our tracks are built to international racing standards, offering an unmatched experience in the region.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="pt-24">
        <div className="container px-4 md:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-96 w-full bg-card rounded-none" />
              ))}
            </div>
          ) : services && services.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {services.map(service => (
                <motion.div key={service.id} variants={fadeIn}>
                  <Card className="h-full bg-card border-border rounded-none flex flex-col overflow-hidden group">
                    {/* Top Accent */}
                    <div className="h-1 w-full bg-border group-hover:bg-primary transition-colors" />
                    
                    <CardContent className="p-8 md:p-10 flex-grow flex flex-col relative">
                      {service.featured && (
                        <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-primary" />
                      )}
                      
                      <div className="mb-auto">
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 block">
                          {service.category}
                        </span>
                        <h3 className="text-3xl font-serif text-foreground mb-6">
                          {service.name}
                        </h3>
                        <p className="text-muted-foreground font-light leading-relaxed mb-8">
                          {service.description}
                        </p>
                      </div>
                      
                      <div className="pt-8 border-t border-border">
                        <div className="flex justify-between items-end mb-6">
                          <div>
                            <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Starting from</span>
                            <span className="text-2xl font-serif text-foreground">
                              AED {service.priceFrom}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground uppercase tracking-widest">
                            / {service.priceUnit}
                          </span>
                        </div>
                        <Link href="/book">
                          <Button variant="outline" className="w-full rounded-none uppercase tracking-widest border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-32 border border-border bg-card">
              <p className="text-muted-foreground uppercase tracking-widest">No experiences available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
