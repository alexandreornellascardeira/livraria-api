import mongoClient from "./mongodb.js";
const db = mongoClient.db("bookstore");
const collection = db.collection("livroInfo");

async function createLivroInfo(livroInfo) {

  await collection.insertOne(livroInfo);

}

async function updateLivroInfo(livroInfo) {

  await collection.updateOne(
    { livroId: livroInfo.livroId },
    { $set: { ...livroInfo } }
  );


}

async function deleteLivroInfo(livroId) {

  await collection.deleteOne({ livroId: parseInt(livroId) });

}

async function getLivroInfo(livroId) {

  return await collection.findOne({ livroId });

}

async function createAvaliacao(avaliacao, livroId) {

  let livroInfo = await getLivroInfo(parseInt(livroId));

  if (!livroInfo) {
    throw new Error('Informações do livro não encontrada!');
  }

  if (!livroInfo.avaliacoes) {

    const livroInfoAux = {
      ...livroInfo,
      avaliacoes: []
    }

    livroInfo = livroInfoAux;
  }

  livroInfo.avaliacoes.push(avaliacao);

  updateLivroInfo(livroInfo);

}

async function getAvaliacao(livroId) {

  return await collection.findOne(
    { livroId: parseInt(livroId) });

}

async function deleteAvaliacao(livroId, index) {

  const livroInfo = await getLivroInfo(parseInt(livroId));

  livroInfo.avaliacoes.splice(index, 1);

  await updateLivroInfo(livroInfo);

}

export default {
  createLivroInfo,
  updateLivroInfo,
  getLivroInfo,
  createAvaliacao,
  getAvaliacao,
  deleteAvaliacao,
  deleteLivroInfo
}