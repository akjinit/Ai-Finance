import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema(
  {
    type: { type: String, enum: ["INCOME", "EXPENSE"], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    category: { type: String, required: true },
    reciptUrl: { type: String },
    isRecurring: { type: Boolean, default: false },
    recurringInterval: { type: String, enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"] },
    nextRecurringDate: { type: Date },
    lastProcessed: { type: Date },
    status: { type: String, enum: ["COMPLETED", "PENDING", "FAILED"], default: "COMPLETED" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  },
  { timestamps: true }
);

export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
