
class AutorService {

  constructor(autorRepository) {
    this.autorRepository = autorRepository;
  }

  async createAutor(autor) {

    if (!autor.nome || !autor.email || !autor.telefone) {
      throw new Error("Informe os dados obrigatórios: Nome, email e telefone.");
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
      throw new Error('Autor não encontrado!');
    }

    return await this.autorRepository.updateAutor(autor);
  }

  async deleteAutor(id) {

    const autor = await this.getAutor(id);

    if (!autor) {
      throw new Error('Autor não encontrado!');
    }

    //Verifica se existem vendas para o cliente...
    const qtLivros=await this.autorRepository.getQtdLivrosByAutorId(id);

    if(qtLivros>0){
        throw new Error('O autor possui livros e não pode ser excluído!');
    }

    return await this.autorRepository.deleteAutor(id);
  }
}

export default AutorService;