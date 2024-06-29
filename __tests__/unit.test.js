import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import { faker } from '@faker-js/faker';
import i18n from 'i18n';

import LivroService from "../services/livro.service.js";
import VendaService from "../services/venda.service.js";
import ClienteService from "../services/cliente.service.js";
import AutorService from "../services/autor.service.js";

const locale="pt";

let mockClienteId = 1;

//Evitar chamada a recursos integrados ...
const mockClienteRepository = {

    createCliente: jest.fn(),
    getClientes: jest.fn(),
    getCliente: jest.fn(),
    deleteCliente: jest.fn(),
    updateCliente: jest.fn(),
    getQtdVendasByClienteId: jest.fn()
};

const mockClienteRepositoryFail = {

    createCliente: jest.fn(),
    getClientes: jest.fn(),
    getCliente: jest.fn(),
    deleteCliente: jest.fn(),
    updateCliente: jest.fn(),
    getQtdVendasByClienteId: jest.fn()
};


describe('Unit Tests - Cliente', () => {

    const showInfo = (msg) => {

        const show = false;
        if (show) console.log(msg);
    }

    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });


    //Gera dados de um cliente fake...
    function generateClienteData() {
        return {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            //forçar teste de falha...
            senha: '',//faker.internet.password(),
            telefone: faker.phone.number().substring(0, 14),
            endereco: faker.location.streetAddress()
        };


    };

    const clientesList = [];

    // Simula criação de novo de cliente...
    mockClienteRepository.createCliente.mockResolvedValue = (cliente) => {

        showInfo(`createCliente: ${JSON.stringify(cliente)}`);

        let newCliente = { cliente_id: mockClienteId++, ...cliente }

        clientesList.push(newCliente);

        return newCliente;
    };

    // eslint-disable-next-line no-unused-vars
    mockClienteRepository.getQtdVendasByClienteId.mockResolvedValue = (id) => {
        return 0;
    }
    // eslint-disable-next-line no-unused-vars
    mockClienteRepositoryFail.getQtdVendasByClienteId.mockResolvedValue = (id) => {
        return 0;
    }

    //Simula pesquisa de todos os clientesList... 
    mockClienteRepository.getClientes.mockResolvedValue = () => {


        showInfo("getClientes");

        //Se ainda não tiver sido criado nenhum cliente, simula a criação de 10 novos clientesList...
        if (clientesList.length === 0) {

            for (let i = 1; i < 10; i++) {

                clientesList.push({ cliente_id: mockClienteId++, ...generateClienteData() });
            }
        }

        return clientesList;
    };


    //Simula pesquisa de cliente através do id.. 
    mockClienteRepository.getCliente.mockResolvedValue = (id) => {

        showInfo(`getCliente Mock by id: ${id}`);

        showInfo(`Clientes: ${JSON.stringify(clientesList)}`)
        let clienteEnc = null;

        clientesList.forEach((clienteItem) => {

            showInfo(clienteItem);

            if (clienteItem.cliente_id === id) {

                clienteEnc = clienteItem;

                return clienteItem;
            }

        });



        return clienteEnc;
    };

    // Simula exclusão de cliente...
    mockClienteRepository.deleteCliente.mockResolvedValue = (id) => {

        let clienteEnc = null;

        clientesList.forEach((cliente) => {

            if (cliente.cliente_id === id) {

                clienteEnc = cliente;

            }
        });

        if (clienteEnc == null) throw new Error(i18n.__({ phrase: 'cliente.data_not_found', locale: locale }));

        clientesList.pop(clienteEnc);
    };

    //Simula update de cliente...
    mockClienteRepository.updateCliente.mockResolvedValue = (cliente) => {

        let clienteEnc = null;

        if (clientesList.length > 0) {
            clientesList.forEach((item) => {

                if (item.cliente_id === cliente.cliente_id) {

                    clienteEnc = cliente;

                }
            });
        }


        return clienteEnc;
    }


    test('Creates a new cliente', async () => {

        let newClienteData = generateClienteData();

        //Muda o comportamento para executar a função "mockada"...
        mockClienteRepository.createCliente.mockReturnValue(
            mockClienteRepository.createCliente.mockResolvedValue(newClienteData));

        const clienteService = new ClienteService(mockClienteRepository);

        let createdCliente;

        //Forçando erro na primeira tentativa ao deixar de passar a senha...
        try {
            createdCliente = await clienteService.createCliente(newClienteData);
        } catch {

            //Informa a senha para possilitar o novo cadastro..
            newClienteData.senha = faker.internet.password();

            createdCliente = await clienteService.createCliente(newClienteData);

        }

        showInfo("Resultado created cliente");
        showInfo(JSON.stringify(createdCliente));

        expect(createdCliente.cliente_id).toBe(1);
        expect(mockClienteRepository.createCliente).toHaveBeenCalledWith(newClienteData);

        mockClienteId = createdCliente.cliente_id;
    });

    test('Gets an cliente by ID', async () => {


        //Muda o comportamento para executar a função "mockada"...
        mockClienteRepository.getCliente.mockReturnValue(
            mockClienteRepository.getCliente.mockResolvedValue(mockClienteId));

        const clienteService = new ClienteService(mockClienteRepository);
        const cliente = await clienteService.getCliente(mockClienteId);


        showInfo(`gets an cliente by id:`);
        showInfo(JSON.stringify(cliente));

        expect(cliente.cliente_id).toEqual(mockClienteId);
        expect(mockClienteRepository.getCliente).toHaveBeenCalledWith(mockClienteId);
    });

    test('Gets all clientes', async () => {


        //Muda o comportamento para executar a função "mockada"...
        mockClienteRepository.getClientes.mockReturnValue(
            mockClienteRepository.getClientes.mockResolvedValue());

        const clienteService = new ClienteService(mockClienteRepository);
        const clientes = await clienteService.getClientes();


        showInfo(`Gets all clientes:`);
        showInfo(JSON.stringify(clientes));

        expect(clientes.length).toEqual(clientesList.length);
        expect(mockClienteRepository.getClientes).toHaveBeenCalledWith();
    });


    test('Updates an existing cliente', async () => {

        //Caso de falha...

        //Forçando cobertura do erro no update...
        const clienteToUpdateFail = { cliente_id: -1, ...generateClienteData() };

        mockClienteRepositoryFail.updateCliente.mockResolvedValue(clienteToUpdateFail);

        const clienteServiceFail = new ClienteService(mockClienteRepositoryFail);


        //Forçando cobertura dos testes em caso de falha no update...
        try {

            await clienteServiceFail.updateCliente(clienteToUpdateFail);

        } catch {
            showInfo(`Updated Cliente Fail: ${JSON.stringify(clienteToUpdateFail)}`);
        }

        //Caso de sucesso...

        const clienteToUpdate = { cliente_id: mockClienteId, ...generateClienteData() };

        //Muda o comportamento para executar a função "mockada"...
        mockClienteRepository.updateCliente.mockReturnValue(
            mockClienteRepository.updateCliente.mockResolvedValue(clienteToUpdate));


        const clienteService = new ClienteService(mockClienteRepository);

        let updatedCliente = await clienteService.updateCliente(clienteToUpdate);


        showInfo(`Updated Cliente: ${JSON.stringify(updatedCliente)}`);

        expect(updatedCliente.cliente_id).toBe(clienteToUpdate.cliente_id);
        expect(updatedCliente.nome).toBe(clienteToUpdate.nome);

        expect(mockClienteRepository.updateCliente).toHaveBeenCalledWith(clienteToUpdate);
    });


}

);

