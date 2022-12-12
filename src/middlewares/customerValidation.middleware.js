import { customerSchema } from "../models/customer.model.js";
import connection from "../database/db.js";

export async function customerSchemaValidation (req, res, next){
    const userData = req.body

    try{
      const userExist = await connection.query("SELECT * FROM customers WHERE cpf=$1", [userData.cpf]) //verifica se o cliente com esse cpf já existe
      if(userExist.rows != 0){ 
          return res.sendStatus(409)
      }
  
      const { error } = customerSchema.validate(userData, { abortEarly: false }); //validação joi
      if(error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(errors);
      }
    } catch(err){
      console.log(err);
      res.sendStatus(500);
    }

    req.user = userData;
    next();
}