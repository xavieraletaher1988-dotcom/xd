// BERA HASS — Checkout 2026
document.addEventListener('DOMContentLoaded', () => {
    const { PRODUCTS, formatPrice, getCartTotal, getCartCount, clearCart, cart: getCart, updateQty, removeFromCart } = window.BeraCart;

    let currentStep = 1;
    const steps = ['stepCart', 'stepShipping', 'stepPayment'];
    const btnNext = document.getElementById('btnNext');
    const btnPrev = document.getElementById('btnPrev');

    // ── Render cart items in checkout ────────────────────
    function renderCheckoutCart() {
        const items = getCart();
        const container = document.getElementById('checkoutCartItems');
        const empty = document.getElementById('checkoutCartEmpty');

        if (items.length === 0) {
            container.style.display = 'none';
            empty.style.display = 'flex';
            btnNext.disabled = true;
            btnNext.style.opacity = '0.5';
            return;
        }

        container.style.display = 'block';
        empty.style.display = 'none';
        btnNext.disabled = false;
        btnNext.style.opacity = '1';

        container.innerHTML = items.map(item => {
            const p = PRODUCTS[item.id];
            if (!p) return '';
            return `
                <div class="ck-cart-item">
                    <div class="ck-cart-img">
                        <img src="${p.image}" alt="${p.name}">
                    </div>
                    <div class="ck-cart-info">
                        <h4>${p.name}</h4>
                        <span class="ck-cart-size">${p.size} &mdash; ${p.tag}</span>
                        <span class="ck-cart-unit-price">${formatPrice(p.price)} c/u</span>
                    </div>
                    <div class="ck-cart-qty">
                        <button class="ck-qty-btn" data-action="minus" data-id="${item.id}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14"/></svg>
                        </button>
                        <span class="ck-qty-value">${item.qty}</span>
                        <button class="ck-qty-btn" data-action="plus" data-id="${item.id}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                    </div>
                    <div class="ck-cart-subtotal">
                        <span class="ck-subtotal-amount">${formatPrice(p.price * item.qty)}</span>
                        <button class="ck-remove-btn" data-id="${item.id}" title="Eliminar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Quantity buttons
        container.querySelectorAll('.ck-qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const items = getCart();
                const item = items.find(i => i.id === id);
                if (!item) return;
                if (btn.dataset.action === 'minus') {
                    updateQty(id, item.qty - 1);
                } else {
                    updateQty(id, item.qty + 1);
                }
                renderCheckoutCart();
                renderSummary();
            });
        });

        // Remove buttons
        container.querySelectorAll('.ck-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(btn.dataset.id);
                renderCheckoutCart();
                renderSummary();
            });
        });
    }

    // ── Render order summary ────────────────────────────
    function renderSummary() {
        const items = getCart();
        const summaryItems = document.getElementById('summaryItems');
        const subtotal = getCartTotal();
        const shipping = subtotal >= 150000 ? 0 : 12000;

        summaryItems.innerHTML = items.map(item => {
            const p = PRODUCTS[item.id];
            if (!p) return '';
            return `
                <div class="summary-item">
                    <div class="summary-item-img"><img src="${p.image}" alt="${p.name}"></div>
                    <div class="summary-item-info">
                        <span class="summary-item-name">${p.name}</span>
                        <span class="summary-item-qty">x${item.qty} &mdash; ${p.size}</span>
                    </div>
                    <span class="summary-item-price">${formatPrice(p.price * item.qty)}</span>
                </div>
            `;
        }).join('');

        document.getElementById('summarySubtotal').textContent = formatPrice(subtotal);

        const shippingEl = document.getElementById('summaryShipping');
        if (items.length === 0) {
            shippingEl.textContent = 'Por calcular';
            shippingEl.className = 'summary-shipping-value';
        } else if (shipping === 0) {
            shippingEl.innerHTML = '<span class="free-shipping">GRATIS</span>';
        } else {
            shippingEl.textContent = formatPrice(shipping);
            shippingEl.className = 'summary-shipping-value';
        }

        document.getElementById('summaryTotal').textContent = formatPrice(subtotal + (items.length > 0 ? shipping : 0));

        // Free shipping progress
        if (subtotal > 0 && subtotal < 150000) {
            const remaining = 150000 - subtotal;
            const pct = Math.min((subtotal / 150000) * 100, 100);
            const freeShipMsg = document.getElementById('freeShipMsg');
            if (!freeShipMsg) {
                const msg = document.createElement('div');
                msg.id = 'freeShipMsg';
                msg.className = 'free-ship-progress';
                msg.innerHTML = `
                    <p>Agrega <strong>${formatPrice(remaining)}</strong> mas para envio <strong>GRATIS</strong></p>
                    <div class="free-ship-bar"><div class="free-ship-fill" style="width:${pct}%"></div></div>
                `;
                document.getElementById('summaryShipping').parentElement.after(msg);
            } else {
                freeShipMsg.querySelector('p').innerHTML = `Agrega <strong>${formatPrice(remaining)}</strong> mas para envio <strong>GRATIS</strong>`;
                freeShipMsg.querySelector('.free-ship-fill').style.width = pct + '%';
            }
        } else {
            const freeShipMsg = document.getElementById('freeShipMsg');
            if (freeShipMsg) freeShipMsg.remove();
        }
    }

    // ── Step navigation ─────────────────────────────────
    function showStep(step) {
        currentStep = step;
        steps.forEach((id, i) => {
            const el = document.getElementById(id);
            if (i < step) {
                el.classList.add('completed');
                el.classList.remove('current');
            } else if (i === step - 1) {
                el.classList.add('current');
                el.classList.remove('completed');
            } else {
                el.classList.remove('current', 'completed');
            }
        });

        // Progress bar
        document.querySelectorAll('.checkout-step').forEach((el, i) => {
            el.classList.toggle('active', i < step);
            el.classList.toggle('current', i === step - 1);
        });
        document.querySelectorAll('.step-line').forEach((el, i) => {
            el.classList.toggle('active', i < step - 1);
        });

        // Buttons
        btnPrev.style.display = step > 1 ? 'inline-flex' : 'none';
        if (step === 1) {
            btnNext.querySelector('span').textContent = 'Continuar al Envio';
        } else if (step === 2) {
            btnNext.querySelector('span').textContent = 'Continuar al Pago';
        } else if (step === 3) {
            btnNext.querySelector('span').textContent = 'Confirmar Pedido';
        }

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Show/hide comprobante based on payment method
        updateComprobanteVisibility();
    }

    // ── Validate shipping form ──────────────────────────
    function validateShipping() {
        const form = document.getElementById('shippingForm');
        const required = form.querySelectorAll('[required]');
        let valid = true;
        required.forEach(input => {
            const group = input.closest('.form-group');
            if (!input.value.trim()) {
                group.classList.add('error');
                valid = false;
            } else {
                group.classList.remove('error');
            }
        });
        // Email validation
        const email = document.getElementById('shipEmail');
        if (email.value && !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            email.closest('.form-group').classList.add('error');
            valid = false;
        }
        if (!valid) {
            const firstError = form.querySelector('.form-group.error');
            if (firstError) firstError.querySelector('input, select')?.focus();
        }
        return valid;
    }

    // ── Payment method toggle ───────────────────────────
    function updateComprobanteVisibility() {
        const comprobanteSection = document.getElementById('comprobanteSection');
        if (comprobanteSection) {
            comprobanteSection.style.display = 'block';
        }
    }

    document.querySelectorAll('input[name="payMethod"]').forEach(radio => {
        radio.addEventListener('change', updateComprobanteVisibility);
    });

    // ── Next/Prev buttons ───────────────────────────────
    btnNext.addEventListener('click', () => {
        if (currentStep === 1) {
            if (getCart().length === 0) return;
            showStep(2);
        } else if (currentStep === 2) {
            if (!validateShipping()) return;
            showStep(3);
        } else if (currentStep === 3) {
            submitOrder();
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentStep > 1) showStep(currentStep - 1);
    });

    // ── Submit Order ────────────────────────────────────
    function submitOrder() {
        const items = getCart();
        const subtotal = getCartTotal();
        const shipping = subtotal >= 150000 ? 0 : 12000;
        const total = subtotal + shipping;
        const payMethod = document.querySelector('input[name="payMethod"]:checked')?.value || 'transferencia';

        const payMethodNames = {
            transferencia: 'Transferencia Bancaria',
            nequi: 'Nequi',
            daviplata: 'Daviplata',
            pse: 'PSE - Pago Seguro en Linea'
        };

        const orderNum = 'BH-' + Date.now().toString(36).toUpperCase().slice(-6);

        // Build order summary
        const orderData = {
            number: orderNum,
            items: items.map(i => ({ ...i, ...PRODUCTS[i.id] })),
            shipping: {
                name: document.getElementById('shipName').value,
                phone: document.getElementById('shipPhone').value,
                email: document.getElementById('shipEmail').value,
                document: document.getElementById('shipDoc').value,
                address: document.getElementById('shipAddress').value,
                city: document.getElementById('shipCity').value,
                department: document.getElementById('shipDept').value,
                zip: document.getElementById('shipZip').value,
                notes: document.getElementById('shipNotes').value
            },
            payment: payMethod,
            subtotal,
            shippingCost: shipping,
            total,
            date: new Date().toLocaleString('es-CO')
        };

        // Save order locally
        const orders = JSON.parse(localStorage.getItem('berahass_orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('berahass_orders', JSON.stringify(orders));

        // Show confirmation
        document.querySelector('.checkout-grid').style.display = 'none';
        document.querySelector('.checkout-nav-buttons').style.display = 'none';
        document.querySelector('.checkout-steps').style.display = 'none';

        const confirmation = document.getElementById('orderConfirmation');
        confirmation.style.display = 'block';

        document.getElementById('orderNumber').textContent = '#' + orderNum;

        document.getElementById('confirmationDetails').innerHTML = `
            <div class="confirm-grid">
                <div class="confirm-card">
                    <h4>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        Productos
                    </h4>
                    ${items.map(i => {
                        const p = PRODUCTS[i.id];
                        return `<p>${i.qty}x ${p.name} (${p.size}) — ${formatPrice(p.price * i.qty)}</p>`;
                    }).join('')}
                </div>
                <div class="confirm-card">
                    <h4>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="17.5" cy="18.5" r="1.5"/></svg>
                        Envio
                    </h4>
                    <p><strong>${orderData.shipping.name}</strong></p>
                    <p>${orderData.shipping.address}</p>
                    <p>${orderData.shipping.city}, ${orderData.shipping.department}</p>
                    <p>${orderData.shipping.phone}</p>
                </div>
                <div class="confirm-card">
                    <h4>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                        Pago
                    </h4>
                    <p>${payMethodNames[payMethod]}</p>
                    <p class="confirm-total">Total: <strong>${formatPrice(total)}</strong></p>
                    ${shipping === 0 ? '<p class="confirm-free">Envio GRATIS</p>' : `<p>Envio: ${formatPrice(shipping)}</p>`}
                </div>
            </div>
        `;

        // Clear cart
        clearCart();

        // Scroll top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Progress to done
        document.querySelectorAll('.checkout-step').forEach(el => el.classList.add('active'));
        document.querySelectorAll('.step-line').forEach(el => el.classList.add('active'));
    }

    // ── Remove error on input ───────────────────────────
    document.querySelectorAll('.checkout-form input, .checkout-form select, .checkout-form textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.closest('.form-group')?.classList.remove('error');
        });
    });

    // ── Initialize ──────────────────────────────────────
    renderCheckoutCart();
    renderSummary();
    showStep(1);

    // Listen for cart updates from sidebar
    document.addEventListener('cartUpdated', () => {
        renderCheckoutCart();
        renderSummary();
    });
});
