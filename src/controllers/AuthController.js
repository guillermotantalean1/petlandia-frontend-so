const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');

// Renderizar página de login
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Renderizar página de registro
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// Procesar login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Buscar usuario por username y password directamente
        const user = await UserModel.findOne({ username, password });
        
        if (!user) {
            return res.render('login', { error: 'Usuario o contraseña incorrectos' });
        }

        // Guardar usuario en sesión
        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        // Redirigir según el rol
        if (user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.render('login', { error: 'Error al iniciar sesión' });
    }
});

// Procesar registro
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            return res.render('register', { error: 'El usuario ya está registrado' });
        }

        // Crear nuevo usuario
        const user = new UserModel({
            username,
            password,
            role: 'user' // Por defecto, todos los nuevos usuarios son 'user'
        });

        await user.save();

        // Iniciar sesión automáticamente
        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        res.redirect('/');
    } catch (error) {
        console.error('Error en registro:', error);
        res.render('register', { error: 'Error al registrar usuario' });
    }
});

// Cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router; 