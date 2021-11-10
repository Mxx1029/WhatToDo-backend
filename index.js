import express from "express";
import config from "./libs/config.js";
import connect from "./libs/database.js";
// import eventController from "./controllers/eventController.js";
import userController from "./controllers/userController.js";
import errorController from "./controllers/errorController.js";


// Setup express and connect to database
const app = express();
config(app);
connect(app);

// Endpoint to filter events
// app.use("/", eventController);

// Endpoint for registration and login, create listings, wishlist
app.use("/", userController);

// Endpoint to handle errors
app.use(errorController);

// Connect to port
const PORT = process.env.PORT;
if (!PORT) {
    console.log("Missing PORT variable, check .env")
};
app.listen(PORT, () => {
    console.log(`App started listening on http://localhost:${PORT}`)
})