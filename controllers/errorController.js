import express from "express";

// enable express router
const router = express.Router();

router.use((error, req, res, next) => {
    let status = 404;
    let message = "Resource not found";
    // let message = new Error("Ressource not found");

    if (error) {
        status = error.status || 500;
        message = error.message;
        // message = new Error(error.message);
    }

    console.log(">> Error from global error handler: ", message);
    res.status(status);
    res.send(message);
});

export default router;