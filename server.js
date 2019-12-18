'use strict';
const express = require('express');
const app = express();
const pg = require('pg');
const PORT = process.env.PORT || 3070;
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
app.get('/', home);
app.get('/new', newSearch);
app.get('/books/:id', renderBook);
// app.get('/', (request, response) => {
//   response.render('index');
// });
app.get('/hello', (request, response) => {
  response.render('index');
});

// app.post('./views/searches', searchBook);

app.get('/books/:book_id', showBookDetails);
//app.put('/books/:book_id', updateBookDetails);

app.post('/searches', search);

//Home Route
function home(req, res){
  let SQL = 'SELECT * FROM books';
  // console.log('this', SQL);

  return client.query(SQL)
    .then(responseData => {
      //console.log('this', responseData);


      res.render('index', {books: responseData.rows})
    })
    .catch(err => {
      res.render('pages/error', {err});
    });
}


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

      return client.query('SELECT DISTINCT bookshelf FROM books')
        .then(bookShelfData => {
          const bookShelf = bookShelfData.rows;
          console.log(bookShelf);
          return res.render('index', {
            book: book,
            bookShelf: bookShelf,
          });
        })
        .catch(err => errorHandler(err, res))
    })
    .catch(err => errorHandler(err, res));
}


function Book(book) {
  this.title = book.title || 'No title available';
  this.author = book.authors || 'No author available';
  this.description = book.description || 'No description available';
  this.url = book.imageLinks ? 'https' + book.imageLinks.thumbnail.slice(4) : '../img/book-icon.png';
  this.isbn = book.industryIdentifiers ? `${book.industryIdentifiers[0].type} ${book.industryIdentifiers[0].identifier}` : 'No isbn available';
}


function showBookDetails(request, response) {
  let sql = 'SELECT * FROM books WHERE books.id = $1;';

    client.query(sql, [request.params.book_id]).then( result =>{
      
      console.log('HELLOOOO');
      response.render( './books/show', { book: result.rows[0]} )
    })
  }
   



//Searching for books by title or author
function search(req, res){
  //console.log('this', req,res)
  // let searchStr = req.body.search;
  // console.log(`Search String: ${searchStr}`);
  // let searchType = req.body.type;
  // console.log(req.body);
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
      //console.log('this', books)
      res.render('searches/show', {books})
    });
}

//Error Handler
function errorHandler(err, res){
  if(res) res.status(500).render('pages/error');
}


app.get('*', (req, res) => res.status(404).render('error'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
