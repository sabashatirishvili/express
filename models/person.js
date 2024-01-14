const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const url = process.env.MONGO;

mongoose.connect(url);
mongoose.set("strictQuery", false);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Person = mongoose.model("Person", personSchema);

module.exports = Person;
