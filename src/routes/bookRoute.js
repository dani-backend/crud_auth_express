import express from "express";
import {
  addBookController,
  getBookController,
} from "../controller/bookController.js";

const routes = express.Router();

routes.post("/book", addBookController);
routes.get("/book", getBookController);

export default routes;
