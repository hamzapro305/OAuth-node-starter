# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory for installing dependencies
WORKDIR /home/app

# Copy package.json and package-lock.json to container
COPY package.json ./

# Install npm dependencies
RUN npm install

# Copy all files
COPY . .

# Build
RUN npm run build:dev

# Stage 2: Run The Application
FROM node:20-alpine AS runner

# Set working directory for running the application
WORKDIR /home/app

# Copy bundle from the 'builder' stage
COPY --from=builder /home/app/dist/dev-build/app-bundle.js .

EXPOSE 8000

# Run Application
CMD ["node", "./app-bundle.js"]
