import User from "../models/user.js";

// Get a list of all users
const getUsers = (req, res) => {
    
    // just for testing
    res.json({ success: "ok" })
};

const getUser = () => {};

// Add/register a new user
const addUser = async (req, res) => {
    try {
        // Check if user already exists
        const userCheck = await User.findOne({ email: req.body.email });
        if (userCheck) {
            console.log(">> Error while registering user: Email already exists");
            return res.status(400).json({ error: "Email already exists" })
        }

        // Add new user to the database
        const user = await User.register(req.body);
        console.log(`>> New user ${user._id}, username: "${user.name}" saved to database.`);
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
        console.log(">> Error while registering user: ", error.message);
        res.status(400).json({ error: "Check inputs" });
    }
};

// Log in a registered user
const loginUser = () => {};

// Update a user
const updateUser = () => {};

// Delete a user
const deleteUser = () => {};

export { getUsers, getUser, addUser, loginUser, updateUser, deleteUser };
