import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bookRoute from "./routes/bookRoute.js";
import authRoute from "./routes/authRoute.js";

// konfigurasi
dotenv.config();

const app = express();
const port = process.env.PORT;

// middleware
app.use(express.json()); // baca data dari req.body
app.use(express.urlencoded({ extended: false })); // Tambahkan ini untuk meng-handle form-data
app.use(cookieParser());
app.use("/api", bookRoute);
app.use("/api", authRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
