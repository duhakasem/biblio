FROM node:23.11
WORKDIR /home/node
COPY package.json package-lock.json /home/node/
EXPOSE 3002
CMD ["npm", "start"]
RUN npm install