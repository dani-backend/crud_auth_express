import express from "express";
import {
  addBookController,
  getBookController,
  getBookByIdController,
  updateBookByIdController,
  deleteBookByIdController,
} from "../controller/bookController.js";

const routes = express.Router();

routes.post("/book", addBookController);
routes.get("/book", getBookController);
routes.get("/book/:id", getBookByIdController);
routes.put("/book/:id", updateBookByIdController);
routes.delete("/book/:id", deleteBookByIdController);

export default routes;
