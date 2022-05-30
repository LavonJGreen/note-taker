const express = require('express');
const fs = require('fs');
const path = require ('path');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001
const app = express();
const sequelize = require('./config/connection');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});


app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.post('/api/notes', (req, res) => {
  
  let createNote = req.body;
  
  
  let noteId = uuidv4();
  

  let loggedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  console.log(loggedNotes);
 
  createNote.id = noteId;
  
  loggedNotes.push(createNote);
  console.log(createNote);
  

  fs.writeFileSync('./db/db.json', JSON.stringify(loggedNotes));
  res.json(loggedNotes);
});

app.delete('/api/notes/:id', (req, res) => {
  let noteId = req.params.id.toString();
  let loggedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

  const newLoggedNotes = loggedNotes.filter(note => note.id.toString() !== noteId);

  fs.writeFileSync('./db/db.json', JSON.stringify(newLoggedNotes));
  res.json(newLoggedNotes); 

})

// app.listen(PORT, () => {
//   console.log(`API server now on port ${PORT}`);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});
});