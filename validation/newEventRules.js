import { body } from "express-validator";

const newEventRules = [
	body("name")
		.exists()
		.trim()
		.escape()
		.withMessage("Please give your listing a title"),
	body("address")
		.exists()
		.trim()
		.escape()
		.withMessage("Please provide the address where your listing takes places"),
	body("category")
		.isIn([
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
		])
		.exists()
		.withMessage("Please choose a category"),
	body("summary")
		.exists()
		.trim()
		.escape()
		.withMessage("Please provide a teaser for your listing"),
	body("description")
		.exists()
		.trim()
		.escape()
		.withMessage("Please provide some information about your listing"),
	body("start_date")
		.isAscii()
		.trim()
		.escape()
		.withMessage("Please provide a start date"),
	body("end_date")
		.isAscii()
		.trim()
		.escape()
		.withMessage("Please provide an end date"),
	body("start_time")
		.isAscii()
		.trim()
		.escape()
		.withMessage("Please provide a start time"),
	body("end_time")
		.isAscii()
		.trim()
		.escape()
		.withMessage("Please provide an end time"),
	body("booking_site").trim().escape(),
	body("website").trim().escape(),
	body("email")
		.isEmail()
		.normalizeEmail()
		.withMessage("Please provide a valid contact email address"),
	body("phone")
		.isNumeric({ no_symbols: false })
		.trim()
		.escape()
		.withMessage("Contact phone number format invalid"),
	body("instagram").trim().escape(),
	body("facebook").trim().escape(),
	body("image").trim().escape(),
];

export default newEventRules;
