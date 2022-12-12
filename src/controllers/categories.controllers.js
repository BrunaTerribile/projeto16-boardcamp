import connection from "../database/db.js";

export async function getCategories(req, res){
    try {
        const categories = await connection.query("SELECT * FROM categories;");
        console.log(categories);
        res.send(categories.rows);
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function postCategory(req, res){
    const { name } = req.body;

    if(!name || name === ""){
        return res.sendStatus(400)
    }

    try {
        const nameExist =  await connection.query("SELECT * FROM categories WHERE name=($1)", [name])
        if(nameExist){
            return res.sendStatus(409)
        }

        const result = await connection.query("INSERT INTO categories (name) VALUES ($1)", [name]);
        console.log(result);
        res.sendStatus(201);
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
}