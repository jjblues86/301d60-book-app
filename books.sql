-- Run schema
-- psql books_app -f books.sql 

-- Push db to heroku
-- heroku pg:push books_app DATABASE_URL --app 


CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(500),
  description TEXT,
  bookshelf VARCHAR(500)
);

INSERT INTO books(author, title, isbn, image_url, description, bookshelf)
  Values('Matt Kracht', 'The Field Guide to Dumb Birds of North America', '9781452177397', 'http://books.google.com/books/content?id=9OtzDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', 'Perfect for the anti-aviary (or bird fanatic with a sense of humor), this snarky illustrated handbook is equal parts profane, funny, and—let\s face it—true. Featuring 50 common North American birds, such as the White-Breasted Butt Nugget and the Goddamned Canada Goose (or White-Breasted Nuthatch and Canada Goose for the layperson), Kracht identifies all the idiots in your backyard and details exactly why they suck with humorous, yet angry, ink drawings. Each entry is accompanied by facts about a bird\s (annoying) call, its (dumb) migratory pattern, its (downright tacky) markings, and more. With migratory maps and tips for birding, plus musings on the avian population and the ethics of birdwatching, this is the essential guide to all things wings. No need to wonder what all that racket is anymore!', 'Humor');

  INSERT INTO books(author, title, isbn, image_url, description, bookshelf)
    Values('Nicholas G. Carr', 'The Shallows', '9780393072228', 'http://books.google.com/books/content?id=9-8jnjgYrgYC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', 'Expanding on an article that appeared in the Atlantic Monthly, the best-selling author of The Big Switch discusses the intellectual and cultural consequences of the Internet, and how it may be transforming our neural pathways for the worse.', 'Computers');