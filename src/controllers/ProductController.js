const express = require('express');
const router = express.Router();
const ProductModel = require("../models/productModel");
const ReviewModel = require("../models/reviewModel");
const OrderModel = require("../models/orderModel");

// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
    if (req.session?.user) {
        next();
    } else {
        res.status(401).json({ error: "Debe iniciar sesión para realizar esta acción" });
    }
};

// Crear producto
router.post("/productos", async (req, res) => {
    try {
        const producto = await ProductModel.create(req.body);
        res.status(201).json(producto);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Listar todos los productos
router.get("/productos", async (req, res) => {
    try {
        const productos = await ProductModel.find({});
        res.render('index', { 
            products: productos,
            user: req.session?.user || null,
            isAdmin: req.session?.user?.role === 'admin' || false
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener producto por ID (vista detalle)
router.get("/producto/:id", async (req, res) => {
    try {
        const [producto, reviews] = await Promise.all([
            ProductModel.findById(req.params.id),
            ReviewModel.find({ product_id: req.params.id }).populate('user_id', 'username').sort('-created_at')
        ]);

        if (!producto) {
            return res.render('error', { 
                message: 'Producto no encontrado',
                user: req.session?.user || null,
                isAdmin: req.session?.user?.role === 'admin' || false
            });
        }

        const averageRating = reviews.length > 0 
            ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
            : 0;

        res.render('product-detail', { 
            product: producto, 
            reviews,
            averageRating,
            user: req.session?.user || null,
            isAdmin: req.session?.user?.role === 'admin' || false
        });
    } catch (err) {
        res.render('error', { 
            message: 'Error al cargar el producto',
            user: req.session?.user || null,
            isAdmin: req.session?.user?.role === 'admin' || false
        });
    }
});

// Agregar al carrito y crear orden
router.post("/producto/:id/comprar", isAuthenticated, async (req, res) => {
    try {
        const producto = await ProductModel.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const cantidad = parseInt(req.body.quantity) || 1;
        if (cantidad > producto.stock) {
            return res.status(400).json({ error: "No hay suficiente stock" });
        }

        const order = await OrderModel.create({
            user_id: req.session.user._id,
            products: [{
                product_id: producto._id,
                quantity: cantidad,
                price: producto.price
            }],
            total: producto.price * cantidad,
            status: 'pending'
        });

        // Actualizar stock
        producto.stock -= cantidad;
        await producto.save();

        res.json({ success: true, orderId: order._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar reseña
router.post("/producto/:id/review", isAuthenticated, async (req, res) => {
    try {
        const review = await ReviewModel.create({
            product_id: req.params.id,
            user_id: req.session.user._id,
            rating: req.body.rating,
            comment: req.body.comment
        });

        res.json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
