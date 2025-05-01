import express from "express";
import { create} from "express-handlebars"; 
import fs from "fs";
const books = JSON.parse(fs.readFileSync("./public/library.json", "utf-8"));
const server = express();
const port = 3001;

const hbs = create({});

server.engine("handlebars", hbs.engine);
server.set("view engine", "handlebars");
server.set("views", "./views");

server.use(express.static("public"));

server.get("/feed", function (req, res) {
    res.render("feed", { books });
});

server.listen(port, function () {
    console.log("Express listening on " + port);
});

