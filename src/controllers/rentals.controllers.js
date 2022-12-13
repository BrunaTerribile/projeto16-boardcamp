import connection from "../database/db.js";
import dayjs from "dayjs";

const today = dayjs().locale("pt-br").format("YYYY-MM-DD");

export async function getRentals(req, res){
    try {
        const rentals = await connection.query(
            `SELECT rentals.*, 
            json_build_object('id', customers.id, 'name', customers.name) as customer,
            json_build_object('id', games.id, 'name', games.name) as game
            FROM rentals 
            JOIN customers 
            ON rentals."customerId" = customers.id 
            JOIN games 
            ON rentals."gameId" = games.id`);
        res.send(rentals.rows);
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function addRental(req, res){
    const { customerId, gameId, daysRented } = req.body;

    try{
        const customerExist = await connection.query(`SELECT * FROM customers WHERE id=$1`, [customerId]);
        if(customerExist.rowCount === 0){ //verifica se o cliente existe
            return res.status(400).send("Esse cliente não existe");
        }

        const gameExist = await connection.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
        if(gameExist.rowCount === 0){ //verifica se o jogo existe
            return res.status(400).send("Esse jogo não existe");
        }

        const rentedGames = await connection.query(`SELECT * FROM rentals WHERE "gameId"=$1`, [gameId]);
        if(gameExist.rows[0].stockTotal <= rentedGames.rowCount){ //verifica se existem jogos disponíveis para alugar
            return res.status(400).send("não existem jogos disponíveis");
        }

        if(daysRented <= 0){ //verifica a quatidade de dias alugados
            return res.sendStatus(400);
        }

        const price = gameExist.rows[0].pricePerDay //pega o valor por dia do aluguel do jogo
        const total = (daysRented*price); //calcula o valor total
        
        const result = await connection.query(
            `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, gameId, today, daysRented, null, total, null]);
        console.log(result);
        res.sendStatus(201)
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function returnRental(req, res){
    const { id } = req.params;

    const rentalData = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id]) //pega os dados do aluguel
    const delay = today - (rentalData[0].rentDate + rentalData[0].daysRented)

    //pegar o valor por dia do aluguel do jogo alugado:
    const price = await connection.query(`SELECT "pricePerDay" FROM games WHERE id=$1`, [rentalData.gameId]) 

    try{
        const result = await connection.query(`UPDATE rentals SET "returnDate"=$2, "delayFee"=$3, WHERE id=$1`,
            [id, today, delay <= 0? null : delay*price])
            console.log(result);
            res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function deleteRental(req, res){
    const { id } = req.params;

    try {
        const result = await connection.query(`DELETE FROM rentals WHERE id=$1`, [id]);
        console.log(result)
        res.sendStatus(200)
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}