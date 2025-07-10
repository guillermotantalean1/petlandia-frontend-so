// Configuración de axios
const api = axios.create({
    baseURL: config.apiUrl,
    timeout: 5000,
    headers: {'Content-Type': 'application/json'}
});

// Interceptor para manejar tokens
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Función para manejar errores
const handleError = (error) => {
    console.error('Error:', error);
    alert(error.response?.data?.message || 'Ocurrió un error');
};

// Funciones para el carrito
let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };

const addToCart = async (productId) => {
    try {
        // Obtener el producto del backend
        const response = await api.get(`/products/${productId}`);
        const product = response.data;

        if (!product) {
            alert('Producto no encontrado');
            return;
        }

        const existingItem = cart.items.find(item => item.id === product._id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                id: product._id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            });
        }
        updateCartTotal();
        saveCart();
        updateCartUI();
        alert(`${product.name} añadido al carrito`);
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
        alert('Error al añadir el producto al carrito');
    }
};

const updateQuantity = (productId, quantity) => {
    const item = cart.items.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartTotal();
            saveCart();
            updateCartUI();
        }
    }
};

const removeFromCart = (productId) => {
    cart.items = cart.items.filter(item => item.id !== productId);
    updateCartTotal();
    saveCart();
    updateCartUI();
};

const updateCartTotal = () => {
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const updateCartUI = () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cartItemsContainer) {
        if (cart.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Tu carrito está vacío</p>';
        } else {
            cartItemsContainer.innerHTML = cart.items.map(item => `
                <div class="cart-item">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 1rem;">
                        <div>
                            <h3>${item.name}</h3>
                            <p class="mb-0">Precio: $${item.price}</p>
                        </div>
                    </div>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.id}')">Eliminar</button>
                </div>
            `).join('');
        }
    }
    
    if (cartTotalElement) {
        cartTotalElement.textContent = `Total: $${cart.total.toFixed(2)}`;
    }

    // Actualizar contador del carrito en el navbar
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
    }
};

const checkout = async () => {
    if (!cart.items.length) {
        alert('El carrito está vacío');
        return;
    }

    try {
        const response = await api.post('/orders', {
            items: cart.items,
            total: cart.total
        });

        if (response.data) {
            alert('¡Compra realizada con éxito!');
            cart = { items: [], total: 0 };
            saveCart();
            updateCartUI();
            location.href = '/';
        }
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        alert('Error al procesar la compra');
    }
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Botones de añadir al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            addToCart(productId);
        });
    });

    // Si estamos en la página de admin, cargar los datos
    if (window.location.pathname === '/admin') {
        loadProductosAdmin();
        loadAsociacionesAdmin();
        loadOrdenesAdmin();
    }

    // Inicializar la UI del carrito cuando se carga la página
    updateCartUI();
});

// Funciones de autenticación
const login = async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            window.location.href = '/?user=' + response.data.username;
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        alert('Error al iniciar sesión. Por favor, intente nuevamente.');
    }
};

const register = async (event) => {
    event.preventDefault();
    const username = document.getElementById('usernameRegister').value;
    const password = document.getElementById('passwordRegister').value;

    try {
        const response = await api.post('/auth/register', { username, password });
        if (response.data.success) {
            alert('Usuario registrado exitosamente');
            window.location.href = '/login';
        } else {
            alert(response.data.message || 'Error al registrar usuario');
        }
    } catch (error) {
        alert('Error al intentar registrar. Por favor, intente nuevamente.');
    }
};

// Función para donar
const donar = async (associationId) => {
    try {
        const response = await api.post(`/donations/${associationId}`);
        if (response.data.success) {
            alert('¡Gracias por tu donación!');
        } else {
            alert('Error al procesar la donación');
        }
    } catch (error) {
        alert('Error al procesar la donación');
    }
};

// Función para cerrar sesión
async function logout() {
    try {
        await axios.post('/api/logout');
        window.location.href = '/';
    } catch (error) {
        alert('Error logging out');
    }
}

