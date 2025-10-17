// =============================================
// PRODUCTO DETALLE API - CARGAR DESDE MONGODB
// TechStore Pro - Página de Detalle Dinámica
// =============================================

console.log('📄 Inicializando producto-detalle-api.js');

// =============================================
// ESTADO GLOBAL
// =============================================

let currentProduct = null;
let currentImageIndex = 0;

// =============================================
// FUNCIÓN PRINCIPAL: CARGAR DETALLE DEL PRODUCTO
// =============================================

async function loadProductDetail() {
    console.log('📡 Cargando detalle del producto desde MongoDB...');
    
    // 1. Obtener ID desde la URL
    const productId = getProductIdFromURL();
    
    if (!productId) {
        console.error('❌ No se encontró ID de producto en la URL');
        showErrorPage('No se especificó un producto');
        return;
    }
    
    console.log('🔍 ID del producto:', productId);
    
    // 2. Mostrar loading
    showLoadingState();
    
    try {
        // 3. Llamar a la API
        const response = await api.getProduct(productId);
        currentProduct = response.data;
        
        console.log('✅ Producto cargado:', currentProduct);
        
        // 4. Actualizar toda la página con los datos
        updatePageContent(currentProduct);
        
        // 5. Inicializar funcionalidades
        initializeGallery(currentProduct.images);
        initializeQuantitySelector();
        initializeAddToCartButton(currentProduct);
        initializeBuyNowButton(currentProduct); // ✅ AGREGADO
        
        // 6. ✅ OCULTAR LOADING Y RESTAURAR INTERACCIÓN
        hideLoadingState();
        
    } catch (error) {
        console.error('❌ Error cargando producto:', error);
        hideLoadingState(); // ✅ RESTAURAR TAMBIÉN EN ERROR
        showErrorPage(error.message || 'Error al cargar el producto');
    }
}

// =============================================
// OBTENER ID DESDE LA URL
// =============================================

function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    console.log('🔗 URL params:', {
        id: productId,
        fullURL: window.location.href
    });
    
    return productId;
}

// =============================================
// ACTUALIZAR TODO EL CONTENIDO DE LA PÁGINA
// =============================================

function updatePageContent(producto) {
    console.log('🖋️ Actualizando contenido de la página...');
    
    // 1. Título principal y descripción
    updateTitle(producto);
    
    // 2. Precio
    updatePrice(producto);
    
    // 3. Imagen principal y galería
    updateMainImage(producto);
    updateImageGallery(producto);
    
    // 4. Disponibilidad y stock
    updateAvailability(producto);
    
    // 5. Descripción completa
    updateDescription(producto);
    
    // 6. Especificaciones técnicas
    updateSpecifications(producto);
    
    // 7. Título de la página (pestaña del navegador)
    document.title = `${producto.name} - TechStore Pro`;
    
    console.log('✅ Página actualizada completamente');
}

// =============================================
// ACTUALIZAR TÍTULO Y DESCRIPCIÓN
// =============================================

function updateTitle(producto) {
    const titleElement = document.querySelector('main h1');
    if (titleElement) {
        titleElement.textContent = producto.name;
        console.log('✅ Título actualizado:', producto.name);
    }
    
    const descElement = document.querySelector('main h1 + p');
    if (descElement) {
        // Crear descripción corta desde specs o descripción
        let shortDesc = '';
        if (producto.specifications) {
            const specs = producto.specifications;
            shortDesc = [
                specs.processor,
                specs.ram,
                specs.storage
            ].filter(Boolean).join(', ');
        }
        
        descElement.textContent = shortDesc || producto.description?.substring(0, 80) + '...';
        console.log('✅ Descripción corta actualizada');
    }
}

// =============================================
// ACTUALIZAR PRECIO
// =============================================

