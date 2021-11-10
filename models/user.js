import mongoose from "mongoose";
import { hash, compareHashes } from "../libs/crypto.js";

// Helper variables
const required = true;
const unique = true;
const { Schema } = mongoose;

// Setting up user schema
const userSchema = new Schema({
    name: {
        type: String, 
        required
    },
    email: {
        type: String, 
        required, 
        unique, 
        minLength: 5
    },
    password: {
        type: String,
        required,
        minLength: 8
    },
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: "events"
    }]
});

userSchema.statics.register = async (data) => {
    // Hashing the password
    const hashed = await hash(data.password);
    data.password = hashed;

    return User.create(data);
}

userSchema.statics.login = async (data) => {
    // Finding user in database
    const user = await User.findOne({ email: data.email });
    if (!user) {

    }

    // Compare the password with saved hash
}

// Setting up user model
const User = mongoose.model("regUsers", userSchema);

export default User;