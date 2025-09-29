// =============================
// CHECKOUT JS - GAMEFORCE
// =============================

document.addEventListener("DOMContentLoaded", () => {
    // =============================
    // VARIABLES DEL CARRITO
    // =============================
    const CART_KEY = "ecommerce-cart-data"; // mismo que en carrito.js
    const cartData = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    const cartContainer = document.getElementById("checkout-cart-items");
    const subtotalEl = document.getElementById("subtotal");
    const taxesEl = document.getElementById("taxes");
    const totalEl = document.getElementById("total");
    const shippingCostEl = document.getElementById("shipping-cost");

    // =============================
    // RENDERIZAR CARRITO EN CHECKOUT
    // =============================
    let subtotal = 0;
    if (cartData.length === 0) {
        cartContainer.innerHTML = "<p class='text-gray-500'>Tu carrito está vacío ❌</p>";
        subtotalEl.textContent = "$0";
        taxesEl.textContent = "$0";
        totalEl.textContent = "$0";
    } else {
        cartContainer.innerHTML = "";
        cartData.forEach(item => {
            subtotal += item.price * item.quantity;

            const div = document.createElement("div");
            div.className = "flex items-center space-x-3 border-b border-gray-200 pb-4";
            div.innerHTML = `
                <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                    <h4 class="font-medium text-gray-900">${item.name}</h4>
                    <p class="text-sm text-gray-500">Cantidad: ${item.quantity}</p>
                </div>
                <div class="text-right">
                    <span class="font-bold text-gray-900">$${(item.price * item.quantity).toLocaleString("es-CO")}</span>
                </div>
            `;
            cartContainer.appendChild(div);
        });

        const taxes = Math.round(subtotal * 0.19);
        const total = subtotal + taxes;

        subtotalEl.textContent = `$${subtotal.toLocaleString("es-CO")}`;
        taxesEl.textContent = `$${taxes.toLocaleString("es-CO")}`;
        totalEl.textContent = `$${total.toLocaleString("es-CO")}`;
        shippingCostEl.textContent = "Gratis";
    }

    // =============================
    // VARIABLES DEL CHECKOUT
    // =============================
    let currentStep = 1;
    const totalSteps = 4;

    const steps = document.querySelectorAll(".checkout-step");
    const stepIndicators = document.querySelectorAll(".step-indicator");
    const nextBtn = document.getElementById("next-step-btn");
    const prevBtn = document.getElementById("prev-step-btn");

    const shippingRadios = document.querySelectorAll("input[name='shipping']");
    const paymentRadios = document.querySelectorAll("input[name='paymentMethod']");
    const paymentDetails = document.querySelectorAll(".payment-details");

    // =============================
    // FUNCIONES AUXILIARES
    // =============================
    const formatMoney = (value) => {
        return `$${value.toLocaleString("es-CO")}`;
    };

    const updateProgressBar = () => {
        stepIndicators.forEach((indicator, i) => {
            if (i + 1 < currentStep) {
                indicator.classList.remove("bg-gray-200", "text-gray-500");
                indicator.classList.add("bg-blue-600", "text-white");
            } else if (i + 1 === currentStep) {
                indicator.classList.remove("bg-gray-200", "text-gray-500");
                indicator.classList.add("bg-blue-600", "text-white");
            } else {
                indicator.classList.add("bg-gray-200", "text-gray-500");
                indicator.classList.remove("bg-blue-600", "text-white");
            }
        });

        for (let i = 1; i < totalSteps; i++) {
            const bar = document.getElementById(`progress-bar-${i}`);
            if (bar) {
                if (i < currentStep) {
                    bar.style.width = "100%";
                } else if (i === currentStep) {
                    bar.style.width = "50%";
                } else {
                    bar.style.width = "0%";
                }
            }
        }
    };

    const showStep = () => {
        steps.forEach((step, i) => {
            step.classList.toggle("hidden", i + 1 !== currentStep);
        });

        prevBtn.classList.toggle("hidden", currentStep === 1);
        nextBtn.textContent = currentStep === totalSteps ? "Finalizar" : "Continuar →";
        updateProgressBar();
    };

    const validateForm = () => {
        const form = steps[currentStep - 1].querySelector("form");
        if (!form) return true;
        return form.checkValidity();
    };

    const updateTotals = () => {
        let subtotal = parseInt(subtotalEl.textContent.replace(/\D/g, "")) || 0;
        let taxes = parseInt(taxesEl.textContent.replace(/\D/g, "")) || 0;
        let shipping = 0;

        const checked = document.querySelector("input[name='shipping']:checked");
        if (checked) {
            if (checked.value === "express") shipping = 25000;
            if (checked.value === "overnight") shipping = 50000;
        }

        shippingCostEl.textContent = shipping === 0 ? "Gratis" : formatMoney(shipping);

        const total = subtotal + taxes + shipping;
        totalEl.textContent = formatMoney(total);
    };

    const handlePaymentChange = () => {
        paymentDetails.forEach((detail) => detail.classList.add("hidden"));
        const checked = document.querySelector("input[name='paymentMethod']:checked");
        if (checked) {
            const detail = document.getElementById(`${checked.value}-details`);
            if (detail) detail.classList.remove("hidden");
        }
    };

    const generateOrderInfo = () => {
        const orderNumberEl = document.getElementById("order-number");
        const orderDateEl = document.getElementById("order-date");

        const now = new Date();
        const orderNum = "#TS-" + now.getFullYear() + "-" + Math.floor(Math.random() * 9000 + 1000);

        const dateFormatter = new Intl.DateTimeFormat("es-CO", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        if (orderNumberEl) orderNumberEl.textContent = orderNum;
        if (orderDateEl) orderDateEl.textContent = dateFormatter.format(now);
    };

    // =============================
    // EVENTOS
    // =============================
    nextBtn.addEventListener("click", () => {
        if (!validateForm()) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        if (currentStep < totalSteps) {
            currentStep++;
            showStep();
        } else {
            generateOrderInfo();
            alert("¡Tu pedido ha sido confirmado!");
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentStep > 1) {
            currentStep--;
            showStep();
        }
    });

    shippingRadios.forEach((radio) => radio.addEventListener("change", updateTotals));
    paymentRadios.forEach((radio) => radio.addEventListener("change", handlePaymentChange));

    // =============================
    // INICIALIZACIÓN
    // =============================
    showStep();
    updateTotals();
    handlePaymentChange();

    // ✅ Hacer accesible globalmente
    window.updateTotals = updateTotals;
});
