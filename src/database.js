/*
REF:
https://www.npmjs.com/package/mongoose
*/
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27020/petlandia';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
            socketTimeoutMS: 45000, // Timeout de socket de 45 segundos
            connectTimeoutMS: 10000, // Timeout de conexión de 10 segundos
        });
        console.log('✅ Conexión exitosa a MongoDB:', MONGODB_URI);
    } catch (err) {
        console.error('❌ Error conectando a MongoDB:', err);
        // Intentar reconectar después de 5 segundos
        setTimeout(connectDB, 5000);
    }
};

// Manejar errores después de la conexión inicial
mongoose.connection.on('error', err => {
    console.error('❌ Error de MongoDB:', err);
    // Si perdemos la conexión, intentar reconectar
    if (err.code === 'ETIMEDOUT') {
        console.log('🔄 Intentando reconectar a MongoDB...');
        setTimeout(connectDB, 5000);
    }
});

connectDB();

module.exports = mongoose;