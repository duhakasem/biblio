const express = require("express");
const path = require('path');
const server = express();
const port = 3001;
const fs = require('fs');
const reviewsFile = path.join(__dirname, 'reviews.json');

// set handlebars as the view engine
server.set('view engine', 'hbs');
server.set('views', path.join(__dirname, 'views'));

// middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));

// routes
server.get("/review", function (req, res) {
    res.render("personalrev");
});

server.get('/reviews', function (req, res) {
    let reviews = [];
    try {
        const data = fs.readFileSync(reviewsFile, 'utf8');
        reviews = JSON.parse(data);

        // sort from newest to oldest
        reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // fomrat timestamp into human-readable version
        reviews = reviews.map(r => ({
            ...r,
            timestampFormatted: new Date(r.timestamp).toLocaleString()
        }));
    } catch (err) {
        console.error('Error reading reviews: ', err);
    }

    res.render('review-list', { reviews });
});

server.post('/save-review', (req, res) => {
    const { name, rating, review} = req.body;
    
    // read existing reviews
    let reviews = [];
    try {
        const data = fs.readFileSync(reviewsFile, 'utf8');
        reviews = JSON.parse(data);
    } catch (err) {
        console.error('Error reading reviews: ', err);
    }

    // add new review
    const timestamp = new Date();
    reviews.push({ name, rating, review, timestamp });

    // save updated reviews
    try {
        fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
    } catch (err) {
        console.error('Error writing reviews: ', err);
    }

    // res.redirect('/reviews');
    res.render('review-thanks', { name, rating, review });
});

// start servers
server.listen(port, function () {
    console.log("Express listening on " + port);
});