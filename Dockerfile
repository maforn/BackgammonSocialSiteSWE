# Stage 1: Build Vue application
FROM node:18 AS build

WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Set up Python server
FROM python:3.9

WORKDIR /app
COPY server/requirements.txt ./
COPY server/.env ./
RUN pip install --no-cache-dir -r requirements.txt
COPY server/ ./

# Copy built Vue application from the previous stage
COPY --from=build /app/dist /app/client/dist

CMD ["python", "main.py"]