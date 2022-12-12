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

}

export async function updateCustomer(req, res){
    
}