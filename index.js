import express from "express";
import { create} from "express-handlebars"; 
import fs from "fs";
const books = JSON.parse(fs.readFileSync("./public/library.json", "utf-8"));
const server = express();
const port = 3001;

const hbs = create({
    // this takes care of the stars for the reviews
    helpers: {
        stars: (rating) => {
          const fullStars = Math.round(rating);
          let starsHtml = '';
          for(let i = 0; i < 5; i++) {
            starsHtml += i < fullStars ? '★' : '☆';
          }
          return starsHtml.split('');
        }
      }
});

server.engine("handlebars", hbs.engine);
server.set("view engine", "handlebars");
server.set("views", "./views");

server.use(express.static("public"));

// Duha´s route for the landing page or feed
server.get("/feed", function (req, res) {
    res.render("feed", { books });
});

// Santiago´s route for the book selection
server.get('/books/:id', function(req, res) {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.book_id === bookId);

    if (book) {
        res.render('book-detail', { book });
    } else {
        res.status(404).send('Book not found');
    }
});

server.listen(port, function () {
    console.log("Express listening on " + port);
});

