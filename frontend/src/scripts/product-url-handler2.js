// product-url-handler.js - Manejo de parámetros URL y carga dinámica con imágenes Unsplash

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔗 Sistema de URL cargado');
    
    const productId = getProductIdFromURL();
    
    if (productId) {
        console.log(`📱 Producto solicitado: ${productId}`);
        loadProductData(productId);
    } else {
        console.log('📦 Página sin producto específico');

        // ✅ Si estamos en productos.html, forzamos el título correcto
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

function loadProductData(productId) {
    console.log(`📄 Cargando: ${productId}`);
    
    const products = {
        "Counter-Strike-001": {
            name: "Counter Strike",
            shortDesc: "Shooter táctico multijugador en primera persona",
            price: "$120.000",
            originalPrice: "$150.000",
            images: {
                main: "../assets/images/Producto1.jpg",
                gallery: [
                    "https://gepig.com/game_cover_460w/4734.jpg",
                    "https://play-cs.com/img/seo/og_image1.jpg",
                    "https://torrent4you.org/wp-content/uploads/counter-strike-1.6.jpg",
                    "https://media.steampowered.com/apps/csgo/blog/images/fb_image.png?v=6"
                ]
            },
            category: "shooters"
        },
        "Minecraft-001": {
            name: "Minecraft",
            shortDesc: "Construcción, exploración y aventuras infinitas",
            price: "$90.000",
            originalPrice: "$110.000",
            images: {
                main: "../assets/images/Producto2.jpg",
                gallery: [
                    "https://www.minecraft.net/content/dam/minecraftnet/games/dungeons/logos/Dungeons-PMP_DLC-Flame-of-the-Nether_Boxart-500x500_03.jpg",
                    "https://www.minecraft.net/content/dam/minecraftnet/games/dungeons/logos/boxart-dlc1.jpg",
                    "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70070000012481/3a6db91b88109a0b62b5afca05db12bb5f92875cec55a2799cf77a51be22d8ed",
                    "https://assetsio.gnwcdn.com/minecraft-dungeons-best-weapons.jpg?width=414&quality=70&format=jpg&auto=webp"
                ]
            },
            category: "aventura"
        },
        "LOL-001": {
            name: "League of Legends",
            shortDesc: "Estrategia y acción en un MOBA competitivo",
            price: "$80.000",
            originalPrice: "$100.000",
            images: {
                main: "../assets/images/Producto3.webp",
                gallery: [
                    "https://www.exitlag.com/blog/wp-content/uploads/2024/10/league-of-legends-download-1.webp",
                    "https://www.losreplicantes.com/images/articulos/11000/11895/s3.jpg",
                    "https://egamersworld.com/cdn-cgi/image/width=690,quality=75,format=webp/uploads/blog/1/17/1735564816859_1735564816859.webp",
                    "https://alfabetajuega.com/hero/2020/11/9-cosas-que-debes-saber-sobre-League-Of-Legends.jpg?width=768&aspect_ratio=16:9&format=nowebp"
                ]
            },
            category: "estrategia"
        },
        "God-of-War-001": {
            name: "God of War Ragnarok",
            shortDesc: "La épica saga de Kratos continúa en el reino nórdico",
            price: "$200.000",
            originalPrice: "$240.000",
            images: {
                main: "../assets/images/Producto4.jpg",
                gallery: [
                    "https://sm.ign.com/ign_es/news/g/god-of-war/god-of-war-ragnarok-developer-strongly-encourages-players-to_psun.jpg",
                    "https://image.api.playstation.com/vulcan/ap/rnd/202207/1117/qpCTTb74VvcbqDjxkBmY4i1G.jpg",
                    "https://www.industriaanimacion.com/wp-content/uploads/2022/10/god_of_war_ragnarok_png.png",
                    "https://www.notebookcheck.org/fileadmin/_processed_/4/6/csm_god-of-war-ragnarok-header_5e92bf50c6.jpg"
                ]
            },
            category: "acción"
        },
        "Hollow-Knight-silksong-001": {
            name: "Hollow Knight: Silksong",
            shortDesc: "Explora un reino encantado en la esperada secuela",
            price: "$130.000",
            originalPrice: "$160.000",
            images: {
                main: "../assets/images/Producto5.jpg",
                gallery: [
                    "https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_1.5/c_scale,w_500/ncom/software/switch/70010000020840/664bba2e76ef62a938d9ca5dbcbe8689b6dfc9d78cc7f56b896c1aa2da810013",
                    "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2025/09/farloom-silksong-4360899.jpg?tf=3840x",
                    "https://cloudfront-us-east-1.images.arcpublishing.com/elespectador/D4KBZ4JIZVBSBHBEUQ7B3WS7X4.jpg",
                    "https://images.squarespace-cdn.com/content/v1/606d4bb793879d12d807d4c8/5b2edc7f-750c-4bcf-9216-e0cac388a585/01_grotto.png"
                ]
            },
            category: "aventura"
        },
        "Hollow-Knight-001": {
            name: "Hollow Knight",
            shortDesc: "Un clásico metroidvania de exploración y acción",
            price: "$100.000",
            originalPrice: "$120.000",
            images: {
                main: "../assets/images/Producto6.jpg",
                gallery: [
                    "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Hollow_Knight_first_cover_art.webp/250px-Hollow_Knight_first_cover_art.webp.png",
                    "https://unity.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ffuvbjjlp%2Fproduction%2F333700fc4e0205b58d777b3627dfe9bb4692e512-1536x864.jpg&w=3840&q=75",
                    "https://cdn.dlcompare.com/game_tetiere/upload/gameimage/file/27936.jpeg.webp",
                    "https://www.radiofrance.fr/s3/cruiser-production/2018/06/6d387c00-491e-4e5a-9ee9-742d3038ec9d/1200x680_20180615230750_1.jpg"
                ]
            },
            category: "aventura"
        },
        "Halo-001": {
            name: "Halo: Combat Evolved",
            shortDesc: "El legendario inicio de la saga Halo",
            price: "$110.000",
            originalPrice: "$140.000",
            images: {
                main: "../assets/images/Producto7.jpg",
                gallery: [
                    "https://www.periodicopublicidad.com/asset/thumbnail,1280,720,center,center/media/lapublicidad/images/2016/09/20/20160920185646025680.jpg",
                    "https://cloudfront-eu-central-1.images.arcpublishing.com/diarioas/NUPRHMVDVRGJTCX2OAUEBIVJC4.jpeg",
                    "https://cdn.mos.cms.futurecdn.net/gzLoBEjWrqDLg7Hx8GQA8E.jpg",
                    "https://cdn.wccftech.com/wp-content/uploads/2020/03/halo_evolved_anniversary_pc.jpg"
                ]
            },
            category: "shooters"
        },
        "The-Quarry-001": {
            name: "The Quarry",
            shortDesc: "Una historia interactiva llena de misterio y horror",
            price: "$95.000",
            originalPrice: "$120.000",
            images: {
                main: "../assets/images/Producto8.jpg",
                gallery: [
                    "https://static1-es.millenium.gg/articles/3/48/11/3/@/260337-the-quarry-fyng-article_cover_bd-2.jpg",
                    "https://i0.wp.com/lavidaesunvideojuego.com/wp-content/uploads/2022/07/The_Quarry_La_vida_es_un_videojuego_0.jpg?fit=1400%2C788&ssl=1",
                    "https://static0.srcdn.com/wordpress/wp-content/uploads/2022/06/The-Quarry-statue.jpg",
                    "https://poinformowani.pl/image/868x429/0.0.1735.857/media/2022/06/42161/the-quarry-screen-2.jpg"
                ]
            },
            category: "aventura"
        }
    };
    
    const product = products[productId];
    if (!product) {
        console.log('❌ Producto no encontrado');
        return;
    }
    
    // ✅ SOLO en producto-detalle.html actualizamos dinámicamente
    if (window.location.pathname.includes('producto-detalle.html')) {
        const titleElement = document.querySelector('main h1');
        if (titleElement) {
            titleElement.textContent = product.name;
            console.log(`✅ Título actualizado: ${product.name}`);
        }
    
        const descElement = document.querySelector('main h1 + p');
        if (descElement) {
            descElement.textContent = product.shortDesc;
            console.log(`✅ Descripción actualizada`);
        }

        // Actualizar título de la pestaña
        document.title = `${product.name} - GameForce`;
    }
    
    // Actualizar precio principal
    const priceElement = document.querySelector('.text-4xl.font-bold.text-blue-600');
    if (priceElement) {
        priceElement.textContent = product.price;
        console.log(`✅ Precio actualizado: ${product.price}`);
    }
    
    // Actualizar precio original
    const originalPriceElement = document.querySelector('.text-xl.text-gray-500.line-through');
    if (originalPriceElement) {
        originalPriceElement.textContent = product.originalPrice;
        console.log(`✅ Precio original actualizado: ${product.originalPrice}`);
    }
    
    // Actualizar breadcrumb
    const breadcrumbElement = document.querySelector('nav.text-sm span.text-gray-900');
    if (breadcrumbElement) {
        breadcrumbElement.textContent = product.name;
        console.log(`✅ Breadcrumb actualizado: ${product.name}`);
    }
    
    // Actualizar imagen principal
    updateMainImage(product.images.main, product.name);
    
    // Actualizar galería de imágenes
    updateImageGallery(product.images.gallery, product.name);
    
    console.log(`🎉 COMPLETADO: ${product.name}`);
}

// Función: Actualizar imagen principal
function updateMainImage(imageSrc, productName) {
    const mainImageContainer = document.getElementById('main-image');
    if (mainImageContainer) {
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
        
        const discountBadge = document.createElement('div');
        discountBadge.className = 'absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold';
        discountBadge.textContent = '-15%';
        mainImageContainer.appendChild(discountBadge);
        
        console.log(`✅ Imagen principal actualizada: ${imageSrc}`);
    }
}

// Función: Actualizar galería
function updateImageGallery(images, productName) {
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    
    thumbnails.forEach((thumbnail, index) => {
        if (images[index]) {
            thumbnail.innerHTML = '';
            
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
        }
    });
    
    console.log(`✅ Galería actualizada con ${images.length} imágenes`);
}
