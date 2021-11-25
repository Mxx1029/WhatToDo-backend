// needs to register every user that puts an event on their wishlist users: [{ type: Schema.Types.ObjectId, ref: "regUsers"}]
import mongoose from "mongoose";
import moment from "moment";

// Helper variables
const required = true;
const unique = true;
const { Schema } = mongoose;
const date = moment.utc(); // is this done every time, there's a new instance of Event created?
// const rootImageUrl = `https://heroku.something.com`; --> we might need this as a pointer for the event images?

// Setting up event schema
const eventSchema = new Schema({
	name: { type: String, required, minLength: 1, maxLength: 100 },
	address: { type: String, required, minLength: 3, maxLength: 100 },
	category: {
		// type: [ { type: String, enum: ["Free", "Music", "Workshop", "Film", "Family", "Market", "Exhibition", "Party", "Performing Arts", "Opening", "Food", "Reading"] } ], required // found this here, apparently then multi-select works for enums: https://stackoverflow.com/questions/27447876/is-it-possible-to-create-a-multi-select-enum-in-mongoose
		type: String,
		enum: [
			"Free",
			"Music",
			"Workshop",
			"Film",
			"Family",
			"Market",
			"Exhibition",
			"Party",
			"Performing Arts",
			"Opening",
			"Food",
			"Reading",
		],
		required,
	},
	summary: { type: String, required, minLenth: 3, maxLength: 100 },
	description: { type: String, required, minLength: 3, maxLength: 1000 },

	// Date and Time
	// min 3 day ahead, max 6 months to the future
	start_date: {
		// type: Date,
        // for seeding fakes // when you use .format("dddd, DD MMMM YYYY"), the output is type string, not type date!!
        type: String,
		min: moment.utc().add(3, "days"),
		max: moment.utc().add(6, "months"),
	}, // date.add(3, "days").format("dddd, DD MMMM YYYY") prints "Friday, 26 November 2021" // see test.js for example how to use moment.js
	end_date: {
		// type: Date,
        // for seeding fakes
        type: String,
		min: moment.utc().add(3, "days"),
		max: moment.utc().add(6, "months"),
	},
	start_time: {
		// type: Date,
        // for seeding fakes // when you use .format("HH:mm"), the output is type string, not type date!!
        type: String,
		min: moment.utc().add(3, "days"),
		max: moment.utc().add(6, "months"),
		// date.add(3, "days").format("dddd, DD MMMM YYYY") prints "13:21"
	},
	end_time: {
		// type: Date,
        // for seeding fakes
        type: String,
		min: moment.utc().add(3, "days"),
		max: moment.utc().add(6, "months"),
	},
	happens_once: { type: Boolean },
	happens_daily_or_weekly: { type: String, enum: ["daily", "weekly"] },
	happens_on_specific_dates: [
		{
			type: Date,
			min: date.add(3, "days"),
			max: date.add(6, "months"),
		},
	], // can you do multiple dates like this?

	// Prices and Booking
	free_event: { type: Boolean, required },
	price: { type: Number },
	booking_required: { type: Boolean, required },
	booking_site: { type: String },

    // Contact Details
    website: { type: String, minLength: 5 },
    email: { type: String },
    phone: { type: String, minLength: 6, maxLength: 25 }, // frontend max: 15, put 25 here for seeding fakes
    instagram: { type: String, minLength: 3 },
    facebook: { type: String, minLength: 3 },

    // Image
    // image: { type: Schema.Types.ObjectId, ref: "images"
    //     // event.path(image).get(value => `${rootImageUrl}/${value}`); 
    // },
    image: String, // for seeding fake events

	// Review
	draft: { type: Boolean, default: true },
	submitted: { type: Boolean, default: false },
	reviewed: { type: Boolean, default: false },
	published: { type: Boolean, default: false },

	// for CRUD actions on event listings
	author: { type: Schema.Types.ObjectId, ref: "regUsers" }, // user that created the event
	created_at: { type: Date, default: () => moment.utc() }, // or default: moment.utc 
	updated_at: { type: Date },
	deleted: { type: Date },

	users_wishlisting: [{ type: Schema.Types.ObjectId, ref: "regUsers" }],
	wishlist_count: { type: Number }, // event owner will only see number, no names
	users_attending: [{ type: Schema.Types.ObjectId, ref: "regUsers" }],
	attending_count: { type: Number }, // event owner will only see number, no names
});

// Setting up event model
const Event = mongoose.model("events", eventSchema);

export default Event;
