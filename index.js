import express from "express";
import { create} from "express-handlebars"; 
import path from "path";
import fs from "fs";
const books = JSON.parse(fs.readFileSync("./public/library.json", "utf-8"));

server.get("/", function (req, res) {
    res.send(`
        <h1>Welcome to the homepage!</h1>
        <p><a href="/hello">Go to /hello</a></p>
    `);
});
const reviewsFile = path.join(__dirname, 'reviews.json');

// set Handlebars as the view engine
server.set('view engine', 'hbs');
server.set('views', path.join(__dirname, 'views'));

// middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));

// show the form
server.get("/review", function (req, res) {
    res.render("personalrev");
});

// handle form submission
server.post('/save-review', (req, res) => {
    const { name, rating, review } = req.body;

    // read existing reviews
    let reviews = [];
    try {
        const data = fs.readFileSync(reviewsFile, 'utf8');
        reviews = JSON.parse(data);
    } catch (err) {
        console.error('Error reading reviews: ', err);
    }

    // add new review with timestamp
    const timestamp = new Date();
    reviews.push({ name, rating, review, timestamp });

    // ave updated reviews
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

