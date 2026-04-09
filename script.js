const WHATSAPP_NUMBER = '14375007575';
const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const LOGIN_ISSUE_WHATSAPP_MESSAGE = 'Hello, I am facing issues with login.';
const SERVICE_URLS = {
    player: [
        'http://premimum.online:80',
        'http://starshare.online:80',
        'http://starshare.one:8080'
    ],
    morePlayer: [
        'http://uniqueott.com:80',
        'http://du7g.com:80',
        'http://starshare.one:80'
    ],
    smartHost: [
        'http://yingpring.online:8080',
        'http://mysouq1.com:8080',
        'https://mysouq1.com'
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    const currencyToggle = document.getElementById('currency-switcher');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    const faqItems = document.querySelectorAll('.faq-item');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const navLinks = document.querySelectorAll('.nav-menu li a');
    const menuOverlay = document.querySelector('.menu-overlay');

    const prices = {
        INR: {
            '1-month': '300 INR',
            '3-months': '1000 INR',
            '6-months': '1800 INR',
            '12-months': '3000 INR',
            '12-months (2 users)': '5400 INR',
            '12-months (4 users)': '10000 INR',
            '24-months (2 years)': '5400 INR',
            '30-months (2.5 years)': '6750 INR',
            '36-months (3 years)': '8000 INR',
            '60-months (5 years)': '12500 INR'
        },
        CAD: {
            '1-month': '5 CAD',
            '3-months': '15 CAD',
            '6-months': '30 CAD',
            '12-months': '50 CAD',
            '12-months (2 users)': '90 CAD',
            '12-months (4 users)': '160 CAD',
            '24-months (2 years)': '90 CAD',
            '30-months (2.5 years)': '110 CAD',
            '36-months (3 years)': '130 CAD',
            '60-months (5 years)': '200 CAD'
        }
    };

    function buildWhatsAppLink(message) {
        return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
    }

    function applyGlobalWhatsAppLinks() {
        document.querySelectorAll('.whatsapp-button').forEach((button) => {
            button.href = WHATSAPP_BASE_URL;
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
        });
    }

    function createUrlBoxes(urls) {
        return urls.map((url) => `
            <div class="url-copy-item">
                <code class="url-copy-text">${url}</code>
                <button type="button" class="url-copy-button" data-copy-url="${url}">Copy</button>
            </div>
        `).join('');
    }

    function renderUrlBoxes(containerId, urls) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = createUrlBoxes(urls);
    }

    function renderSharedLoginUrls() {
        const sharedContainer = document.getElementById('shared-login-urls');
        if (sharedContainer) {
            sharedContainer.innerHTML = `
                <p><strong>URL(s) For Player:</strong></p>
                <div>${createUrlBoxes(SERVICE_URLS.player)}</div>
                <p><strong>More URL(s) For Player:</strong></p>
                <div>${createUrlBoxes(SERVICE_URLS.morePlayer)}</div>
                <p><strong>URL(s) for Smart Host:</strong></p>
                <div>${createUrlBoxes(SERVICE_URLS.smartHost)}</div>
            `;
        }
    }

    async function copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }

        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    function attachCopyButtonsHandler() {
        document.addEventListener('click', async (event) => {
            const button = event.target.closest('.url-copy-button');
            if (!button) return;
            const url = button.getAttribute('data-copy-url');
            if (!url) return;
            try {
                await copyTextToClipboard(url);
                const previousText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = previousText || 'Copy';
                }, 1200);
            } catch {
                button.textContent = 'Failed';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 1200);
            }
        });
    }

    function applyLoginHelpWhatsAppLinks() {
        const loginHelpLink = buildWhatsAppLink(LOGIN_ISSUE_WHATSAPP_MESSAGE);
        ['login-help-whatsapp-link', 'faq-login-help-whatsapp-link'].forEach((id) => {
            const element = document.getElementById(id);
            if (!element) return;
            element.href = loginHelpLink;
            element.target = '_blank';
            element.rel = 'noopener noreferrer';
        });
    }

    function openFaqFromHash() {
        if (!window.location.hash) return;
        let targetElement = null;
        try {
            targetElement = document.querySelector(decodeURIComponent(window.location.hash));
        } catch {
            targetElement = null;
        }
        if (!targetElement) return;
        const faqItem = targetElement.classList.contains('faq-item')
            ? targetElement
            : targetElement.closest('.faq-item');
        if (faqItem) {
            faqItem.classList.add('open');
        }
    }

    function updatePrices(currency) {
        Object.keys(prices[currency]).forEach(key => {
            const element = document.getElementById(`price-${key}`);
            if (element) {
                element.textContent = prices[currency][key];
            }
        });

        document.querySelectorAll('[id="get-trial"]').forEach((trialLink) => {
            trialLink.href = buildWhatsAppLink('Hello, I want to get a 24-hour free trial for Starshare IPTV.');
            trialLink.target = '_blank';
            trialLink.rel = 'noopener noreferrer';
        });
        Object.keys(prices[currency]).forEach(key => {
            const element = document.getElementById(`buy-${key}`);
            if (element) {
                element.href = buildWhatsAppLink(`Hello, I want to buy ${key.replace('-', ' ')}, priced at ${prices[currency][key]} for Starshare IPTV.`);
                element.target = '_blank';
                element.rel = 'noopener noreferrer';
            }
        });
    }

    // Function to detect location and set the default currency
    function detectLocationAndSetCurrency() {
        fetch('https://ipinfo.io?token=91d1ef62bda863') // Replace with your actual API token from https://ipinfo.io
            .then(response => response.json())
            .then(data => {
                const country = data.country;
                if (country === 'IN') {
                    // Set to INR if in India
                    updatePrices('INR');
                    currencyToggle.checked = false; // Make sure the toggle is set to INR
                } else {
                    // Set to CAD for Canada or any other country
                    updatePrices('CAD');
                    currencyToggle.checked = true; // Toggle to CAD
                }
            })
            .catch(() => {
                // Fallback to CAD in case of any error or if geolocation fails
                updatePrices('CAD');
                currencyToggle.checked = true;
            });
    }

    // Apply WhatsApp link globally and detect location/currency
    applyGlobalWhatsAppLinks();
    renderUrlBoxes('player-urls-list', SERVICE_URLS.player);
    renderUrlBoxes('more-player-urls-list', SERVICE_URLS.morePlayer);
    renderUrlBoxes('smart-host-urls-list', SERVICE_URLS.smartHost);
    renderSharedLoginUrls();
    attachCopyButtonsHandler();
    applyLoginHelpWhatsAppLinks();
    openFaqFromHash();
    window.addEventListener('hashchange', openFaqFromHash);
    detectLocationAndSetCurrency();

    // Toggle currency manually using the switcher
    currencyToggle.addEventListener('change', function() {
        updatePrices(this.checked ? 'CAD' : 'INR');
    });

    mobileMenuToggle.addEventListener('click', function() {
        navbar.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navbar.classList.remove('active');
            menuOverlay.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    menuOverlay.addEventListener('click', function() {
        navbar.classList.remove('active');
        menuOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });

    faqItems.forEach(item => {
        item.addEventListener('click', function(event) {
            const clickedInsideUrlBox = event.target.closest('.url-copy-item');
            const clickedInteractiveElement = event.target.closest('button, a, input, textarea, select');
            const selectedText = window.getSelection ? window.getSelection().toString().trim() : '';

            // Keep FAQ open while using URL copy boxes or selecting text.
            if (clickedInsideUrlBox || clickedInteractiveElement || selectedText) {
                return;
            }

            this.classList.toggle('open');
        });
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(tab).classList.add('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.classList.contains('tab-button')) return;
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');
let currentIndex = 0;
const totalSlides = slides.length;

let touchStartX = 0;
let touchEndX = 0;

function moveSlider(direction) {
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
    updateSlider();
}

function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function autoRotate() {
    moveSlider(1);
}

arrowLeft.addEventListener('click', (e) => {
    e.preventDefault();
    moveSlider(-1);
});

arrowRight.addEventListener('click', (e) => {
    e.preventDefault();
    moveSlider(1);
});

// Touch events for swipe functionality
slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance (in pixels) to trigger a swipe
    if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left
        moveSlider(1);
    } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right
        moveSlider(-1);
    }
}

// Auto-rotate every 4 seconds
let autoRotateInterval = setInterval(autoRotate, 4000);

// Pause auto-rotation on user interaction
function pauseAutoRotate() {
    clearInterval(autoRotateInterval);
}

function resumeAutoRotate() {
    autoRotateInterval = setInterval(autoRotate, 3000);
}

slider.addEventListener('touchstart', pauseAutoRotate);
slider.addEventListener('touchend', resumeAutoRotate);
arrowLeft.addEventListener('click', () => {
    pauseAutoRotate();
    setTimeout(resumeAutoRotate, 3000);
});
arrowRight.addEventListener('click', () => {
    pauseAutoRotate();
    setTimeout(resumeAutoRotate, 3000);
});

// Preload images
function preloadImages() {
    const imageUrls = Array.from(slides).map(slide => slide.querySelector('img').src);
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Call preloadImages when the page loads
window.addEventListener('load', preloadImages);