function updatePrice(producto) {
    // Precio principal
    const priceElement = document.querySelector('.text-4xl.font-bold.text-blue-600');
    if (priceElement) {
        priceElement.textContent = producto.formattedPrice || formatPrice(producto.price);
        console.log('✅ Precio actualizado:', producto.formattedPrice);
    }
    
    // Precio original (si hay descuento)
    const originalPriceElement = document.querySelector('.text-xl.text-gray-500.line-through');
    if (originalPriceElement && producto.originalPrice) {
        originalPriceElement.textContent = formatPrice(producto.originalPrice);
        console.log('✅ Precio original actualizado');
    }
    
    // Badge de ahorro
    const savingsElement = document.querySelector('.bg-red-100.text-red-800');
    if (savingsElement && producto.originalPrice) {
        const savings = producto.originalPrice - producto.price;
        savingsElement.textContent = `Ahorra ${formatPrice(savings)}`;
    }
}

// =============================================
// ACTUALIZAR IMAGEN PRINCIPAL
// =============================================

function updateMainImage(producto) {
    const mainImageContainer = document.getElementById('main-image');
    if (!mainImageContainer) {
        console.warn('⚠️ No se encontró #main-image');
        return;
    }
    
    // Limpiar contenido actual
    mainImageContainer.innerHTML = '';
    
    // Crear nueva imagen
    const img = document.createElement('img');
    img.src = producto.mainImage || producto.images[0];
    img.alt = producto.name;
    img.className = 'w-full h-full object-cover rounded-xl';
    img.loading = 'lazy';
    
    // Fallback si la imagen no carga
    img.onerror = function() {
        this.src = 'https://via.placeholder.com/800?text=Producto';
    };
    
    mainImageContainer.appendChild(img);
    
    // Badge de descuento
    if (producto.discount) {
        const discountBadge = document.createElement('div');
        discountBadge.className = 'absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg';
        discountBadge.textContent = `-${producto.discount}%`;
        mainImageContainer.appendChild(discountBadge);
    }
    
    console.log('✅ Imagen principal actualizada');
}

// =============================================
// ACTUALIZAR GALERÍA DE IMÁGENES
// =============================================

function updateImageGallery(producto) {
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    const images = producto.images || [producto.mainImage];
    
    if (thumbnails.length === 0) {
        console.warn('⚠️ No se encontraron miniaturas');
        return;
    }
    
    thumbnails.forEach((thumbnail, index) => {
        // Limpiar contenido
        thumbnail.innerHTML = '';
        
        if (images[index]) {
            // Crear imagen miniatura
            const img = document.createElement('img');
            img.src = images[index];
            img.alt = `${producto.name} vista ${index + 1}`;
            img.className = 'w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity';
            img.loading = 'lazy';
            
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/200?text=Vista+' + (index + 1);
            };
            
            thumbnail.appendChild(img);
            
            // Marcar la primera como activa
            if (index === 0) {
                thumbnail.classList.add('border-2', 'border-blue-500');
                thumbnail.classList.remove('opacity-70');
            }
        } else {
            // Si no hay imagen para este thumbnail, ocultar
            thumbnail.style.display = 'none';
        }
    });
    
    console.log(`✅ Galería actualizada con ${images.length} imágenes`);
}

// =============================================
// ACTUALIZAR DISPONIBILIDAD
// =============================================

function updateAvailability(producto) {
    const availabilityContainer = document.querySelector('.bg-green-50.border-green-200');
    
    if (!availabilityContainer) {
        console.warn('⚠️ No se encontró contenedor de disponibilidad');
        return;
    }
    
    if (producto.quantity > 0) {
        // En stock
        availabilityContainer.className = 'bg-green-50 border border-green-200 rounded-lg p-4';
        availabilityContainer.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-green-800 font-medium">En stock - Envío inmediato</span>
            </div>
            <p class="text-green-700 text-sm mt-1">
                ${producto.quantity <= 5 ? `Últimas ${producto.quantity} unidades disponibles` : `${producto.quantity} unidades disponibles`}
            </p>
        `;
    } else {
        // Agotado
        availabilityContainer.className = 'bg-red-50 border border-red-200 rounded-lg p-4';
        availabilityContainer.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span class="text-red-800 font-medium">Producto agotado</span>
            </div>
            <p class="text-red-700 text-sm mt-1">No disponible temporalmente</p>
        `;
    }
    
    console.log('✅ Disponibilidad actualizada');
}

