FROM node:20-slim

RUN apt-get update && apt-get install -y \
    lua5.4 \
    luarocks \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
