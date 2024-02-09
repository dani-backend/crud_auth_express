import express from "express";
import {
  addBookController,
  getBookController,
  getBookByIdController,
} from "../controller/bookController.js";

const routes = express.Router();

routes.post("/book", addBookController);
routes.get("/book", getBookController);
routes.get("/book/:id", getBookByIdController);

export default routes;
