# FROM node:16.13.0 as build

# WORKDIR /frontend

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm ci

# RUN npm install -g @angular/cli

# COPY . .

# RUN npm run build --prod

# build angular project
# FROM node:16.13.0 AS builder


# # deploy angular with docker
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm ci
# # RUN npm install -g @angular/cli
# COPY . .
# RUN npm run build --prod




# Define nginx for front-end server
FROM nginx:1.21.6-alpine as production-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk update
RUN apk add --update npm
RUN npm ci
# RUN npm install -g @angular/cli
COPY . .
RUN npm run build --prod
RUN chown nginx:nginx /usr/share/nginx/html/*
RUN chown nginx:nginx /usr/share/nginx/*
COPY nginx.conf /etc/nginx/nginx.conf
# RUN npm run build --prod
# CMD ["npm","run", "build","--prod"]
COPY ./dist/prowess-frontend /usr/share/nginx/html
EXPOSE 4200:80
