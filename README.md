# Petlandia Frontend

## Descripción
Petlandia es una plataforma web dedicada a conectar amantes de mascotas con productos, servicios y asociaciones de ayuda animal. El proyecto está construido con Node.js y utiliza EJS como motor de plantillas para crear una experiencia de usuario dinámica y atractiva.

## Características Principales
- 🐾 Catálogo de productos para mascotas
- 🏠 Listado de asociaciones de ayuda animal
- 💝 Sistema de donaciones
- 🛒 Carrito de compras
- 👤 Gestión de usuarios y autenticación
- ⚙️ Panel de administración

## Requisitos Previos
- Node.js (v18 o superior)
- npm (v6 o superior)
- Docker y Docker Compose (opcional, para contenedorización)
- MongoDB (incluido en Docker Compose)

## Tecnologías Utilizadas
- Node.js - Runtime de JavaScript
- Express.js - Framework web
- EJS - Motor de plantillas
- MongoDB - Base de datos
- Bootstrap - Framework CSS
- Axios - Cliente HTTP
- Docker - Contenedorización

## Instalación

### Método Local
1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd petlandia-frontend-so
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/petlandia
NODE_ENV=development
```

4. Iniciar la aplicación:
```bash
# Para desarrollo con recarga automática
npm run dev

# Para producción
npm start
```

### Usando Docker
1. Construir y levantar los contenedores:
```bash
docker-compose up --build
```

La aplicación estará disponible en:
- Frontend: http://localhost:8080
- MongoDB: mongodb://localhost:27017

## Estructura del Proyecto
```
petlandia-frontend-so/
├── src/
│   ├── controllers/     # Lógica de negocio
│   ├── models/         # Modelos de datos
│   ├── public/         # Archivos estáticos (CSS, JS)
│   ├── routes/         # Definición de rutas
│   └── views/          # Plantillas EJS
├── docker-compose.yml  # Configuración de servicios
├── Dockerfile         # Configuración de imagen Docker
└── package.json       # Dependencias y scripts
```

## Endpoints Principales
- `/` - Página principal
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios
- `/products` - Catálogo de productos
- `/associations` - Listado de asociaciones
- `/cart` - Carrito de compras
- `/admin` - Panel de administración

## Scripts Disponibles
- `npm start` - Inicia la aplicación en modo producción
- `npm run dev` - Inicia la aplicación en modo desarrollo con recarga automática


