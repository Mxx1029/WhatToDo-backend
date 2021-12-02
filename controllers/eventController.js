import moment from "moment";
import Event from "../models/event.js";
import User from "../models/user.js";
// import Image from "../models/image.js";

// landing page: you get all events happening today
const getEventsForToday = (req, res, next) => {
	// get same format as is in the database out of moment object (type: String)
	const today = moment();

	Event.find(
		// implement today's events, when we actually have data, but also: events who are longer than one day will not be found like this
		{ start_date: { $lte: moment(today) }, end_date: { $gte: moment(today) } },
		(err, docs) => {
			if (err) {
				next(err);
				return;
			}
			res.json(docs);
		}
	);
};

// get events using req.query
const getEvents = (req, res, next) => {
	const categoryFilter = req.query.category;
	const dateFilter = req.query.date;
	// const keywordFilter = req.query.keyword;
	// if (categoryFilter && dateFilter && keywordFilter) {
	if (categoryFilter && dateFilter) {
		Event.find(
			{
				category: categoryFilter,
				start_date: { $lte: moment(dateFilter) },
				end_date: { $gte: moment(dateFilter) },
			},
			(err, docs) => {
				if (err) {
					next(err);
					return;
				}
				res.send(docs);
			}
		);
		// } else if ((categoryFilter && dateFilter) || (categoryFilter && keywordFilter) || (dateFilter && keywordFilter)) {
	} else if (categoryFilter) {
		Event.find({ category: categoryFilter }, (err, docs) => {
			if (err) {
				next(err);
				return;
			}
			res.send(docs);
		});
	} else if (dateFilter) {
		Event.find(
			{
				start_date: { $lte: moment(dateFilter) },
				end_date: { $gte: moment(dateFilter) },
			},
			(err, docs) => {
				if (err) {
					next(err);
					return;
				}
				res.send(docs);
			}
		);
		// } else if (keywordFilter) {
		// Event.find({ keywordFilter })
	} else {
		// default: show events for today (landing page)
		getEventsForToday(req, res, next); // ??
	}
};

// user clicks on a event
const getEvent = (req, res, next) => {
	const eventId = req.params.eventId;
	Event.findOne({ _id: eventId }, (err, doc) => {
		if (err) {
			next(err);
			return;
		}
		res.send(doc);
	});
};

const addEvent = async (req, res, next) => {
	// console.log(req.file);
	// console.log(req.body);

	// Create new event with data from client-side
	// const newEvent = new Event(req.body);

	// Save the created event
	// await newEvent.save((err, doc) => {
	// 	if (err) {
	// 		next(err);
	// 		return;
	// 	}

	// for testing:
	// res.status(201);
	// res.send(doc);
	// for production:
	// console.log(`>> New event ${doc._id}, title: "${doc.name}" saved to database. Created by ${doc.author}`);
	// res.status(201);
	// res.json({
	//     _id: doc.id,
	//     name: doc.name,
	//     start_date: doc.start_date
	// })
	// });

	try {
		// Create new event with data from client-side
		const newEvent = await Event.create(req.body);

		// Get user/author creating the event from the database
		const userId = req.params.userId;
        console.log(userId);
		const user = await User.findOne({ _id: userId });
        console.log(newEvent);
        console.log(user);
		// Save event as one of the user's listings
		user.createdListings.push(newEvent);
		await user.save();
		// newEvent["author"] = user; // this overwrites newEvent with the user object..! How to add a value to an existing instance, do i need to do .findOneAndUpdate()?
        console.log(user.createdListings);
		await newEvent.save((err, doc) => {
            if (err) {
                next(err);
				return;
			}
            console.log(newEvent.author);
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

const updateEvent = (req, res, next) => {};

const deleteEvent = (req, res, next) => {};

export {
	getEventsForToday,
	getEvents,
	getEvent,
	addEvent,
	updateEvent,
	deleteEvent,
};
