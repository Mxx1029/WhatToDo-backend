import moment from "moment";
import Event from "../models/event.js";
import User from "../models/user.js";
// import Image from "../models/image.js";

// Helper callback function
const callback = (error, result, response, next) => {
	if (error) {
		next(error);
		return;
	}
	response.json(result);
};

// landing page: you get all events happening today
const getEventsForToday = (req, res, next) => {
	// get same format as is in the database out of moment object (type: String)
	const today = moment();

	Event.find(
		// implement today's events, when we actually have data, but also: events who are longer than one day will not be found like this
		{ start_date: { $lte: moment(today) }, end_date: { $gte: moment(today) } },
		(err, docs) => callback(err, docs, res, next)
	);
};

// get events using req.query
const getEvents = (req, res, next) => {
	const categoryFilter = req.body.category;
	const dateFilter = req.body.date;
	const keywordFilter = req.body.keyword;

	const filters = {};
	if (categoryFilter) {
		filters.category = categoryFilter;
	}
	if (dateFilter) {
		(filters.start_date = { $lte: moment(dateFilter) }),
			(filters.end_date = { $gte: moment(dateFilter) });
	}
	if (keywordFilter) {
		// ---- 2 versions for keyword search:
		// partial match: if you look for "Chicken Concrete", THIS will find "Chicken" and "Concrete" and "Chicken Concrete" (searches in all text fields)
		filters.$text = { $search: `^.*${keywordFilter}.*$` };
		// full match: if you look for "Chicken Concrete", THIS will look in the fields provided and find only "Chicken Concrete", no just "Chicken", or just "Concrete" events
		// filters.$or = [ { name: { $regex: `^.*${keywordFilter}.*$` } },
		// 	{ address: { $regex: `^.*${keywordFilter}.*$` } },
		// 	{ summary: { $regex: `^.*${keywordFilter}.*$` } },
		// 	{ description: { $regex: `^.*${keywordFilter}.*$` } }, ]
	}
	Event.find(filters, (err, docs) => callback(err, docs, res, next));
};

// user clicks on a event
const getEvent = (req, res, next) => {
	const eventId = req.params.eventId;
	Event.findOne({ _id: eventId }, (err, doc) => callback(err, doc, res, next));
};

const getWishlist = async (req, res, next) => {
	try {
		const userId = req.params.userId;
		const user = await User.findOne({ _id: userId });
        // user.populate('wishlist');
        // const wishlist = await user.exec();
        // console.log(wishlist);
		res.status(200);
		// res.json(wishlist);
        res.json(user.wishlist); // not working at the moment, getting error: 'Cast to ObjectId failed for value "wishlist" (type string) at path "_id" for model "events"'
	} catch (error) {
		next(error);
	}
};

const addToWishlist = async (req, res, next) => {
	try {
		const userId = req.params.userId;
		const user = await User.findOne({ _id: userId });
		const eventId = req.params.eventId;
		const event = await Event.findOne({ _id: eventId });
        // Add event to the user's wishlist
		if (!user.wishlist.includes(event._id)) {
			user.wishlist.push(event);
            // also test:
            // user.wishlist.create(event); // no save needed ??
            // for testing: 
            user.save()
                .then(() => {
                    console.log("Added event to wishlist of user")
                })
                .catch(err => {
                    res.status(500);
                    res.json({ errors: [ `during saving event to user's wishlist: ${err.message}` ] });
                })
            // for production:
			// await user.save();
			
		}
        // Add user to list of users having this event on their wishlist
        if(!event.wishlisting_users.includes(userId)) {
            event.wishlisting_users.push(user);
            // also test:
            // event.wishlisting_users.create(event);
            // for testing:
            event.save()
                .then(() => {
                    console.log("Added user to event's wishlisting users");
                })
                .catch(err => {
                    res.status(500);
                    res.json({ errors: [ `during saving of user on event's wishlisting users: ${err.message}` ] });
                })
            // for production:
			// await event.save();
        }
        res.status(200);
		res.json({ success: "event added to wishlist, user added to event's wishlisting users" });
	} catch (error) {
		next(error);
	}
};

const removeFromWishlist = async (req, res, next) => {
	try {
		const userId = req.params.userId;
		const user = await User.findOne({ _id: userId });
		const eventId = req.params.eventId;
		const event = await Event.findOne({ _id: eventId });
		if (!user.wishlist.includes(event._id) && !event.wishlisting_users.includes(user._id)) {
			res.status(200);
            res.json({ success: "removed from wishlist"});
		}
        // Remove event from user's wishlist
		user.wishlist.splice(event._id, 1);
        // also try out this:
        // user.wishlist.id(event._id).remove();
        // for testing: 
        user.save()
            .then(() => {
                console.log("event removed from user's wishlist");
            })
            .catch(err => {
                res.status(500);
                res.json({ errors: [ `during removing event from user's wishlist: " ${err.message} `] });
            })

        // Remove user from event's wishlisting users  
        event.wishlisting_users.splice(user._id, 1);
        // also try out this:
        // event.wishlisting_users.id(user._id).remove();
        // for testing: 
        event.save()
            .then(() => {
                console.log("user removed from event's wishlisting users" );
            })
            .catch(err => {
                res.status(500);
                res.json({ errors: [ `during removing user from event's wishlisting users: " ${err.message} `] });
            })
        // for production:
		// await user.save();
        // await event.save();
		res.status(200);
		res.json({ success: "event removed from wishlist, user removed from event's wishlisting users" });
	} catch (error) {
		next(error);
	}
};

const addEvent = async (req, res, next) => {
	console.log(req.file);

	try {
		// Get user/author creating the event from the database
		const userId = req.params.userId;
		const user = await User.findOne({ _id: userId });

		// Create new event with data from client-side
		const newEvent = await Event.create(req.body);

		// Save event as one of the user's listings (one-to-many)
		user.createdListings.push(newEvent);
		await user.save();

		// Set user as author/creator of the new event (one-to-one)
		newEvent.author = user._id;
		await newEvent.save((err, doc) => {
			if (err) {
				next(err);
				return;
			}
			// for testing:
			res.status(201);
			res.send(doc);
			// for production:
			// console.log(`>> New event ${doc._id}, title: "${doc.name}" saved to database. Created by ${doc.author}`);
			// res.status(201);
			// res.json({
			//     _id: doc.id,
			//     name: doc.name,
			//     start_date: doc.start_date
			// })
		});
	} catch (error) {
		next(error);
	}
};

const updateEvent = (req, res, next) => {
	res.send("works, but no frontend functionality");
};

const deleteEvent = (req, res, next) => {
	res.send("works, but no frontend functionality");
};

export {
	getEventsForToday,
	getEvents,
	getEvent,
	getWishlist,
	addToWishlist,
	removeFromWishlist,
	addEvent,
	updateEvent,
	deleteEvent,
};
