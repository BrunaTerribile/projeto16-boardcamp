import connection from "../database/db.js";
import customerSchema from '../models/customer.model.js';

export async function getAll(req, res){
    const cpf = req.query.cpf;

    try {
        if(cpf){
            const search = `${cpf}%`
            const filterUser = await connection.query(
                'SELECT * FROM customers WHERE cpf LIKE $1 ', [search]);
            return res.send(filterUser.rows);
        }

        const customers = await connection.query(
            'SELECT * FROM customers');
        res.send(customers.rows);
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function getCustomer(req, res){
    const { id } = req.params
    
    try {
        const find = await connection.query('SELECT * FROM customers WHERE id=$1', [id]);
        if(find.rows == 0){
            return res.sendStatus(404)
        }
        res.send(find.rows);
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function addCustomer(req, res){
    const { name, phone, cpf, birthday } = req.body

    try {
        const userExist = await connection.query("SELECT * FROM customers WHERE cpf=$1", [cpf]) 
        if(userExist.rows != 0){ //verifica se o cliente com esse cpf já existe
            return res.sendStatus(409)
        }

        const customerData = { //objeto para validação joi
            name,
            phone,
            cpf,
            birthday
        }

        const { error } = customerSchema.validate(customerData, { abortEarly: false }); //validação joi

        if(error) {
          const errors = error.details.map((detail) => detail.message);
          return res.status(400).send(errors);
        }

        const result = await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', 
        [name, phone, cpf, birthday]);
        console.log(result);
        res.sendStatus(201);
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function updateCustomer(req, res){
    
}