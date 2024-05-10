import "module-alias/register";
import "dotenv/config";
import express from "express";
import http from "http";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
// import cron from "node-cron";
import frontenUrl from "@/constants/frontendUrl";

import authRoutes from "@/routes/auth";
import companyRoutes from "@/routes/company";
import userRoutes from "@/routes/user";
import transactionRoutes from "@/routes/transaction";
import imageTrashRoutes from "@/routes/imageTrash";
import createManagerHandler from "@/controllers/auth/createManager";

const app = express();
const port = process.env.PORT || 8080;

const corsOptions = {
  origin: [frontenUrl],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(authRoutes);
app.use(companyRoutes);
app.use(userRoutes);
app.use(transactionRoutes);
app.use(imageTrashRoutes);

// cron.schedule(
//   "0 */6 * * *",
//   () => {
//     // scheduleAchiveMessageHandler()
//   },
//   { timezone: "Africa/Lagos" }
// );

app.get("/", (req, res) => {
  res.send({ status: "working" });
});

const server = http.createServer(app);

server.listen(port, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log(`Server running on http//localhost:${port}`);
      createManagerHandler();
    })
    .catch((error) => console.log(error));
});
