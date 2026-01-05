# STAGE 1: Build
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev deps needed for build)
RUN npm install

# Copy the rest of the source code
COPY . .

# Run the build command
RUN npm run build

# STAGE 2: Production environment
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Use custom nginx config to enable SPA routing
COPY nginx-default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]