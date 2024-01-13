const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());
app.use(express.static("dist"));

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

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

let currentDate = new Date();
let string = currentDate.toUTCString();
console.log(string);
app.get("/", (request, response) => {
  response.send("<h1>Hello, World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  let content = `
  <div>
    <h3>Phonebook has info for ${persons.length} people</h3>
    <br/>
    <h3>${string}</h3>
  </div>`;
  response.send(content);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.send(person);
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const nameExists = persons.some(
    (existingPerson) => existingPerson.name === person.name
  );

  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
