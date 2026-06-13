import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);
  const submitContact = useSubmitContact();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    submitContact.mutate(
      { data },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
      }
    );
  };

  return (
    <div className="w-full flex flex-col bg-background pb-32">
      <section className="pt-24 pb-16 md:pt-32 border-b border-border bg-card">
        <div className="container px-4 md:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary tracking-[0.2em] uppercase text-xs font-medium mb-6 block">
              Connect
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6">Contact Us</h1>
          </motion.div>
        </div>
      </section>

      <section className="pt-16">
        <div className="container px-4 md:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Info Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-12"
            >
              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Location</h3>
                <p className="text-lg font-serif text-foreground">
                  Dubai Autodrome Circuit<br />
                  Motor City, Dubai<br />
                  United Arab Emirates
                </p>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Hours</h3>
                <ul className="text-base text-foreground space-y-2 font-light">
                  <li className="flex justify-between max-w-[250px] border-b border-border/50 pb-2">
                    <span>Mon - Thu</span>
                    <span className="font-mono text-sm">10:00 - 22:00</span>
                  </li>
                  <li className="flex justify-between max-w-[250px] border-b border-border/50 pb-2">
                    <span>Fri - Sat</span>
                    <span className="font-mono text-sm">09:00 - 00:00</span>
                  </li>
                  <li className="flex justify-between max-w-[250px] pb-2">
                    <span>Sunday</span>
                    <span className="font-mono text-sm">09:00 - 22:00</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Direct</h3>
                <p className="text-base text-foreground font-light mb-2">
                  <span className="text-muted-foreground mr-4">T.</span>
                  <a href="tel:+97141234567" className="hover:text-primary transition-colors">+971 4 123 4567</a>
                </p>
                <p className="text-base text-foreground font-light">
                  <span className="text-muted-foreground mr-4">E.</span>
                  <a href="mailto:concierge@rctrackcafe.com" className="hover:text-primary transition-colors">concierge@rctrackcafe.com</a>
                </p>
              </div>
            </motion.div>

            {/* Form Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {isSuccess ? (
                <div className="bg-card border border-border p-12 text-center h-full flex flex-col justify-center items-center">
                  <div className="w-16 h-16 border border-primary rounded-full flex items-center justify-center mb-6 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h3 className="text-2xl font-serif text-foreground mb-4">Message Received</h3>
                  <p className="text-muted-foreground font-light mb-8">
                    We will be in touch shortly.
                  </p>
                  <Button 
                    variant="outline" 
                    className="rounded-none uppercase tracking-widest border-border text-foreground hover:bg-background"
                    onClick={() => {
                      setIsSuccess(false);
                      form.reset();
                    }}
                  >
                    Send Another
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card border border-border p-8 md:p-10">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="YOUR NAME" className="rounded-none bg-background border-border h-12 focus-visible:ring-primary uppercase" {...field} />
                          </FormControl>
                          <FormMessage className="text-destructive text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="YOUR EMAIL" type="email" className="rounded-none bg-background border-border h-12 focus-visible:ring-primary uppercase" {...field} />
                          </FormControl>
                          <FormMessage className="text-destructive text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Subject (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="INQUIRY SUBJECT" className="rounded-none bg-background border-border h-12 focus-visible:ring-primary uppercase" {...field} />
                          </FormControl>
                          <FormMessage className="text-destructive text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="HOW CAN WE ASSIST YOU?" 
                              className="rounded-none bg-background border-border min-h-[150px] focus-visible:ring-primary uppercase resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-destructive text-xs" />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={submitContact.isPending}
                      className="w-full rounded-none h-14 uppercase tracking-widest text-sm bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {submitContact.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
