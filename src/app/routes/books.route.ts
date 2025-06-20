import { Router } from "express";
import booksService from "../services/books.service";

const router = Router();

router.route("/").post(booksService.postBooks).get(booksService.getAllBooks);

export default router;
