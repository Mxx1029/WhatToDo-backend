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
    };
    if (dateFilter) {
        filters.start_date = { $lte: moment(dateFilter) },
        filters.end_date = { $gte: moment(dateFilter) }
    };
    if (keywordFilter) {
        // ---- 2 versions for keyword search:
        // partial match: if you look for "Chicken Concrete", THIS will find "Chicken" and "Concrete" and "Chicken Concrete" (searches in all text fields)
        filters.$text = { $search: `^.*${keywordFilter}.*$` }
        // full match: if you look for "Chicken Concrete", THIS will look in the fields provided and find only "Chicken Concrete", no just "Chicken", or just "Concrete" events
        // filters.$or = [ { name: { $regex: `^.*${keywordFilter}.*$` } },
        // 	{ address: { $regex: `^.*${keywordFilter}.*$` } },
        // 	{ summary: { $regex: `^.*${keywordFilter}.*$` } },
        // 	{ description: { $regex: `^.*${keywordFilter}.*$` } }, ]
    };
    Event.find(filters, (err, docs) => callback(err, docs, res, next));
};

// user clicks on a event
const getEvent = (req, res, next) => {
	const eventId = req.params.eventId;
	Event.findOne({ _id: eventId }, (err, doc) => callback(err, doc, res, next));
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
	addEvent,
	updateEvent,
	deleteEvent,
};
