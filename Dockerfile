# Step 1: Build the React application
FROM node:20-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
ENV NODE_OPTIONS="--max-old-space-size=4096"
COPY . ./
RUN npm run build

# Step 2: Serve the application using Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]