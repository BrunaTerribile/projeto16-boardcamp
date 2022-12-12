import { Router } from "express";
import { 
    getAll, 
    getCustomer, 
    addCustomer, 
    updateCustomer 
} from '../controllers/customer.controllers.js'

const router = Router();

router.get("/customers", getAll);
router.get("/customers/:id", getCustomer);
router.post("/customers", addCustomer);
router.put("/customers/:id", updateCustomer);

export default router;