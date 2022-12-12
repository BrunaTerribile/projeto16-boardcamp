import connection from "../database/db.js";
import { gameSchema } from "../models/games.model.js";

export async function getGames(req, res){
    const name = req.query.name;

    try {
        if(name){
            const gameName = `%${name}%`
            const filterGames = await connection.query(
                'SELECT games.*, categories.name as "categoryName", categories.id FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.name LIKE $1 ', [gameName]);
            return res.send(filterGames.rows).status(400);
        }

        const games = await connection.query(
            'SELECT games.*, categories.name as "categoryName", categories.id FROM games JOIN categories ON games."categoryId" = categories.id');
        res.send(games.rows);
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function postGame(req, res){
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        const gameExist = await connection.query("SELECT * FROM games WHERE name=$1", [name]) 
        if(gameExist.rows != 0){ //verifica se o jogo já existe
            return res.sendStatus(409)
        }

        const categoryExist = await connection.query("SELECT * FROM categories WHERE id=$1", [categoryId]) 
        if(categoryExist.rows == 0){ //verifica se a categoria inserida existe
            return res.sendStatus(400)
        }

        const newGame = { //objeto para validação joi
            name,
            stockTotal,
            pricePerDay
        }

        const { error } = gameSchema.validate(newGame, { abortEarly: false }); //validação joi

        if(error) {
          const errors = error.details.map((detail) => detail.message);
          return res.status(400).send(errors);
        }

        const result = await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', 
        [name, image, stockTotal, categoryId, pricePerDay]);
        console.log(result);
        res.sendStatus(201);
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
}