# Setting Up a Basic Express App

## 1. Initialize Node.js Project
```bash
npm init
```
Follow the prompts to set up your package.json file.

## 2. Install Express
```bash
npm install express
```

## 3. Set Up .gitignore
Create a .gitignore file to exclude node_modules from version control:
```bash
touch .gitignore
echo "node_modules/" >> .gitignore
```

## 4. Create index.js
Create a file named index.js. Example contents:

```bash
const express = require("express");
const server = express();
const port = 3001;

server.get("/hello", function (req, res) {
    res.send("Hello!");
});

server.listen(port, function () {
    console.log("Express listening on " + port);
});
```

## 5. Run the App:
Start the server using:
```bash
node index.js
```

### Access at: http://localhost:3001/hello