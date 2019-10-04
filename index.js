const express = require("express");
const server = express();
server.use(express.json());

const projects = [];
let requests = 0;

checkNumberOfRequestsDone = (req, res, next) => {
  requests++;
  console.log("Requests done until now: ", requests);

  return next();
};

checkIfProjectExists = (req, res, next) => {
  const { id } = req.params;
  const findProjects = projects.find(p => p.id == id);

  if (!findProjects)
    return res.status(400).json({ error: "Project not found!" });

  return next();
};

server.use(checkNumberOfRequestsDone);

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
