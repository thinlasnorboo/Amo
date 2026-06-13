import { Router, type IRouter } from "express";
import { ListServicesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const SERVICES = [
  {
    id: 1,
    name: "RC Track Racing",
    description: "Take to our championship-grade circuit in a professionally maintained 1:10 scale RC car. Solo sessions or head-to-head racing with real-time lap timing and leaderboards.",
    priceFrom: 85,
    priceUnit: "30 min",
    category: "racing",
    featured: true,
  },
  {
    id: 2,
    name: "Artisan Coffee Bar",
    description: "Explore 47 signature beverages crafted by our award-winning baristas. From Ethiopian single-origin pour-overs to house-blend espresso creations — every cup is a masterpiece.",
    priceFrom: 28,
    priceUnit: "cup",
    category: "cafe",
    featured: true,
  },
  {
    id: 3,
    name: "Private Events",
    description: "Transform our venue into your exclusive domain. Corporate events, birthday celebrations, team-building experiences, and product launches — all elevated to extraordinary.",
    priceFrom: 3500,
    priceUnit: "event",
    category: "events",
    featured: true,
  },
  {
    id: 4,
    name: "Coaching & Clinics",
    description: "Elevate your racing technique with one-on-one coaching from our resident racing experts. From novice orientation to advanced cornering mastery — tailored to your level.",
    priceFrom: 200,
    priceUnit: "session",
    category: "racing",
    featured: false,
  },
  {
    id: 5,
    name: "RC Car Customisation",
    description: "Our in-house workshop offers full vehicle customisation — body kits, performance tuning, paint schemes, and livery design. Drive something that's unmistakably yours.",
    priceFrom: 450,
    priceUnit: "package",
    category: "workshop",
    featured: false,
  },
  {
    id: 6,
    name: "Championship League",
    description: "Compete in our monthly ranked championship series. Track records, podium ceremonies, exclusive member pricing, and a trophy cabinet awaiting the bold and the fast.",
    priceFrom: 320,
    priceUnit: "month",
    category: "racing",
    featured: true,
  },
];

router.get("/services", async (_req, res): Promise<void> => {
  res.json(ListServicesResponse.parse(SERVICES));
});

export default router;
