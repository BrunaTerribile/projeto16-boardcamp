import connection from "../database/db.js";

export async function verifyRental(req, res, next){
    const { id } = req.params;

    try{
        const rentalExist = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
    if(rentalExist.rows === 0){ //verifica se o aluguel está registrado
        return res.sendStatus(404);
    } else if(rentalExist.rows[0].returnDate != null){ //verifica se o aluguel já está finalizado
        return res.send("Esse aluguel já foi finalizado").status(400);
    }
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }

    next();
}
