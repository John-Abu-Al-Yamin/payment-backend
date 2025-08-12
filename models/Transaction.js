import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverName: { type: String, required: true }, // اسم المستلماسم الشخص اللي هيستلم الفلوس.
    receiverPhone: { type: String, required: true }, // رقم المستلم
    method: { type: String, required: true }, // طريقة التحويل (مثلاً بنك، محفظة)
    amount: { type: Number, required: true }, // المبلغ الأصلي
    exchangeRate: { type: Number }, // يضيفه الـ Admin لاحقًا
    convertedAmount: { type: Number }, // ناتج التحويل بعد سعر الصرف
    receiptImage: { type: String }, // رابط الصورة من Cloudinary
    status: {
      type: String,
      enum: [
        "pending",
        "receipt_uploaded",
        "exchange_rate_added",
        "confirmed",
        "rejected",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
