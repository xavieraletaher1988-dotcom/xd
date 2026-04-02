// BERA HASS — Sistema de Carrito 2026
(function() {
    'use strict';

    // ── Catálogo de productos ────────────────────────────
    const PRODUCTS = {
        'refinado-250': {
            id: 'refinado-250',
            name: 'Aceite Refinado',
            desc: 'Aceite de Aguacate Hass Refinado 250ml',
            price: 26500,
            image: 'garrafa-clean.png',
            size: '250 ml',
            tag: 'Cocina'
        },
        'extravirgen-250': {
            id: 'extravirgen-250',
            name: 'Aceite Extra Virgen',
            desc: 'Aceite de Aguacate Hass Extra Virgen 250ml',
            price: 31500,
            image: 'PHOTO-2026-04-01-22-43-53.jpg',
            size: '250 ml',
            tag: 'Premium'
        },
        'industrial-5l': {
            id: 'industrial-5l',
            name: 'Garrafa Industrial',
            desc: 'Aceite de Aguacate Hass 5 Litros',
            price: 510000,
            image: 'garrafa.png',
            size: '5 Litros',
            tag: 'Mayorista'
        }
    };

    // ── Estado del carrito ───────────────────────────────
    let cart = JSON.parse(localStorage.getItem('berahass_cart') || '[]');

    function saveCart() {
        localStorage.setItem('berahass_cart', JSON.stringify(cart));
        updateCartBadge();
        updateCartSidebar();
        document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
    }

    function addToCart(productId, qty) {
        qty = parseInt(qty) || 1;
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({ id: productId, qty });
        }
        saveCart();
        showCartNotification(PRODUCTS[productId].name, qty);
        openCartSidebar();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
    }

    function updateQty(productId, qty) {
        qty = parseInt(qty);
        if (qty <= 0) { removeFromCart(productId); return; }
        const item = cart.find(i => i.id === productId);
        if (item) { item.qty = qty; saveCart(); }
    }

    function getCartTotal() {
        return cart.reduce((sum, item) => {
            const product = PRODUCTS[item.id];
            return sum + (product ? product.price * item.qty : 0);
        }, 0);
    }

    function getCartCount() {
        return cart.reduce((sum, item) => sum + item.qty, 0);
    }

    function clearCart() {
        cart = [];
        saveCart();
    }

    function formatPrice(n) {
        return '$' + n.toLocaleString('es-CO');
    }

    // ── Badge del carrito en navbar ─────────────────────
    function updateCartBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        const count = getCartCount();
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    // ── Notificación "Agregado al carrito" ──────────────
    function showCartNotification(name, qty) {
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        const notif = document.createElement('div');
        notif.className = 'cart-notification';
        notif.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
            <span><strong>${qty}x ${name}</strong> agregado al carrito</span>
        `;
        document.body.appendChild(notif);
        requestAnimationFrame(() => notif.classList.add('show'));
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 400);
        }, 2500);
    }

    // ── Sidebar del carrito ─────────────────────────────
    function createCartSidebar() {
        if (document.getElementById('cartSidebar')) return;

        const overlay = document.createElement('div');
        overlay.className = 'cart-overlay';
        overlay.id = 'cartOverlay';
        overlay.addEventListener('click', closeCartSidebar);

        const sidebar = document.createElement('div');
        sidebar.className = 'cart-sidebar';
        sidebar.id = 'cartSidebar';
        sidebar.innerHTML = `
            <div class="cart-sidebar-header">
                <h3>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    Mi Carrito
                </h3>
                <button class="cart-close" id="cartClose" aria-label="Cerrar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            </div>
            <div class="cart-sidebar-body" id="cartBody"></div>
            <div class="cart-sidebar-footer" id="cartFooter"></div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(sidebar);

        document.getElementById('cartClose').addEventListener('click', closeCartSidebar);
    }

    function openCartSidebar() {
        createCartSidebar();
        updateCartSidebar();
        requestAnimationFrame(() => {
            document.getElementById('cartOverlay').classList.add('active');
            document.getElementById('cartSidebar').classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeCartSidebar() {
        const overlay = document.getElementById('cartOverlay');
        const sidebar = document.getElementById('cartSidebar');
        if (overlay) overlay.classList.remove('active');
        if (sidebar) sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateCartSidebar() {
        const body = document.getElementById('cartBody');
        const footer = document.getElementById('cartFooter');
        if (!body || !footer) return;

        if (cart.length === 0) {
            body.innerHTML = `
                <div class="cart-empty">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    <p>Tu carrito está vacío</p>
                    <span>Agrega productos para comenzar</span>
                </div>
            `;
            footer.innerHTML = '';
            return;
        }

        body.innerHTML = cart.map(item => {
            const p = PRODUCTS[item.id];
            if (!p) return '';
            return `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-img">
                        <img src="${p.image}" alt="${p.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4>${p.name}</h4>
                        <span class="cart-item-size">${p.size}</span>
                        <span class="cart-item-price">${formatPrice(p.price)}</span>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-qty-control">
                            <button class="qty-btn qty-minus" data-id="${item.id}">-</button>
                            <span class="qty-value">${item.qty}</span>
                            <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
                        </div>
                        <span class="cart-item-subtotal">${formatPrice(p.price * item.qty)}</span>
                        <button class="cart-item-remove" data-id="${item.id}" title="Eliminar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        const total = getCartTotal();
        const count = getCartCount();
        footer.innerHTML = `
            <div class="cart-summary">
                <div class="cart-summary-row">
                    <span>Productos (${count})</span>
                    <span>${formatPrice(total)}</span>
                </div>
                <div class="cart-summary-row cart-summary-total">
                    <span>Total</span>
                    <span>${formatPrice(total)}</span>
                </div>
            </div>
            <a href="checkout.html" class="btn btn-gold btn-lg btn-full cart-checkout-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>Ir a Pagar</span>
            </a>
            <button class="cart-clear-btn" id="cartClearBtn">Vaciar carrito</button>
        `;

        // Event listeners for cart items
        body.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = cart.find(i => i.id === id);
                if (item) updateQty(id, item.qty - 1);
            });
        });
        body.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = cart.find(i => i.id === id);
                if (item) updateQty(id, item.qty + 1);
            });
        });
        body.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
        });
        const clearBtn = document.getElementById('cartClearBtn');
        if (clearBtn) clearBtn.addEventListener('click', clearCart);
    }

    // ── Inicialización ──────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        updateCartBadge();

        // Cart button in navbar
        document.querySelectorAll('.nav-cart-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                openCartSidebar();
            });
        });

        // "Agregar al carrito" buttons on index page product cards
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                const productId = btn.dataset.product;
                const qtyInput = btn.closest('.prod-info, .prod-detail-info')?.querySelector('.qty-input');
                const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
                addToCart(productId, qty);
            });
        });

        // Quantity controls on product pages
        document.querySelectorAll('.prod-qty-control').forEach(control => {
            const input = control.querySelector('.qty-input');
            const minus = control.querySelector('.qty-dec');
            const plus = control.querySelector('.qty-inc');
            if (minus) minus.addEventListener('click', () => {
                let val = parseInt(input.value) || 1;
                if (val > 1) input.value = val - 1;
            });
            if (plus) plus.addEventListener('click', () => {
                let val = parseInt(input.value) || 1;
                if (val < 99) input.value = val + 1;
            });
            if (input) input.addEventListener('change', () => {
                let val = parseInt(input.value);
                if (isNaN(val) || val < 1) input.value = 1;
                if (val > 99) input.value = 99;
            });
        });
    });

    // Expose globally
    window.BeraCart = { addToCart, removeFromCart, updateQty, getCartTotal, getCartCount, clearCart, openCartSidebar, closeCartSidebar, PRODUCTS, cart: () => cart, formatPrice };

})();
