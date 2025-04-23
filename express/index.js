const express = require("express");
const server = express();
const port = 3001;

server.get("/", function (req, res) {
    res.send(`
        <h1>Welcome to the homepage!</h1>
        <p><a href="/hello">Go to /hello</a></p>
    `);
});

server.get("/hello", function (req, res) {
    res.send("Hello IMIs!");
});


server.listen(port, function () {
    console.log("Express listening on " + port);
});