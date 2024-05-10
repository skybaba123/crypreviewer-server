import { model, Schema } from "mongoose";

const companySchema = new Schema(
  {
    name: { type: String, trim: true, default: "Crypreviewer" },
    headTitle: { type: String, default: "N/A" },
    headDescription: { type: String, default: "N/A" },
    baseUrl: { type: String, trim: true, default: "N/A" },

    address: {
      type: String,
      trim: true,
      default: "408 Warren Rd - San Mateo, CA 94402",
    },

    icon: {
      public_id: { type: String },
      secure_url: {
        type: String,
        required: true,
        default: "https://example.com/img.png",
      },
      width: { type: Number },
      height: { type: Number },
    },

    logo: {
      public_id: { type: String },
      secure_url: {
        type: String,
        required: true,
        default: "https://example.com/img.png",
      },
      width: { type: Number },
      height: { type: Number },
    },

    welcomeEmail: {
      status: { type: String, default: "off", enum: ["on", "off"] },
      emailMessage: { type: String, default: "Welcome" },
    },

    currency: {
      name: { type: String, default: "Nigerian Naira" },
      code: { type: String, default: "NGN" },
      symbol: { type: String, default: "₦" },
    },

    emailSetup: {
      host: { type: String, trim: true, default: "N/A" },
      port: { type: Number, default: 0 },
      secure: { type: Boolean, default: true },
      from: { type: String, trim: true, default: "N/A" },
      auth: {
        user: { type: String, default: "N/A" },
        pass: { type: String, default: "N/A" },
      },
    },

    colors: {
      light: {
        background: { type: String, trim: true, default: "#ffffff" },
        backgroundSec: { type: String, trim: true, default: "#f0f0f0" },
        text: { type: String, trim: true, default: "#333333" },
        textSec: { type: String, trim: true, default: "#666666" },
        primary: { type: String, trim: true, default: "#32bc89" },
      },
      dark: {
        background: { type: String, trim: true, default: "#181818" },
        backgroundSec: { type: String, trim: true, default: "#1f1f1f" },
        text: { type: String, trim: true, default: "#ffffff" },
        textSec: { type: String, trim: true, default: "#cccccc" },
        primary: { type: String, trim: true, default: "#6de8bb" },
      },
      primaryVeryLight: { type: String, trim: true, default: "#e3fff5" },
    },
  },
  { timestamps: true }
);

const Company = model("Company", companySchema);

export default Company;
