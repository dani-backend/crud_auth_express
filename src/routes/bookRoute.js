import express from "express";
import * as bookController from "../controller/bookController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/book", upload.single("cover"), bookController.addBookController);
router.get("/book", bookController.getBookController);
router.get("/book/:id", bookController.getBookByIdController);
router.put("/book/:id", bookController.updateBookByIdController);
router.delete("/book/:id", bookController.deleteBookByIdController);

export default router;
