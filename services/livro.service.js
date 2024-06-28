
class LivroService {

    constructor(livroRepository, livroInfoRepository) {
        this.livroRepository = livroRepository;
        this.livroInfoRepository = livroInfoRepository;
    }


    async createLivro(livro) {

        if (!livro.autor_id || !livro.nome || !livro.valor || !livro.estoque) {
            throw new Error("Informe os dados obrigatórios: ID do autor, nome, valor e estoque.");
        }


        return await this.livroRepository.createLivro(livro);
    }


    async getLivros() {
        return await this.livroRepository.getLivros();
    }

    async getLivro(livroId) {

        if (!livroId) {
            throw new Error('Informe o ID do livro!');
        }

        const livro = await this.livroRepository.getLivro(livroId);

        if (livro) {
            livro.info = await this.livroInfoRepository.getLivroInfo(parseInt(livroId));
        }

        return livro;
    }

    async getLivroByAutorId(autorId) {

        if (!autorId) {
            throw new Error('Informe o ID do autor!');
        }

        const livros = await this.livroRepository.getLivroByAutorId(autorId);


        return livros;
    }

    async updateLivro(livro) {

        const livroEnc = await this.getLivro(livro.livro_id);

        if (!livroEnc) {
            throw new Error('Livro não encontrado!');
        }

        if (livro.autor_id || livro.nome) {
            throw new Error('Não é permitido alterar o autor e o nome do livro!');
        }
        return await this.livroRepository.updateLivro(livro);
    }

    async deleteLivro(id) {

        const livro = await this.getLivro(id);

        if (!livro) {
            throw new Error('Livro não encontrado!');
        }

        //Verifica se existem vendas para o cliente...
        const qtVendas = await this.livroRepository.getQtdVendasByLivroId(id);

        if (qtVendas > 0) {
            throw new Error('O livro possui vendas e não pode ser excluído!');
        }


        return await this.livroRepository.deleteLivro(id);
    }

    async createLivroInfo(livroInfo) {

        if (!livroInfo.livroId) {
            throw new Error("LivroId não informado!");
        }
        await this.livroInfoRepository.createLivroInfo(livroInfo);
    }

    async updateLivroInfo(livroInfo) {

        if (!livroInfo.livroId) {
            throw new Error("LivroId não informado!");
        }


        await this.livroInfoRepository.updateLivroInfo(livroInfo);
    }

    async deleteLivroInfo(livroId) {

        const livro = await this.getLivro(livroId);

        if (!livro) {
            throw new Error('Livro não encontrado!');
        }

        return await this.livroInfoRepository.deleteLivroInfo(livroId);
    }

    async getLivroInfo(livroId) {

        return await this.livroInfoRepository.getLivroInfo(parseInt(livroId));
    }

    async createAvaliacao(avaliacao, livroId) {

        if (!livroId || !avaliacao.nome || !avaliacao.nota || !avaliacao.avaliacao) {
            throw new Error("Os seguintes parâmetros são obrigatórios: Id do Livro, autor, nota e avaliação!");
        }

        return await this.livroInfoRepository.createAvaliacao(avaliacao, livroId);
    }

    async deleteAvaliacao(livroId, index) {

        return await this.livroInfoRepository.deleteAvaliacao(livroId, index);
    }
}




export default LivroService;