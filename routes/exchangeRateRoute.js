import express from "express";
import { getAllExchangeRates, getExchangeRateByPair } from "../controllers/exchangeRateController.js";
import verifyJWT from "../middleware/verfiyJWT.js";
const router = express.Router();

router.get("/", verifyJWT, getAllExchangeRates);
router.get("/:base/:target", verifyJWT, getExchangeRateByPair);

export default router;
