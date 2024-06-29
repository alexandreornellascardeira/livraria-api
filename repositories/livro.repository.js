import Livro from "../models/livro.model.js";

import db from "./db.js";

import { QueryTypes,Op } from "sequelize";

async function getLivros() {

    return await Livro.findAll();

}

async function getLivro(id) {

    return await Livro.findByPk(parseInt(id), { raw: true });

}

async function getLivroByAutorId(autorId){
    

    return  await Livro.findAll({
        where: {
          autor_id: {
            [Op.eq]: parseInt(autorId),  
          },
        }
      },
      { raw: true }
    );

    

}

async function createLivro(livro) {

    return await Livro.create(livro);

}

async function deleteLivro(id) {

    await Livro.destroy({
        where: {
            livro_id: id
        }

    });

}



async function updateLivro(livro) {

    //Evitando update na chave primária...
    const updateLivro = {

        livro_id: livro.livro_id,
        autor_id: livro.autor_id,
        nome: livro.nome,
        valor: livro.valor,
        estoque: livro.estoque

    };

    await Livro.update(
        updateLivro, {
        where: {
            livro_id: livro.livro_id
        }
    });

    return await getLivro(livro.livro_id);




}


async function getQtdVendasByLivroId(livroId) {

    const result = await db.query(
        `SELECT getQtdVendasByLivroId(${livroId}) as qtd`, {
        type: QueryTypes.SELECT,
    }); // Access the count from the first row


    return result[0].qtd;
}




export default {
    getLivros,
    getLivro,
    createLivro,
    deleteLivro,
    updateLivro,
    getQtdVendasByLivroId,
    getLivroByAutorId 

}