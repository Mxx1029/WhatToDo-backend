import express from "express";
import {
	getUsers,
	addUser,
	loginUser,
	updateUser,
	deleteUser,
} from "../controllers/userController.js";
import validate from "../middlewares/validationCheck.js";
import registerRules from "../validation/registerRules.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/add", validate(registerRules), addUser);
router.post("/login", loginUser);
router.put("/update", updateUser);
router.delete("/delete", deleteUser);

export default router;
