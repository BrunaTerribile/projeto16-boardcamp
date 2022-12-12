import { Router } from "express";
import { getGames, postGame } from "../controllers/games.controllers.js";

const router = Router();

router.get("/games", getGames);
router.post("/games", postGame);

export default router;