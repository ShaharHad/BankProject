# Use the Node.js image
FROM node:20

# Set the working directory inside the container
WORKDIR /bank

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Define the command to start the app
CMD ["npm", "start"]