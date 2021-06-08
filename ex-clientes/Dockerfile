# develop stage
#FROM node:14.17.0-buster as develop-stage
FROM node:14.17.0-buster as develop-stage
WORKDIR /app
COPY package*.json ./
RUN yarn install && yarn global add @angular/cli
COPY . .

# build stage
FROM develop-stage as build-stage
RUN yarn build

# production stage
FROM nginx:1.19.3 as production-stage
COPY --from=build-stage /dist/app-unipar2 /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
