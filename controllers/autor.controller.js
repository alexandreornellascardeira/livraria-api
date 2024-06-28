import AutorService from "../services/autor.service.js";
import autorRepository from "../repositories/autor.repository.js";
 
const autorService = new AutorService(autorRepository);

async function createAutor(req, res, next) {

    if(!req.user.isAdmin){
        throw new Error("Forbidden");
    }

    try {

        let autor = req.body;
 
        const createdAutor = await autorService.createAutor(autor);

        res.status(201).json(createdAutor);
 

        global.logger.info(`POST /autor - ${JSON.stringify(createdAutor)}`);

    } catch (err) {
        next(err);
    }
}

async function getAutors(req, res, next) {

    
    if(!req.user.isAdmin){
        throw new Error("Forbidden");
    }

    try {

        const autors = await autorService.getAutors();

        res.status(200).json(autors);

        global.logger.info("GET /autor");

    } catch (err) {
        next(err);
    }
}

async function getAutor(req, res, next) {


    if(!req.user.isAdmin){
        throw new Error("Forbidden");
    }

    try {

        const autor = await autorService.getAutor(req.params.id);

        res.status(200).json(autor);

        global.logger.info("GET /autor/:id")

    } catch (err) {
        next(err);
    }
}

async function deleteAutor(req, res, next) {


    if(!req.user.isAdmin){
        throw new Error("Forbidden");
    }

    try {

        await autorService.deleteAutor(req.params.id);

        res.status(200).end();

        global.logger.info(`DELETE /autor/:id - ${req.params.id}`)

    } catch (err) {
        next(err);
    }
}

async function updateAutor(req, res, next) {


    if(!req.user.isAdmin){
        throw new Error("Forbidden");
    }
    
    try {

        const autor = req.body;

        if (!autor.autor_id || !autor.nome || !autor.email ||  !autor.telefone) {
            throw new Error("Informe os dados obrigatórios: ID, Nome, email, e telefone.");
        }

        const updateAutor=await autorService.updateAutor(autor);

        res.status(201).json(updateAutor);

        global.logger.info(`PUT /autor - ${JSON.stringify(autor)}`);

    } catch (err) {
        next(err);
    }
}


export default {
    createAutor,
    getAutor,
    getAutors,
    deleteAutor,
    updateAutor
}