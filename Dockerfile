FROM node:21 AS syncedui
WORKDIR /ui
COPY web/ ./
RUN npm install && npm run build

FROM node:21 AS spifyserver
WORKDIR /app
COPY server/ ./
RUN npm install --production
COPY --from=syncedui /ui/build ./public

EXPOSE 8000
CMD ["node", "./synced-server.js"]