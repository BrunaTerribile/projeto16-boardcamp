import { Router } from "express";
import { 
    getRentals, 
    addRental, 
    returnRental, 
    deleteRental 
} from '../controllers/rentals.controllers.js'
import { verifyRental } from '../middlewares/rentalVerification.middleware.js'

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", addRental);
router.put("/rentals/:id/return", verifyRental, returnRental);
router.delete("/rentals/:id", verifyRental, deleteRental);

export default router;