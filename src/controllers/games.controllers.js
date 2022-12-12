import connection from "../database/db.js";

export async function getGames(req, res){
    const { name } = req.query

    try {
        if(name){
            const filterGames = await connection.query("SELECT * FROM games WHERE name LIKE '%($1)%';", [name]);
            console.log(filterGames);
            res.send(filterGames.rows);
        }

        const games = await connection.query("SELECT * FROM games;");
        console.log(games);
        res.send(games.rows);
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function postGame(req, res){
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    if(!name || name === ""){
        return res.sendStatus(400)
    }

    try {
        const gameExist = await connection.query("SELECT * FROM games WHERE name=$1", [name])
        if(!gameExist){
            return res.sendStatus(409)
        }

        const result = await connection.query('INSERT INTO games (name, image, stockTotal, categoryId, pricePerDay) VALUES ($1, $2, $3, $4, $5)', 
        [name, image, stockTotal, categoryId, pricePerDay]);
        console.log(result);
        res.sendStatus(201);
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
}