# --- build stage ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_OUTPUT_EXPORT=true
RUN npm run build

# --- runtime stage ---
FROM nginx:alpine
COPY --from=build /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
