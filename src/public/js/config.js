// Configuración de la aplicación
const config = {
    // La API está en el mismo servidor que el frontend
    apiUrl: '/api'
};

// Exportar la configuración para que otros archivos la puedan usar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} 