import express from "express";
import verifyJWT from "../middleware/verfiyJWT.js";
import { addTransaction } from "../controllers/transactionsController.js";
import upload from "../middleware/uploadImage.js";
const router = express.Router();

router.post("/", verifyJWT, upload.single("receiptImage"), addTransaction);

export default router;
