document.addEventListener('DOMContentLoaded', function () {
    initDarkMode();
    initDevNotif();
    initFooterYear();
    initValidation();
    initSidebarToggle();
    initServicesSection();
    startAutoScrollCardWrapper();
});

/* -------------------- DARK MODE -------------------- */
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const sidebarDarkBtn = document.getElementById('sidebarDarkModeToggle');
    const body = document.body;

    function updateDarkModeButton() {
        const isDark = body.classList.contains('dark-mode');
        if (toggle) toggle.innerHTML = isDark ? '🌙' : '☀️';
        if (sidebarDarkBtn) sidebarDarkBtn.innerHTML = isDark ? '🌙' : '☀️';
    }

    let theme = localStorage.getItem('theme');
    if (!theme) {
        const hour = new Date().getHours();
        if (hour >= 18 || hour < 6) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    } else if (theme === 'dark') {
        body.classList.add('dark-mode');
    }
    updateDarkModeButton();

    [toggle, sidebarDarkBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                body.classList.toggle('dark-mode');
                localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
                updateDarkModeButton();
            });
        }
    });
}

/* -------------------- DEV NOTIF -------------------- */
function initDevNotif() {
    const devNotif = document.getElementById('dev-notif');
    const notifText = document.getElementById('notif-text');
    const notifClose = document.getElementById('notif-close');

    function minimizeNotif() {
        notifText.style.display = 'none';
        notifClose.style.display = 'none';

        if (!devNotif.querySelector('.notif-icon')) {
            const icon = document.createElement('span');
            icon.className = 'notif-icon';
            icon.innerText = '⚠️';
            icon.style.cursor = 'pointer';
            devNotif.appendChild(icon);
            icon.addEventListener('click', restoreNotif);
        }
        devNotif.classList.add('minimized');
    }

    function restoreNotif() {
        notifText.style.display = 'inline';
        notifClose.style.display = 'inline-block';
        const icon = devNotif.querySelector('.notif-icon');
        if (icon) icon.remove();
        devNotif.classList.remove('minimized');
    }

    if (notifClose && devNotif && notifText) {
        notifClose.addEventListener('click', minimizeNotif);
    }
}

/* -------------------- FOOTER YEAR -------------------- */
function initFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* -------------------- VALIDATION -------------------- */
function initValidation() {
    const emailLink = document.getElementById('emailLink');
    const phoneLink = document.getElementById('phoneLink');
    const addressLink = document.getElementById('addressLink');

    if (emailLink) {
        emailLink.addEventListener('click', function (e) {
            const email = "defry.pku@gmail.com";
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Email tidak valid!");
                e.preventDefault();
            }
        });
    }

    if (phoneLink) {
        phoneLink.addEventListener('click', function (e) {
            const phone = "081234567890";
            const phonePattern = /^[0-9]{10,15}$/;
            if (!phonePattern.test(phone.replace(/[^0-9]/g, ""))) {
                alert("Nomor telepon tidak valid!");
                e.preventDefault();
            }
        });
    }

    if (addressLink) {
        addressLink.addEventListener('click', function (e) {
            const address = "Jl. Teknologi No. 123, Jakarta";
            if (!address || address.length < 5) {
                alert("Alamat tidak valid!");
                e.preventDefault();
            }
        });
    }
}

/* -------------------- SIDEBAR TOGGLE -------------------- */
function initSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const body = document.body;

    if (sidebarToggle && sidebar && body) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
            body.classList.toggle('sidebar-open');
            sidebarToggle.style.display = sidebar.classList.contains('active') ? 'none' : '';
        });

        document.addEventListener('click', function (e) {
            if (
                sidebar.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                e.target !== sidebarToggle
            ) {
                sidebar.classList.remove('active');
                body.classList.remove('sidebar-open');
                sidebarToggle.style.display = '';
            }
        });
    }
}
/* -------------------- SECTION SERVICES -------------------- */
function initServicesSection() {
    // Swipe/drag support for .card-wrapper
    const cardWrapper = document.querySelector(".services .card-wrapper");
    let isDown = false,
        startX,
        scrollLeft;

    cardWrapper.addEventListener("mousedown", (e) => {
        isDown = true;
        cardWrapper.classList.add("dragging");
        startX = e.pageX - cardWrapper.offsetLeft;
        scrollLeft = cardWrapper.scrollLeft;
    });
    cardWrapper.addEventListener("mouseleave", () => {
        isDown = false;
        cardWrapper.classList.remove("dragging");
    });
    cardWrapper.addEventListener("mouseup", () => {
        isDown = false;
        cardWrapper.classList.remove("dragging");
    });
    cardWrapper.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - cardWrapper.offsetLeft;
        const walk = (x - startX) * 1.5; // scroll-fast
        cardWrapper.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    cardWrapper.addEventListener("touchstart", (e) => {
        isDown = true;
        startX = e.touches[0].pageX - cardWrapper.offsetLeft;
        scrollLeft = cardWrapper.scrollLeft;
    });
    cardWrapper.addEventListener("touchend", () => {
        isDown = false;
    });
    cardWrapper.addEventListener("touchmove", (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - cardWrapper.offsetLeft;
        const walk = (x - startX) * 1.5;
        cardWrapper.scrollLeft = scrollLeft - walk;
    });
}

/* -------------------- Auto Swipe -------------------- */
function startAutoScrollCardWrapper(selector = ".services .card-wrapper", intervalMs = 3500) {
    const cardWrapper = document.querySelector(selector);
    if (!cardWrapper) return;
    const cards = cardWrapper.querySelectorAll('.photocard');
    if (!cards.length) return;
    let idx = 0;
    let interval = null;

    function scrollToCard(i) {
        if (!cards[i]) return;

        const card = cards[i];
        const offsetLeft = card.offsetLeft;
        const cardWrapperPadding = parseInt(getComputedStyle(cardWrapper).paddingLeft) || 0;

        cardWrapper.scrollTo({
            left: offsetLeft - cardWrapperPadding,
            behavior: 'smooth'
        });
    }

    function start() {
        interval = setInterval(() => {
            idx = (idx + 1) % cards.length;
            scrollToCard(idx);
        }, intervalMs);
    }

    function stop() {
        clearInterval(interval);
    }

    cardWrapper.addEventListener('mouseenter', stop);
    cardWrapper.addEventListener('mouseleave', start);
    cardWrapper.addEventListener('touchstart', stop, { passive: true });
    cardWrapper.addEventListener('touchend', start);

    start();
    // Return stop function if you want to control it from outside
    return stop;
}