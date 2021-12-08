import express from "express";
import multer from "multer";
import * as eventController from "../controllers/eventController.js";
import * as userController from "../controllers/userController.js";
import validate from "../middlewares/validationCheck.js";
import registerRules from "../validation/registerRules.js";
import loginRules from "../validation/loginRules.js";
import newEventRules from "../validation/newEventRules.js";
import checkLogin from "../middlewares/checkLogin.js";

const router = express.Router();

// Define destination for image upload (for eventController.addEvent)
const upload = multer({ dest: "./uploads/" });

// routes for CRUD actions on users
router.get("/", userController.getUsers);
router.get("/:userId", userController.getUser);
// register a user
router.post("/", validate(registerRules), userController.addUser);

// login a user --> req.body will contain email/password
router.post("/login", validate(loginRules), userController.loginUser); // --> after this redirect to /users/:userId/events/today ?
router.put("/:userId", userController.updateUser);
router.delete("/:userId", userController.deleteUser);

// routes for browsing events with logged in user
// landing page after successful login
router.get("/:userId/events/today", eventController.getEventsForToday);
// user clicks on a event
router.get("/:userId/events/:eventId", eventController.getEvent);
// query events using req.body
router.post("/:userId/events", eventController.getEvents);

// routes for wishlist/favorites actions OR CRUD actions on events (only possible for logged in users) 
// getting the user's wishlist of events
router.get("/:userId/events/wishlist", checkLogin, eventController.getWishlist);
// adding or removing an event to/from the user's wishlist
router.post("/:userId/events/:eventId", checkLogin, eventController.addToWishlist);
router.delete("/:userId/events/:eventId", checkLogin, eventController.removeFromWishlist);
// adding an event
router.post(
	"/:userId/events",
	checkLogin,
	upload.single("uploaded_image"),
	validate(newEventRules),
	eventController.addEvent
);
router.put("/:userId/events/:eventId", eventController.updateEvent);
router.delete("/:userId/events/:eventId", eventController.deleteEvent);

export default router;
