FROM ghcr.io/puppeteer/puppeteer:24.12.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