// =============================================
// ACTUALIZAR DESCRIPCIÓN COMPLETA
// =============================================

function updateDescription(producto) {
    const descriptionSection = document.querySelector('.bg-white.rounded-xl.shadow-lg.p-8.mb-8');
    
    if (!descriptionSection) {
        console.warn('⚠️ No se encontró sección de descripción');
        return;
    }
    
    // Actualizar descripción principal
    const descParagraphs = descriptionSection.querySelectorAll('.prose p');
    if (descParagraphs.length > 0 && producto.description) {
        // Dividir descripción en 2 párrafos si es muy larga
        const fullDesc = producto.description;
        const midPoint = Math.floor(fullDesc.length / 2);
        const splitPoint = fullDesc.indexOf('. ', midPoint) + 1;
        
        if (splitPoint > 0 && descParagraphs.length >= 2) {
            descParagraphs[0].textContent = fullDesc.substring(0, splitPoint);
            descParagraphs[1].textContent = fullDesc.substring(splitPoint);
        } else {
            descParagraphs[0].textContent = fullDesc;
        }
    }
    
    console.log('✅ Descripción actualizada');
}

// =============================================
// ACTUALIZAR ESPECIFICACIONES TÉCNICAS
// =============================================

function updateSpecifications(producto) {
    if (!producto.specifications) {
        console.log('⚠️ Producto sin especificaciones');
        return;
    }
    
    const specs = producto.specifications;
    
    // Mapeo de especificaciones a selectores
    const specMappings = [
        { key: 'processor', selector: 'Procesador:' },
        { key: 'ram', selector: 'Memoria RAM:' },
        { key: 'storage', selector: 'Almacenamiento:' },
        { key: 'graphics', selector: 'GPU:' },
        { key: 'display', selector: 'Pantalla:' },
        { key: 'battery', selector: 'Batería:' }
    ];
    
    // Actualizar cada especificación
    specMappings.forEach(({ key, selector }) => {
        if (specs[key]) {
            const specElements = Array.from(document.querySelectorAll('.text-gray-600.font-medium'));
            const specLabel = specElements.find(el => el.textContent === selector);
            
            if (specLabel) {
                const valueElement = specLabel.parentElement.querySelector('.text-gray-900.font-semibold');
                if (valueElement) {
                    valueElement.textContent = specs[key];
                }
            }
        }
    });
    
    console.log('✅ Especificaciones actualizadas');
}

// =============================================
// INICIALIZAR GALERÍA INTERACTIVA
// =============================================

function initializeGallery(images) {
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    const mainImageContainer = document.getElementById('main-image');
    
    if (!mainImageContainer || thumbnails.length === 0) {
        console.warn('⚠️ Galería no encontrada');
        return;
    }
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            if (!images[index]) return;
            
            // Actualizar imagen principal
            const mainImg = mainImageContainer.querySelector('img');
            if (mainImg) {
                mainImg.style.opacity = '0.5';
                setTimeout(() => {
                    mainImg.src = images[index];
                    mainImg.style.opacity = '1';
                }, 150);
            }
            
            // Actualizar estado de thumbnails
            thumbnails.forEach(thumb => {
                thumb.classList.remove('border-2', 'border-blue-500');
                thumb.classList.add('opacity-70');
            });
            
            this.classList.add('border-2', 'border-blue-500');
            this.classList.remove('opacity-70');
            
            currentImageIndex = index;
            console.log(`🖼️ Imagen cambiada a índice ${index}`);
        });
    });
    
    console.log('✅ Galería interactiva inicializada');
}

// =============================================
// INICIALIZAR SELECTOR DE CANTIDAD
// =============================================

