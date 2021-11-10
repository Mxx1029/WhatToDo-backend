import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import seed from "./seed.js";

export default async function config(app) {
    // Middleware to log all requests (except favicon)
    app.use((req, res, next) => {
        if (req.path.indexOf("favicon") === -1) {
            console.log(`[REQ] ${req.method} ${req.path}`);
        }
        next();
    })

    // Enable Cross-origin-resource-sharing (frontend runs on different server)
    app.use(cors());
    // Enables to read JSONs in the req.body 
    app.use(express.json());

    // Load environment variables
    const { error } = dotenv.config();
    if (error) {
        console.log("Error while loading configuration from .env");
        process.exit(1);
    }

    // Seed database with some fake events and users
    // await seed();
    // console.log("Seeding fakes");
}