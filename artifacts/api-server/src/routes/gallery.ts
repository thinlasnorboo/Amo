import { Router, type IRouter } from "express";
import { ListGalleryItemsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const GALLERY_ITEMS = [
  { id: 1, title: "The Main Circuit", category: "track", imageUrl: null },
  { id: 2, title: "Artisan Coffee Bar", category: "cafe", imageUrl: null },
  { id: 3, title: "Championship Podium", category: "events", imageUrl: null },
  { id: 4, title: "RC Fleet — Pro Series", category: "cars", imageUrl: null },
  { id: 5, title: "Lounge & Viewing Area", category: "venue", imageUrl: null },
  { id: 6, title: "Track Day Action", category: "track", imageUrl: null },
  { id: 7, title: "Training Circuit", category: "track", imageUrl: null },
  { id: 8, title: "Private Event Setup", category: "events", imageUrl: null },
  { id: 9, title: "Espresso Station", category: "cafe", imageUrl: null },
  { id: 10, title: "Member Lounge", category: "venue", imageUrl: null },
  { id: 11, title: "Night Race Series", category: "track", imageUrl: null },
  { id: 12, title: "Custom Workshop", category: "cars", imageUrl: null },
];

router.get("/gallery", async (_req, res): Promise<void> => {
  res.json(ListGalleryItemsResponse.parse(GALLERY_ITEMS));
});

export default router;
