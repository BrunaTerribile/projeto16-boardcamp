import { Router } from "express";
import { 
    getRentals, 
    addRental, 
    returnRental, 
    deleteRental 
} from '../controllers/rentals.controllers.js'

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", addRental);
router.post("/rentals/:id/return", returnRental);
router.delete("/rentals/:id", deleteRental);

export default router;