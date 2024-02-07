import express from "express";
import dotenv from "dotenv";
import bookRoute from "./routes/bookRoute.js";

// konfigurasi
dotenv.config();

const app = express();
const port = process.env.PORT;

// middleware
app.use(express.json()); // baca data dari req.body
app.use("/api", bookRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
