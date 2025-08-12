import mongoose from "mongoose";

const exchangeRateSchema = new mongoose.Schema(
  {
    baseValue: { 
      type: Number, 
      default: 1, 
      required: true 
    }, // القيمة الأساسية (عادة 1)
    
    baseCurrency: { 
      type: String, 
      required: true,
      uppercase: true, // تخزين العملة بحروف كبيرة (EGP, USD)
      trim: true
    }, // العملة الأولى

    targetValue: { 
      type: Number, 
      required: true 
    }, // كم يساوي من العملة الثانية

    targetCurrency: { 
      type: String, 
      required: true,
      uppercase: true,
      trim: true
    }, // العملة الثانية
  },
  { timestamps: true }
);

// منع تكرار نفس زوج العملات
exchangeRateSchema.index(
  { baseCurrency: 1, targetCurrency: 1 }, 
  { unique: true }
);

const ExchangeRate = mongoose.model("ExchangeRate", exchangeRateSchema);
export default ExchangeRate;
