import { describe, expect, test } from '@jest/globals';
import { faker } from '@faker-js/faker';

import request from 'supertest';
import app from '../server.js';

const authentication = "Basic YWRtaW46ZGVzYWZpby1pZ3RpLW5vZGVqcw==";

describe('API Tests', () => {

    let mockLivroId;
    let mockClienteId;
    let mockAutorId;
    let mockVendaId;
   

    let createdLivro;
    let createdCliente;
    let createdAutor;
    let createdVenda;


    const showInfo = (msg) => {

        const show = true;
        if (show) console.log(msg);
    }


    const getRandomInt = (min = 0, max = 1900) => {

        // Ensure min is less than or equal to max
        if (min > max) {
            [min, max] = [max, min];
        }

        const randomFloat = Math.random();

        // Scale the random number to be within the desired range and round down to get an integer
        const randomInt = Math.floor(randomFloat * (max - min + 1)) + min;

        return randomInt;
    }


    //Cliente

    test('GET /cliente responds with 200', async () => {



        const response = await request(app).get('/cliente').set('Authorization', authentication);
        expect(response.status).toBe(200);
    });

    test('POST /cliente creates a resource', async () => {


        //Gera dados de um cliente fake...
        const cliente = {

            nome: faker.person.fullName(),
            email: faker.internet.email(),
            senha: faker.internet.password(),
            telefone: faker.phone.number().substring(0, 14),
            endereco: faker.location.streetAddress()

        };

        const response = await request(app).post('/cliente').set('Authorization', authentication).send(cliente);

        showInfo(`POST /cliente response: ${JSON.stringify(response)}`);
        createdCliente = JSON.parse(response.text);

        expect(response.status).toBe(201);
        expect(createdCliente).not.toBeNull();

        mockClienteId = createdCliente.cliente_id;
    });


    test('GET /cliente/:id responds with 200', async () => {
        const response = await request(app).get(`/cliente/${mockClienteId}`).set('Authorization', authentication);
        expect(response.status).toBe(200);
    });

    //Autor
    test('GET /autor responds with 200', async () => {
        const response = await request(app).get('/autor').set('Authorization', authentication);
        expect(response.status).toBe(200);
    });

    test('POST /autor creates a resource', async () => {


        //Gera dados de um cliente fake...
        const autor = {

            nome: faker.person.fullName(),
            email: faker.internet.email(),
            telefone: faker.phone.number().substring(0, 14)

        };

        const response = await request(app).post('/autor').set('Authorization', authentication).send(autor);

        showInfo(`POST /autor response: ${JSON.stringify(response)}`);
        createdAutor = JSON.parse(response.text);

        expect(response.status).toBe(201);
        expect(createdAutor).not.toBeNull();

        mockAutorId = createdAutor.autor_id;
    });


    test('GET /autor/:id responds with 200', async () => {
        const response = await request(app).get(`/autor/${mockAutorId}`).set('Authorization', authentication);
        expect(response.status).toBe(200);
    });


    //Livro

    test('GET /livro responds with 200', async () => {
        const response = await request(app).get('/livro').set('Authorization', authentication);
        expect(response.status).toBe(200);
    });

    test('POST /livro creates a resource', async () => {


        //Gera dados de um cliente fake...
        const livro = {

            autor_id: mockAutorId,
            nome: faker.music.songName(),//books name not exists?...
            valor: faker.commerce.price(),
            estoque: getRandomInt(0, 1000)

        };

        const response = await request(app).post('/livro').set('Authorization', authentication).send(livro);

        showInfo(`POST /livro response: ${JSON.stringify(response)}`);
        createdLivro = JSON.parse(response.text);

        expect(response.status).toBe(201);
        expect(createdLivro).not.toBeNull();

        mockLivroId = createdLivro.livro_id;
    });

    test('GET /livro/:id responds with 200', async () => {
        const response = await request(app).get(`/livro/${mockLivroId}`).set('Authorization', authentication);
        expect(response.status).toBe(200);
    });




    test('POST /livro/info creates a resource', async () => {

        const livroInfo = {

            livroId: mockLivroId,
            descricao: faker.music.songName(),
            paginas: getRandomInt(30, 1900),
            editora: faker.company.name(),
            avaliacoes: []

        };

        const response = await request(app).post('/livro/info').set('Authorization', authentication).send(livroInfo);

        showInfo(`POST /livro/info response: ${JSON.stringify(response)}`);
        //createdAvaliacao = JSON.parse(response.text);

        expect(response.status).toBe(200);
        //expect(createdAvaliacao).not.toBeNull();


    });

    test('POST /livro/:id/avaliacao creates a resource', async () => {

        const avaliacao = {

            nome: faker.person.fullName(),
            nota: getRandomInt(0, 10),
            avaliacao: faker.lorem.lines()
        }



        const response = await request(app).post(`/livro/${mockLivroId}/avaliacao`).set('Authorization', authentication).send(avaliacao);

        showInfo(`POST /livro/:id/avaliacao response: ${JSON.stringify(response)}`);


        expect(response.status).toBe(200);

    });

    //Venda

    test('GET /venda responds with 200', async () => {
        const response = await request(app).get('/venda').set('Authorization', authentication);
        expect(response.status).toBe(200);
    });

    test('POST /venda creates a resource', async () => {


        //Gera dados de um cliente fake...
        const venda = {

            cliente_id: mockClienteId,
            livro_id: mockLivroId,
            //valor: faker.commerce.price(),
            data_venda: faker.date.recent()

        };

        const response = await request(app).post('/venda').set('Authorization', authentication).send(venda);

        showInfo(`POST /venda response: ${JSON.stringify(response)}`);
        createdVenda = JSON.parse(response.text);

        expect(response.status).toBe(201);
        expect(createdVenda).not.toBeNull();

        mockVendaId = createdVenda.venda_id;
    });


    test('GET /venda/:id responds with 200', async () => {
        const response = await request(app).get(`/venda/${mockVendaId}`).set('Authorization', authentication);
        expect(response.status).toBe(200);
    });

    //Testa atualizações...
    test('PUT /venda update a resource', async () => {

        createdVenda.valor = faker.commerce.price();

        const response = await request(app).put('/venda').set('Authorization', authentication).send(createdVenda);

        showInfo(`PUT /venda response: ${JSON.stringify(response)}`);
        const updatedVenda = JSON.parse(response.text);

        expect(response.status).toBe(201);
        expect(updatedVenda).not.toBeNull();


    });


    test('PUT /livro update a resource', async () => {

        const livroToUpdate = {
            livro_id: createdLivro.livro_id,
            valor: createdLivro.valor,
            estoque: getRandomInt(0, 830)
        }


        const response = await request(app).put('/livro').set('Authorization', authentication).send(livroToUpdate);

        showInfo(`PUT /livro response: ${JSON.stringify(response)}`);
        const updatedLivro = JSON.parse(response.text);

        expect(response.status).toBe(201);
        expect(updatedLivro).not.toBeNull();


    });


    test('PUT /autor update a resource', async () => {

        createdAutor.telefone = faker.phone.number().substring(0, 14);

        const response = await request(app).put('/autor').set('Authorization', authentication).send(createdAutor);

        showInfo(`PUT /autor response: ${JSON.stringify(response)}`);
        const updatedAutor = JSON.parse(response.text);

        expect(response.status).toBe(201);
        expect(updatedAutor).not.toBeNull();

    });

    test('POST /cliente creates a resource', async () => {

        createdCliente.endereco = faker.location.streetAddress()

        const response = await request(app).put('/cliente').set('Authorization', authentication).send(createdCliente);

        showInfo(`PUT /cliente response: ${JSON.stringify(response)}`);
        let updatedCliente = JSON.parse(response.text);

        expect(response.status).toBe(201);
        expect(updatedCliente).not.toBeNull();


    });


    //Testa exclusões...

    test('DELETE /venda/:id responds with 200', async () => {
        const response = await request(app).delete(`/venda/${mockVendaId}`).set('Authorization', authentication);
        expect(response.status).toBe(200);


    });

    test('DELETE /avaliacao/:id responds with 200', async () => {
        const response = await request(app).delete(`/livro/${mockLivroId}/avaliacao/0`).set('Authorization', authentication);
        expect(response.status).toBe(200);

    });

    test('DELETE /livro/:id responds with 200', async () => {
        const response = await request(app).delete(`/livro/${mockLivroId}`).set('Authorization', authentication);
        expect(response.status).toBe(200);

    });

    test('DELETE /autor/:id responds with 200', async () => {
        const response = await request(app).delete(`/autor/${mockAutorId}`).set('Authorization', authentication);
        expect(response.status).toBe(200);

    });

    test('DELETE /cliente/:id responds with 200', async () => {
        const response = await request(app).delete(`/cliente/${mockClienteId}`).set('Authorization', authentication);
        expect(response.status).toBe(200);

    });


});