const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//Retorna os repositórios cadastrados
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  //Recebendo as informações do repositório a ser cadastrado
  const {url, title, techs} = request.body;
  
  //Criando o novo repositório
  const repository = { id: uuid(), url, title, techs, likes: 0};

  //Inserindo o novo repositório na lista
  repositories.push(repository);

  //Retornando o repositório cadastrado
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  //Obtendo o id do repositorio que será alterado
  const { id } = request.params;
  
  //Recebendo as informações do repositório a ser alterado
  const {url, title, techs, likes} = request.body;

  //Verifica a localização do repositório desejado
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //Verifica se o repositório existe na lista
  if(repositoryIndex < 0){
    return response.status(400).send();
  }

  //Caso o usuário tente alterar a quantidade de likes
  if(likes){
    return response.status(400).json({"likes" : repositories[repositoryIndex].likes});
  }

  //Atualizando o repositório encontrado
  const repository = {
    id,
    url,
    title,
    techs,
    likes,
  }

  //Atualizando
  repositories[repositoryIndex] = repository;

  //Retornando caso tenha alterado com sucesso
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  //Verifica a localização do repositório desejado
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //Verifica se o repositório existe na lista
  if(repositoryIndex < 0){
    return response.status(400).send();
  }

  //Caso exista ele será removido
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();


});

app.post("/repositories/:id/like", (request, response) => {
  //Recebendo o id do repositório
  const { id } = request.params;

  //Encontrando o index do repositório em questão
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //Verifica se o repositório existe na lista
  if(repositoryIndex < 0){
    return response.status(400).send();
  }

  //Caso exista aumentaremos o número de likes
  repositories[repositoryIndex].likes += 1;

  return response.json({"likes" : repositories[repositoryIndex].likes});

});

module.exports = app;
