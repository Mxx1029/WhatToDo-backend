import Event from "../models/event.js";
// import Image from "../models/image.js";

// landing page: you get all events happening today
const getEventsForToday = (req, res, next) => {
    // get same format as is in the database out of moment object (type: String)
    // const today = moment().format("dddd, DD MMMM YYYY");

    Event.find(
        // implement today's events, when we actually have data, but also: events who are longer than one day will not be found like this
        // { start_date: today }, 
        (err, result) => {
            if (err) { next(err) };
            res.json(result);
        }
    );
};

const getEvents = (req, res, next) => {};

const getEvent = (req, res, next) => {};

const addEvent = (req, res, next) => {
    console.log(req.file);
    console.log(req.body);
    const event = req.body;

    const newEvent = new Event({
        name: event.name,
        address: event.address,
        category: event.category,
        summary: event.summary,
        description: event.description,
        start_date: event.start_date,

    });

    newEvent
        .save()
        .then(result => res.send(result)) // for testing
        // .then(result => {
        //     console.log(`>> New event ${result._id}, title: "${result.name}" saved to database. Created by ${result.author}`);
        //     res.status(201);
        //     res.json({
        //         _id: result.id,
        //         name: result.name,
        //         start_date: result.start_date
        //     })
        // }) // for production
        .catch(err => next(err))
};

const updateEvent = (req, res, next) => {};

const deleteEvent = (req, res, next) => {};

export { getEventsForToday, getEvents, getEvent, addEvent, updateEvent, deleteEvent };