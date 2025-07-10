const express = require("express")
const router = express.Router()

const userController = require("../controllers/UserController")

// Mostrar TODOS los Usuarios (GET)
router.get("/", userController.mostrar)

// Crear Usuario (POST)
router.post("/crear", userController.crear)

// Editar Usuario (POST)
router.post("/editar", userController.editar)

// Eliminar Usuario (GET)
router.get("/borrar/:id", userController.borrar);

module.exports = router



