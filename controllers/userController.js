import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Get a list of all users
const getUsers = (req, res) => {
	// just for testing
	res.json({ success: "ok" });
};

const getUser = () => {};

// Add/register a new user
const addUser = async (req, res, next) => {
	try {
		// Check if user already exists
		const userCheck = await User.findOne({ email: req.body.email });
		if (userCheck) {
			const err = new Error("Email already exists");
			err.status = 400;
			next(err);
			return;
		}

		// Add new user to the database
		const user = await User.register(req.body);
		console.log(
			`>> New user ${user._id}, username: "${user.name}" saved to database.`
		);
		// just to test the hashing
		// console.log(user.password);
		res.status(201);
		res.json({
			_id: user.id,
			name: user.name,
			email: user.email,
		});
	} catch (error) {
		// To make sure no email address is published into the log
		if (error.message.indexOf("email") !== -1) {
			console.log(">> Error while registering user (email)");
			return res.status(400).json({ error: "Check inputs" });
		}
		next(error);
	}
};

// Log in a registered user
const loginUser = async (req, res, next) => {
	try {
		const user = await User.login(req.body);
		if (!user) {
			const err = new Error("User not found. Register first.");
			err.status = 400;
			next(err);
			return;
		}

		// Create JWT token
		const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        

		res.json({ user, token });
	} catch (error) {
        next(error);
    }
};

// Update a user
const updateUser = () => {};

// Delete a user
const deleteUser = () => {};

export { getUsers, getUser, addUser, loginUser, updateUser, deleteUser };
