import i18n from 'i18n';

class AutorService {

  constructor(autorRepository, locale) {
    this.autorRepository = autorRepository;
    this.locale=locale;
  }

  async createAutor(autor) {

    if (!autor.nome || !autor.email || !autor.telefone) {
      throw new Error(i18n.__({ phrase: 'autor.data_required_service', locale: this.locale }));
    }

   return await this.autorRepository.createAutor(autor);
  }


  async getAutors() {
    return await this.autorRepository.getAutors();
  }

  async getAutor(id) {
    return await this.autorRepository.getAutor(id);
  }

  async updateAutor(autor) {

    const autorEnc = await this.getAutor(autor.autor_id);

    if (!autorEnc) {
      throw new Error(i18n.__({ phrase: 'autor.data_not_foud', locale: this.locale }));
    }

    return await this.autorRepository.updateAutor(autor);
  }

  async deleteAutor(id) {

    const autor = await this.getAutor(id);

    if (!autor) {
      throw new Error(i18n.__({ phrase: 'autor.data_not_foud', locale: this.locale }));
    }

    //Verifica se existem vendas para o cliente...
    const qtLivros=await this.autorRepository.getQtdLivrosByAutorId(id);

    if(qtLivros>0){
        throw new Error(i18n.__({ phrase: 'autor.delete_retricted', locale: this.locale }));
    }

    return await this.autorRepository.deleteAutor(id);
  }
}

export default AutorService;