let mockAutorId = 1;

//Evitar chamada a recursos integrados ...
const mockAutorRepository = {

    createAutor: jest.fn(),
    getAutors: jest.fn(),
    getAutor: jest.fn(),
    deleteAutor: jest.fn(),
    updateAutor: jest.fn(),
    getQtdLivrosByAutorId: jest.fn()
};

const mockAutorRepositoryFail = {

    createAutor: jest.fn(),
    getAutors: jest.fn(),
    getAutor: jest.fn(),
    deleteAutor: jest.fn(),
    updateAutor: jest.fn(),
    getQtdLivrosByAutorId: jest.fn()
};



describe('Unit Tests - Autor', () => {

    const showInfo = (msg) => {

        const show = false;
        if (show) console.log(msg);
    }
    /*
        beforeEach(() => {
            jest.clearAllMocks(); // Reset mocks before each test
        });
    */

    //Gera dados de um autor fake...
    function generateAutorData() {
        return {
            nome: faker.person.fullName(),
            email: '',//faker.internet.email(), Forçar o erro...
            telefone: faker.phone.number().substring(0, 14)
        };
    };

    const autores = [];



    // eslint-disable-next-line no-unused-vars
    mockAutorRepository.getQtdLivrosByAutorId.mockResolvedValue = (autorId) => {

        return 0;
    }
    // eslint-disable-next-line no-unused-vars
    mockAutorRepositoryFail.getQtdLivrosByAutorId.mockResolvedValue = (autorId) => {

        return 0;
    }

    // Simula criação de novo de autor...
    mockAutorRepository.createAutor.mockResolvedValue = (autor) => {

        showInfo(`createAutor: ${JSON.stringify(autor)}`);

        let newAutor = { autor_id: mockAutorId++, ...autor }

        autores.push(newAutor);

        return newAutor;
    };

    //Simula pesquisa de todos os autores... 
    mockAutorRepository.getAutors.mockResolvedValue = () => {


        showInfo("getAutors");

        //Se ainda não tiver sido criado nenhum autor, simula a criação de 10 novos autores...
        if (autores.length === 0) {

            for (let i = 1; i < 10; i++) {

                autores.push({ autor_id: mockAutorId++, ...generateAutorData() });
            }
        }

        return autores;
    };


    //Simula pesquisa de autor através do id.. 
    mockAutorRepository.getAutor.mockResolvedValue = (id) => {

        showInfo(`getAutor Mock by id: ${id}`);

        showInfo(`Autores: ${JSON.stringify(autores)}`)
        let autorEnc = null;

        autores.forEach((autorItem) => {

            showInfo(autorItem);

            if (autorItem.autor_id === id) {

                autorEnc = autorItem;

                return autorItem;
            }

        });



        return autorEnc;
    };

    // Simula exclusão de autor...
    mockAutorRepository.deleteAutor.mockResolvedValue = (id) => {

        let autorEnc = null;

        autores.forEach((autor) => {

            if (autor.autor_id === id) {

                autorEnc = autor;

            }
        });

        if (autorEnc == null) throw new Error("Autor não encontrado!");

        autores.pop(autorEnc);
    };

    //Simula update de autor...
    mockAutorRepository.updateAutor.mockResolvedValue = (autor) => {

        let autorEnc = null;

        if (autores.length > 0) {
            autores.forEach((item) => {

                if (item.autor_id === autor.autor_id) {

                    autorEnc = autor;

                }
            });
        }


        return autorEnc;
    }


    test('Creates a new Autor', async () => {

        let newAutorData = generateAutorData();

        //Caso de falha...

        //Muda o comportamento para executar a função "mockada"...
        mockAutorRepositoryFail.createAutor.mockResolvedValue(newAutorData);

        const autorServiceFail = new AutorService(mockAutorRepositoryFail,locale);

        try {
            await autorServiceFail.createAutor(newAutorData);
        } catch (e) {
            showInfo(`Create Autor Fail: ${JSON.stringify(e)}`);
        }

        //Caso de sucesso...
        newAutorData.email = faker.internet.email();

        //Muda o comportamento para executar a função "mockada"...
        mockAutorRepository.createAutor.mockReturnValue(
            mockAutorRepository.createAutor.mockResolvedValue(newAutorData));

        const autorService = new AutorService(mockAutorRepository);

        const createdAutor = await autorService.createAutor(newAutorData);

        showInfo("Resultado created autor");
        showInfo(JSON.stringify(createdAutor));

        expect(createdAutor.autor_id).toBe(1);
        expect(mockAutorRepository.createAutor).toHaveBeenCalledWith(newAutorData);

        mockAutorId = createdAutor.autor_id;
    });

    test('Gets an autor by ID', async () => {
        const autorId = mockAutorId;

        //Muda o comportamento para executar a função "mockada"...
        mockAutorRepository.getAutor.mockReturnValue(
            mockAutorRepository.getAutor.mockResolvedValue(autorId));

        const autorService = new AutorService(mockAutorRepository);
        const autor = await autorService.getAutor(autorId);


        showInfo(`gets an autor by id:`);
        showInfo(JSON.stringify(autor));

        expect(autor.autor_id).toEqual(autorId);
        expect(mockAutorRepository.getAutor).toHaveBeenCalledWith(autorId);
    });

    test('Gets all Autors', async () => {


        //Muda o comportamento para executar a função "mockada"...
        mockAutorRepository.getAutors.mockReturnValue(
            mockAutorRepository.getAutors.mockResolvedValue());

        const autorService = new AutorService(mockAutorRepository);
        const autors = await autorService.getAutors();


        showInfo(`Gets all Autors:`);
        showInfo(JSON.stringify(autors));

        expect(autors.length).toEqual(autores.length);
        expect(mockAutorRepository.getAutors).toHaveBeenCalledWith();
    });


    test('Updates an existing Autor', async () => {

        //Caso de falha...

        //Forçando cobertura do erro no update...
        const autorToUpdateFail = { autor_id: -1, ...generateAutorData() };

        mockAutorRepositoryFail.updateAutor.mockResolvedValue(autorToUpdateFail);

        const autorServiceFail = new AutorService(mockAutorRepositoryFail);

        //Forçando cobertura dos testes em caso de falha no update...
        try {

            await autorServiceFail.updateAutor(autorToUpdateFail);

        } catch {
            showInfo(`Updated Autor Fail: ${JSON.stringify(autorToUpdateFail)}`);
        }


        const autorId = mockAutorId;

        const autorToUpdate = { autor_id: autorId, ...generateAutorData() };

        //Muda o comportamento para executar a função "mockada"...
        mockAutorRepository.updateAutor.mockReturnValue(
            mockAutorRepository.updateAutor.mockResolvedValue(autorToUpdate));


        const autorService = new AutorService(mockAutorRepository);
        const updatedAutor = await autorService.updateAutor(autorToUpdate);

        showInfo(`Updated Autor: ${JSON.stringify(updatedAutor)}`);

        expect(updatedAutor.autor_id).toBe(autorToUpdate.autor_id);
        expect(updatedAutor.nome).toBe(autorToUpdate.nome);

        expect(mockAutorRepository.updateAutor).toHaveBeenCalledWith(autorToUpdate);
    });


}

);



