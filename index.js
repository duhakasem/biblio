const express = require("express");
const path = require('path');
const server = express();
const port = 3000;

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

server.post('/save-review', (req, res) => {
    const { name, rating, review} = req.body;
    res.render('review-thanks', { name, rating, review});
})

// start servers
server.listen(port, function () {
    console.log("Express listening on " + port);
});