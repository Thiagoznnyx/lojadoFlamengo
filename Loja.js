const express = require('express');
const app = express();
const port = 3000;


const db = require('./db');


app.use(express.json()); //Define que estamos usando json


let lojas = [];


app.get("/", (req, res) => {
    res.send("Hello world!");
});


app.get("/Loja", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM Loja");
        res.json(rows);
    } catch (error) {
        console.log("Erro ao buscar: " + error.message);
        res.status(500).send("Erro ao buscar loja");
    }
});


app.get("/Loja/:id", async (req, res) => {
    const id = req.params.id;


    try {
        const [rows] = await db.query("SELECT * FROM Loja WHERE id = ?", [id]);
        if (rows.length > 0) {
            return res.json(rows[0]);
        }
        res.status(404).send("Loja com id:" + id + " não encontrada!");
    } catch (error) {
        console.log("Erro ao buscar: " + error.message);
        res.status(500).send("Erro ao buscar loja");
    }
});


app.post("/loja", async (req, res) => {
    let loja = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO Loja(nome, descricao, categoria, preco, estoque) VALUES (?, ?, ?, ?, ?)",
            [loja.nome, loja.descricao, loja.categoria, loja.preco, loja.estoque]
        );


        loja.id = result.insertId;


        res.status(201).json(loja);
    } catch (error) {
        console.log("Erro ao cadastrar loja: " + error.message);
        res.status(500).send("Erro ao cadastrar loja");
    }
});


app.put("/loja/:id", async (req, res) => {
    const id = req.params.id;


    try {
        const [rows] = await db.query("SELECT * FROM Loja WHERE id = ?", [id]);
        if (rows.length > 0) {
            let loja = req.body;
            await db.query(
                "UPDATE Loja SET nome = ?, descricao = ?, categoria = ?, preco = ?, estoque = ? WHERE id = ?",
                [loja.nome, loja.descricao, loja.categoria, loja.preco, loja.estoque, id]
            );


            loja.id = id;


            return res.status(200).json(loja);
        }
        res.status(404).send("Loja com id:" + id + " não encontrada!");
    } catch (error) {
        console.log("Erro ao atualizar: " + error.message);
        res.status(500).send("Erro ao atualizar loja");
    }
});


app.delete("/loja/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db.query("DELETE FROM Loja WHERE id = ?", [id]);
        if (rows.affectedRows > 0) {
            return res.status(204).send("Loja deletada com sucesso!");
        }
        res.status(404).send("Loja não encontrada para deletar!");
    } catch (error) {
        console.log("Erro ao deletar: " + error.message);
        res.status(500).send("Erro ao deletar loja");
    }
});


app.listen(port, () => {
    console.log('Servidor rodando na porta http://localhost:3000/');
});

