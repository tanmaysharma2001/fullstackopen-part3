// const { response } = require('express')
require("dotenv").config();
const { response, request } = require("express");
const express = require("express");
const app = express();
const Person = require("./models/person");

app.use(express.static("build"));

const cors = require("cors");
app.use(cors());

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
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", function (req, res, next) {

  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/info", function (req, res) {
  Person.count({}, function (err, count) {
    res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${d.toString()}</p>
    `);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
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

  const newPerson = Person({
    name: body.name,
    number: body.number,
  });

  if (persons.find((person) => person.name === newPersonName)) {
    Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
      .then((updatedPerson) => {
        response.json(updatedPerson);
      })
      .catch((error) => next(error));
  } else {
    newPerson.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  }
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const newPerson = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint " });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
