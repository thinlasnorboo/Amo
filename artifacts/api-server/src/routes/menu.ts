import { Router, type IRouter } from "express";
import { db, menuItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListMenuItemsResponse,
  CreateMenuItemBody,
  UpdateMenuItemBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const SEED_ITEMS = [
  { name: "Signature Espresso",   description: "Our house-blend double shot — rich, syrupy, with a hazelnut finish.", price: 320, category: "espresso", featured: true,  sortOrder: 1 },
  { name: "Flat White",           description: "Silky microfoam over a double ristretto. Precision in every pour.",  price: 380, category: "espresso", featured: false, sortOrder: 2 },
  { name: "Macchiato",            description: "A bold espresso marked with the finest steamed milk.",               price: 350, category: "espresso", featured: false, sortOrder: 3 },
  { name: "Cortado",              description: "Equal parts espresso and warm milk — balanced, smooth, confident.",  price: 350, category: "espresso", featured: false, sortOrder: 4 },
  { name: "Long Black",           description: "Hot water over a double espresso. The purist's choice.",             price: 320, category: "espresso", featured: false, sortOrder: 5 },
  { name: "Ethiopian Pour-Over",  description: "Yirgacheffe single origin. Notes of jasmine, blueberry, and lemon zest.", price: 520, category: "filter", featured: true, sortOrder: 6 },
  { name: "Colombian V60",        description: "Huila region. Chocolate, caramel, and a lingering stone-fruit sweetness.", price: 490, category: "filter", featured: false, sortOrder: 7 },
  { name: "Kenyan Chemex",        description: "Nyeri highlands. Blackcurrant and grapefruit brightness in a clean cup.", price: 510, category: "filter", featured: false, sortOrder: 8 },
  { name: "Cold Brew Reserve",    description: "18-hour cold steeped, served over a single large ice sphere.",       price: 440, category: "cold", featured: true,  sortOrder: 9 },
  { name: "Nitro Float",          description: "Nitrogen-infused cold brew topped with salted caramel cream.",       price: 490, category: "cold", featured: false, sortOrder: 10 },
  { name: "Iced Matcha Latte",    description: "Ceremonial-grade Japanese matcha with oat milk and honey.",          price: 410, category: "cold", featured: false, sortOrder: 11 },
  { name: "RC Racer",             description: "Espresso, dark chocolate, smoked salt, and orange peel.",            price: 560, category: "specialty", featured: true,  sortOrder: 12 },
  { name: "The Podium",           description: "Triple shot, salted caramel, and a gold-dusted foam.",               price: 600, category: "specialty", featured: true,  sortOrder: 13 },
  { name: "Track Day Tonic",      description: "Chilled espresso over elderflower tonic and yuzu.",                  price: 530, category: "specialty", featured: false, sortOrder: 14 },
  { name: "Truffle Mushroom Toast", description: "Toasted sourdough, whipped ricotta, black truffle, and micro herbs.", price: 790, category: "food", featured: true,  sortOrder: 15 },
  { name: "Smoked Salmon Bagel",  description: "House-cured salmon, dill cream cheese, capers, and red onion.",     price: 870, category: "food", featured: false, sortOrder: 16 },
  { name: "Wagyu Beef Slider",    description: "A trio of Wagyu mini burgers with caramelised onion and aged cheddar.", price: 1100, category: "food", featured: true, sortOrder: 17 },
  { name: "Dark Chocolate Fondant", description: "Warm valrhona chocolate fondant with Madagascar vanilla ice cream.", price: 750, category: "food", featured: false, sortOrder: 18 },
] as const;

async function seedIfEmpty() {
  const existing = await db.select().from(menuItemsTable).limit(1);
  if (existing.length === 0) {
    await db.insert(menuItemsTable).values(SEED_ITEMS.map(i => ({ ...i })));
  }
}

seedIfEmpty().catch(() => {});

router.get("/menu", async (_req, res): Promise<void> => {
  const items = await db.select().from(menuItemsTable).orderBy(menuItemsTable.sortOrder, menuItemsTable.id);
  res.json(ListMenuItemsResponse.parse(items));
});

router.post("/menu", async (req, res): Promise<void> => {
  const parsed = CreateMenuItemBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error }); return; }
  const [item] = await db.insert(menuItemsTable).values(parsed.data).returning();
  res.status(201).json(item);
});

router.patch("/menu/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const parsed = UpdateMenuItemBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error }); return; }
  const [updated] = await db.update(menuItemsTable).set(parsed.data).where(eq(menuItemsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated);
});

router.delete("/menu/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(menuItemsTable).where(eq(menuItemsTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
  res.status(204).end();
});

export default router;
