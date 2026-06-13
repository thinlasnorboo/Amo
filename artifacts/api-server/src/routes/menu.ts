import { Router, type IRouter } from "express";
import { ListMenuItemsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const MENU_ITEMS = [
  // Espresso
  { id: 1, name: "Signature Espresso", description: "Our house-blend double shot — rich, syrupy, with a hazelnut finish.", price: 28, category: "espresso", featured: true },
  { id: 2, name: "Flat White", description: "Silky microfoam over a double ristretto. Precision in every pour.", price: 32, category: "espresso", featured: false },
  { id: 3, name: "Macchiato", description: "A bold espresso marked with the finest steamed milk. Classic and uncompromising.", price: 30, category: "espresso", featured: false },
  { id: 4, name: "Cortado", description: "Equal parts espresso and warm milk — balanced, smooth, confident.", price: 30, category: "espresso", featured: false },
  { id: 5, name: "Long Black", description: "Hot water over a double espresso. The purist's choice.", price: 28, category: "espresso", featured: false },
  // Filter
  { id: 6, name: "Ethiopian Pour-Over", description: "Yirgacheffe single origin. Notes of jasmine, blueberry, and lemon zest.", price: 45, category: "filter", featured: true },
  { id: 7, name: "Colombian V60", description: "Huila region. Chocolate, caramel, and a lingering stone-fruit sweetness.", price: 42, category: "filter", featured: false },
  { id: 8, name: "Kenyan Chemex", description: "Nyeri highlands. Blackcurrant and grapefruit brightness in a clean cup.", price: 44, category: "filter", featured: false },
  // Cold
  { id: 9, name: "Cold Brew Reserve", description: "18-hour cold steeped, served over a single large ice sphere. Dark and velvety.", price: 38, category: "cold", featured: true },
  { id: 10, name: "Nitro Float", description: "Nitrogen-infused cold brew topped with salted caramel cream.", price: 42, category: "cold", featured: false },
  { id: 11, name: "Iced Matcha Latte", description: "Ceremonial-grade Japanese matcha with oat milk and honey.", price: 35, category: "cold", featured: false },
  // Specialty
  { id: 12, name: "RC Racer", description: "Espresso, dark chocolate, smoked salt, and orange peel. Named after our fastest lap.", price: 48, category: "specialty", featured: true },
  { id: 13, name: "The Podium", description: "Triple shot, salted caramel, and a gold-dusted foam. A champion's reward.", price: 52, category: "specialty", featured: true },
  { id: 14, name: "Track Day Tonic", description: "Chilled espresso over elderflower tonic and yuzu. Unexpectedly brilliant.", price: 46, category: "specialty", featured: false },
  // Food
  { id: 15, name: "Truffle Mushroom Toast", description: "Toasted sourdough, whipped ricotta, black truffle, and micro herbs.", price: 68, category: "food", featured: true },
  { id: 16, name: "Smoked Salmon Bagel", description: "House-cured salmon, dill cream cheese, capers, and red onion on a sesame bagel.", price: 75, category: "food", featured: false },
  { id: 17, name: "Wagyu Beef Slider", description: "A trio of Wagyu mini burgers with caramelised onion and aged cheddar.", price: 95, category: "food", featured: true },
  { id: 18, name: "Seasonal Fruit Plate", description: "Artfully arranged seasonal fruits with a lavender honey drizzle.", price: 55, category: "food", featured: false },
  { id: 19, name: "Dark Chocolate Fondant", description: "Warm valrhona chocolate fondant with Madagascar vanilla ice cream.", price: 65, category: "food", featured: false },
];

router.get("/menu", async (_req, res): Promise<void> => {
  res.json(ListMenuItemsResponse.parse(MENU_ITEMS));
});

export default router;
