#!/bin/bash

# Start the Node.js server
echo "Starting the Node.js server..."
node sim-api/server.js &

# Wait for a moment to ensure the server starts
echo "Waiting for server to start"
sleep 3

# Navigate to the web application directory
echo "Navigating to the web application directory..."
cd web-app || exit

# Start the web application
echo "Starting the web application..."
npm run start

# Keep the script running to maintain server execution
wait
