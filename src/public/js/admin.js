// Global variables to store current items
let currentProducts = [];
let currentAssociations = [];
let currentOrders = [];

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadAssociations();
    loadOrders();
});

// Products Management
async function loadProducts() {
    try {
        const response = await axios.get('/api/products');
        currentProducts = response.data;
        renderProducts();
    } catch (error) {
        alert('Error loading products');
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
                <button class="btn btn-sm btn-primary" onclick="editProduct('${product._id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function showProductModal(productId = null) {
    const product = productId ? currentProducts.find(p => p._id === productId) : null;
    document.getElementById('productId').value = product?._id || '';
    document.getElementById('productName').value = product?.name || '';
    document.getElementById('productDescription').value = product?.description || '';
    document.getElementById('productPrice').value = product?.price || '';
    document.getElementById('productStock').value = product?.stock || '';
    document.getElementById('productStatus').value = product?.status || 'active';
    
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

function editProduct(productId) {
    showProductModal(productId);
}

async function saveProduct() {
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        status: document.getElementById('productStatus').value
    };

    const productId = document.getElementById('productId').value;

    try {
        if (productId) {
            await axios.put(`/api/products/${productId}`, productData);
        } else {
            await axios.post('/api/products', productData);
        }
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        loadProducts();
    } catch (error) {
        alert('Error saving product');
    }
}

async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
    try {
            await axios.delete(`/api/products/${productId}`);
            loadProducts();
    } catch (error) {
            alert('Error deleting product');
        }
    }
}

// Associations Management
async function loadAssociations() {
    try {
        const response = await axios.get('/api/associations');
        currentAssociations = response.data;
        renderAssociations();
    } catch (error) {
        alert('Error loading associations');
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
                <button class="btn btn-sm btn-primary" onclick="editAssociation('${association._id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteAssociation('${association._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
}

function showAssociationModal(associationId = null) {
    const association = associationId ? currentAssociations.find(a => a._id === associationId) : null;
    document.getElementById('associationId').value = association?._id || '';
    document.getElementById('associationName').value = association?.name || '';
    document.getElementById('associationDescription').value = association?.description || '';
    document.getElementById('associationStatus').value = association?.status || 'active';
        
    const modal = new bootstrap.Modal(document.getElementById('associationModal'));
    modal.show();
}

function editAssociation(associationId) {
    showAssociationModal(associationId);
}

async function saveAssociation() {
    const associationData = {
        name: document.getElementById('associationName').value,
        description: document.getElementById('associationDescription').value,
        status: document.getElementById('associationStatus').value
    };

    const associationId = document.getElementById('associationId').value;

    try {
        if (associationId) {
            await axios.put(`/api/associations/${associationId}`, associationData);
        } else {
            await axios.post('/api/associations', associationData);
        }
        bootstrap.Modal.getInstance(document.getElementById('associationModal')).hide();
        loadAssociations();
    } catch (error) {
        alert('Error saving association');
    }
}

async function deleteAssociation(associationId) {
    if (confirm('Are you sure you want to delete this association?')) {
    try {
            await axios.delete(`/api/associations/${associationId}`);
            loadAssociations();
        } catch (error) {
            alert('Error deleting association');
        }
    }
}

// Orders Management
async function loadOrders() {
    try {
        const response = await axios.get('/api/orders');
        currentOrders = response.data;
        renderOrders();
    } catch (error) {
        alert('Error loading orders');
    }
}

function renderOrders() {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = currentOrders.map(order => `
        <tr>
            <td>${order._id}</td>
            <td>${order.user_id?.name || 'Unknown'}</td>
            <td>$${calculateOrderTotal(order).toFixed(2)}</td>
            <td>${order.status}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="updateOrderStatus('${order._id}')">Update Status</button>
            </td>
        </tr>
    `).join('');
}

function calculateOrderTotal(order) {
    return order.products.reduce((total, item) => total + (item.product_id?.price * item.quantity), 0);
}

async function updateOrderStatus(orderId) {
    const newStatus = prompt('Enter new status (pending, processing, completed, cancelled):');
    if (newStatus && ['pending', 'processing', 'completed', 'cancelled'].includes(newStatus)) {
        try {
            await axios.put(`/api/orders/${orderId}`, { status: newStatus });
            loadOrders();
        } catch (error) {
            alert('Error updating order status');
        }
    } else if (newStatus) {
        alert('Invalid status. Please use: pending, processing, completed, or cancelled');
    }
} 