const express = require('express');

const server = express();
server.use(express.json());

let numberOfRequests = 0;
const projects = [];

//verificar se projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found!' });
  }

  return next();
}

//log de requisições
function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

//criar projeto
server.post('/projects', (req, res)=>{
  const { id, title } = req.body;
  const project = {
                    id,
                    title,
                    tasks:[]
                  }
  projects.push(project);
  return res.json(projects);
});

//listar todos os projetos
server.get('/projects', (req, res)=>{
  return res.json(projects);
});

//listar um projeto
server.get('/projects/:id', checkProjectExists, (req, res)=>{
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  return res.json(project);  
});

//alterar um projeto
server.put('/projects/:id', checkProjectExists, (req, res)=>{
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);  
});

//apagar um projeto
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

//adicionar uma tarefa a um projeto
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);