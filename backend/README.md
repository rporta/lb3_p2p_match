# server (proyecto en loopback)

> Se requiere Node v16.14.2 & npm 8.5.0

- Ejecutar `npm i`
- Correr el server, ejecutar `npm start`, pero antes tener un compilado en `backend/client`

---

## Docker 

- Crear file .env con este contendio
```
NGROK_AUTHTOKEN=3Kkoo4cek7wyLwZA8OqxoEqaIda_2YbGgdA376t87vSighg5o
```
- Construir img `docker build -t app-webrtc-signaling .`
- Correr img 

```bash
  docker run -d \
  -p 5000:5000 \
  -p 4040:4040 \
  --name webrtc-server \
  app-webrtc-signaling
```