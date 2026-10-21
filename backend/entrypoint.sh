#!/bin/sh

# Si existe un archivo .env, cargar sus variables de entorno
if [ -f /app/.env ]; then
  export $(grep -v '^#' /app/.env | xargs)
fi

# Configurar el authtoken de ngrok si está definido
if [ -n "$NGROK_AUTHTOKEN" ]; then
  echo "> Configurando ngrok authtoken..."
  ngrok config add-autotoken "$NGROK_AUTHTOKEN"
fi

# Iniciar ngrok en segundo plano apuntando a HTTPS e ignorando el certificado autofirmado
echo "> Iniciando ngrok en https://localhost:5000..."
ngrok http https://localhost:5000 --no-tls-verify --log=stdout &

# Iniciar el servidor Node.js
exec "$@"