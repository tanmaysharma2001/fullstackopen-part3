const mongoose = require("mongoose");

if (process.argv.length < 2) {
  console.log(
    "Please provide the password like this: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const newName = process.argv[3];
const newNumber = process.argv[4];

const url = `mongodb+srv://sharmatanmay617:${password}@cluster0.rjaoqxa.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (!newName) {
  mongoose
    .connect(url)
    .then((result) => {
      console.log("phonebook: ");

      Person.find({}).then((result) => {
        result.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
      });
    })
    .catch((err) => console.log(err));
} else {
  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected");

      const person = new Person({
        name: newName,
        number: newNumber,
      });

      return person.save();
    })
    .then(() => {
      console.log(`added ${newName} number ${newNumber} to phonebook`);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
