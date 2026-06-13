import { motion } from "framer-motion";
import { useListMenuItems } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Menu() {
  const { data: menuItems, isLoading } = useListMenuItems();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  // Group menu items by category
  const categories = ["espresso", "filter", "cold", "specialty", "food"] as const;
  
  const groupedItems = menuItems?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div className="w-full flex flex-col bg-background pb-32">
      {/* Header */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 border-b border-border relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="container px-4 md:px-8 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary tracking-[0.2em] uppercase text-xs font-medium mb-6 block">
              The Café
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-8">Artisan Menu</h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
              Sourced globally, roasted locally, extracted perfectly. 
              Our coffee program is as engineered as the machines on our tracks.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Menu Sections */}
      <section className="pt-24">
        <div className="container px-4 md:px-8 max-w-5xl mx-auto">
          {isLoading ? (
            <div className="space-y-24">
              {[1, 2].map(section => (
                <div key={section} className="space-y-8">
                  <Skeleton className="h-8 w-48 bg-card" />
                  <div className="space-y-6">
                    {[1, 2, 3].map(item => (
                      <div key={item} className="flex justify-between border-b border-border pb-6">
                        <div className="space-y-2 w-2/3">
                          <Skeleton className="h-6 w-full max-w-[250px] bg-card" />
                          <Skeleton className="h-4 w-full bg-card" />
                        </div>
                        <Skeleton className="h-6 w-16 bg-card" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : groupedItems ? (
            <div className="space-y-32">
              {categories.map(category => {
                const items = groupedItems[category];
                if (!items || items.length === 0) return null;

                return (
                  <motion.div
                    key={category}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="relative"
                  >
                    <div className="flex items-center gap-6 mb-12">
                      <h2 className="text-3xl font-serif text-foreground capitalize">{category}</h2>
                      <div className="h-px flex-grow bg-border" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                      {items.map(item => (
                        <div key={item.id} className="group relative">
                          {item.featured && (
                            <span className="absolute -left-4 top-1 text-primary text-xs">◆</span>
                          )}
                          <div className="flex justify-between items-baseline mb-2">
                            <h3 className="text-lg font-serif text-foreground group-hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                            <div className="flex-grow border-b border-dotted border-border/50 mx-4 relative top-[-4px]" />
                            <span className="text-foreground font-medium">AED {item.price}</span>
                          </div>
                          <p className="text-sm text-muted-foreground font-light pr-12 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
             <div className="text-center py-32 border border-border bg-card">
              <p className="text-muted-foreground uppercase tracking-widest">Menu is currently being updated.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
