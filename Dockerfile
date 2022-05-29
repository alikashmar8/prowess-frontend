# FROM node:16.13.0 as build

# WORKDIR /frontend

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm ci

# RUN npm install -g @angular/cli

# COPY . .

# RUN npm run build --prod

# Define nginx for front-end server
FROM nginx:1.21.6-alpine
RUN chown nginx:nginx /usr/share/nginx/html/*
RUN chown nginx:nginx /usr/share/nginx/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./dist/prowess-frontend /usr/share/nginx/html
EXPOSE 4200:80
