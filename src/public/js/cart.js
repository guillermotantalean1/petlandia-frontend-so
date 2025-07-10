// Función para agregar al carrito
async function addToCart(productId) {
    try {
        const response = await fetch('/producto/' + productId + '/comprar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: 1
            })
        });

        const data = await response.json();

        if (response.status === 401) {
            // Usuario no está logueado
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            return;
        }

        if (!response.ok) {
            throw new Error(data.error || 'Error al agregar al carrito');
        }

        // Actualizar el contador del carrito
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + 1;
        }

        alert('¡Producto agregado al carrito!');
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
} 