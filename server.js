'use strict';
const express = require('express');
const app = express();
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');

const PORT = process.env.PORT || 3000;


require('dotenv').config();

//Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.static( './public'));
app.use(methodOverride((req, res) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    console.log(req.body['_method']);
    let method = req.body['_method'];
    delete req.body['_method'];
    return method; //returns PUT, PATCH, POST, GET, or DELETE.
  }
}))

//Templating engines
app.set('view engine', 'ejs');
app.set('views', './views/pages');

//Database setup
const client = new pg.Client(process.env.DATABASE_URL)
client.connect()
client.on('error', err => console.error(err));

//Search Route
app.get('/', home);
app.get('/new', newSearch);
app.get('/books/:id', renderBook);
app.post('/books/:id', renderBook);
app.post('/save', saveBook);
app.post('/searches', search);
app.put('/update/:id', updateBooks);
app.delete('/books/:id', deleteBooks);
app.get('/hello', (request, response) => {
  response.render('index');
});

//Searching for books by title or author
function search(req, res){
  let searchStr = req.body.search[0];
  let searchType = req.body.search[1];
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
      res.render('searches/show', {books})
    });
}


//Home Route
function home(req, res){
  let SQL = 'SELECT * FROM books';

  return client.query(SQL)
    .then(responseData => {
      res.render('index', {books: responseData.rows})
    })
    .catch(err => {
      res.render('pages/error', {err});
    });
}

//New Search route
function newSearch(req, res){
  res.render('searches/new');
}

// Render Book
function renderBook(req,res){
  let SQL = `SELECT * FROM books WHERE id=$1`;
  let values = [req.params.id];

  return client.query(SQL, values)
    .then(booksResult => {
      console.log('this', booksResult);

      const book = booksResult.rows[0];
      console.log('this', book)

      return client.query('SELECT DISTINCT bookshelf FROM books')
        .then(bookShelfData => {
          const bookShelf = bookShelfData.rows;
          return res.render('books/show', {
            book: book,
            bookshelf: bookShelf,
          });
        })
        .catch(err => errorHandler(err, res))
    })
    .catch(err => errorHandler(err, res));
}

//Save Books
function saveBook(req, res){
  let SQL = `INSERT INTO books
  (author, title, isbn, image_url, description, bookshelf)
  VALUES($1,$2,$3,$4,$5,$6)`;
  let values = (SQL, [req.body.author, req.body.title, req.body.isbn, req.body.image_url, req.body.description, req.body.bookshelf]);

  return client.query(SQL, values)
    .then(savedResults => {
      let SQL = `SELECT id FROM books WHERE isbn=$1`;
      let values = [req.body.isbn];

      return client.query(SQL, values)
        .then(savedResults => {
          res.redirect(`/books/${savedResults.rows[0].id}`);
        })
        .catch(err => errorHandler(err, res));
    })
    .catch(err => errorHandler(err, res));
}

//Update Books
function updateBooks(req,res){
  let SQL = `UPDATE books SET author=$1, title=$2, isbn=$3, image_url=$4, description=$5, bookshelf=$6 WHERE id=$7`;

  let values = [req.body.author, req.body.title, req.body.isbn, req.body.image_url, req.body.description, req.body.bookshelf, req.params.id];

  return client.query(SQL, values)
    .then(updatedBook => {
      res.redirect(`/books/${req.params.id}`);
    })
    .catch(err => errorHandler(err, res));
}


//Delete Books
function deleteBooks(req,res){
  client.query(`DELETE FROM books WHERE id=$1`, [req.params.id])
    .then(deletedBook => {
      res.redirect('/');
    })
    .catch(err => errorHandler(err, res));
}


//Constructor
function Book(book) {
  this.title = book.title || 'No title available';
  this.author = book.authors || 'No author available';
  this.description = book.description || 'No description available';
  this.image_url = book.imageLinks ? 'https' + book.imageLinks.thumbnail.slice(4) : '../img/book-icon.png';
  this.isbn = book.industryIdentifiers ? `${book.industryIdentifiers[0].type} ${book.industryIdentifiers[0].identifier}` : 'No isbn available';
}


//Error Handler
function errorHandler(err, res){
  if(res) res.status(500).render('pages/error');
}


// app.get('*', (req, res) => res.status(404).render('error'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
