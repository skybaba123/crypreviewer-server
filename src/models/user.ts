import { model, Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, trim: true, lowercase: true, required: true },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    loginKey: String,

    plan: {
      type: String,
      enum: [
        "free",
        "basic-lite",
        "basic-plus",
        "intermidiate-lite",
        "intermidiate-plus",
        "advanced-lite",
        "advanced-plus",
        "advanced-pro",
      ],
      default: "free",
    },

    planExpiry: { type: Number, default: 0 },

    referrerId: Types.ObjectId,

    accountBal: { type: Number, default: 0 },

    referralBal: { type: Number, default: 0 },

    // referralTransactions: {
    //   type: [
    //     {
    //       amount: { type: Number, required: true },
    //       type: {
    //         type: String,
    //         required: true,
    //         enum: ["withdrawal", "earning"],
    //       },
    //       createdAt: { type: Date, default: new Date() },
    //     },
    //   ],
    //   default: [],
    // },

    role: { type: String, enum: ["user", "admin"], default: "user" },

    manager: { type: String, enum: ["yes", "no"], default: "no" },

    verificationCode: String,
    verificationCodeExpiry: Number,
    sessionToken: String,
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;

export const createUser = async (data: any) => new User(data).save();
