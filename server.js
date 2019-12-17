'use strict';
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const superagent = require('superagent');

require('dotenv').config();

app.use(express.urlencoded({extended: true}));
app.use(express.static( './public'));

app.set('view engine', 'ejs');
app.set('views', './views/pages');


app.get('/', (request, response) => {
  response.render('index');
});
app.get('/hello', (request, response) => {
  response.render('index');
});
app.get('*', (req, res) => res.status(404).render('error'));
// app.post('./views/searches', searchBook);

app.post('/searches', search);


function Book(book) {
  this.title = book.title || 'No title available';
  this.author = book.authors || 'No author available';
  this.description = book.description || 'No description available';
  this.url = book.imageLinks ? 'https' + book.imageLinks.thumbnail.slice(4) : '../img/book-icon.png';
  this.isbn = book.industryIdentifiers ? `${book.industryIdentifiers[0].type} ${book.industryIdentifiers[0].identifier}` : 'No isbn available';
}


//Searching for books by title or author
function search(req, res){
  console.log('this', req,res)
  let searchStr = req.body.search[0];
  let searchType = req.body.search[1];
  let booksUrl = 'https://www.googleapis.com/books/v1/volumes?q=books';

  //Search Type Conditionals
  if(searchType === 'title'){
    booksUrl += `+intitle:${searchStr}`
  } else if (searchType === 'author') {
    booksUrl += `+inauthor:${searchStr}`

  }
  return superagent.get(booksUrl)
    .then(result => {
      let books = result.body.items.map(book => new Book(book.volumeInfo))
      console.log('this', books)
      res.render('searches/show', {books: books})
    })
}



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
