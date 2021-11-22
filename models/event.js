// needs to register every user that puts an event on their wishlist users: [{ type: Schema.Types.ObjectId, ref: "regUsers"}]
import mongoose from "mongoose";

// Helper variables
const required = true;
const unique = true;
const { Schema } = mongoose;

// Setting up event schema
const eventSchema = new Schema({
	name: { type: String, required }, // minLength/maxLength?
	adress: { type: String, required }, // validation ??
	categories: { 
        // type: [ { type: String, enum: ["Free", "Music", "Workshop", "Film", "Family", "Market", "Exhibition", "Party", "Performing Arts", "Opening", "Food", "Reading"] } ], required // found this here, apparently then multi-select works for enums: https://stackoverflow.com/questions/27447876/is-it-possible-to-create-a-multi-select-enum-in-mongoose
        type: String,
        enum: ["Free", "Music", "Workshop", "Film", "Family", "Market", "Exhibition", "Party", "Performing Arts", "Opening", "Food", "Reading"],
        required 
    },
    summary: { type: String, required, maxLength: 100 }, // minLength?
    description: { type: String, required }, // minLength/maxLength?

    // Date and Time
    start_date: { type: Date, default: Date.now() }, // ???
    end_date: {},
    start_time: {},
    end_time: {}, 
    happens_once: { type: Boolean },
    happens_daily_or_weekly: { type: String, enum: ["daily", "weekly"] },
    happens_on_specific_dates: { type: Date }, // how to do multiple dates?

    // Prices and Booking
    free_event: { type: Boolean, required },
    price: { type: Number },
    booking_required: { type: Boolean, required },
    booking_site: { type: String },

    // Contact Details
    website: { type: String },
    email: { type: String },
    phone: { type: String }, // ?? validation
    instagram: { type: String },
    twitter: { type: String },
    facebook: { type: String },

    // Image
    image: {
        type: Schema.Types.ObjectId,
        ref: "images"
    },

    // Review
    draft: { type: Boolean, default: true },
    submitted: { type: Boolean, default: false },
    reviewed: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    // for CRUD actions on event listings
    owner: { type: Schema.Types.ObjectId, ref: "regUsers" }, // user that created the event
    created_at: { type: Date, default: new Date.toISOString() },
    updated_at: { type: Date, default: new Date.toISOString() },
    deleted: { type: Date },

    users_wishlisting: [ { type: Schema.Types.ObjectId, ref: "regUsers" } ],
    wishlist_count: { type: Number }, // event owner will only see number, no names
    users_attending: [ { type: Schema.Types.ObjectId, ref: "regUsers" } ],
    attending_count: { type: Number } // event owner will only see number, no names
});

// Setting up event model
const Event = mongoose.model("events", eventSchema);

export default Event;
