FROM node:14

# Create a directory for the server app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install server dependencies
RUN npm install

# Copy server files to the container
COPY . .

# Expose the server port
EXPOSE 3000
