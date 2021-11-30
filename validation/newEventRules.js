import { body } from "express-validator";

const newEventRules = [
	body("name")
		.exists()
		.trim()
		.escape()
		.withMessage("listing-name-has-invalid-input"),
	body("address")
		.exists()
		.trim()
		.escape()
		.withMessage("address-has-invalid-input"),
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
		.withMessage("category-invalid"),
	body("summary")
		.exists()
		.trim()
		.escape()
		.withMessage("summary-has-invalid-input"),
	body("description")
		.exists()
		.trim()
		.escape()
		.withMessage("description-has-invalid-input"),
	body("start_date")
    // for testing Date fields become strings
		// .isDate() 
		.trim()
		.escape(),
		// .withMessage("start-date-has-invalid-input"),
	body("end_date")
		// .isDate()
		.trim()
		.escape(),
		// .withMessage("end-date-has-invalid-input"),
	body("start_time")
		// .isDate()
		.trim()
		.escape(),
		// .withMessage("start-time-has-invalid-input"),
	body("end_time")
		// .isDate()
		.trim()
		.escape(),
		// .withMessage("end-time-has-invalid-input"),
	body("booking_site").trim().escape(),
	body("website").trim().escape(),
	body("email").isEmail().normalizeEmail().withMessage("email-invalid"),
	body("phone")
		.isNumeric({ no_symbols: false })
		.trim()
		.escape()
		.withMessage("phone-has-invalid-input"),
	body("instagram").trim().escape(),
	body("facebook").trim().escape(),
	body("image").trim().escape(),
];

export default newEventRules;
