import { Router } from "express";
import { getCategories, postCategory } from "../controllers/categories.controllers.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", postCategory);

export default router;