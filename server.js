'use strict';
const express = require('express');
const app = express();
const pg = require('pg');
const PORT = process.env.PORT || 3000;
const superagent = require('superagent');

require('dotenv').config();

app.use(express.urlencoded({extended: true}));
app.use(express.static( './public'));

app.set('view engine', 'ejs');
app.set('views', './views/pages');

//Database setup
const client = new pg.Client(process.env.DATABASE_URL)
client.connect()
client.on('error', err => console.error(err));

//Search Route
app.get('/', (request, response) => {
  response.render('index');
});
app.get('/hello', (request, response) => {
  response.render('index');
});
app.get('*', (req, res) => res.status(404).render('error'));
// app.post('./views/searches', searchBook);

app.post('/searches', search);

//Home Route
// function home(req, res){
//   let SQL = 'SELECT * FROM books';

//   return client.query()
// }


function Book(book) {
  this.title = book.title || 'No title available';
  this.author = book.authors || 'No author available';
  this.description = book.description || 'No description available';
  this.url = book.imageLinks ? 'https' + book.imageLinks.thumbnail.slice(4) : '../img/book-icon.png';
  this.isbn = book.industryIdentifiers ? `${book.industryIdentifiers[0].type} ${book.industryIdentifiers[0].identifier}` : 'No isbn available';
}


//Searching for books by title or author
function search(req, res){
  //console.log('this', req,res)
  // let searchStr = req.body.search;
  // console.log(`Search String: ${searchStr}`);
  // let searchType = req.body.type;
  // console.log(req.body);
  let searchStr = req.body.search[0]
  // console.log('this', searchStr)
  let searchType = req.body.search[1]
  // console.log('this', searchType)

  let booksUrl = 'https://www.googleapis.com/books/v1/volumes?q=';

  //Search Type Conditionals
  if(searchType === 'title'){
    booksUrl += `+intitle:${searchStr}`
  } else if (searchType === 'author') {
    booksUrl += `+inauthor:${searchStr}`

  }
  return superagent.get(booksUrl)
    .then(result => {
      let books = result.body.items.map(book => new Book(book.volumeInfo))
      //console.log('this', books)
      res.render('searches/show', {books})
    });
}



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
