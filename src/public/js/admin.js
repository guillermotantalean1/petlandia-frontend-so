// Variables globales para almacenar los items actuales
let currentProducts = [];
let currentAssociations = [];
let currentOrders = [];

// Cargar datos cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadAssociations();
    loadOrders();
});

// Gestión de Productos
async function loadProducts() {
    try {
        const response = await axios.get('/api/products');
        currentProducts = response.data;
        renderProducts();
    } catch (error) {
        console.error('Error cargando productos:', error);
        alert('Error al cargar productos');
    }
}

function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = currentProducts.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>${product.status}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editProduct('${product._id}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product._id}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function editProduct(productId) {
    const product = currentProducts.find(p => p._id === productId);
    if (product) {
        document.getElementById('productId').value = product._id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productStatus').value = product.status;
        
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    }
}

async function saveProduct() {
    try {
        const productData = {
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            status: document.getElementById('productStatus').value
        };

        const productId = document.getElementById('productId').value;

        if (productId) {
            await axios.put(`/api/products/${productId}`, productData);
        } else {
            await axios.post('/api/products', productData);
        }

        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        document.getElementById('productForm').reset();
        loadProducts();
    } catch (error) {
        console.error('Error guardando producto:', error);
        alert('Error al guardar producto');
    }
}

async function deleteProduct(productId) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        try {
            await axios.delete(`/api/products/${productId}`);
            loadProducts();
        } catch (error) {
            console.error('Error eliminando producto:', error);
            alert('Error al eliminar producto');
        }
    }
}

// Gestión de Asociaciones
async function loadAssociations() {
    try {
        const response = await axios.get('/api/associations');
        currentAssociations = response.data;
        renderAssociations();
    } catch (error) {
        console.error('Error cargando asociaciones:', error);
        alert('Error al cargar asociaciones');
    }
}

function renderAssociations() {
    const tbody = document.getElementById('associationsTableBody');
    tbody.innerHTML = currentAssociations.map(association => `
        <tr>
            <td>${association.name}</td>
            <td>${association.description}</td>
            <td>${association.status}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editAssociation('${association._id}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteAssociation('${association._id}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function editAssociation(associationId) {
    const association = currentAssociations.find(a => a._id === associationId);
    if (association) {
        document.getElementById('associationId').value = association._id;
        document.getElementById('associationName').value = association.name;
        document.getElementById('associationDescription').value = association.description;
        document.getElementById('associationStatus').value = association.status;
        
        const modal = new bootstrap.Modal(document.getElementById('associationModal'));
        modal.show();
    }
}

async function saveAssociation() {
    try {
        const associationData = {
            name: document.getElementById('associationName').value,
            description: document.getElementById('associationDescription').value,
            status: document.getElementById('associationStatus').value
        };

        const associationId = document.getElementById('associationId').value;

        if (associationId) {
            await axios.put(`/api/associations/${associationId}`, associationData);
        } else {
            await axios.post('/api/associations', associationData);
        }

        bootstrap.Modal.getInstance(document.getElementById('associationModal')).hide();
        document.getElementById('associationForm').reset();
        loadAssociations();
    } catch (error) {
        console.error('Error guardando asociación:', error);
        alert('Error al guardar asociación');
    }
}

async function deleteAssociation(associationId) {
    if (confirm('¿Está seguro de que desea eliminar esta asociación?')) {
        try {
            await axios.delete(`/api/associations/${associationId}`);
            loadAssociations();
        } catch (error) {
            console.error('Error eliminando asociación:', error);
            alert('Error al eliminar asociación');
        }
    }
}

// Gestión de Órdenes
async function loadOrders() {
    try {
        const response = await axios.get('/api/orders');
        currentOrders = response.data;
        renderOrders();
    } catch (error) {
        console.error('Error cargando órdenes:', error);
        alert('Error al cargar órdenes');
    }
}

function renderOrders() {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = currentOrders.map(order => `
        <tr>
            <td>${order._id}</td>
            <td>${order.user_id?.name || 'Desconocido'}</td>
            <td>$${calculateOrderTotal(order).toFixed(2)}</td>
            <td>${order.status}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="updateOrderStatus('${order._id}')">Actualizar Estado</button>
            </td>
        </tr>
    `).join('');
}

function calculateOrderTotal(order) {
    return order.products.reduce((total, item) => total + (item.product_id?.price * item.quantity), 0);
}

async function updateOrderStatus(orderId) {
    const newStatus = prompt('Ingrese el nuevo estado (pending, processing, completed, cancelled):');
    if (newStatus && ['pending', 'processing', 'completed', 'cancelled'].includes(newStatus)) {
        try {
            await axios.put(`/api/orders/${orderId}`, { status: newStatus });
            loadOrders();
        } catch (error) {
            console.error('Error actualizando estado de orden:', error);
            alert('Error al actualizar estado de orden');
        }
    } else if (newStatus) {
        alert('Estado no válido');
    }
} 