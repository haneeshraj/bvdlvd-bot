# Use Node.js LTS
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Run the bot with tsx (no build step needed)
CMD ["npm", "run", "dev"]# Run the bot
CMD ["npm", "start"]
