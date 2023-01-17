// const { response } = require('express')
const { response } = require("express");
const express = require("express");
const app = express();

// without json parser the type of the request body will be undefined.
app.use(express.json());

var d = new Date(Date.now());

var currentdate = new Date();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>ajksndkjasd</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(204).end();
  }
});

app.get("/info", (request, response) => {
  response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${d.toString()}</p>
    `);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (Object.keys(body).length === 0) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const newPersonName = body.name;
  const newPersonNumber = body.number;

  if (newPersonName.length === 0 || newPersonNumber.length === 0) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  if (persons.find((person) => person.name === newPersonName)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const newId = Math.floor(Math.random() * 1000);

  const newPerson = {
    name: body.name,
    number: body.number,
    id: newId,
  };

  persons = persons.concat(newPerson);

  response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
