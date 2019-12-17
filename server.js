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
app.get('*', (req, res) => res.status(404).render('/views/pages/error/error404'));
app.post('./views/searches', searchBook);




function Book(book) {
    this.title = book.title || 'No title available';
    this.author = book.authors || 'No author available';
    this.description = book.description || 'No description available';
    this.url = book.imageLinks ? 'https' + book.imageLinks.thumbnail.slice(4) : '../img/book-icon.png';
    this.isbn = book.industryIdentifiers ? `${book.industryIdentifiers[0].type} ${book.industryIdentifiers[0].identifier}` : 'No isbn available';
  }
  
function searchBook(request, response) {
    superagent.get(`https://www.googleapis.com/books/v1/volumes?q=author=ramsey`).then(result => {
        if(result.body.totalItems > 0) {
            result = result.body.items.map( book => new Book(book.volumeInfo));
            console.log(result);
          }
    });
}

searchBook();
  






app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
