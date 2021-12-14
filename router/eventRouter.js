import express from "express";
import * as eventController from "../controllers/eventController.js";

const router = express.Router();

// routes to browse events without being a registered and logged in user
// landing page 
router.get("/today", eventController.getEventsForToday);
// query events using req.body
router.post("/search", eventController.getEvents);
// click on one event
router.get("/:eventId", eventController.getEvent); 


export default router;
