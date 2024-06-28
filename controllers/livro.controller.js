import LivroService from "../services/livro.service.js";

import livroRepository from "../repositories/livro.repository.js";
import livroInfoRepository from "../repositories/livroInfo.repository.js";

const livroService = new LivroService(livroRepository, livroInfoRepository);

async function createLivro(req, res, next) {

    if (!req.user.isAdmin) {
        throw new Error("Forbidden");
    }

    try {

        let livro = req.body;

        const createdlivro = await livroService.createLivro(livro);

        res.status(201).json(createdlivro);

        global.logger.info(`POST /livro - ${JSON.stringify(livro)}`);

    } catch (err) {
        next(err);
    }
}

async function getLivros(req, res, next) {

    //Qualquer tipo de usuário logado..
    if (!req.user) {
        throw new Error("Forbidden");
    }

    const autorId = req.query.autorId;

    if (autorId) {

        try {

            const livros = await livroService.getLivroByAutorId(parseInt(autorId));

            res.status(200).json(livros);

            global.logger.info("GET /livro/?autorId");

        } catch (err) {
            next(err);
        }

        return;
    }

    try {

        const livros = await livroService.getLivros();

        res.status(200).json(livros);

        global.logger.info("GET /livro");

    } catch (err) {
        next(err);
    }
}

async function getLivro(req, res, next) {


    //Qualquer tipo de usuário logado..
    if (!req.user) {
        throw new Error("Forbidden");
    }


    try {

        const livro = await livroService.getLivro(req.params.id);

        res.status(200).json(livro);

        global.logger.info("GET /livro/:id")

    } catch (err) {
        next(err);
    }
}

async function deleteLivro(req, res, next) {


    if (!req.user.isAdmin) {
        throw new Error("Forbidden");
    }

    try {

        await livroService.deleteLivro(req.params.id);

        res.status(200).end();

        global.logger.info(`DELETE /livro/:id - ${req.params.id}`)

    } catch (err) {
        next(err);
    }
}

async function updateLivro(req, res, next) {


    if (!req.user.isAdmin) {
        throw new Error("Forbidden");
    }

    try {

        const livro = req.body;

        const updatedLivro = await livroService.updateLivro(livro);

        res.status(201).json(updatedLivro);

        global.logger.info(`PUT /livro - ${JSON.stringify(livro)}`);

    } catch (err) {
        next(err);
    }
}



async function createLivroInfo(req, res, next) {


    if (!req.user.isAdmin) {
        throw new Error("Forbidden");
    }

    try {

        let livroInfo = req.body;

        await livroService.createLivroInfo(livroInfo);

        res.end();

        global.logger.info(`POST /livro/info - ${JSON.stringify(livroInfo)}`);

    } catch (err) {
        next(err);
    }
}


async function updateLivroInfo(req, res, next) {


    if (!req.user.isAdmin) {
        throw new Error("Forbidden");
    }

    try {

        let livroInfo = req.body;

        await livroService.updateLivroInfo(livroInfo);

        res.end();

        global.logger.info(`PUT /livro/info - ${JSON.stringify(livroInfo)}`);

    } catch (err) {
        next(err);
    }
}

async function deleteLivroInfo(req, res, next) {


    if (!req.user.isAdmin) {
        throw new Error("Forbidden");
    }

    try {

        let livroId = req.params.id;

        await livroService.deleteLivroInfo(livroId);

        res.end();

        global.logger.info(`DELETE /livro/info - ${JSON.stringify(livroId)}`);

    } catch (err) {
        next(err);
    }
}


async function createAvaliacao(req, res, next) {

    //Qualquer tipo de usuário logado..
    if (!req.user) {
        throw new Error("Forbidden");
    }


    try {

        let avaliacao = req.body;
        let livroId = req.params.id;

        await livroService.createAvaliacao(avaliacao, livroId);

        res.end();

        global.logger.info(`POST /livro/avaliacao - ${JSON.stringify(avaliacao)}`);

    } catch (err) {
        next(err);
    }
}



async function deleteAvaliacao(req, res, next) {


    if (!req.user.isAdmin) {
        throw new Error("Forbidden");
    }

    try {

        await livroService.deleteAvaliacao(req.params.id, req.params.index);

        res.end();

        global.logger.info(`DELETE /livro/avaliacao - ${JSON.stringify(req.params)}`);

    } catch (err) {
        next(err);
    }
}

export default {
    createLivro,
    getLivro,
    getLivros,
    deleteLivro,
    updateLivro,
    createLivroInfo,
    updateLivroInfo,
    createAvaliacao,
    deleteAvaliacao,
    deleteLivroInfo
}