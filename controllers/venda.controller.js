import VendaService from "../services/venda.service.js";
import vendaRepository from "../repositories/venda.repository.js";
import livroRepository from "../repositories/livro.repository.js";

const vendaService = new VendaService(vendaRepository, livroRepository);

async function createVenda(req, res, next) {

    let venda = req.body;
    
    if(!req.user.isAdmin){

        if(!req.user.cliente_id || req.user.cliente_id!==venda.cliente_id){
             throw new Error("Forbidden");
        }
    }

    try {
        
 
        const createdVenda = await vendaService.createVenda(venda);

        res.status(201).json(createdVenda);

        global.logger.info(`POST /venda - ${JSON.stringify(venda)}`);

    } catch (err) {
        next(err);
    }
}

async function getVendas(req, res, next) {

    //Vendas por clienteId...
    const cliente_id = req.query.clienteId;
    
    if(!req.user.isAdmin){

        if(!req.user.cliente_id  || !cliente_id  ||req.user.cliente_id!==cliente_id){
             throw new Error("Forbidden");
        }
    }

    //Vendas por AutorId...
    const autorId = req.query.autorId; 

    if(autorId){

        try {

            const vendas = await vendaService.getVendasByAutorId(parseInt(autorId));
    
            res.status(200).json(vendas);
    
            global.logger.info("GET /livro/?autorId");
    
        } catch (err) {
            next(err);
        }

        return;
    }
     

    if(cliente_id){

        try {

            const vendas = await vendaService.getVendasByClienteId(parseInt(cliente_id));
    
            res.status(200).json(vendas);
    
            global.logger.info("GET /livro/?clienteId");
    
        } catch (err) {
            next(err);
        }

        return;
    }
    
    //Vendas por livroId...
    const livroId = req.query.livroId; 

    if(livroId){

        try {

            const vendas = await vendaService.getVendasByLivroId(parseInt(livroId));
    
            res.status(200).json(vendas);
    
            global.logger.info("GET /livro/?livroId");
    
        } catch (err) {
            next(err);
        }

        return;
    }

    try {

        const vendas = await vendaService.getVendas();

        res.status(200).json(vendas);

        global.logger.info("GET /venda");

    } catch (err) {
        next(err);
    }
}

async function getVenda(req, res, next) {

  
    try {

        const venda = await vendaService.getVenda(req.params.id);

            
        if(!req.user.isAdmin){

            if(!req.user.cliente_id  || !venda || req.user.cliente_id!==venda.cliente_id){
                throw new Error("Forbidden");
            }
        }

        res.status(200).json(venda);

        global.logger.info("GET /venda/:id")

    } catch (err) {
        next(err);
    }
}

async function deleteVenda(req, res, next) {


    if(!req.user.isAdmin){
        throw new Error("Forbidden");
    }

    try {

        await vendaService.deleteVenda(req.params.id);

        res.status(200).end();

        global.logger.info(`DELETE /venda/:id - ${req.params.id}`)

    } catch (err) {
        next(err);
    }
}

async function updateVenda(req, res, next) {


    if(!req.user.isAdmin){
        throw new Error("Forbidden");
    }

    try {

        const venda = req.body;

        const updatedVenda = await vendaService.updateVenda(venda);

        res.status(201).json(updatedVenda);

        global.logger.info(`PUT /venda - ${JSON.stringify(venda)}`);

    } catch (err) {
        next(err);
    }
}
 

export default {
    createVenda,
    getVenda,
    getVendas,
    deleteVenda,
    updateVenda 
}