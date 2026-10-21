# Proyecto lb3_p2p_match

## Estructura de archivos

```
lb3_p2p_match
└── backend (contiene proyecto en lb3)
    └── client (contiene la build que genera vite)
    └── server (contiene proyecto en lb3: lb3_p2p)
└── frontend (contiene proyecto en vu3)
```
---

# Backend 

El proyecto esta creado en `Loopback 3`, tiene un script boot para inicializar la capa de webSocket, y sirve el cliente web en la carpeta `backend/client`

---

# Frontend

El proyecto esta creado en `Vue 3`, es un cliente reactivo, 
- Para desarrollar `cd lb3_p2p_match/frontend && npm run dev`
- Al terminar de desarrollar y una vez guardado el proyecto, ejecutar `cd lb3_p2p_match/frontend && npm run build`, para que se actualice la build que contiene el proyecto lb3 en `lb3_p2p_match/backend/client`

---

# Para en android 
Ejecutar en PowerShell `Start-Process "C:\Android\Sdk\emulator\emulator.exe" -ArgumentList "-avd PIXEL_7_API_35"`

