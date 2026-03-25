FROM node:22-alpine

WORKDIR /app

RUN yarn global add nodemon ts-node typescript

COPY package.json yarn.lock ./

RUN yarn install

EXPOSE 3000

CMD ["yarn", "run", "dev"]