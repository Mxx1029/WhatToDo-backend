import express from "express";
import {
	getUsers,
	addUser,
	loginUser,
	updateUser,
	deleteUser,
} from "../controllers/userController.js";
import validate from "../middlewares/validationCheck.js";
import registerRules from "../validation/registerRules.js";

const router = express.Router();

// router.get("/", getUsers);
// router.post("/add", validate(registerRules), addUser);
// router.post("/login", loginUser);
// router.put("/update", updateUser);
// router.delete("/delete", deleteUser);


// ------ #issue5-endpoints work on 16/11/2021
// just experimenting w/ endpoints --> this is not functional and will not run

// routes to browse events without being a registered and logged in user
router.get("/", getEventsForToday); // landing page
router.get(`/events/${eventId}`, getEvent(eventId)); // click on one event
router.get(`/events?category=${category}`, getEvents(category)); // filter events by 1 category
router.get(`/events?date=${date}`, getEvents(date)); // filter events by 1 date
router.get(`/events?keyword=${keyword}`, getEvents(keyword)); // filter events by 1 keyword (not a key feature, it's just here)
router.get(
	`/events?category=${category}&date=${date}`,
	getEvents(category, date)
);
router.get(
	`/events?category=${category}&date=${date}&=${keyword}`,
	getEvents(category, date, keyword)
);

// routes for CRUD actions on users 
router.get("/users", getAllUsers);
router.get(`/users/${userId}`, getUser(userId));
router.post("/users", addUser); // register a user
router.post(`/users/${userId}`, loginUser(userId)); // login a user --> after this, user will get events of today, where they started from 
router.put(`/users/${userId}`, updateUser(userId));
router.delete(`/users/${userId}`, deleteUser(userId));

// routes for browsing events with logged in user
router.get(`/users/${userId}/events/${eventId}`, getEvent(eventId)); // user clicks on a event
router.get(`/users/${userId}/events?category=${category}`, getEvents(category)); // user filters events by 1 category
router.get(`/users/${userId}/events?date=${date}`, getEvents(date)); // user filters events by 1 date
router.get(`/users/${userId}/events?keyword=${keyword}`, getEvents(keyword)); // user filters events by 1 keyword (not a key feature)
router.get(
	`/users/${userId}/events?category=${category}&date=${date}`,
	getEvents(category, date)
);
router.get(
	`/events?category=${category}&date=${date}&=${keyword}`,
	getEvents(category, date, keyword)
);

// routes for CRUD actions on events
router.post(`/users/${userId}/events`, addEvent(userId));
router.put(`/users/${userId}/events/${eventId}`, updateEvent(userId, eventId));
router.delete(`/users/${userId}/events/${eventId}`, deleteEvent(userId, eventId));

export default router;
