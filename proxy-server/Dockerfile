FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json* ./

# Install dependencies using the recommended flag
RUN npm install --omit=dev

# Copy the rest of the application
COPY . .

EXPOSE 3000

CMD ["npm", "start"]