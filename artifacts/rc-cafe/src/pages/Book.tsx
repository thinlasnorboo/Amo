import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateBooking } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  experienceType: z.string().min(1, "Experience type is required"),
  specialRequests: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Book() {
  const [isSuccess, setIsSuccess] = useState(false);
  const createBooking = useCreateBooking();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      experienceType: "",
      specialRequests: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    createBooking.mutate(
      { data },
      {
        onSuccess: () => {
          setIsSuccess(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      }
    );
  };

  if (isSuccess) {
    return (
      <div className="w-full flex flex-col bg-background min-h-[80vh] items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center px-4"
        >
          <div className="w-20 h-20 border border-primary rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h1 className="text-4xl font-serif text-foreground mb-4">Reservation Confirmed</h1>
          <p className="text-muted-foreground font-light leading-relaxed mb-8">
            Thank you for booking with RC Track Café. We have received your request and will send a confirmation email shortly with further details.
          </p>
          <Button 
            variant="outline" 
            className="rounded-none uppercase tracking-widest border-border text-foreground hover:bg-card w-full"
            onClick={() => {
              setIsSuccess(false);
              form.reset();
            }}
          >
            Make Another Booking
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-background pb-32">
      <section className="pt-24 pb-16 md:pt-32 border-b border-border bg-card">
        <div className="container px-4 md:px-8 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary tracking-[0.2em] uppercase text-xs font-medium mb-6 block">
              Reservations
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-foreground mb-6">Book Track Time</h1>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Secure your spot on the grid. Walk-ins are welcome, but reservations guarantee track availability and priority pit access.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pt-16">
        <div className="container px-4 md:px-8 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="JOHN" className="rounded-none bg-card border-border h-12 focus-visible:ring-primary uppercase" {...field} />
                        </FormControl>
                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="DOE" className="rounded-none bg-card border-border h-12 focus-visible:ring-primary uppercase" {...field} />
                        </FormControl>
                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="JOHN@EXAMPLE.COM" type="email" className="rounded-none bg-card border-border h-12 focus-visible:ring-primary uppercase" {...field} />
                        </FormControl>
                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+971 50 123 4567" type="tel" className="rounded-none bg-card border-border h-12 focus-visible:ring-primary uppercase" {...field} />
                        </FormControl>
                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Date</FormLabel>
                        <FormControl>
                          <Input type="date" className="rounded-none bg-card border-border h-12 focus-visible:ring-primary uppercase font-mono text-sm" {...field} />
                        </FormControl>
                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Time</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-none bg-card border-border h-12 focus:ring-primary uppercase">
                              <SelectValue placeholder="SELECT TIME" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-none bg-card border-border">
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="12:00">12:00 PM</SelectItem>
                            <SelectItem value="14:00">02:00 PM</SelectItem>
                            <SelectItem value="16:00">04:00 PM</SelectItem>
                            <SelectItem value="18:00">06:00 PM</SelectItem>
                            <SelectItem value="20:00">08:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="experienceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Experience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-none bg-card border-border h-12 focus:ring-primary uppercase">
                            <SelectValue placeholder="SELECT EXPERIENCE" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none bg-card border-border">
                          <SelectItem value="open_practice">Open Practice (Bring Your Own)</SelectItem>
                          <SelectItem value="rental_basic">Basic Rental Package</SelectItem>
                          <SelectItem value="rental_pro">Pro Telemetry Package</SelectItem>
                          <SelectItem value="vip_pit">VIP Pit Reservation</SelectItem>
                          <SelectItem value="private_event">Private Event / Corporate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs tracking-widest text-muted-foreground">Special Requests</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="ANY SPECIFIC CHASSIS REQUIREMENTS OR COFFEE PREFERENCES?" 
                          className="rounded-none bg-card border-border min-h-[120px] focus-visible:ring-primary uppercase resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={createBooking.isPending}
                  className="w-full rounded-none h-14 uppercase tracking-widest text-sm bg-primary text-primary-foreground hover:bg-primary/90 mt-8"
                >
                  {createBooking.isPending ? "Processing..." : "Confirm Reservation"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
