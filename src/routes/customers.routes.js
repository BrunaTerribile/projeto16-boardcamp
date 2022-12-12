import { Router } from "express";
import { 
    getAll, 
    getCustomer, 
    addCustomer, 
    updateCustomer 
} from '../controllers/customer.controllers.js';
import { customerSchemaValidation } from '../middlewares/customerValidation.middleware.js'

const router = Router();

router.get("/customers", getAll);
router.get("/customers/:id", getCustomer);
router.post("/customers", customerSchemaValidation, addCustomer);
router.put("/customers/:id", customerSchemaValidation, updateCustomer);

export default router;