FROM docker ghcr.io/puppeteer/puppeteer:24.12.1

ENV PUPPETEER_SLIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY ..
CMD ["node", "index.js"]