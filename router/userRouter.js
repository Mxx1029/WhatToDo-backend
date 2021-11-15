import express from "express";
import {
	getUsers,
	addUser,
	loginUser,
	updateUser,
	deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/add", addUser);
router.post("/login", loginUser);
router.put("/update", updateUser);
router.delete("/delete", deleteUser);

export default router;
