import express from "express";
import { create} from "express-handlebars"; 
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = express();
const port = 3001;

const books = JSON.parse(fs.readFileSync("./public/library.json", "utf-8"));
const reviewsFile = path.join(__dirname, './public/reviews.json');

const hbs = create({
    extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),
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

server.engine("hbs", hbs.engine);
server.set("view engine", "hbs");
server.set("views", "./views");

server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));

server.get("/", (req, res) => {
    res.send(`
      <h1>Welcome to Biblio!</h1>
      <p><a href="/feed">Go to Feed</a></p>
    `);
  });

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

server.get("/review", function (req, res) {
    res.render("personalrev");
});

server.post('/save-review', (req, res) => {
    const { name, rating, review } = req.body;
    let reviews = [];
    try {
        const data = fs.readFileSync(reviewsFile, 'utf8');
        reviews = JSON.parse(data);
    } catch (err) {
        console.error('Error reading reviews: ', err);
    }

    const timestamp = new Date();
    reviews.push({ name, rating, review, timestamp });

    try {
        fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
    } catch (err) {
        console.error('Error writing reviews: ', err);
    }

    // thank-you page
    res.render('review-thanks', { name, rating, review });
});

server.get("/hello", function (req, res) {
    res.send("Hello IMIs!");
});


server.listen(port, function () {
    console.log("Express listening on " + port);
});

