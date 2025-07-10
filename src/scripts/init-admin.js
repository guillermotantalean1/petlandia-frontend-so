const mongoose = require('mongoose');
const UserModel = require('../models/userModel');

const createAdminUser = async () => {
    try {
        const adminUser = await UserModel.findOne({ username: 'admin' });
        
        if (!adminUser) {
            await UserModel.create({
                username: 'admin',
                password: 'admin',
                role: 'admin'
            });
            console.log('✅ Usuario admin creado exitosamente');
        } else {
            console.log('ℹ️ El usuario admin ya existe');
        }
    } catch (error) {
        console.error('❌ Error al crear usuario admin:', error);
    }
};

module.exports = createAdminUser; 