const express = require("express");
const path = require('path');
const fs = require('fs');

const server = express();
const port = 3001;
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

// start server
server.listen(port, function () {
    console.log("Express listening on " + port);
});