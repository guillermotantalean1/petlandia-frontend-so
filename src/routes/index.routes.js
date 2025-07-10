const express = require('express');
const router = express.Router();

const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const PetModel = require("../models/petModel");
const OrderModel = require("../models/orderModel");
const DonationModel = require("../models/donationModel");
const AssociationModel = require("../models/associationModel");

// Middleware para verificar si es admin
const isAdmin = (req, res, next) => {
    if (req.session?.user?.role === 'admin') {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Ruta principal - renderiza la página de inicio
router.get("/", async (req, res) => {
    try {
        const [products, associations] = await Promise.all([
            ProductModel.find({ status: 'active' }).limit(6).maxTimeMS(5000),
            AssociationModel.find({ status: 'active' }).limit(4).maxTimeMS(5000)
        ]);
        
        res.render("index", {
            products,
            associations,
            user: req.session?.user || null,
            isAdmin: req.session?.user?.role === 'admin' || false
        });
    } catch (err) {
        console.error('Error loading home page:', err);
        res.status(500).render("error", { 
            error: 'Error cargando la página. Por favor, intente de nuevo.',
            user: req.session?.user || null,
            isAdmin: req.session?.user?.role === 'admin' || false
        });
    }
});

// Auth Routes
router.get('/login', (req, res) => {
    if (req.session?.user) {
        return res.redirect('/');
    }
    res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });
        
        if (!user || user.password !== password) {
            return res.render('login', { error: 'Usuario o contraseña incorrectos' });
        }

        req.session.user = {
            _id: user._id,
            username: user.username,
            role: user.role
        };

        if (user.role === 'admin') {
            return res.redirect('/admin');
        }

        // Si hay una URL de redirección, usar esa
        const redirect = req.query.redirect || '/';
        res.redirect(redirect);
    } catch (err) {
        console.error('Error en login:', err);
        res.render('login', { error: 'Error al iniciar sesión' });
    }
});

router.get('/register', (req, res) => {
    if (req.session?.user) {
        return res.redirect('/');
    }
    res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;

        // Validaciones básicas
        if (!username || !password) {
            return res.render('register', { error: 'Todos los campos son requeridos' });
        }

        if (password !== confirmPassword) {
            return res.render('register', { error: 'Las contraseñas no coinciden' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.render('register', { error: 'El usuario ya existe' });
        }

        // Crear el usuario
        const user = await UserModel.create({
            username,
            password,
            role: 'user'
        });

        // Iniciar sesión automáticamente
        req.session.user = {
            _id: user._id,
            username: user.username,
            role: user.role
        };

        res.redirect('/');
    } catch (err) {
        console.error('Error en registro:', err);
        res.render('register', { error: 'Error al registrar usuario. Por favor, intente de nuevo.' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Admin Routes
router.get("/admin/login", (req, res) => {
    if (req.session?.user?.role === 'admin') {
        res.redirect('/admin');
    } else {
        res.render("admin-login", {
            error: null,
            user: req.session?.user || null,
            isAdmin: false
        });
    }
});

router.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;
    // Validación simple para admin
    if (username === 'admin' && password === 'admin') {
        req.session.user = {
            username: 'admin',
            role: 'admin'
        };
        res.redirect('/admin');
    } else {
        res.render('admin-login', { 
            error: 'Credenciales incorrectas',
            user: null,
            isAdmin: false
        });
    }
});

// Panel de administración
router.get("/admin", isAdmin, async (req, res) => {
    try {
        const [products, users] = await Promise.all([
            ProductModel.find({}),
            UserModel.find({})
        ]);
        
        res.render("admin", {
            products,
            users,
            user: req.session.user,
            isAdmin: true
        });
    } catch (err) {
        console.error('Error en panel admin:', err);
        res.status(500).render('error', { error: 'Error al cargar el panel de administración' });
    }
});

// API Routes with Admin Protection
// Products
router.get("/api/products", async (req, res) => {
    try {
        const products = await ProductModel.find({});
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/api/products", isAdmin, async (req, res) => {
    try {
        const product = await ProductModel.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put("/api/products/:id", isAdmin, async (req, res) => {
    try {
        const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete("/api/products/:id", isAdmin, async (req, res) => {
    try {
        await ProductModel.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Associations
router.get("/api/associations", async (req, res) => {
    try {
        const associations = await AssociationModel.find({});
        res.json(associations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/api/associations", isAdmin, async (req, res) => {
    try {
        const association = await AssociationModel.create(req.body);
        res.status(201).json(association);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put("/api/associations/:id", isAdmin, async (req, res) => {
    try {
        const association = await AssociationModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(association);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete("/api/associations/:id", isAdmin, async (req, res) => {
    try {
        await AssociationModel.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Orders
router.get("/api/orders", isAdmin, async (req, res) => {
    try {
        const orders = await OrderModel.find({}).populate("user_id products.product_id");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/api/orders/:id", isAdmin, async (req, res) => {
    try {
        const order = await OrderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// View Routes
router.get("/products", async (req, res) => {
    try {
        const products = await ProductModel.find({ status: 'active' });
        res.render("index", {
            products,
            user: req.session?.user || null,
            isAdmin: req.session?.user?.role === 'admin' || false
        });
    } catch (err) {
        res.status(500).render("error", {
            error: 'Error cargando los productos',
            user: req.session?.user || null,
            isAdmin: req.session?.user?.role === 'admin' || false
        });
    }
});

router.get("/associations", async (req, res) => {
    try {
        const associations = await AssociationModel.find({ status: 'active' });
        res.render("associations", { 
            associations,
            user: req.session?.user || null,
            isAdmin: req.session?.user?.role === 'admin' || false
        });
    } catch (err) {
        res.status(500).render("error", { error: err.message });
    }
});

router.get("/login", (req, res) => {
    if (req.session?.user) {
        res.redirect('/');
    } else {
        res.render("login", {
            user: null,
            isAdmin: false
        });
    }
});

router.get("/cart", (req, res) => {
    res.render("cart", {
        user: req.session?.user || null,
        isAdmin: req.session?.user?.role === 'admin' || false
    });
});

// Logout route
router.post("/api/logout", (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

module.exports = router; 