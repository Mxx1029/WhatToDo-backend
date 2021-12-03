import express from "express";
import multer from "multer";
import * as eventController from "../controllers/eventController.js";
import * as userController from "../controllers/userController.js";
import validate from "../middlewares/validationCheck.js";
import registerRules from "../validation/registerRules.js";
// import loginRules from "../validation/loginRules.js";
import newEventRules from "../validation/newEventRules.js";

const router = express.Router();

// Define destination for image upload (for eventController.addEvent)
const upload = multer({ dest: "./uploads/" });

// routes for CRUD actions on users
router.get("/", userController.getUsers);
router.get("/:userId", userController.getUser);
// register a user
router.post("/", validate(registerRules), userController.addUser);



// login a user --> req.body will contain email/password
router.post("/login", userController.loginUser); // --> after this redirect to /users/:userId/events/today ?
router.put("/:userId", userController.updateUser);
router.delete("/:userId", userController.deleteUser);

// routes for browsing events with logged in user
// landing page after successful login
router.get("/:userId/events/today", eventController.getEventsForToday);
// get events using req.query
router.get("/:userId/events", eventController.getEvents);
// user clicks on a event
router.get("/:userId/events/:eventId", eventController.getEvent);

// routes for CRUD actions on events (only possible for logged in users)
// these need login checks (secure endpoints) loginCheck() function?
router.post(
	"/:userId/events",
    // in newEventRules.js uncomment validation of the date fields (for REST client testing, the date fields are strings)

	upload.single("uploaded_image"),
	validate(newEventRules), 
	eventController.addEvent
);
router.put("/:userId/events/:eventId", eventController.updateEvent);
router.delete("/:userId/events/:eventId", eventController.deleteEvent);

export default router;
