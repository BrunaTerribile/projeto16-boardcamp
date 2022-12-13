import connection from "../database/db.js";
import dayjs from "dayjs";

const today = dayjs().locale("pt-br").format("YYYY-MM-DD");

export async function getRentals(req, res){
    try {
        const rentals = await connection.query(
            `SELECT rentals.*, customers.name as "customer", customers.id, games.*, games.id 
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
        if(customerExist.rows === 0){ //verifica se o cliente existe
            return res.sendStatus(400);
        }

        const gameExist = await connection.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
        if(gameExist.rows === 0){ //verifica se o jogo existe
            return res.sendStatus(400);
        }

        const rentedGames = await connection.query(`SELECT * FROM rentals WHERE gameId=$1`, [gameId]);
        if(gameExist.rows.stockTotal <= rentedGames.rows){ //verifica se existem jogos disponíveis para alugar
            return res.sendStatus(400);
        }

        if(daysRented >= 0){ //verifica a quatidade de dias alugados
            return res.sendStatus(400);
        }

        const price = await connection.query(`SELECT "pricePerDay" FROM games WHERE id=$1`, [gameId]); //pega o valor por dia do aluguel do jogo
        const total = (daysRented*price); //calcula o valor total
        
        const result = await connection.query(
            `INSERT INTO rentals (customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee) 
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