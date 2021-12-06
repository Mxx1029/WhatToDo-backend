import { body } from "express-validator";

const registerRules = [
	body("name").exists().trim().escape().withMessage("Please provide your name"),
	body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
	body("password").isLength({ max: 65 }).withMessage("Password is too long"),
	body("password").isStrongPassword().withMessage("Password is too weak. Use at least 8 characters including 1 uppercase and 1 lowercase letter, 1 number and 1 symbol."),
];

export default registerRules;
