import Venda from "../models/venda.model.js";
import db from "./db.js";
import { QueryTypes,Op } from "sequelize";

async function getVendas() {

    return await Venda.findAll();

}

async function getVenda(id) {

    return await Venda.findByPk(parseInt(id));

}

async function getVendasByClienteId(clienteId) {

    return  await Venda.findAll({
        where: {
          cliente_id: {
            [Op.eq]: parseInt(clienteId),  
          },
        }
      },
      { raw: true }
    );

}

async function getVendasByAutorId(autorId) {

    return await db.query(
        `select * from getVendasByAutorId(${autorId}) vendas`, {
        type: QueryTypes.SELECT,
    },
    { raw: true }
    ); 

}

async function getVendasByLivroId(livroId) {
    
    return  await Venda.findAll({
        where: {
          livro_id: {
            [Op.eq]: parseInt(livroId),  
          },
        }
      },
      { raw: true }
    );

}

async function createVenda(venda) {

    return await Venda.create(venda);

}

async function deleteVenda(id) {

    await Venda.destroy({
        where: {
            venda_id: id
        }
    });

}

async function updateVenda(venda) {

    //Evitando o update na chave primária...
    const vendaUpdate = {
        cliente_id: venda.cliente_id,
        livro_id: venda.livro_id,
        valor: venda.valor,
        data_venda: venda.data_venda,
    }

    await Venda.update(
        vendaUpdate, {
        where: {
            venda_id: venda.venda_id
        }
    });

    return getVenda(venda.venda_id);

}


async function getValorByLivroId(livroId) {

    const result = await db.query(
        `SELECT getValorByLivroId(${livroId}) as vl`, {
        type: QueryTypes.SELECT,
    }); 

    return result[0].vl;
}

export default {
    getVendas,
    getVenda,
    createVenda,
    deleteVenda,
    updateVenda,
    getValorByLivroId,
    getVendasByClienteId,
    getVendasByAutorId,
    getVendasByLivroId

}