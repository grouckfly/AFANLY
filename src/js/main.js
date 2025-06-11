document.addEventListener('DOMContentLoaded', function () {
    initDarkMode();
    initDevNotif();
    initFooterYear();
    initValidation();
    initSidebarToggle();
    initCarousel();
    initPhotocardHighlighting();
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

/* -------------------- CAROUSEL -------------------- */
function initCarousel() {
    const carousel = document.getElementById('service-carousel');
    const btnLeft = document.querySelector('.carousel-btn.left');
    const btnRight = document.querySelector('.carousel-btn.right');

    if (!carousel || !btnLeft || !btnRight) return;

    // Cloning items for infinite loop
    const cloneCount = 3;
    const cards = [...carousel.children];

    for (let i = 0; i < cloneCount; i++) {
        carousel.appendChild(cards[i].cloneNode(true)); // clone awal ke akhir
        carousel.insertBefore(cards[cards.length - 1 - i].cloneNode(true), carousel.firstChild); // clone akhir ke awal
    }

    // Scroll ke posisi tengah (offset clones)
    let startIndex = cloneCount;
    const getItemWidth = () => {
        const card = carousel.querySelector(".photocard");
        const gap = parseInt(getComputedStyle(carousel).gap || 0);
        return card ? card.offsetWidth + gap : 300;
    };
    let itemWidth = getItemWidth();
    carousel.scrollLeft = startIndex * itemWidth;

    // Fungsi geser ke card berikutnya/sebelumnya secara mulus
    function scrollToCard(direction) {
        itemWidth = getItemWidth();
        carousel.scrollBy({ left: direction === 'left' ? -itemWidth : itemWidth, behavior: "smooth" });

        // Infinity logic: jika sudah di ujung, lompat ke tengah
        setTimeout(() => {
            const maxScroll = itemWidth * (cards.length + cloneCount);
            if (carousel.scrollLeft <= 0) {
                carousel.scrollLeft = itemWidth * cards.length;
            } else if (carousel.scrollLeft >= maxScroll) {
                carousel.scrollLeft = itemWidth * cloneCount;
            }
        }, 400);
    }

    btnLeft.addEventListener("click", () => scrollToCard('left'));
    btnRight.addEventListener("click", () => scrollToCard('right'));

    // Infinite loop effect untuk swipe manual
    carousel.addEventListener("scroll", () => {
        itemWidth = getItemWidth();
        const maxScroll = itemWidth * (cards.length + cloneCount);
        if (carousel.scrollLeft <= 0) {
            carousel.scrollLeft = itemWidth * cards.length;
        } else if (carousel.scrollLeft >= maxScroll) {
            carousel.scrollLeft = itemWidth * cloneCount;
        }
    });

    // Disable smooth scroll temporarily if forced jump
    let lastScrollLeft = carousel.scrollLeft;
    carousel.addEventListener("scroll", () => {
        itemWidth = getItemWidth();
        if (Math.abs(carousel.scrollLeft - lastScrollLeft) > itemWidth * cards.length) {
            carousel.style.scrollBehavior = "auto";
            carousel.scrollLeft = itemWidth * cloneCount;
            requestAnimationFrame(() => {
                carousel.style.scrollBehavior = "smooth";
            });
        }
        lastScrollLeft = carousel.scrollLeft;
    });
}

/* -------------------- PHOTOCARD HIGHLIGHT -------------------- */
function initPhotocardHighlighting() {
    const cardWrapper = document.querySelector('.card-wrapper');
    if (!cardWrapper || !cardWrapper.querySelectorAll('.photocard').length) return;

    function setActivePhotocard() {
        const photocards = document.querySelectorAll('.photocard');
        let minDiff = Infinity;
        let activeCard = null;
        const wrapperRect = cardWrapper.getBoundingClientRect();
        const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;

        photocards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const diff = Math.abs(wrapperCenter - cardCenter);
            if (diff < minDiff) {
                minDiff = diff;
                activeCard = card;
            }
        });

        photocards.forEach(card => {
            const desc = card.querySelector('.service-desc');
            if (card === activeCard) {
                card.classList.add('active');
                card.style.opacity = "1";
                card.style.filter = "none";
                if (desc) desc.style.filter = "none";
            } else {
                card.classList.remove('active');
                card.style.opacity = "0.6";
                card.style.filter = "blur(2px)";
                if (desc) desc.style.filter = "blur(2px)";
            }
        });
    }

    function scrollToActiveCard() {
        if (window.innerWidth > 900) return;
        const activeCard = document.querySelector('.photocard.active');
        if (activeCard) {
            const wrapperRect = cardWrapper.getBoundingClientRect();
            const cardRect = activeCard.getBoundingClientRect();
            const offset = cardRect.left - wrapperRect.left - (wrapperRect.width / 2 - cardRect.width / 2);
            cardWrapper.scrollTo({ left: cardWrapper.scrollLeft + offset, behavior: 'smooth' });
        }
    }

    setActivePhotocard();
    cardWrapper.addEventListener('scroll', () => {
        setActivePhotocard();
        scrollToActiveCard();
    });

    window.addEventListener('resize', () => {
        setActivePhotocard();
        scrollToActiveCard();
    });
}