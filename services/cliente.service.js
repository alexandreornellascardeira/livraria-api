import i18n from 'i18n';
import bcrypt from "bcrypt";
import clienteRepository from "../repositories/cliente.repository.js";

class ClienteService {

    constructor(clienteRepository, locale) {
        this.clienteRepository = clienteRepository;
        this.locale=locale;
    }

    async hashPassword(plainTextPassword) {

        const saltRounds = 10;

        const hash = await bcrypt.hash(plainTextPassword, saltRounds);
        return hash;
    };

    async getInfoLogin(username, password) {

        const passOK = this.hashPassword(password);

        return clienteRepository.getInfoLogin(username, passOK);
    }

    async createCliente(cliente) {

        if (!cliente.nome || !cliente.email || !cliente.senha || !cliente.telefone || !cliente.endereco) {
            throw new Error(i18n.__({ phrase: 'cliente.data_required_service', locale: this.locale }) );
        }

        //Tratamento de senhas...
        cliente.senha = await this.hashPassword(cliente.senha);

        return await this.clienteRepository.createCliente(cliente);
    }

    async getClientes() {

        const clientes = await this.clienteRepository.getClientes();

        if (clientes != null) {

            const clientesOK = clientes.map(cliente => {


                if (cliente.senha) {
                    // eslint-disable-next-line no-unused-vars
                    const { senha, ...outrosCampos } = cliente;
                    return outrosCampos;
                }
                else {
                    return cliente;
                }

            });

            return clientesOK;
        }

       return clientes;

    }

    async getCliente(id) {
        const cliente = await this.clienteRepository.getCliente(id);

        if (cliente != null) {

            if (cliente.senha) {
                // eslint-disable-next-line no-unused-vars
                const { senha, ...outrosCampos } = cliente;
                return outrosCampos;
            }
        }

        return cliente;

    }

    async updateCliente(cliente) {

        const clienteEnc = await this.getCliente(cliente.cliente_id);

        if (!clienteEnc) {
            throw new Error(i18n.__({ phrase: 'cliente.data_not_found', locale: this.locale }));
        }

        return await this.clienteRepository.updateCliente(cliente);
    }

    async deleteCliente(id) {

        const cliente = await this.getCliente(id);

        if (!cliente) {
            throw new Error(i18n.__({ phrase: 'cliente.data_not_found', locale: this.locale }));
        }

        //Verifica se existem vendas para o cliente...
        const qtVendas = await this.clienteRepository.getQtdVendasByClienteId(id);

        if (qtVendas > 0) {
            throw new Error(i18n.__({ phrase: 'cliente.delete_denied', locale: this.locale }));
        }

        return await this.clienteRepository.deleteCliente(id);
    }
}

export default ClienteService;