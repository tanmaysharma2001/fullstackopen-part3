// const { response } = require('express')
const { response } = require("express");
const express = require("express");
const app = express();

const cors = require('cors')
app.use(cors())

// without json parser the type of the request body will be undefined.
app.use(express.json());

var morgan = require("morgan");

var d = new Date(Date.now());

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

app.use(morgan("tiny"));

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

app.get("/", function (req, res) {
  res.send("<h1>ajksndkjasd</h1>");
});

app.get("/api/persons", function (req, res) {
  res.json(persons);
});

app.get("/api/persons/:id", function (req, res) {
  const id = Number(request.params.id);

  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(204).end();
  }
});

app.get("/info", function (req, res) {
  res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${d.toString()}</p>
    `);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", function (request, response) {
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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint " });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
