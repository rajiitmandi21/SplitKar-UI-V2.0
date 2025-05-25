#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}SplitKar Backend Manager${NC}"

# Function to check what's running on port 5000
check_port() {
    echo -e "${YELLOW}Checking what's running on port 5000...${NC}"
    lsof -ti:5000
}

# Function to kill processes on port 5000
kill_port() {
    echo -e "${YELLOW}Killing processes on port 5000...${NC}"
    lsof -ti:5000 | xargs kill -9 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Port 5000 is now free${NC}"
    else
        echo -e "${RED}❌ No processes found on port 5000${NC}"
    fi
}

# Function to start backend
start_backend() {
    echo -e "${YELLOW}Starting backend server...${NC}"
    cd backend
    npm start
}

# Main menu
case "$1" in
    "check")
        check_port
        ;;
    "kill")
        kill_port
        ;;
    "start")
        kill_port
        sleep 2
        start_backend
        ;;
    "restart")
        kill_port
        sleep 2
        start_backend
        ;;
    *)
        echo "Usage: $0 {check|kill|start|restart}"
        echo ""
        echo "Commands:"
        echo "  check   - Check what's running on port 5000"
        echo "  kill    - Kill processes on port 5000"
        echo "  start   - Kill existing processes and start backend"
        echo "  restart - Same as start"
        exit 1
        ;;
esac
