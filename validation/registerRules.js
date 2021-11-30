import { body } from "express-validator";

const registerRules = [
	body("name").exists().trim().escape().withMessage("name-has-invalid-input"),
	body("email").isEmail().normalizeEmail().withMessage("email-invalid"),
	body("password").isLength({ max: 28 }).withMessage("password-too-long"),
	body("password").isStrongPassword().withMessage("password-too-weak"),
];

export default registerRules;
