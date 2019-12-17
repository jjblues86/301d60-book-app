<<<<<<< HEAD
=======
'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
//const methodOverride = require('method-override');

require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.urlencoded({extended: true})); 
app.set('view engine', 'ejs');


//const functions = require(path.join(__dirname, 'modules', 'pending.js'));
app.set('views', './views/pages');
app.use(express.static( './public'));

app.get('/', (request, response) => {
    response.render('index');
});

app.get('/hello', (request, response) => {
    response.render('index');
});


app.get('*', (req, res) => res.status(404).render('pages/err/error404'));



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> 0a405b3ea64678f13cbd38fe33aae5d7adc2763e
