FROM node:22-alpine

WORKDIR /app

RUN npm install -g nodemon ts-node typescript

COPY package*.json ./
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]