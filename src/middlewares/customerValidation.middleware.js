import { customerSchema } from "../models/customer.model.js";

export function customerSchemaValidation (req, res, next){
    const user = req.body

    const userExist = connection.query("SELECT * FROM customers WHERE cpf=$1", [user.cpf]) //verifica se o cliente com esse cpf já existe
    if(userExist.rows != 0){ 
        return res.sendStatus(409)
    }

    const { error } = customerSchema.validate(user, { abortEarly: false }); //validação joi
    if(error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }
  
    res.locals.user = user;
  
    next();
}