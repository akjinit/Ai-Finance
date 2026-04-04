import mongoose, { Schema } from "mongoose";

const BudgetSchema = new Schema(
  {
    amount: { type: Number, required: true },
    lastAlertSend: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  },
  { timestamps: true }
);

export const Budget = mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
