const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    courseSlug: { type: String, required: true },
    courseTitle: { type: String, required: true },
    amount: { type: Number, required: true },
    studentName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "netbanking"],
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "paid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
