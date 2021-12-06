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
	const categoryFilter = req.query.category;
	const dateFilter = req.query.date;
	// const keywordFilter = req.query.keyword.replaceAll("%20", " ");
	const keywordFilter = req.query.keyword;

	// switch (true) {
	// 	case categoryFilter && dateFilter && keywordFilter:
	// 		Event.find(
	// 			{
	// 				category: categoryFilter,
	// 				start_date: { $lte: moment(dateFilter) },
	// 				end_date: { $gte: moment(dateFilter) },
	// 				// ---- 2 versions for keyword search:
	//                 //  partial match: if you look for "Chicken Concrete", THIS will find "Chicken" and "Concrete" and "Chicken Concrete" (searches in all text fields)
	//                 $text: { $search: `^.*${keywordFilter}.*$` },
    //                 //  full match: if you look for "Chicken Concrete", THIS will look in the fields provided and find only "Chicken Concrete", no just "Chicken", or just "Concrete" events
    //                 // $or: [
    //                 //     { name: { $regex: `^.*${keywordFilter}.*$` } },
    //                 //     { address: { $regex: `^.*${keywordFilter}.*$` } },
    //                 //     { summary: { $regex: `^.*${keywordFilter}.*$` } },
    //                 //     { description: { $regex: `^.*${keywordFilter}.*$` } },
    //                 // ],
	// 			},
	// 			(err, docs) => callback(err, docs, res, next)
	// 		);
	// 		break;
	// 	case categoryFilter && dateFilter:
	//         Event.find(
	//             {
	//                 category: categoryFilter,
	//                 start_date: { $lte: moment(dateFilter) },
	//                 end_date: { $gte: moment(dateFilter) },
	//             },
	//             (err, docs) => callback(err, docs, res, next)
	//         );
	// 		break;
	// 	case categoryFilter && keywordFilter:
	//         Event.find(
	//             { 
    //                 category: categoryFilter,
	// 			    // ---- 2 versions for keyword search:
	//                 // partial match: if you look for "Chicken Concrete", THIS will find "Chicken" and "Concrete" and "Chicken Concrete" (searches in all text fields)
	//                 $text: { $search: `^.*${keywordFilter}.*$` },
	//                 // full match: if you look for "Chicken Concrete", THIS will look in the fields provided and find only "Chicken Concrete", no just "Chicken", or just "Concrete" events
	//                 // $or: [
	// 	            //     { name: { $regex: `^.*${keywordFilter}.*$` } },
	// 	            //     { address: { $regex: `^.*${keywordFilter}.*$` } },
	// 	            //     { summary: { $regex: `^.*${keywordFilter}.*$` } },
	// 	            //     { description: { $regex: `^.*${keywordFilter}.*$` } },
	//                 // ],
	//             },
	//             (err, docs) => callback(err, docs, res, next)
	//         );
	// 		break;
	// 	case dateFilter && keywordFilter:
	//         Event.find(
	//             {
	//                 start_date: { $lte: moment(dateFilter) },
	//                 end_date: { $gte: moment(dateFilter) },
	// 				// ---- 2 versions for keyword search:
	//                 // partial match: if you look for "Chicken Concrete", THIS will find "Chicken" and "Concrete" and "Chicken Concrete" (searches in all text fields)
	//                 $text: { $search: `^.*${keywordFilter}.*$` },
	//                 // full match: if you look for "Chicken Concrete", THIS will look in the fields provided and find only "Chicken Concrete", no just "Chicken", or just "Concrete" events
	//                 // $or: [
	// 	            //     { name: { $regex: `^.*${keywordFilter}.*$` } },
	// 	            //     { address: { $regex: `^.*${keywordFilter}.*$` } },
	// 	            //     { summary: { $regex: `^.*${keywordFilter}.*$` } },
	// 	            //     { description: { $regex: `^.*${keywordFilter}.*$` } },
	//                 // ],
	//             },
	//             (err, docs) => callback(err, docs, res, next)
	//         );
	// 		break;
	// 	case categoryFilter:
	//         Event.find({ category: categoryFilter }, (err, docs) => callback(err, docs, res, next));
	// 		break;
	// 	case dateFilter:
	//         Event.find(
	//             {
	//                 start_date: { $lte: moment(dateFilter) },
	//                 end_date: { $gte: moment(dateFilter) },
	//             },
	//             (err, docs) => callback(err, docs, res, next)
	//         );
	// 		break;
	// 	case keywordFilter:
	//         Event.find(
    //             { 
    //                 // ---- 2 versions for keyword search:
	//                 // partial match: if you look for "Chicken Concrete", THIS will find "Chicken" and "Concrete" and "Chicken Concrete" (searches in all text fields)
	//                 $text: { $search: `^.*${keywordFilter}.*$` },
	//                 // full match: if you look for "Chicken Concrete", THIS will look in the fields provided and find only "Chicken Concrete", no just "Chicken", or just "Concrete" events
	//                 $or: [
	// 	                { name: { $regex: `^.*${keywordFilter}.*$` } },
	// 	                { address: { $regex: `^.*${keywordFilter}.*$` } },
	// 	                { summary: { $regex: `^.*${keywordFilter}.*$` } },
	// 	                { description: { $regex: `^.*${keywordFilter}.*$` } },
	//                 ], 
    //             }, 
    //             (err, docs) => callback(err, docs, res, next));
	// 		break;
	// 	default:
	//         // default: show events for today (landing page)
	// 	    getEventsForToday(req, res, next);
	// 		break;
	// }

	if (categoryFilter && dateFilter && keywordFilter) {
		Event.find(
			{
				category: categoryFilter,
				start_date: { $lte: moment(dateFilter) },
				end_date: { $gte: moment(dateFilter) },
				// ---- 2 versions for keyword search:
				// partial match: if you look for "Chicken Concrete", THIS will find "Chicken" and "Concrete" and "Chicken Concrete" (searches in all text fields)
				$text: { $search: `^.*${keywordFilter}.*$` },
				// full match: if you look for "Chicken Concrete", THIS will look in the fields provided and find only "Chicken Concrete", no just "Chicken", or just "Concrete" events
				// $or: [
				// 	{ name: { $regex: `^.*${keywordFilter}.*$` } },
				// 	{ address: { $regex: `^.*${keywordFilter}.*$` } },
				// 	{ summary: { $regex: `^.*${keywordFilter}.*$` } },
				// 	{ description: { $regex: `^.*${keywordFilter}.*$` } },
				// ],
			},
			(err, docs) => callback(err, docs, res, next)
		);
	} else if (categoryFilter && dateFilter) {
		Event.find(
			{
				category: categoryFilter,
				start_date: { $lte: moment(dateFilter) },
				end_date: { $gte: moment(dateFilter) },
			},
			(err, docs) => callback(err, docs, res, next)
		);
	} else if (categoryFilter && keywordFilter) {
		Event.find(
			{
				category: categoryFilter,
				// ---- 2 versions for keyword search:
				// partial match: if you look for "Chicken Concrete", THIS will find "Chicken" and "Concrete" and "Chicken Concrete" (searches in all text fields)
				$text: { $search: `^.*${keywordFilter}.*$` },
				// full match: if you look for "Chicken Concrete", THIS will look in the fields provided and find only "Chicken Concrete", no just "Chicken", or just "Concrete" events
				// $or: [
				// 	{ name: { $regex: `^.*${keywordFilter}.*$` } },
				// 	{ address: { $regex: `^.*${keywordFilter}.*$` } },
				// 	{ summary: { $regex: `^.*${keywordFilter}.*$` } },
				// 	{ description: { $regex: `^.*${keywordFilter}.*$` } },
				// ],
			},
			(err, docs) => callback(err, docs, res, next)
		);
	} else if (dateFilter && keywordFilter) {
		Event.find(
			{
				start_date: { $lte: moment(dateFilter) },
				end_date: { $gte: moment(dateFilter) },
				// ---- 2 versions for keyword search:
				// partial match: if you look for "Chicken Concrete", THIS will find "Chicken" and "Concrete" and "Chicken Concrete" (searches in all text fields)
				$text: { $search: `^.*${keywordFilter}.*$` },
				// full match: if you look for "Chicken Concrete", THIS will look in the fields provided and find only "Chicken Concrete", no just "Chicken", or just "Concrete" events
				// $or: [
				// 	{ name: { $regex: `^.*${keywordFilter}.*$` } },
				// 	{ address: { $regex: `^.*${keywordFilter}.*$` } },
				// 	{ summary: { $regex: `^.*${keywordFilter}.*$` } },
				// 	{ description: { $regex: `^.*${keywordFilter}.*$` } },
				// ],
			},
			(err, docs) => callback(err, docs, res, next)
		);
	} else if (categoryFilter) {
		Event.find({ category: categoryFilter }, (err, docs) =>
			callback(err, docs, res, next)
		);
	} else if (dateFilter) {
		Event.find(
			{
				start_date: { $lte: moment(dateFilter) },
				end_date: { $gte: moment(dateFilter) },
			},
			(err, docs) => callback(err, docs, res, next)
		);
	} else if (keywordFilter) {
		Event.find(
			{
				// ---- 2 versions for keyword search:
				// partial match: if you look for "Chicken Concrete", THIS will find "Chicken" and "Concrete" and "Chicken Concrete" (searches in all text fields)
				$text: { $search: `^.*${keywordFilter}.*$` },
				// full match: if you look for "Chicken Concrete", THIS will look in the fields provided and find only "Chicken Concrete", no just "Chicken", or just "Concrete" events
				// $or: [
				// 	{ name: { $regex: `^.*${keywordFilter}.*$` } },
				// 	{ address: { $regex: `^.*${keywordFilter}.*$` } },
				// 	{ summary: { $regex: `^.*${keywordFilter}.*$` } },
				// 	{ description: { $regex: `^.*${keywordFilter}.*$` } },
				// ],
			},
			(err, docs) => callback(err, docs, res, next)
		);
	} else {
		// default: show events for today (landing page)
		getEventsForToday(req, res, next);
	}
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
