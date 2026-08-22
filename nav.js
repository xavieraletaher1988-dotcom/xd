// BERA HASS — Menú móvil para las páginas que no cargan script.js
(function () {
    'use strict';
    document.addEventListener('DOMContentLoaded', function () {
        var toggle = document.getElementById('navToggle');
        var links = document.getElementById('navLinks');
        if (!toggle || !links) return;
        toggle.addEventListener('click', function () {
            var abierto = links.classList.toggle('active');
            toggle.classList.toggle('active', abierto);
            toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
        });
        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                links.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    });
})();