// Funciones de administración
const loadProductosAdmin = async () => {
    try {
        const response = await api.get('/products');
        const productos = response.data;
        const tbody = document.getElementById('productosTable');
        if (!tbody) return;

        tbody.innerHTML = productos.map(producto => `
            <tr>
                <td>${producto._id}</td>
                <td>${producto.name}</td>
                <td>$${producto.price}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editarProducto('${producto._id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarProducto('${producto._id}')">Eliminar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        handleError(error);
    }
};

const loadAsociacionesAdmin = async () => {
    try {
        const response = await api.get('/associations');
        const asociaciones = response.data;
        const tbody = document.getElementById('asociacionesTable');
        if (!tbody) return;

        tbody.innerHTML = asociaciones.map(asociacion => `
            <tr>
                <td>${asociacion._id}</td>
                <td>${asociacion.name}</td>
                <td>${asociacion.description}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editarAsociacion('${asociacion._id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarAsociacion('${asociacion._id}')">Eliminar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        handleError(error);
    }
};

const loadOrdenesAdmin = async () => {
    try {
        const response = await api.get('/orders');
        const ordenes = response.data;
        const tbody = document.getElementById('ordenesTable');
        if (!tbody) return;

        tbody.innerHTML = ordenes.map(orden => `
            <tr>
                <td>${orden._id}</td>
                <td>${orden.userId}</td>
                <td>$${orden.total}</td>
                <td>${orden.status}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="verOrden('${orden._id}')">Ver</button>
                    <button class="btn btn-sm btn-success" onclick="actualizarEstadoOrden('${orden._id}')">Actualizar Estado</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        handleError(error);
    }
};

// Funciones CRUD Productos
const guardarProducto = async () => {
    const id = document.getElementById('productoId').value;
    const data = {
        name: document.getElementById('productoNombre').value,
        price: parseFloat(document.getElementById('productoPrecio').value),
        image: document.getElementById('productoImagen').value
    };

    try {
        if (id) {
            await api.put(`/products/${id}`, data);
        } else {
            await api.post('/products', data);
        }
        bootstrap.Modal.getInstance(document.getElementById('productoModal')).hide();
        loadProductosAdmin();
    } catch (error) {
        handleError(error);
    }
};

const editarProducto = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        const producto = response.data;
        
        document.getElementById('productoId').value = producto._id;
        document.getElementById('productoNombre').value = producto.name;
        document.getElementById('productoPrecio').value = producto.price;
        document.getElementById('productoImagen').value = producto.image || '';
        
        new bootstrap.Modal(document.getElementById('productoModal')).show();
    } catch (error) {
        handleError(error);
    }
};

const eliminarProducto = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
        await api.delete(`/products/${id}`);
        loadProductosAdmin();
    } catch (error) {
        handleError(error);
    }
};

// Funciones CRUD Asociaciones
const guardarAsociacion = async () => {
    const id = document.getElementById('asociacionId').value;
    const data = {
        name: document.getElementById('asociacionNombre').value,
        description: document.getElementById('asociacionDescripcion').value
    };

    try {
        if (id) {
            await api.put(`/associations/${id}`, data);
        } else {
            await api.post('/associations', data);
        }
        bootstrap.Modal.getInstance(document.getElementById('asociacionModal')).hide();
        loadAsociacionesAdmin();
    } catch (error) {
        handleError(error);
    }
};

const editarAsociacion = async (id) => {
    try {
        const response = await api.get(`/associations/${id}`);
        const asociacion = response.data;
        
        document.getElementById('asociacionId').value = asociacion._id;
        document.getElementById('asociacionNombre').value = asociacion.name;
        document.getElementById('asociacionDescripcion').value = asociacion.description;
        
        new bootstrap.Modal(document.getElementById('asociacionModal')).show();
    } catch (error) {
        handleError(error);
    }
};

const eliminarAsociacion = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta asociación?')) return;
    
    try {
        await api.delete(`/associations/${id}`);
        loadAsociacionesAdmin();
    } catch (error) {
        handleError(error);
    }
};

// Funciones para órdenes
const verOrden = async (id) => {
    try {
        const response = await api.get(`/orders/${id}`);
        const orden = response.data;
        alert(`Detalles de la orden:\n${JSON.stringify(orden, null, 2)}`);
    } catch (error) {
        handleError(error);
    }
};

const actualizarEstadoOrden = async (id) => {
    const nuevoEstado = prompt('Ingrese el nuevo estado (pendiente, en proceso, completada):');
    if (!nuevoEstado) return;

    try {
        await api.put(`/orders/${id}`, { status: nuevoEstado });
        loadOrdenesAdmin();
    } catch (error) {
        handleError(error);
    }
};