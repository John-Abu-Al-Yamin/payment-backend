// controllers/exchangeRateController.js
import ExchangeRate from "../models/ExchangeRate.js";

// Get all exchange rates
export const getAllExchangeRates = async (req, res) => {
  try {
    const exchangeRates = await ExchangeRate.find().lean();
    if (!exchangeRates.length) {
      return res
        .status(404)
        .json({ success: false, message: "No exchange rates found" });
    }
    res.json({ success: true, exchangeRates });
  } catch (error) {
    console.error("Error getting exchange rates:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get exchange rate by base and target currency
export const getExchangeRateByPair = async (req, res) => {
  try {
    let { base, target } = req.params;

    if (!base || !target) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Base and target currencies are required",
        });
    }

    base = base.toUpperCase();
    target = target.toUpperCase();

    const exchangeRate = await ExchangeRate.findOne({
      baseCurrency: base,
      targetCurrency: target,
    }).lean();

    if (!exchangeRate) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No exchange rate found for ${base} → ${target}`,
        });
    }

    res.json({ success: true, exchangeRate });
  } catch (error) {
    console.error("Error getting exchange rate by pair:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
