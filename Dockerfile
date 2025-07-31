# Node.js image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy only necessary files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all app files
COPY . .

# Expose port
EXPOSE 8080

# Start app
CMD ["node", "server.js"]
