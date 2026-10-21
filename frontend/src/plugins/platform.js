// Función auxiliar para detectar la plataforma
function getPlatformOrigin() {
    if (navigator.userAgentData?.platform) {
        const platform = navigator.userAgentData.platform.toLowerCase()
        if (platform.includes('android')) return 'android'
        if (platform.includes('windows') || platform.includes('mac') || platform.includes('linux')) return 'desktop'
    }

    const ua = navigator.userAgent.toLowerCase()
    if (/android/i.test(ua)) return 'android'
    if (/ipad|iphone|ipod/i.test(ua)) return 'ios'
    if (/windows nt|macintosh|linux/i.test(ua)) return 'desktop'

    return 'unknown'
}

// Exportamos la estructura del plugin requerida por Vue
export default {
    install(app) {

        // Inyecta $origin globalmente
        Object.defineProperty(app.config.globalProperties, '$platform', {
            get: () => getPlatformOrigin(),
            enumerable: true
        })
    }
}