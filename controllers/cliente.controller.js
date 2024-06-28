import ClienteService from "../services/cliente.service.js";
import clienteRepository from "../repositories/cliente.repository.js";

const clienteService = new ClienteService(clienteRepository);

async function createCliente(req, res, next) {


    if(!req.user.isAdmin){
        throw new Error("Forbidden");
    }

    try {

        let cliente = req.body;

        let createdCliente = await clienteService.createCliente(cliente);

        res.status(201).json(createdCliente);

        global.logger.info(`POST /cliente - ${JSON.stringify(createdCliente)}`);

    } catch (err) {
        next(err);
    }
}

async function getClientes(req, res, next) {

    
    if(!req.user.isAdmin){
        throw new Error("Forbidden");
    }

    try {

        const clientes = await clienteService.getClientes();
        res.status(200).json(clientes);

        global.logger.info("GET /clientes");

    } catch (err) {
        next(err);
    }
}

async function getCliente(req, res, next) {

    const cliente_id = req.params.id;

    if(!req.user.isAdmin){

        if(!req.user.cliente_id || req.user.cliente_id!==cliente_id){
             throw new Error("Forbidden");
        }
    }

    try {

        const cliente = await clienteService.getCliente(cliente_id);
        res.status(200).json(cliente);

        global.logger.info("GET /cliente/:id")

    } catch (err) {
        next(err);
    }
}

async function deleteCliente(req, res, next) {


    if(!req.user.isAdmin){

        throw new Error("Forbidden");
    }

    try {

        await clienteService.deleteCliente(req.params.id);
       
        res.status(200).end();

        global.logger.info(`DELETE /cliente/:id - ${req.params.id}`)

    } catch (err) {
        next(err);
    }
}

async function updateCliente(req, res, next) {

    const cliente = req.body;

    if (!cliente.cliente_id || !cliente.nome || !cliente.email || !cliente.senha || !cliente.telefone || !cliente.endereco) {
        throw new Error("Informe os dados obrigatórios: Nome, email, senha, telefone e endereço.");
    }

    if(!req.user.isAdmin){

        if(!req.user.cliente_id || req.user.cliente_id!==cliente.cliente_id){
             throw new Error("Forbidden");
        }
    }

    try {
        
        const clienteUpdate = await clienteService.updateCliente(cliente);
        res.status(201).json(clienteUpdate);


        global.logger.info(`PUT /cliente - ${JSON.stringify(clienteUpdate)}`);

    } catch (err) {
        next(err);
    }
}


export default {
    createCliente,
    getCliente,
    getClientes,
    deleteCliente,
    updateCliente
}