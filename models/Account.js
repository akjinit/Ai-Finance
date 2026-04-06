import mongoose, { Schema } from "mongoose";

const AccountSchema = new Schema(
  {
    type: { type: String, enum: ["CURRENT", "SAVINGS"], required: true },
    balance: { type: Number, default: 0 },
    name: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
  },
  { timestamps: true, strictPopulate: false }
);

export const Account = mongoose.models.Account || mongoose.model("Account", AccountSchema);
