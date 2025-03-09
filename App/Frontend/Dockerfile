# Multi-stage Docker build for React frontend application

# Stage 1: Build stage - uses Node.js to build the React app
FROM node:18 AS build
WORKDIR /app

# Copy package files and install dependencies
# This step will be cached unless package files change
COPY App/frontend/package*.json ./
RUN npm ci  # Clean install of dependencies (stricter than npm install)

# Copy source code and build the application
COPY App/frontend/. .
RUN npm run build  # Creates optimized production build in /app/build

# Stage 2: Runtime stage - uses lightweight Nginx to serve static files
FROM nginx:alpine
# Copy the built React app from the build stage to Nginx's serve directory
COPY --from=build /app/build /usr/share/nginx/html
# Copy custom Nginx configuration
COPY App/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80  # Expose port 80 for web traffic
# Start Nginx in the foreground (prevents container from exiting)
CMD ["nginx", "-g", "daemon off;"]
