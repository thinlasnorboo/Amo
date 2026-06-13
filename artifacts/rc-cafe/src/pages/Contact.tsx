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
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = (data: FormValues) => {
    submitContact.mutate({ data }, { onSuccess: () => setIsSuccess(true) });
  };

  return (
    <div className="w-full flex flex-col bg-background pb-32">
      {/* Header */}
      <section className="pt-24 pb-16 md:pt-32 border-b border-border bg-card">
        <div className="container px-4 md:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-primary tracking-[0.2em] uppercase text-xs font-medium mb-6 block">Connect</span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6">Contact Us</h1>
          </motion.div>
        </div>
      </section>

      <section className="pt-16">
        <div className="container px-4 md:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-12"
            >
              {/* Location */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Location</h3>
                <a
                  href="https://maps.app.goo.gl/Ax5oZPLmYdmaUmk56?g_st=ic"
                  target="_blank" rel="noopener noreferrer"
                  className="group"
                >
                  <p className="text-lg font-serif text-foreground group-hover:text-primary transition-colors leading-relaxed">
                    LA RC Hub &amp; Cafe<br />
                    View on Google Maps →
                  </p>
                </a>
              </div>

              {/* Hours */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Hours</h3>
                <ul className="text-base text-foreground space-y-2 font-light">
                  <li className="flex justify-between max-w-[250px] border-b border-border/50 pb-2">
                    <span>Mon – Thu</span>
                    <span className="font-mono text-sm">10:00 – 22:00</span>
                  </li>
                  <li className="flex justify-between max-w-[250px] border-b border-border/50 pb-2">
                    <span>Fri – Sat</span>
                    <span className="font-mono text-sm">09:00 – 00:00</span>
                  </li>
                  <li className="flex justify-between max-w-[250px] pb-2">
                    <span>Sunday</span>
                    <span className="font-mono text-sm">09:00 – 22:00</span>
                  </li>
                </ul>
              </div>

              {/* Direct */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Direct</h3>
                <p className="text-base text-foreground font-light mb-2">
                  <span className="text-muted-foreground mr-4">T.</span>
                  <a href="tel:+918825042800" className="hover:text-primary transition-colors">+91 88250 42800</a>
                </p>
                <p className="text-base text-foreground font-light">
                  <span className="text-muted-foreground mr-4">IG.</span>
                  <a href="https://www.instagram.com/la_rc_cafe?igsh=dmYyZGlveTR0MDRi" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@la_rc_cafe</a>
                </p>
              </div>

              {/* Social links */}
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/la_rc_cafe?igsh=dmYyZGlveTR0MDRi"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  Instagram
                </a>
                <a
                  href="https://maps.app.goo.gl/Ax5oZPLmYdmaUmk56?g_st=ic"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  Get Directions
                </a>
              </div>

              {/* Google Maps embed */}
              <div className="border border-border overflow-hidden" style={{ height: 240 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.7!2d91.75!3d26.18!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zTEEgUkMgSHViICYgQ2FmZQ!5e0!3m2!1sen!2sin!4v1"
                  width="100%" height="240" style={{ border: 0, filter: "grayscale(80%) invert(90%) contrast(90%)" }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="LA RC Hub & Cafe Location"
                />
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {isSuccess ? (
                <div className="bg-card border border-border p-12 text-center h-full flex flex-col justify-center items-center">
                  <div className="w-16 h-16 border border-primary rounded-full flex items-center justify-center mb-6 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 className="text-2xl font-serif text-foreground mb-4">Message Received</h3>
                  <p className="text-muted-foreground font-light mb-8">We will be in touch shortly.</p>
                  <Button variant="outline" className="rounded-none uppercase tracking-widest border-border text-foreground hover:bg-background"
                    onClick={() => { setIsSuccess(false); form.reset(); }}>Send Another</Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card border border-border p-8 md:p-10">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Full Name</FormLabel>
                        <FormControl><Input placeholder="YOUR NAME" className="rounded-none bg-background border-border h-12 focus-visible:ring-primary uppercase" {...field} /></FormControl>
                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Email</FormLabel>
                        <FormControl><Input placeholder="YOUR EMAIL" type="email" className="rounded-none bg-background border-border h-12 focus-visible:ring-primary uppercase" {...field} /></FormControl>
                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Subject (Optional)</FormLabel>
                        <FormControl><Input placeholder="INQUIRY SUBJECT" className="rounded-none bg-background border-border h-12 focus-visible:ring-primary uppercase" {...field} /></FormControl>
                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="HOW CAN WE ASSIST YOU?" className="rounded-none bg-background border-border min-h-[150px] focus-visible:ring-primary uppercase resize-none" {...field} />
                        </FormControl>
                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )} />
                    <Button type="submit" disabled={submitContact.isPending}
                      className="w-full rounded-none h-14 uppercase tracking-widest text-sm bg-primary text-primary-foreground hover:bg-primary/90">
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
