import { Router } from "express";
import borrowService from "../services/borrow.service";

const router = Router();

router.route("/").post(borrowService.createBorrow);

export default router;
