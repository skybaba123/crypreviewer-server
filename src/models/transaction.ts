import { Schema, model, Types } from "mongoose";

const transactionSchema = new Schema(
  {
    amount: { type: Number, required: true },

    status: {
      type: String,
      require: true,
      enum: ["processing", "successful", "failed"],
    },

    type: { type: String, require: true, enum: ["earning", "withdrawal"] },

    coin: { type: String, trim: true },

    coinAmount: { type: Number, trim: true },

    earningPhraseKey: { type: String, trim: true },

    withdrawalWalletAddress: { type: String, trim: true },

    ownerId: { type: Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const Transaction = model("Transaction", transactionSchema);

export default Transaction;
