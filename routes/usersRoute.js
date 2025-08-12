// routes/authRoute.js
import express from "express";
import { changePassword, getAllUsers, getUserById, updateUser } from "../controllers/usersController.js";
import verifyJWT from "../middleware/verfiyJWT.js";
const router = express.Router();

router.route("/").get(verifyJWT,getAllUsers);
router.route("/:id")
  .get(verifyJWT, getUserById)
  .put(verifyJWT, updateUser); 

router.route("/:id/change-password")
  .put(verifyJWT, changePassword);
 

export default router;
 