FROM node:lts
COPY . /app/
WORKDIR /app/
# TODO: We really need to remove the
# legacy peer deps
RUN npm i --legacy-peer-deps && npm run build
EXPOSE 3000
CMD ["node", "server.js"]
