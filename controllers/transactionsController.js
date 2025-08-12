import Transaction from "../models/Transaction.js";
import ExchangeRate from "../models/ExchangeRate.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const addTransaction = async (req, res) => {
  try {
    const { receiverName, receiverPhone, method, amount, baseCurrency, targetCurrency } = req.body;

    // تحقق من وجود جميع الحقول المطلوبة
    if (!receiverName || !receiverPhone || !method || !amount || !baseCurrency || !targetCurrency) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // تحقق من وجود الصورة المرفوعة
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Receipt image is required" });
    }

    // تحقق من وجود بيانات المستخدم
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized: user info missing" });
    }

    // تحويل المبلغ إلى رقم والتأكد من صحته
    const amountNumber = Number(amount);
    if (isNaN(amountNumber)) {
      return res.status(400).json({ success: false, message: "Amount must be a valid number" });
    }

    // رفع الصورة على Cloudinary داخل فولدر receipts
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "receipts"
    });

    // حذف الصورة المؤقتة من المجلد المحلي
    fs.unlinkSync(req.file.path);

    // جلب سعر الصرف بناء على العملات المطلوبة
    const exchangeRateData = await ExchangeRate.findOne({
      baseCurrency: baseCurrency.toUpperCase(),
      targetCurrency: targetCurrency.toUpperCase()
    });

    if (
      !exchangeRateData ||
      typeof exchangeRateData.baseValue !== "number" ||
      typeof exchangeRateData.targetValue !== "number" ||
      isNaN(exchangeRateData.baseValue) ||
      isNaN(exchangeRateData.targetValue)
    ) {
      return res.status(404).json({
        success: false,
        message: `Exchange rate not found or invalid for ${baseCurrency} → ${targetCurrency}`
      });
    }

    // حساب سعر الصرف بناءً على baseValue و targetValue
    const rate = exchangeRateData.targetValue / exchangeRateData.baseValue;
    const convertedAmount = amountNumber * rate;

    // إنشاء العملية الجديدة في قاعدة البيانات
    const transaction = await Transaction.create({
      sender: req.user.id,
      receiverName,
      receiverPhone,
      method,
      amount: amountNumber,
      exchangeRate: rate,
      convertedAmount,
      receiptImage: uploadResult.secure_url,
      status: "receipt_uploaded"
    });

    // الرد بنجاح العملية
    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
