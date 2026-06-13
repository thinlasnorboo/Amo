import { motion } from "framer-motion";
import { useListGalleryItems } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Gallery() {
  const { data: items, isLoading } = useListGalleryItems();

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  return (
    <div className="w-full flex flex-col bg-background pb-32">
      {/* Header */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 border-b border-border">
        <div className="container px-4 md:px-8 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary tracking-[0.2em] uppercase text-xs font-medium mb-6 block">
              Visuals
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6">Gallery</h1>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Glimpses of the track, the machines, and the craft.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="pt-16">
        <div className="container px-4 md:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <Skeleton 
                  key={i} 
                  className={`w-full bg-card rounded-none ${i % 3 === 0 ? 'aspect-square' : i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`} 
                />
              ))}
            </div>
          ) : items && items.length > 0 ? (
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
            >
              {items.map((item, i) => (
                <motion.div 
                  key={item.id} 
                  variants={fadeIn}
                  className="break-inside-avoid group relative overflow-hidden bg-card border border-border"
                >
                  <div className={`w-full relative ${i % 3 === 0 ? 'aspect-square' : i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'} bg-muted`}>
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-card">
                         <span className="text-muted-foreground text-xs uppercase tracking-widest opacity-50">RC Track Café</span>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-primary text-[10px] uppercase tracking-[0.2em] mb-2">{item.category}</span>
                      <h3 className="text-foreground font-serif text-lg">{item.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-32 border border-border bg-card">
              <p className="text-muted-foreground uppercase tracking-widest">No images available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
