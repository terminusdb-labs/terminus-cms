FROM node:lts
COPY . /app
WORKDIR /app
RUN npm i && npm run build
EXPOSE 3035
CMD ["npm", "start"]
