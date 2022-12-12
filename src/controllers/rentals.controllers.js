import connection from "../database/db.js";

export async function getRentals(req, res){
    try {
        const rentals = await connection.query(
            'SELECT rentals.*, customers.name as "customer", customers.id, games.*, games.id FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id');
        res.send(rentals.rows);
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function addRental(req, res){
    
}

export async function returnRental(req, res){
    
}

export async function deleteRental(req, res){
    
}