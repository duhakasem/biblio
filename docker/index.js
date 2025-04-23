const express = require("express");
const server = express();
const port = 3002;

server.get("/hello", function (req, res) {
    res.send("Hello!");
});

server.listen(port, function () {
    console.log("Express listening on " + port);
});