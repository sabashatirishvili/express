const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "castError") {
    return response.status(400).send({ error: "Malformatted id" });
  }

  next(error);
};

app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());
app.use(express.static("dist"));
app.use(errorHandler);

mongoose.connect(process.env.MONGO);

let currentDate = new Date();
let string = currentDate.toUTCString();
console.log(string);
app.get("/", (request, response) => {
  response.send("<h1>Hello, World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", async (request, response) => {
  const count = await Person.countDocuments({});
  let content = `
  <div>
    <h3>Phonebook has info for ${count} people</h3>
    <br/>
    <h3>${string}</h3>
  </div>`;
  response.send(content);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id).then((person) => {
    response.json(person);
  });
});

app.post("/api/persons", async (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name and number are required",
    });
  }

  try {
    const existingPerson = await Person.findOne({ name: body.name });

    if (nameExists) {
      existingPerson.number = body.number;
      const updatedPerson = await existingPerson.save();
      response.json(updatedPerson);
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      });

      const savedPerson = await person.save();
      response.json(savedPerson);
    }
  } catch (error) {
    console.error("Error saving person:", error);
    response.status(500).json({
      error: "Internal server error",
    });
  }
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updated) => response.json(updated))
    .catch((error) => {
      next(error);
    });
});
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
