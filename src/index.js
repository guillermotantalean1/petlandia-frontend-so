const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const createAdminUser = require('./scripts/init-admin');
const app = express();

// Configuración de variables de entorno
const PORT = process.env.PORT || 4000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'petlandia-secret';

// Conexión a la base de datos
require('./database');

// Inicializar usuario admin
createAdminUser();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesión
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

// Middleware para pasar el usuario a todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session?.user || null;
    res.locals.isAdmin = req.session?.user?.role === 'admin' || false;
    next();
});

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Rutas
app.use('/', require('./routes/index.routes'));

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).render('error', { 
        error: 'Página no encontrada'
    });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', { 
        error: 'Error interno del servidor'
    });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor corriendo en http://0.0.0.0:${PORT}`);
});