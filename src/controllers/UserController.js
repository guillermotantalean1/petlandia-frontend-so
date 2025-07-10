const ModelUser = require("../models/User");

// Crear un user
router.post("/users", async (req, res) => {
    try {
        const nuevouser = await ModelUser.create(req.body);
        res.status(201).json(nuevouser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Listar todos los users
router.get("/users", async (req, res) => {
    try {
        const users = await ModelUser.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un user por ID
router.get("/users/:id", async (req, res) => {
    try {
        const user = await ModelUser.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "user no encontrado" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar un user
router.put("/users/:id", async (req, res) => {
    try {
        const user = await ModelUser.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ error: "user no encontrado" });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Eliminar un user (opcional)
router.delete("/users/:id", async (req, res) => {
    try {
        const user = await ModelUser.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: "user no encontrado" });
        res.json({ mensaje: "user eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
