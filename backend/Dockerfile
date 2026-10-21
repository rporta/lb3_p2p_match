# 1. Usar imagen oficial de Node.js ligera
FROM node:18-alpine

# 2. Instalar OpenSSL para certs y curl/tar para ngrok
RUN apk add --no-cache openssl curl tar

# 3. Instalar el binario oficial de ngrok
RUN curl -sSL https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz | tar -xz -C /usr/local/bin

# 4. Establecer directorio de trabajo
WORKDIR /app

# 5. Generar certificado SSL autofirmado válido por 365 días en /app
RUN openssl req -x509 -newkey rsa:2048 -keyout /app/key.pem -out /app/cert.pem -days 365 -nodes -subj "/CN=localhost"

# 6. Copiar archivos de dependencias e instalarlas
COPY package*.json ./
RUN npm install

# 7. Copiar el código fuente y el archivo .env
COPY . .

# 8. Copiar y dar permisos de ejecución al script de entrada
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# 9. Exponer puertos necesarios
EXPOSE 5000
EXPOSE 4040

# 10. Configurar punto de entrada y comando
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "index.js"]