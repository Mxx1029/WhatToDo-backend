import mongoose from "mongoose";
import moment from "moment";
import { hash, compareHashes } from "../libs/crypto.js";

// Helper variables
const required = true;
const unique = true;
const { Schema } = mongoose;

// Setting up user schema
const userSchema = new Schema({
	name: {
		type: String,
		required,
		minLength: 3,
		maxLength: 20,
	},
	email: {
		type: String,
		required,
		unique,
		minLength: 5,
	},
	password: {
		type: String,
		required,
		minLength: 8,
		maxLength: 65,
	},
	wishlist: [{ type: Schema.Types.ObjectId, ref: "events" }], // ?
	attending: [{ type: Schema.Types.ObjectId, ref: "events" }], // ?
	createdListings: [{ type: Schema.Types.ObjectId, ref: "events" }], // ?
	account_created: { type: Date, default: () => moment.utc() },
});

/**
 * Static method to register a new user into the database
 * @param {object} userData - User to be created
 * @returns {object} - Created User or null if registration fails
 */

userSchema.statics.register = async (userData) => {
	try {
		// Hashing the password
		const hashed = await hash(userData.password);
		userData.password = hashed;

		// Create the user
		return User.create(userData);
	} catch (error) {
		return null;
	}
};

/**
 * Static method to login a already registered user
 * @param {object} userData - object containing email and password
 * @returns {Promise<object>} - will resolve to user object if successful or null if not
 */

userSchema.statics.login = async (userData) => {
	try {
		const user = await User.findOne({ email: userData.email });

		// Compare the password with saved hash
		await compareHashes(userData.password, user.password);

		return user.toJSON();
	} catch (error) {
		return null;
	}
};

/**
 * Instance method to convert a User object into a shorter JSON (and make sure, no hashes/passwords are sent)
 * @returns {object} - simplefied JSON representation
 */
userSchema.methods.toJSON = () => {
	return {
		_id: this._id,
		name: this.name,
		email: this.email,
	};
};

// Setting up user model
const User = mongoose.model("regUsers", userSchema);

export default User;
