FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S frontend -u 1001

# Change ownership
RUN chown -R frontend:nodejs /app
USER frontend

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
