#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up SplitKar Backend...${NC}"

# Check if backend directory exists
if [ ! -d "backend" ]; then
  echo -e "${RED}Error: backend directory not found!${NC}"
  exit 1
fi

# Navigate to backend directory
cd backend

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
  echo -e "${YELLOW}Creating .env file from template...${NC}"
  cp .env.example .env
  echo -e "${GREEN}Created .env file. Please update with your configuration.${NC}"
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Build the TypeScript code
echo -e "${YELLOW}Building TypeScript code...${NC}"
npm run build

echo -e "${GREEN}✅ Backend setup complete!${NC}"
echo -e "${YELLOW}To start the backend server, run:${NC}"
echo -e "cd backend && npm start"

# Return to original directory
cd ..
