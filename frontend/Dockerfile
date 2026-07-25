# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Instala las dependencias de forma reproducible utilizando package-lock.json.
RUN npm ci

COPY . .

# Genera la versión optimizada para producción.
RUN npm run build

# ---------- Runtime Stage ----------
# Imagen ligera de Nginx para servir los archivos estáticos.
FROM nginx:alpine

# Copia únicamente los archivos generados durante la compilación.
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]