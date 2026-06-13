import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import servicesRouter from "./services";
import menuRouter from "./menu";
import galleryRouter from "./gallery";
import contactRouter from "./contact";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookingsRouter);
router.use(servicesRouter);
router.use(menuRouter);
router.use(galleryRouter);
router.use(contactRouter);
router.use(statsRouter);

export default router;
