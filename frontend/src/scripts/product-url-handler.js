// product-url-handler.js - Carga dinámica de productos desde el backend

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔗 Sistema de URL cargado');
    
    const productId = getProductIdFromURL();
    
    if (productId) {
        console.log(`📱 Producto solicitado: ${productId}`);
        loadProductData(productId);
    } else {
        console.log('📦 Página sin producto específico');
        if (window.location.pathname.includes('productos.html')) {
            document.title = "Productos - Gameforce";
        }
    }
});

function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    console.log(`🔍 URL detectada: ${productId || 'ninguno'}`);
    return productId;
}

async function loadProductData(productId) {
    console.log(`📄 Cargando producto desde backend: ${productId}`);
    
    try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Producto no encontrado');
        
        const product = await response.json();

        // Actualizar título y descripción
        if (window.location.pathname.includes('producto-detalle.html')) {
            const titleElement = document.querySelector('main h1');
            if (titleElement) titleElement.textContent = product.name;

            const descElement = document.querySelector('main h1 + p');
            if (descElement) descElement.textContent = product.description;

            document.title = `${product.name} - GameForce`;
        }

        // Actualizar precios
        const priceElement = document.querySelector('.text-4xl.font-bold.text-blue-600');
        if (priceElement) priceElement.textContent = product.formattedPrice;

        const originalPriceElement = document.querySelector('.text-xl.text-gray-500.line-through');
        if (originalPriceElement) originalPriceElement.textContent = product.formattedOriginalPrice || '';

        // Badge de descuento
        const mainImageContainer = document.getElementById('main-image');
        if (mainImageContainer) {
            const discountBadge = mainImageContainer.querySelector('.absolute');
            if (discountBadge) {
                discountBadge.textContent = `-${product.discountPercentage}%`;
            }
        }

        // Actualizar breadcrumb
        const breadcrumbElement = document.querySelector('nav.text-sm span.text-gray-900');
        if (breadcrumbElement) breadcrumbElement.textContent = product.name;

        // Actualizar imagen principal
        updateMainImage(product.images.main, product.name);

        // Actualizar galería
        updateImageGallery(product.images.gallery, product.name);

        console.log(`🎉 COMPLETADO: ${product.name}`);
    } catch (err) {
        console.error('❌ Error cargando producto:', err);
    }
}

// Función: Actualizar imagen principal
function updateMainImage(imageSrc, productName) {
    const mainImageContainer = document.getElementById('main-image');
    if (!mainImageContainer) return;

    mainImageContainer.innerHTML = '';

    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = productName;
    img.className = 'w-full h-full object-cover rounded-xl';
    img.loading = 'lazy';

    img.onerror = function() {
        this.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'w-full h-full flex items-center justify-center bg-gray-200 rounded-xl';
        fallback.innerHTML = '<span class="text-6xl">🎮</span>';
        mainImageContainer.appendChild(fallback);
    };

    mainImageContainer.appendChild(img);

    // Badge de descuento dinámico
    const discountBadge = document.createElement('div');
    discountBadge.className = 'absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold';
    discountBadge.textContent = '-0%';
    mainImageContainer.appendChild(discountBadge);
}

// Función: Actualizar galería
function updateImageGallery(images, productName) {
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.innerHTML = '';
        if (!images[index]) return;

        const img = document.createElement('img');
        img.src = images[index];
        img.alt = `${productName} vista ${index + 1}`;
        img.className = 'w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity';
        img.loading = 'lazy';

        img.onerror = function() {
            this.style.display = 'none';
            const fallback = document.createElement('span');
            fallback.className = 'text-2xl';
            fallback.textContent = '🎮';
            thumbnail.appendChild(fallback);
        };

        thumbnail.appendChild(img);

        thumbnail.addEventListener('click', function() {
            updateMainImage(images[index], productName);
            thumbnails.forEach(thumb => {
                thumb.classList.remove('ring-2', 'ring-blue-500');
                thumb.classList.add('opacity-70');
            });
            this.classList.add('ring-2', 'ring-blue-500');
            this.classList.remove('opacity-70');
        });

        if (index === 0) {
            thumbnail.classList.add('ring-2', 'ring-blue-500');
            thumbnail.classList.remove('opacity-70');
        }
    });

    console.log(`✅ Galería actualizada con ${images.length} imágenes`);
}
