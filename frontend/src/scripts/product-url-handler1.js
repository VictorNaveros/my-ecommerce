// product-url-handler.js - Leer URLs y cargar datos dinámicos
console.log('🔗 Cargando manejador de URLs...');

document.addEventListener('DOMContentLoaded', function() {
    // Solo ejecutar en página de detalle
    if (window.location.pathname.includes('producto-detalle.html')) {
        console.log('📄 Página de detalle detectada');
        
        const productId = getProductIdFromURL();
        if (productId) {
            console.log(`🎯 Producto solicitado: ${productId}`);
            loadProductData(productId);
        } else {
            console.log('⚠️ Sin ID, cargando producto por defecto');
            loadProductData('macbook-pro-16');
        }
    }
});

/**
 * Obtener ID del producto desde URL
 */
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    console.log(`🔍 Parámetro URL: ${productId || 'ninguno'}`);
    return productId;
}

/**
 * Base de datos de productos
 */
const PRODUCTOS_DB = {
    'macbook-pro-16': {
        nombre: 'MacBook Pro 16" M3',
        descripcion: 'Chip M3, 16GB RAM, 512GB SSD',
        precio: 6200000,
        precioOriginal: 7450000,
        descuento: 15,
        categoria: 'Laptops',
        emoji: '💻',
        stock: 3,
        rating: 4.8,
        reviews: 127
    },
    'iphone-15-pro': {
        nombre: 'iPhone 15 Pro',
        descripcion: '128GB, Titanio Natural',
        precio: 4800000,
        precioOriginal: 5200000,
        descuento: 8,
        categoria: 'Celulares',
        emoji: '📱',
        stock: 5,
        rating: 4.9,
        reviews: 203
    },
    'nvidia-rtx-4080': {
        nombre: 'NVIDIA RTX 4080',
        descripcion: '16GB GDDR6X, Gaming OC',
        precio: 3200000,
        precioOriginal: 3600000,
        descuento: 11,
        categoria: 'Componentes',
        emoji: '🎮',
        stock: 2,
        rating: 4.7,
        reviews: 89
    },
    'samsung-galaxy-s24': {
        nombre: 'Samsung Galaxy S24',
        descripcion: '256GB, Phantom Black',
        precio: 2400000,
        precioOriginal: 2800000,
        descuento: 14,
        categoria: 'Celulares',
        emoji: '📱',
        stock: 8,
        rating: 4.6,
        reviews: 156
    },
    'dell-xps-13': {
        nombre: 'Dell XPS 13',
        descripcion: 'Intel i7, 16GB RAM, 512GB SSD',
        precio: 3500000,
        precioOriginal: 3900000,
        descuento: 10,
        categoria: 'Laptops',
        emoji: '💻',
        stock: 4,
        rating: 4.5,
        reviews: 94
    },
    'amd-ryzen-7': {
        nombre: 'AMD Ryzen 7 7800X3D',
        descripcion: '8-Core, 4.2GHz, AM5',
        precio: 1100000,
        precioOriginal: 1250000,
        descuento: 12,
        categoria: 'Componentes',
        emoji: '⚡',
        stock: 6,
        rating: 4.9,
        reviews: 267
    },
    'airpods-pro': {
        nombre: 'AirPods Pro (2ª Gen)',
        descripcion: 'Cancelación activa de ruido',
        precio: 750000,
        precioOriginal: 850000,
        descuento: 12,
        categoria: 'Audio',
        emoji: '🎧',
        stock: 15,
        rating: 4.4,
        reviews: 445
    },
    'silla-gaming': {
        nombre: 'Silla Gaming Pro',
        descripcion: 'Ergonómica, LED RGB',
        precio: 890000,
        precioOriginal: 1100000,
        descuento: 19,
        categoria: 'Gaming',
        emoji: '🪑',
        stock: 3,
        rating: 4.3,
        reviews: 78
    }
};

/**
 * Cargar datos del producto específico
 */
function loadProductData(productId) {
    const product = PRODUCTOS_DB[productId];
    
    if (!product) {
        console.error(`❌ Producto no encontrado: ${productId}`);
        window.location.href = 'productos.html';
        return;
    }
    
    console.log(`📦 Cargando: ${product.nombre}`);
    
    // Actualizar información en la página
    updateProductInfo(product, productId);
    updatePageTitle(product);
    updateBreadcrumb(product);
    
    console.log('✅ Datos del producto cargados');
}

/**
 * Actualizar información del producto
 */
function updateProductInfo(product, productId) {
    // Título principal
    const title = document.querySelector('h1');
    if (title) title.textContent = product.nombre;
    
    // Descripción
    const desc = document.querySelector('h1 + p');
    if (desc) desc.textContent = product.descripcion;
    
    // Precio actual
    const price = document.querySelector('.text-4xl.font-bold.text-blue-600');
    if (price) price.textContent = `$${product.precio.toLocaleString('es-CO')}`;
    
    // Precio original
    const originalPrice = document.querySelector('.line-through');
    if (originalPrice) originalPrice.textContent = `$${product.precioOriginal.toLocaleString('es-CO')}`;
    
    // Descuento
    const discount = document.querySelector('.bg-red-500');
    if (discount) discount.textContent = `-${product.descuento}%`;
    
    // Ahorro
    const savings = document.querySelector('.bg-red-100 span');
    if (savings) {
        const ahorro = product.precioOriginal - product.precio;
        savings.textContent = `Ahorra $${ahorro.toLocaleString('es-CO')}`;
    }
    
    // Emoji principal
    const emoji = document.querySelector('.text-8xl');
    if (emoji) emoji.textContent = product.emoji;
    
    // Stock
    const stock = document.querySelector('.text-green-700');
    if (stock) stock.textContent = `Últimas ${product.stock} unidades disponibles`;
    
    // Reviews
    const reviews = document.querySelector('.text-sm.text-gray-600');
    if (reviews && reviews.textContent.includes('reseñas')) {
        reviews.textContent = `(${product.reviews} reseñas)`;
    }
    
    console.log(`🎨 Información actualizada para: ${product.nombre}`);
}

/**
 * Actualizar título de la página
 */
function updatePageTitle(product) {
    document.title = `${product.nombre} - TechStore Pro`;
}

/**
 * Actualizar breadcrumb
 */
function updateBreadcrumb(product) {
    const breadcrumb = document.querySelector('nav span.text-gray-900');
    if (breadcrumb) {
        breadcrumb.textContent = product.nombre;
    }
    
    // Actualizar enlace de categoría
    const categoryLink = document.querySelector('nav a[href*="categoria"]');
    if (categoryLink) {
        categoryLink.textContent = product.categoria;
    }
}

// Funciones debug
function debugCurrentProduct() {
    const productId = getProductIdFromURL() || 'macbook-pro-16';
    console.log(`🔍 Producto actual: ${productId}`);
    console.log('📊 Datos:', PRODUCTOS_DB[productId]);
    return productId;
}

window.debugCurrentProduct = debugCurrentProduct;
console.log('📜 product-url-handler.js cargado completamente');