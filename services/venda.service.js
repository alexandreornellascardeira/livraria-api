import i18n from 'i18n';

class VendaService {

    constructor(vendaRepository, livroRepository,locale) {
        this.vendaRepository = vendaRepository;
        this.livroRepository = livroRepository;
        this.locale=locale;
    }

    async createVenda(venda) {

        if (!venda.cliente_id || !venda.livro_id || !venda.data_venda) {
            throw new Error(i18n.__({ phrase: 'venda.data_required', locale: this.locale }));
        }
        if (venda.valor) {
            throw new Error(i18n.__({ phrase: 'venda.data_not_required', locale: this.locale }));
        }
        try {

            //Define o valor do livro...
            const livro = await this.livroRepository.getLivro(parseInt(venda.livro_id));

            if (!livro) {
                throw new Error('Livro não localizado!');
            }

            if (!livro.estoque || livro.estoque <= 0) {
                throw new Error('Livro sem saldo de estoque!');
            }


            return await this.vendaRepository.createVenda(venda);

        } catch (e) {

            throw new Error(`Parâmetro inválido! ${e.message}`);
        }
    }


    async getVendas() {
        return await this.vendaRepository.getVendas();
    }

    async getVenda(id) {
        try {
            return await this.vendaRepository.getVenda(parseInt(id));
        } catch {

            throw new Error('Parâmetro inválido!');
        }
    }


    async getVendasByLivroId(livroId) {
        try {
            return await this.vendaRepository.getVendasByLivroId(parseInt(livroId));
        } catch {

            throw new Error('Parâmetro inválido!');
        }
    }

    async getVendasByClienteId(clienteId) {
        try {
            return await this.vendaRepository.getVendasByClienteId(parseInt(clienteId));
        } catch {

            throw new Error('Parâmetro inválido!');
        }
    }

    async getVendasByAutorId(autorId) {
        try {
            return await this.vendaRepository.getVendasByAutorId(parseInt(autorId));
        } catch {

            throw new Error('Parâmetro inválido!');
        }
    }


    async updateVenda(venda) {
        try {
            const vendaEnc = await this.getVenda(parseInt(venda.venda_id));

            if (!vendaEnc) {
                throw new Error('Venda não encontrado!');
            }

            return await this.vendaRepository.updateVenda(venda);

        } catch {

            throw new Error('Parâmetro inválido!');
        }
    }

    async deleteVenda(id) {
        try {
            const venda = await this.getVenda(parseInt(id));

            if (!venda) {
                throw new Error('Venda não encontrado!');
            }

            return await this.vendaRepository.deleteVenda(id);
        } catch (e) {

            throw new Error(`Parâmetro inválido! ${e.message} - ${id}`);
        }
    }

}

export default VendaService;