function initializeQuantitySelector() {
    const decreaseBtn = document.getElementById('quantity-decrease');
    const increaseBtn = document.getElementById('quantity-increase');
    const quantityInput = document.getElementById('quantity-input');
    
    if (!decreaseBtn || !increaseBtn || !quantityInput) {
        console.warn('⚠️ Selector de cantidad no encontrado');
        return;
    }
    
    // Botón disminuir
    decreaseBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value) || 1;
        if (value > 1) {
            quantityInput.value = value - 1;
            updateQuantityButtons(value - 1);
        }
    });
    
    // Botón aumentar
    increaseBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value) || 1;
        const maxQuantity = currentProduct ? currentProduct.quantity : 10;
        if (value < maxQuantity && value < 10) {
            quantityInput.value = value + 1;
            updateQuantityButtons(value + 1);
        }
    });
    
    // Input directo
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value) || 1;
        const maxQuantity = currentProduct ? currentProduct.quantity : 10;
        
        if (value < 1) value = 1;
        if (value > maxQuantity) value = maxQuantity;
        if (value > 10) value = 10;
        
        this.value = value;
        updateQuantityButtons(value);
    });
    
    console.log('✅ Selector de cantidad inicializado');
}

// =============================================
// ACTUALIZAR ESTADO DE BOTONES DE CANTIDAD
// =============================================

function updateQuantityButtons(quantity) {
    const decreaseBtn = document.getElementById('quantity-decrease');
    const increaseBtn = document.getElementById('quantity-increase');
    const maxQuantity = currentProduct ? currentProduct.quantity : 10;
    
    if (decreaseBtn) {
        if (quantity <= 1) {
            decreaseBtn.classList.add('opacity-50', 'cursor-not-allowed');
            decreaseBtn.disabled = true;
        } else {
            decreaseBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            decreaseBtn.disabled = false;
        }
    }
    
    if (increaseBtn) {
        if (quantity >= maxQuantity || quantity >= 10) {
            increaseBtn.classList.add('opacity-50', 'cursor-not-allowed');
            increaseBtn.disabled = true;
        } else {
            increaseBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            increaseBtn.disabled = false;
        }
    }
}

// =============================================
// INICIALIZAR BOTÓN "AGREGAR AL CARRITO"
// =============================================

function initializeAddToCartButton(producto) {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    if (!addToCartBtn) {
        console.warn('⚠️ Botón agregar al carrito no encontrado');
        return;
    }
    
    // Limpiar event listeners anteriores
    const newBtn = addToCartBtn.cloneNode(true);
    addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);
    
    newBtn.addEventListener('click', function() {
        const quantityInput = document.getElementById('quantity-input');
        const quantity = parseInt(quantityInput?.value) || 1;
        
        // Verificar stock
        if (producto.quantity === 0) {
            showNotification('❌ Producto agotado', 'error');
            return;
        }
        
        if (quantity > producto.quantity) {
            showNotification(`⚠️ Solo hay ${producto.quantity} unidades disponibles`, 'warning');
            return;
        }
        
        // Agregar al carrito
        const productData = {
            id: producto.id || producto._id,
            name: producto.name,
            price: producto.price,
            image: producto.mainImage || producto.images[0],
            quantity: quantity
        };
        
        if (typeof addToCart === 'function') {
            addToCart(productData);
            showNotification(`✅ ${quantity} unidad(es) agregadas al carrito`, 'success');
            
            // Feedback visual en el botón
            const originalText = newBtn.textContent;
            newBtn.textContent = '✅ ¡Agregado!';
            newBtn.classList.add('bg-green-600');
            newBtn.classList.remove('bg-blue-600');
            
            setTimeout(() => {
                newBtn.textContent = originalText;
                newBtn.classList.remove('bg-green-600');
                newBtn.classList.add('bg-blue-600');
            }, 2000);
        } else {
            console.error('❌ Función addToCart no disponible');
            showNotification('❌ Error al agregar al carrito', 'error');
        }
        
        console.log('🛒 Producto agregado al carrito:', productData);
    });
    
    // Deshabilitar si no hay stock
    if (producto.quantity === 0) {
        newBtn.disabled = true;
        newBtn.classList.add('opacity-50', 'cursor-not-allowed');
        newBtn.textContent = 'Agotado';
    }
    
    console.log('✅ Botón "Agregar al carrito" inicializado');
}

