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

    function updatePrices(currency) {
        Object.keys(prices[currency]).forEach(key => {
            const element = document.getElementById(`price-${key}`);
            if (element) {
                element.textContent = prices[currency][key];
            }
        });

        const whatsappLink = 'https://wa.me/12267796050?text=';
        document.getElementById('get-trial').href = `${whatsappLink}Hello, I want to get a 24-hour free trial for Starshare IPTV.`;
        Object.keys(prices[currency]).forEach(key => {
            const element = document.getElementById(`buy-${key}`);
            if (element) {
                element.href = `${whatsappLink}Hello, I want to buy ${key.replace('-', ' ')}, priced at ${prices[currency][key]} for Starshare IPTV.`;
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

    // Automatically detect location and set the currency
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
        item.addEventListener('click', function() {
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
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
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
