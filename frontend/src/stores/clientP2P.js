import { defineStore } from 'pinia'
import localforage from 'localforage'

localforage.config({
    name: 'P2PAppStorage',
    storeName: 'client_media'
})

export const useClientP2PStore = defineStore('clientP2P', {
    state: () => ({
        id: null,
        nombre: '',
        apellido: '',
        alias: '',
        edad: '',
        sexo: '',              // <--- Nuevo campo
        descripcion: '',       // <--- Nuevo campo
        buscando: '',          // <--- Nuevo campo ("Qué estás buscando")
        fotosPerfil: [],       // <--- Array para almacenar hasta 5 fotos (base64 o IDs)
        videosPerfil: [],      // <--- Array para almacenar hasta 5 videos (opcional)
        billetera: {
            creditos: 0,
            corazon: 0,
            ojos: 0
        },
        ubicacion: {
            pais: '',
            provincia: '',
            localidad: '',
            barrio: ''
        },
        estado: 'desconectado',
        avatarUrl: '',
        fotosIds: [],
        videosIds: []
    }),

    actions: {
        setConectado(id) {
            this.id = id
            this.estado = 'conectado'
        },

        setDesconectado() {
            this.id = null
            this.estado = 'desconectado'
        },

        setDatosPersonales(nombre, apellido, alias, edad, sexo, descripcion, buscando) {
            if (nombre !== undefined) this.nombre = nombre
            if (apellido !== undefined) this.apellido = apellido
            if (alias !== undefined) this.alias = alias
            if (edad !== undefined) this.edad = edad
            if (sexo !== undefined) this.sexo = sexo
            if (descripcion !== undefined) this.descripcion = descripcion
            if (buscando !== undefined) this.buscando = buscando
        },

        actualizarBilletera(nuevosDatos) {
            this.billetera = { ...this.billetera, ...nuevosDatos }
        },

        setUbicacion(pais, provincia, localidad, barrio) {
            this.ubicacion = { pais, provincia, localidad, barrio }
        },

        async detectarUbicacionGPS() {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    console.warn('Geolocalización no soportada')
                    return resolve(this.ubicacion)
                }

                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const lat = position.coords.latitude
                        const lon = position.coords.longitude

                        try {
                            const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
                            )
                            const data = await response.json()

                            if (data && data.address) {
                                const addr = data.address
                                const barrio = addr.suburb || addr.neighbourhood || addr.residential || addr.quarter || ''
                                const localidad = addr.city || addr.town || addr.village || addr.city_district || ''
                                const provincia = addr.state || addr.region || ''
                                const pais = addr.country || ''

                                this.setUbicacion(pais, provincia, localidad, barrio)
                            }
                            resolve(this.ubicacion)
                        } catch (err) {
                            console.error('Error al geocodificar:', err)
                            resolve(this.ubicacion)
                        }
                    },
                    (error) => {
                        console.warn('Error en permiso o recepción de GPS:', error)
                        resolve(this.ubicacion)
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                )
            })
        },

        async agregarFoto(fileBlob) {
            try {
                const fotoId = 'foto_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)
                await localforage.setItem(fotoId, fileBlob)
                this.fotosIds.push(fotoId)
                return fotoId
            } catch (error) {
                console.error("Error al guardar la foto en IndexedDB:", error)
                throw error
            }
        },

        async agregarVideo(fileBlob) {
            try {
                const videoId = 'video_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)
                await localforage.setItem(videoId, fileBlob)
                this.videosIds.push(videoId)
                return videoId
            } catch (error) {
                console.error("Error al guardar el video en IndexedDB:", error)
                throw error
            }
        },

        async obtenerMedia(mediaId) {
            try {
                const blob = await localforage.getItem(mediaId)
                if (blob) {
                    return URL.createObjectURL(blob)
                }
                return null
            } catch (error) {
                console.error("Error al recuperar el archivo multimedia:", error)
                return null
            }
        }
    },

    persist: {
        enabled: true,
        strategies: [
            {
                key: 'clientP2P',
                storage: localStorage,
                paths: [
                    'nombre', 'apellido', 'alias', 'edad', 'sexo',
                    'descripcion', 'buscando', 'fotosPerfil', 'videosPerfil',
                    'billetera', 'estado', 'avatarUrl', 'fotosIds', 'videosIds'
                ]
            }
        ]
    }
})