let mockLivroId = 1;


//Evitar chamada a recursos integrados ...
const mockLivroRepository = {

    createLivro: jest.fn(),
    getLivros: jest.fn(),
    getLivro: jest.fn(),
    deleteLivro: jest.fn(),
    updateLivro: jest.fn(),
    getQtdVendasByLivroId: jest.fn()
};

const mockLivroRepositoryFail = {

    createLivro: jest.fn(),
    getLivros: jest.fn(),
    getLivro: jest.fn(),
    deleteLivro: jest.fn(),
    updateLivro: jest.fn(),
};


const mockLivroInfoRepository = {
    createLivroInfo: jest.fn(),
    updateLivroInfo: jest.fn(),
    getLivroInfo: jest.fn(),
    deleteLivroInfo: jest.fn(),
    createAvaliacao: jest.fn(),
    deleteAvaliacao: jest.fn(),
};



describe('Unit Tests - Livro', () => {

    const showInfo = (msg) => {

        const show = true;
        if (show) console.log(msg);
    }

    const getRandomInt = (min = 0, max = 1000) => {

        // Ensure min is less than or equal to max
        if (min > max) {
            [min, max] = [max, min];
        }

        const randomFloat = Math.random();

        // Scale the random number to be within the desired range and round down to get an integer
        const randomInt = Math.floor(randomFloat * (max - min + 1)) + min;

        return randomInt;
    }

    /*
        beforeEach(() => {
            jest.clearAllMocks(); // Reset mocks before each test
        });
    
    */

    //Gera dados de um livro fake...
    function generateLivroData() {
        return {
            autor_id: mockAutorId,
            nome: faker.music.songName(),//books name not exists?...
            valor: 0,//faker.commerce.price(), Forçar falha...
            estoque: getRandomInt()
        };

    }

    const livrosList = [];
     
    //let mockAutorId = 1;

    const livrosInfoList = [];

    // Simula criação de novo de livro...
    mockLivroRepository.createLivro.mockResolvedValue = (livro) => {

        showInfo(`createLivro: ${JSON.stringify(livro)}`);

        let newLivro = { livro_id: mockLivroId++, ...livro }

        livrosList.push(newLivro);

        return newLivro;
    };

    //Simula pesquisa de todos os livrosList... 
    mockLivroRepository.getLivros.mockResolvedValue = () => {


        showInfo("getLivros");

        //Se ainda não tiver sido criado nenhum livro, simula a criação de 10 novos livrosList...
        if (livrosList.length === 0) {

            for (let i = 1; i < 10; i++) {

                livrosList.push({ livro_id: mockLivroId++, ...generateLivroData() });
            }
        }

        return livrosList;
    };


    //Simula pesquisa de livro através do id.. 
    mockLivroRepository.getLivro.mockResolvedValue = (id) => {

        showInfo(`getLivro Mock by id: ${id}`);

        showInfo(`Livroes: ${JSON.stringify(livrosList)}`)
        let livroEnc = null;

        livrosList.forEach((livroItem) => {

            showInfo(livroItem);

            if (livroItem.livro_id === id) {

                livroEnc = livroItem;

                return livroItem;
            }

        });



        return livroEnc;
    };

    // Simula exclusão de livro...
    mockLivroRepository.deleteLivro.mockResolvedValue = (id) => {

        let livroEnc = null;

        livrosList.forEach((livro) => {

            if (livro.livro_id === id) {

                livroEnc = livro;

            }
        });

        if (livroEnc == null) throw new Error("Livro não encontrado!");

        livrosList.pop(livroEnc);
    };

    // eslint-disable-next-line no-unused-vars
    mockLivroRepository.getQtdVendasByLivroId.mockResolvedValue = (id) => {
        return 0;
    }
    //Simula update de livro...
    mockLivroRepository.updateLivro.mockResolvedValue = (livro) => {

        let livroEnc = null;

        if (livrosList.length > 0) {
            livrosList.forEach((item) => {

                if (item.livro_id === livro.livro_id) {

                    livroEnc = livro;

                }
            });
        }


        return livroEnc;
    }



    mockLivroInfoRepository.createLivroInfo.mockResolvedValue = (livroInfo) => {

        showInfo(`createLivroInfo: ${JSON.stringify(livroInfo)}`);

        livrosInfoList.push(livroInfo);
    }


    mockLivroInfoRepository.updateLivroInfo.mockResolvedValue = (livroInfo) => {

        showInfo(`createLivroInfo: ${JSON.stringify(livroInfo)}`);


        livrosInfoList.forEach((item) => {

            if (item.livroId === livroInfo.livroId) {

                item = livroInfo;

            }
        });

    }

    mockLivroInfoRepository.deleteLivroInfo.mockResolvedValue = (id) => {

        let livroInfoEnc = null;

        livrosInfoList.forEach((livroInfo) => {

            if (livroInfo.livroId === id) {

                livroInfoEnc = livroInfo;

            }
        });

        if (livroInfoEnc == null) throw new Error("Livro Info não encontrado!");

        livrosInfoList.pop(livroInfoEnc);
    }

    mockLivroInfoRepository.getLivroInfo.mockResolvedValue = (livroId) => {

        let livroInfoEnc;

        livrosInfoList.forEach((item) => {

            if (item.livroId === livroId) {

                livroInfoEnc = item;

            }
        });

        return livroInfoEnc

    }
    mockLivroInfoRepository.createAvaliacao.mockResolvedValue = (avaliacao, livroId) => {


        livrosInfoList.forEach((item) => {

            if (item.livroId === livroId) {

                item.avaliacoes.push(avaliacao);

            }
        });


    }
    mockLivroInfoRepository.deleteAvaliacao.mockResolvedValue = (livroId, index) => {

        livrosInfoList.forEach((item) => {

            if (item.livroId === livroId) {

                item.avaliacoes.slice(index, 1);

            }
        });
    }


    test('Creates a new Livro', async () => {

        let newLivroData = generateLivroData();

        //Caso de falha na criação...

        //Muda o comportamento para executar a função "mockada"...
        mockLivroRepositoryFail.createLivro.mockReturnValue(null);
        mockLivroRepositoryFail.createLivro.mockResolvedValue(newLivroData);

        const livroServiceFail = new LivroService(mockLivroRepositoryFail, mockLivroInfoRepository);

        try {
            await livroServiceFail.createLivro(newLivroData);
        } catch (e) {
            showInfo(`Create Livro Fail: ${JSON.stringify(e)}`);
        }

        //Caso de sucesso na criação...
        newLivroData.valor = faker.commerce.price();

        //Muda o comportamento para executar a função "mockada"...
        mockLivroRepository.createLivro.mockReturnValue(
            mockLivroRepository.createLivro.mockResolvedValue(newLivroData));

        const livroService = new LivroService(mockLivroRepository, mockLivroInfoRepository);

        showInfo("Antes de createLivro:");
        showInfo(JSON.stringify(newLivroData));
        const createdLivro = await livroService.createLivro(newLivroData);

        showInfo("Resultado created livro");
        showInfo(JSON.stringify(createdLivro));

        expect(createdLivro.livro_id).toBe(1);
        expect(mockLivroRepository.createLivro).toHaveBeenCalledWith(newLivroData);

        mockLivroId = createdLivro.livro_id;
    });

    test('Gets livro by ID', async () => {



        //Muda o comportamento para executar a função "mockada"...
        mockLivroRepository.getLivro.mockReturnValue(
            mockLivroRepository.getLivro.mockResolvedValue(mockLivroId));

        const livroService = new LivroService(mockLivroRepository, mockLivroInfoRepository);
        const livro = await livroService.getLivro(mockLivroId);


        showInfo(`gets an livro by id:`);
        showInfo(JSON.stringify(livro));

        expect(livro.livro_id).toEqual(mockLivroId);
        expect(mockLivroRepository.getLivro).toHaveBeenCalledWith(mockLivroId);
    });

    test('Gets all Livros', async () => {


        //Muda o comportamento para executar a função "mockada"...
        mockLivroRepository.getLivros.mockReturnValue(
            mockLivroRepository.getLivros.mockResolvedValue());

        const livroService = new LivroService(mockLivroRepository, mockLivroInfoRepository);
        const livros = await livroService.getLivros();


        showInfo(`Gets all livros:`);
        showInfo(JSON.stringify(livros));

        expect(livros.length).toEqual(livrosList.length);
        expect(mockLivroRepository.getLivros).toHaveBeenCalledWith();
    });



    test('Updates an existing Livro', async () => {



        //Forçar falha no update...
        const livroToUpdateFail = { livro_id: -1, ...generateLivroData() }

        mockLivroRepositoryFail.updateLivro.mockResolvedValue(livroToUpdateFail);
        mockLivroRepository.updateLivro.mockReturnValue(null);


        const livroServiceFail = new LivroService(mockLivroRepositoryFail, mockLivroInfoRepository);

        //Forçando cobertura dos testes em caso de falha no update...
        try {

            await livroServiceFail.updateLivro(livroToUpdateFail);

        } catch (e) {
            showInfo(`Updated Livro Fail: ${e.message}`);
        }

        //Sucesso no update...

        let livroToUpdate = { livro_id: mockLivroId, ...generateLivroData() };

        //Muda o comportamento para executar a função "mockada"...
        mockLivroRepository.updateLivro.mockReturnValue(
            mockLivroRepository.updateLivro.mockResolvedValue(livroToUpdate));

        const livroService = new LivroService(mockLivroRepository, mockLivroInfoRepository);

        let updatedLivro;
        try {

            //will fail again: "Não é permitido alterar o autor e o nome do livro"...
            updatedLivro = await livroService.updateLivro(livroToUpdate);

        } catch (e) {

            showInfo(`Update Fail: ${e.message}`);

            //Remove o autor_id e o nome do livro para permitir o update com sucesso...

            // eslint-disable-next-line no-undef
            const livroToUpdateOK = {
                livro_id: livroToUpdate.livro_id,
                valor: livroToUpdate.valor,
                estoque: livroToUpdate.estoque
            }
            livroToUpdate = livroToUpdateOK;

            //Muda o comportamento para executar a função "mockada"...
            mockLivroRepository.updateLivro.mockReturnValue(
                mockLivroRepository.updateLivro.mockResolvedValue(livroToUpdate));


            updatedLivro = await livroService.updateLivro(livroToUpdate);
        }


        showInfo(`Updated Livro: ${JSON.stringify(updatedLivro)}`);

        expect(updatedLivro.livro_id).toBe(livroToUpdate.livro_id);
        expect(updatedLivro.nome).toBe(livroToUpdate.nome);

        expect(mockLivroRepository.updateLivro).toHaveBeenCalledWith(livroToUpdate);
    });




    test('Creates a new Livro Info', async () => {

        const newLivroInfo = {
            livroId: mockLivroId,
            descricao: faker.music.songName(),
            paginas: getRandomInt(30, 1000),
            editora: '',//faker.company.name(), Forçar a falha...
            avaliacoes: []
        }


        //Muda o comportamento para executar a função "mockada"...

        mockLivroInfoRepository.createLivroInfo.mockResolvedValue(newLivroInfo);


        try {
            await new LivroService(mockLivroRepository, mockLivroInfoRepository).createLivroInfo(newLivroInfo);
        } catch (e) {
            showInfo(`Create Livro Info Fail: ${JSON.stringify(e)}`);
        }

        //Caso de sucesso na criação...
        newLivroInfo.editora = faker.company.name();

        //Muda o comportamento para executar a função "mockada"...
        mockLivroInfoRepository.createLivroInfo.mockResolvedValue(newLivroInfo);

        new LivroService(mockLivroRepository, mockLivroInfoRepository).createLivroInfo(newLivroInfo);

        showInfo("Resultado created Livro Info");
        //showInfo(JSON.stringify(createdLivro));

        //expect(createdLivro.livro_id).toBe(1);
        expect(mockLivroInfoRepository.createLivroInfo).toHaveBeenCalledWith(newLivroInfo);
    });
 

    describe('Unit Tests - Venda', () => {


        /*
        beforeEach(() => {
            jest.clearAllMocks(); // Reset mocks before each test
        });
        */

        const showInfo = (msg) => {

            const show = false;
            if (show) console.log(msg);
        }


        //Gera dados de um venda fake...
        function generateVendaData() {
            return {

                cliente_id: mockClienteId,
                livro_id: mockLivroId,
                valor: faker.commerce.price(),//Forçar falha...
                data_venda: faker.date.recent()
            };

        };

        const vendasList = [];
        let mockVendaId = 1;
 


        //Evitar chamada a recursos integrados ...
        const mockVendaRepository = {

            createVenda: jest.fn(),
            getVendas: jest.fn(),
            getVenda: jest.fn(),
            deleteVenda: jest.fn(),
            updateVenda: jest.fn(),
        };

        const mockVendaRepositoryFail = {

            createVenda: jest.fn(),
            getVendas: jest.fn(),
            getVenda: jest.fn(),
            deleteVenda: jest.fn(),
            updateVenda: jest.fn(),
        };

        // Simula criação de novo de venda...
        mockVendaRepository.createVenda.mockResolvedValue = (venda) => {

            showInfo(`createVenda: ${JSON.stringify(venda)}`);

            let newVenda = { venda_id: mockVendaId++, ...venda }

            vendasList.push(newVenda);

            return newVenda;
        };

        //Simula pesquisa de todos os vendasList... 
        mockVendaRepository.getVendas.mockResolvedValue = () => {


            showInfo("getVendas");

            //Se ainda não tiver sido criado nenhum venda, simula a criação de 10 novos vendasList...
            if (vendasList.length === 0) {

                for (let i = 1; i < 10; i++) {

                    vendasList.push({ venda_id: mockVendaId++, ...generateVendaData() });
                }
            }

            return vendasList;
        };


        //Simula pesquisa de venda através do id.. 
        mockVendaRepository.getVenda.mockResolvedValue = (id) => {

            showInfo(`getVenda Mock by id: ${id}`);

            showInfo(`Vendaes: ${JSON.stringify(vendasList)}`)
            let vendaEnc = null;

            vendasList.forEach((vendaItem) => {

                showInfo(vendaItem);

                if (vendaItem.venda_id === id) {

                    vendaEnc = vendaItem;

                    return vendaItem;
                }

            });



            return vendaEnc;
        };

        // Simula exclusão de venda...
        mockVendaRepository.deleteVenda.mockResolvedValue = (id) => {

            let vendaEnc = null;

            vendasList.forEach((venda) => {

                if (venda.venda_id === id) {

                    vendaEnc = venda;

                }
            });

            if (vendaEnc == null) throw new Error("Venda não encontrado!");

            vendasList.pop(vendaEnc);
        };

        //Simula update de venda...
        mockVendaRepository.updateVenda.mockResolvedValue = (venda) => {

            let vendaEnc = null;

            if (vendasList.length > 0) {
                vendasList.forEach((item) => {

                    if (item.venda_id === venda.venda_id) {

                        vendaEnc = venda;

                    }
                });
            }


            return vendaEnc;
        }


        test('Creates a new Venda', async () => {

            //Caso de falha...
            let newVendaData = generateVendaData();

            //Muda o comportamento para executar a função "mockada"...

            mockVendaRepositoryFail.createVenda.mockResolvedValue(newVendaData);

            const vendaServiceFail = new VendaService(mockVendaRepositoryFail, mockLivroRepositoryFail);

            try {
                await vendaServiceFail.createVenda(newVendaData);
            } catch (e) {

                showInfo(`Create Venda Fail: ${e.message}`);
            }


            //Sucesso...
            const newVendaDataOK = {
                cliente_id: newVendaData.cliente_id,
                livro_id: newVendaData.livro_id,
                data_venda: newVendaData.data_venda
            }

            //Muda o comportamento para executar a função "mockada"...
            mockVendaRepository.createVenda.mockReturnValue(
                mockVendaRepository.createVenda.mockResolvedValue(newVendaDataOK));

            const vendaService = new VendaService(mockVendaRepository, mockLivroRepository);

            const createdVenda = await vendaService.createVenda(newVendaDataOK);

            showInfo("Resultado created venda");
            showInfo(JSON.stringify(createdVenda));

            expect(createdVenda.venda_id).toBe(1);
            expect(mockVendaRepository.createVenda).toHaveBeenCalledWith(newVendaDataOK);

            mockVendaId= createdVenda.venda_id;
        });

        test('Gets Venda by ID', async () => {
            const vendaId = mockVendaId;

            //Muda o comportamento para executar a função "mockada"...
            mockVendaRepository.getVenda.mockReturnValue(
                mockVendaRepository.getVenda.mockResolvedValue(vendaId));

            const vendaService = new VendaService(mockVendaRepository,mockLivroRepository);
            const venda = await vendaService.getVenda(vendaId);


            showInfo(`gets an venda by id:`);
            showInfo(JSON.stringify(venda));

            expect(venda.venda_id).toEqual(vendaId);
            expect(mockVendaRepository.getVenda).toHaveBeenCalledWith(vendaId);
        });

        test('Gets all Vendas', async () => {


            //Muda o comportamento para executar a função "mockada"...
            mockVendaRepository.getVendas.mockReturnValue(
                mockVendaRepository.getVendas.mockResolvedValue());

            const vendaService = new VendaService(mockVendaRepository,mockLivroRepository);
            const vendas = await vendaService.getVendas();


            showInfo(`Gets all Vendas:`);
            showInfo(JSON.stringify(vendas));

            expect(vendas.length).toEqual(vendasList.length);
            expect(mockVendaRepository.getVendas).toHaveBeenCalledWith();
        });



        test('Updates an existing Venda', async () => {

            //Caso de falha...

            const vendaToUpdateFail = { venda_id: -1, ...generateVendaData() };

            mockVendaRepositoryFail.updateVenda.mockResolvedValue(vendaToUpdateFail);

            const vendaServiceFail = new VendaService(mockVendaRepositoryFail,mockLivroRepositoryFail);

            //Forçando cobertura dos testes em caso de falha no update...
            try {

                await vendaServiceFail.updateVenda(vendaToUpdateFail);

            } catch {
                showInfo(`Updated Venda Fail: ${JSON.stringify(vendaToUpdateFail)}`);
            }


            const vendaId = mockVendaId;

            const vendaToUpdate = { venda_id: vendaId, ...generateVendaData() };

            //Muda o comportamento para executar a função "mockada"...
            mockVendaRepository.updateVenda.mockReturnValue(
                mockVendaRepository.updateVenda.mockResolvedValue(vendaToUpdate));


            const vendaService = new VendaService(mockVendaRepository,mockLivroRepository);
            const updatedVenda = await vendaService.updateVenda(vendaToUpdate);

            showInfo(`Updated Venda: ${JSON.stringify(updatedVenda)}`);

            expect(updatedVenda.venda_id).toBe(vendaToUpdate.venda_id);
            expect(updatedVenda.nome).toBe(vendaToUpdate.nome);

            expect(mockVendaRepository.updateVenda).toHaveBeenCalledWith(vendaToUpdate);
        });


        test('Deletes a Venda by ID', async () => {

            //Caso de fallha...

            mockVendaRepositoryFail.deleteVenda.mockResolvedValue(-1);

            const vendaServiceFail = new VendaService(mockVendaRepositoryFail,mockLivroRepositoryFail);
            try {
                await vendaServiceFail.deleteVenda(-1);
            } catch (e) {
                showInfo(`Delete Venda Fail: ${JSON.stringify(e)}`);
            }

            const vendaId = mockVendaId;

            //Muda o comportamento para executar a função "mockada"...
            mockVendaRepository.deleteVenda.mockResolvedValue(vendaId);

            const vendaService = new VendaService(mockVendaRepository,mockLivroRepository);
            await vendaService.deleteVenda(vendaId);

            //Muda o comportamento para executar a função "mockada"...
            mockVendaRepository.getVenda.mockReturnValue(
                mockVendaRepository.getVenda.mockResolvedValue(vendaId));

            const vendaService2 = new VendaService(mockVendaRepository);
            const vendaExcluido = await vendaService2.getVenda(vendaId);

            expect(vendaExcluido).toBeNull();

            expect(mockVendaRepository.deleteVenda).toHaveBeenCalledWith(vendaId);
        });
    }

    );



    test('Deletes a cliente by ID', async () => {


        //Muda o comportamento para executar a função "mockada"...
        mockClienteRepository.deleteCliente.mockResolvedValue(mockClienteId);

        //Forçar falha no update...
        mockClienteRepositoryFail.deleteCliente.mockResolvedValue(-1);

        const clienteServiceFail = new ClienteService(mockClienteRepositoryFail);
        try {
            await clienteServiceFail.deleteCliente(-1);
        } catch (e) {
            showInfo(`Delete Cliente Fail: ${JSON.stringify(e)}`);
        }

        const clienteService = new ClienteService(mockClienteRepository);

        await clienteService.deleteCliente(mockClienteId);

        //Muda o comportamento para executar a função "mockada"...
        mockClienteRepository.getCliente.mockReturnValue(
            mockClienteRepository.getCliente.mockResolvedValue(mockClienteId));

        const clienteService2 = new ClienteService(mockClienteRepository);
        const clienteExcluido = await clienteService2.getCliente(mockClienteId);

        expect(clienteExcluido).toBeNull();

        expect(mockClienteRepository.deleteCliente).toHaveBeenCalledWith(mockClienteId);
    });

    test('Deletes a livro by ID', async () => {



        //Forçar falha no delete...
        mockLivroRepositoryFail.deleteLivro.mockResolvedValue(-1);

        const livroServiceFail = new LivroService(mockLivroRepositoryFail, mockLivroInfoRepository);
        try {
            await livroServiceFail.deleteLivro(-1);
        } catch (e) {
            showInfo(`Delete Livro Fail: ${e.message}`);
        }


        //Caso sucesso...

        //Muda o comportamento para executar a função "mockada"...
        mockLivroRepository.deleteLivro.mockResolvedValue(mockLivroId);
        mockLivroInfoRepository.deleteLivroInfo.mockResolvedValue(mockLivroId);

        const livroService = new LivroService(mockLivroRepository, mockLivroInfoRepository);
        await livroService.deleteLivro(mockLivroId);

        //Muda o comportamento para executar a função "mockada"...
        mockLivroRepository.getLivro.mockReturnValue(
            mockLivroRepository.getLivro.mockResolvedValue(mockLivroId));

        const livroService2 = new LivroService(mockLivroRepository, mockLivroInfoRepository);
        const livroExcluido = await livroService2.getLivro(mockLivroId);

        expect(livroExcluido).toBeNull();

        expect(mockLivroRepository.deleteLivro).toHaveBeenCalledWith(mockLivroId);
    });



    test('Deletes an Autor by id', async () => {

        //Caso de fallha...

        mockAutorRepositoryFail.deleteAutor.mockResolvedValue(-1);

        const autorServiceFail = new AutorService(mockAutorRepositoryFail);
        try {
            await autorServiceFail.deleteAutor(-1);
        } catch (e) {
            showInfo(`Delete Autor Fail: ${JSON.stringify(e)}`);
        }

        const autorId = mockAutorId;

        //Muda o comportamento para executar a função "mockada"...
        mockAutorRepository.deleteAutor.mockResolvedValue(autorId);

        const autorService = new AutorService(mockAutorRepository);
        await autorService.deleteAutor(autorId);

        //Muda o comportamento para executar a função "mockada"...
        mockAutorRepository.getAutor.mockReturnValue(
            mockAutorRepository.getAutor.mockResolvedValue(autorId));

        const autorService2 = new AutorService(mockAutorRepository);
        const autorExcluido = await autorService2.getAutor(autorId);

        expect(autorExcluido).toBeNull();

        expect(mockAutorRepository.deleteAutor).toHaveBeenCalledWith(autorId);
    });


}

);


