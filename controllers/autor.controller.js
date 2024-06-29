import AutorService from "../services/autor.service.js";
import autorRepository from "../repositories/autor.repository.js";
 
let autorService = null;

function setLocale(locale){

    if(autorService) return autorService;

    autorService = new AutorService(autorRepository,locale);
}

async function createAutor(req, res, next) {

    setLocale(req.getLocale());

    if(!req.user.isAdmin){
        throw new Error(res.__('http_forbidden'));
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

    setLocale(req.getLocale());

    if(!req.user.isAdmin){
        throw new Error(res.__('HTTP_FORBIDDEN'));
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

    setLocale(req.getLocale());

    if(!req.user.isAdmin){
        throw new Error(res.__('HTTP_FORBIDDEN'));
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

    setLocale(req.getLocale());

    if(!req.user.isAdmin){
        throw new Error(res.__('HTTP_FORBIDDEN'));
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

    setLocale(req.getLocale());
    
    if(!req.user.isAdmin){
        throw new Error(res.__('HTTP_FORBIDDEN'));
    }
    
    try {

        const autor = req.body;

        if (!autor.autor_id || !autor.nome || !autor.email ||  !autor.telefone) {
            throw new Error(res.__('autor.data_required'));
          
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