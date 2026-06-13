import { Router, type IRouter } from "express";
import { db, bookingsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { GetStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [totalRes] = await db.select({ count: count() }).from(bookingsTable);
  const [confirmedRes] = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "confirmed"));
  const [pendingRes] = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "pending"));

  const stats = {
    totalBookings: totalRes?.count ?? 0,
    confirmedBookings: confirmedRes?.count ?? 0,
    pendingBookings: pendingRes?.count ?? 0,
    totalTracks: 12,
    memberCount: 5000,
    coffeeVarieties: 47,
    yearsOpen: 6,
  };

  res.json(GetStatsResponse.parse(stats));
});

export default router;
