import Cliente from "../models/cliente.model.js";
import db from "./db.js";
import { QueryTypes } from "sequelize";


async function getInfoLogin(username, password) {

    return await db.query(
        `select * from getInfoLogin(${username}, ${password}) user`, {
        type: QueryTypes.SELECT,
    },
        { raw: true }
    );

}
async function getClientes() {

    return await Cliente.findAll({ raw: true });
}

async function getCliente(id) {

    return await Cliente.findByPk(parseInt(id), { raw: true });
}

async function createCliente(cliente) {

    return await Cliente.create(cliente);

}

async function deleteCliente(id) {

    await Cliente.destroy({
        where: {
            cliente_id: id
        }

    });


}

async function updateCliente(cliente) {

    //Evitando o update na chave primária...
    const updateCliente = {
        nome: cliente.nome,
        email: cliente.email,
        senha: cliente.senha,
        telefone: cliente.telefone,
        endereco: cliente.endereco,
        cep: cliente.cep
    };

    await Cliente.update(
        updateCliente,
        {
            where: {
                cliente_id: cliente.cliente_id
            }

        });

    return await getCliente(cliente.cliente_id);

}

async function getQtdVendasByClienteId(clienteId) {

    const result = await db.query(
        `SELECT getQtdVendasByClienteId(${clienteId}) as qtd`, {
        type: QueryTypes.SELECT,
    }); 

    return result[0].qtd;
}

export default {
    getClientes,
    getCliente,
    createCliente,
    deleteCliente,
    updateCliente,
    getQtdVendasByClienteId,
    getInfoLogin
}