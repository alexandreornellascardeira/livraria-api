
import i18n from 'i18n';

class LivroService {

    constructor(livroRepository, livroInfoRepository, locale) {
        this.livroRepository = livroRepository;
        this.livroInfoRepository = livroInfoRepository;
        this.locale=locale;
    }


    async createLivro(livro) {

        if (!livro.autor_id || !livro.nome || !livro.valor || !livro.estoque) {
            throw new Error(i18n.__({ phrase: 'livro.data_not_found', locale: this.locale }));
        }


        return await this.livroRepository.createLivro(livro);
    }


    async getLivros() {
        return await this.livroRepository.getLivros();
    }

    async getLivro(livroId) {

        if (!livroId) {
            throw new Error(i18n.__({ phrase: 'livro.id_required', locale: this.locale }));
        }

        const livro = await this.livroRepository.getLivro(livroId);

        if (livro) {
            livro.info = await this.livroInfoRepository.getLivroInfo(parseInt(livroId));
        }

        return livro;
    }

    async getLivroByAutorId(autorId) {

        if (!autorId) {
            throw new Error(i18n.__({ phrase: 'autor.id_required', locale: this.locale }));
        }

        const livros = await this.livroRepository.getLivroByAutorId(autorId);


        return livros;
    }

    async updateLivro(livro) {

        const livroEnc = await this.getLivro(livro.livro_id);

        if (!livroEnc) {
            throw new Error(i18n.__({ phrase: 'livro.data_not_found', locale: this.locale }));
        }

        if (livro.autor_id || livro.nome) {
            throw new Error(i18n.__({ phrase: 'livro.update_denied', locale: this.locale }));
        }
        return await this.livroRepository.updateLivro(livro);
    }

    async deleteLivro(id) {

        const livro = await this.getLivro(id);

        if (!livro) {
            throw new Error(i18n.__({ phrase: 'livro.not_found', locale: this.locale }));
        }

        //Verifica se existem vendas para o cliente...
        const qtVendas = await this.livroRepository.getQtdVendasByLivroId(id);

        if (qtVendas > 0) {
            throw new Error(i18n.__({ phrase: 'livro.delete_denied', locale: this.locale }));
        }


        return await this.livroRepository.deleteLivro(id);
    }

    async createLivroInfo(livroInfo) {

        if (!livroInfo.livroId) {
            throw new Error(i18n.__({ phrase: 'livro.id_required', locale: this.locale }));
        }
        await this.livroInfoRepository.createLivroInfo(livroInfo);
    }

    async updateLivroInfo(livroInfo) {

        if (!livroInfo.livroId) {
            throw new Error(i18n.__({ phrase: 'livro.id_required', locale: this.locale }));
        }


        await this.livroInfoRepository.updateLivroInfo(livroInfo);
    }

    async deleteLivroInfo(livroId) {

        const livro = await this.getLivro(livroId);

        if (!livro) {
            throw new Error(i18n.__({ phrase: 'livro.not_found', locale: this.locale }));
        }

        return await this.livroInfoRepository.deleteLivroInfo(livroId);
    }

    async getLivroInfo(livroId) {

        return await this.livroInfoRepository.getLivroInfo(parseInt(livroId));
    }

    async createAvaliacao(avaliacao, livroId) {

        if (!livroId || !avaliacao.nome || !avaliacao.nota || !avaliacao.avaliacao) {
            throw new Error(i18n.__({ phrase: 'livro.delete_denied', locale: this.locale }));
        }

        return await this.livroInfoRepository.createAvaliacao(avaliacao, livroId);
    }

    async deleteAvaliacao(livroId, index) {

        return await this.livroInfoRepository.deleteAvaliacao(livroId, index);
    }
}




export default LivroService;