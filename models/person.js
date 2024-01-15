const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const url = process.env.MONGO;

mongoose.connect(url);
mongoose.set('strictQuery', false);

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator(v) {
        return /^\d{2,3}-\d{4,}$/gm.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number.`,
    },
    required: [true, 'User phone number required'],
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Person = mongoose.model('Person', personSchema);

module.exports = Person;