// =============================================
// INICIALIZAR BOTÓN "COMPRAR AHORA" ✅ NUEVO
// =============================================

function initializeBuyNowButton(producto) {
    const buyNowBtn = document.getElementById('buy-now-btn');
    
    if (!buyNowBtn) {
        console.warn('⚠️ Botón comprar ahora no encontrado');
        return;
    }
    
    // Limpiar event listeners anteriores
    const newBtn = buyNowBtn.cloneNode(true);
    buyNowBtn.parentNode.replaceChild(newBtn, buyNowBtn);
    
    newBtn.addEventListener('click', function() {
        console.log('🛒 Click en "Comprar Ahora"');
        
        const quantityInput = document.getElementById('quantity-input');
        const quantity = parseInt(quantityInput?.value) || 1;
        
        // Verificar stock
        if (producto.quantity === 0) {
            showNotification('❌ Producto agotado', 'error');
            return;
        }
        
        if (quantity > producto.quantity) {
            showNotification(`⚠️ Solo hay ${producto.quantity} unidades disponibles`, 'warning');
            return;
        }
        
        // Agregar al carrito
        const productData = {
            id: producto.id || producto._id,
            name: producto.name,
            price: producto.price,
            image: producto.mainImage || producto.images[0],
            quantity: quantity
        };
        
        if (typeof addToCart === 'function') {
            addToCart(productData);
            console.log('🛒 Producto agregado al carrito (Comprar Ahora):', productData);
            
            // Notificación y redirección
            showNotification('✅ Redirigiendo al carrito...', 'success');
            
            // Feedback visual en el botón
            newBtn.textContent = '✅ Redirigiendo...';
            newBtn.disabled = true;
            
            // Redireccionar después de 500ms
            setTimeout(() => {
                window.location.href = 'carrito.html';
            }, 500);
            
        } else {
            console.error('❌ Función addToCart no disponible');
            showNotification('❌ Error al procesar la compra', 'error');
        }
    });
    
    // Deshabilitar si no hay stock
    if (producto.quantity === 0) {
        newBtn.disabled = true;
        newBtn.classList.add('opacity-50', 'cursor-not-allowed');
        newBtn.textContent = 'Agotado';
    }
    
    console.log('✅ Botón "Comprar Ahora" inicializado');
}

// =============================================
// FUNCIONES DE UTILIDAD
// =============================================

function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    } text-white`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =============================================
// ESTADOS DE ERROR Y LOADING
// =============================================

function showLoadingState() {
    const main = document.querySelector('main');
    if (main) {
        main.style.opacity = '0.5';
        main.style.pointerEvents = 'none';
    }
    console.log('⏳ Mostrando loading...');
}

// ✅ FUNCIÓN AGREGADA
function hideLoadingState() {
    const main = document.querySelector('main');
    if (main) {
        main.style.opacity = '1';
        main.style.pointerEvents = 'auto';
    }
    console.log('✅ Loading ocultado - Página desbloqueada');
}

function showErrorPage(errorMessage) {
    const main = document.querySelector('main');
    if (main) {
        main.innerHTML = `
            <div class="flex flex-col items-center justify-center py-16 px-4">
                <svg class="w-24 h-24 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Error al cargar el producto</h2>
                <p class="text-gray-600 mb-4">${errorMessage}</p>
                <div class="flex gap-4">
                    <a href="productos.html" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">
                        Volver a productos
                    </a>
                    <button onclick="location.reload()" class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg">
                        🔄 Reintentar
                    </button>
                </div>
            </div>
        `;
        main.style.opacity = '1';
        main.style.pointerEvents = 'auto';
    }
    console.error('❌ Página de error mostrada:', errorMessage);
}

// =============================================
// INICIALIZACIÓN AUTOMÁTICA
// =============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProductDetail);
} else {
    loadProductDetail();
}

console.log('✅ producto-detalle-api.js cargado y listo');