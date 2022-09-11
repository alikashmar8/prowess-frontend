# Stage 1: Compile and Build angular codebase
# Use official node image as the base image
FROM node:16.13.0 as build
# Set the working directory
WORKDIR /usr/local/app
# Add the source code to app
COPY ./ /usr/local/app/
# Install all the dependencies
RUN npm install
# Generate the build of the application
RUN npm run build --prod

# Define nginx for front-end server
FROM nginx:1.21.6-alpine
WORKDIR /usr/local/app
RUN chown nginx:nginx /usr/share/nginx/html/*
RUN chown nginx:nginx /usr/share/nginx/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/local/app/dist/prowess-frontend /usr/share/nginx/html
