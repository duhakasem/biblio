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
---

# Installing Docker & Running an Express App

## Install Docker

Download and install Docker Desktop:
[Docker Installation Guide](https://docs.docker.com/desktop/)


## Single Container Setup

### 1. Create a Dockerfile

Add the following to a file named Dockerfile:

```Dockerfile
FROM node:current
WORKDIR /home/node
COPY package.json package-lock.json /home/node/
EXPOSE 3002
```

### 2. Build the Docker Image
```
docker image build --tag biblio-express:latest .
```

### 3. List Available Docker Images
```
docker image ls
```

### 4. Run the Express App in a Container

```
docker container run --name biblio-container -p 3002:3002 --volume :/home/node/ biblio-express:latest npm start
```

### 5. Interact with the Running Container

Open a shell inside the container:
```
docker container exec -it biblio-container /bin/bash
```
Stop the container in another shell:
```
docker container kill biblio-container
```

## Add NGINX

### 1. Add compose.yml
Use the compose.yml file from the repo:
[compose.yml](https://github.com/htw-imi-wt1/lab-02-express-docker/blob/main/sample-docker/compose.yml)

### 2. Add nginx.conf
Place this file in a folder named nginx:
[nginx.conf](https://github.com/htw-imi-wt1/lab-02-express-docker/blob/main/sample-docker/nginx/nginx.conf)

## Serve Static HTML Files

### 1. Create public_html folder
```
mkdir public_html
```
Put any static HTML files (e.g. index.html) you want to serve in here.

### 2. Update default.conf.template
Use the [default.conf.template](https://github.com/htw-imi-wt1/lab-02-express-docker/blob/main/sample-docker/nginx/templates/default.conf.template) and ensure to include the following block in server block:
```
location /doc/ {
    alias /usr/share/nginx/html/;
    index index.html;
}
```

### 3. Update compose.yml to Mount public_html
Update the nginx service section of your compose.yml:
```
Services:
  nginx:
     image: nginx:latest
     container_name: reverse_proxy
     volumes:
         - ./public_html:/usr/share/nginx/html
```

### 4.  Start Docker Compose
```
docker compose up --build -d
```

### Access at http://localhost/doc 
