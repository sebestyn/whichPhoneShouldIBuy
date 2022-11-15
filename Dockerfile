FROM node:18.12-bullseye-slim
ENV NODE_ENV production
WORKDIR /usr/src/app

# Copy
COPY . .

# Install dependencies
RUN npm ci --omit=dev

# Expose port
EXPOSE 3000

# Run app
CMD [ "node", "./app.js" ]
