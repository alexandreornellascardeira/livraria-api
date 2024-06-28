import Autor from "../models/autor.model.js";
import db from "./db.js";
import { QueryTypes } from "sequelize";

async function getAutors() {

    return await Autor.findAll();

}

async function getAutor(id) {

    return await Autor.findByPk(parseInt(id));

}

async function createAutor(autor) {

    return await Autor.create(autor);
}

async function deleteAutor(id) {

    await Autor.destroy(
        {
            where: {
                autor_id: id
            }
        }
    );
}

async function updateAutor(autor) {

    //Evitando o update na chave primária...
    const updateAutor = {
        nome: autor.nome,
        email: autor.email,
        telefone: autor.telefone,
    };

    await Autor.update(
        updateAutor,
        {
            where: {
                autor_id: autor.autor_id
            }
        }
    );

    return await getAutor(autor.autor_id);

}


async function getQtdLivrosByAutorId(autorId){

    const result =  await db.query(
        `SELECT getQtdLivrosByAutorId(${autorId}) as qtd`, {
        type: QueryTypes.SELECT,
    });
    

    return result[0].qtd;
}

export default {
    getAutors,
    getAutor,
    createAutor,
    deleteAutor,
    updateAutor,
    getQtdLivrosByAutorId 
}