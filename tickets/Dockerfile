FROM node:14.5.0-alpine

WORKDIR /app
COPY package.json .
RUN apk add git
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]