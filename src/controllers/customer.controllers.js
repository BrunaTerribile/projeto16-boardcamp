import connection from "../database/db.js";

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
    const { id } = req.params;
    
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
    const { name, phone, cpf, birthday } = req.locals.user; //dados já validados no middleware

    try {
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
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.locals.user; //dados já validados no middleware

    try{
        const result = await connection.query('UPDATE customers SET name=$2, phone=$3, cpf=$4, birthday=$5) WHERE id=$1', 
        [id, name, phone, cpf, birthday]);
        console.log(result);
        res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}