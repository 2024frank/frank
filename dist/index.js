"use strict";
// Tab functionality with swipe support
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");
const tabsContainer = document.querySelector(".tabs");
// Make tabs container horizontally scrollable
if (tabsContainer) {
    tabsContainer.style.overflowX = 'auto';
}
// Add hover effect to tab buttons
tabButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px)';
        button.style.boxShadow = '0 5px 15px rgba(0, 255, 0, 0.3)';
    });
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
    });
});
// Function to switch tabs with animation
function switchTab(targetTab) {
    // Fade out current active content
    const currentActiveContent = document.querySelector('.tab-content.active');
    if (currentActiveContent) {
        currentActiveContent.classList.add('fade-out');
        setTimeout(() => {
            currentActiveContent.classList.remove('active', 'fade-out');
            // Fade in new content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active', 'fade-in');
                setTimeout(() => {
                    targetContent.classList.remove('fade-in');
                }, 300);
            }
        }, 300);
    }
    // Update tab buttons
    tabButtons.forEach(btn => btn.classList.remove("active"));
    const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
    if (targetButton) {
        targetButton.classList.add("active");
    }
    // Scroll the target button into view
    targetButton?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
    });
}
// Add click event listeners to tab buttons
tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        const tabName = button.getAttribute('data-tab');
        if (tabName) {
            switchTab(tabName);
        }
    });
});
// Swipe detection variables
let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 100;
// Get array of tab IDs in order
const tabOrder = Array.from(tabButtons).map(btn => btn.getAttribute('data-tab') || '');
// Function to get next/previous tab
function getAdjacentTab(direction) {
    const activeButton = document.querySelector('.tab-button.active');
    const currentTab = activeButton?.getAttribute('data-tab') || '';
    const currentIndex = tabOrder.indexOf(currentTab);
    if (direction === 'next') {
        return tabOrder[(currentIndex + 1) % tabOrder.length];
    }
    else {
        return tabOrder[(currentIndex - 1 + tabOrder.length) % tabOrder.length];
    }
}
// Touch event handlers
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});
document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});
// Handle swipe gesture
function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > minSwipeDistance) {
        // Left swipe
        if (swipeDistance < 0) {
            switchTab(getAdjacentTab('next'));
        }
        // Right swipe
        else {
            switchTab(getAdjacentTab('prev'));
        }
    }
}
// Matrix animation with enhanced colors
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const matrixBackground = document.querySelector(".matrix-background");
if (matrixBackground) {
    matrixBackground.appendChild(canvas);
}
const ctx = canvas.getContext("2d");
const columns = canvas.width / 20;
const drops = Array(Math.floor(columns)).fill(1);
// Create a gradient for the matrix effect
function createGradient() {
    if (!ctx)
        return null;
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#00ff00');
    gradient.addColorStop(0.5, '#00ffff');
    gradient.addColorStop(1, '#0000ff');
    return gradient;
}
function drawMatrix() {
    if (!ctx)
        return;
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Use gradient for text
    const gradient = createGradient();
    if (gradient) {
        ctx.fillStyle = gradient;
    }
    else {
        ctx.fillStyle = "#00ff00";
    }
    ctx.font = "20px monospace";
    drops.forEach((y, x) => {
        // Randomize character set for more variety
        const charSets = [
            String.fromCharCode(33 + Math.random() * 94), // Standard ASCII
            String.fromCharCode(0x30A0 + Math.random() * 96), // Japanese Hiragana
            String.fromCharCode(0x4E00 + Math.random() * 20992), // Chinese characters
        ];
        const text = charSets[Math.floor(Math.random() * charSets.length)];
        // Add slight color variation
        if (Math.random() > 0.95) {
            ctx.fillStyle = `hsl(${Math.random() * 60 + 120}, 100%, 50%)`;
        }
        ctx.fillText(text, x * 20, y * 20);
        if (y * 20 > canvas.height && Math.random() > 0.975) {
            drops[x] = 0;
        }
        drops[x]++;
    });
    requestAnimationFrame(drawMatrix);
}
drawMatrix();
// Add parallax effect to the welcome text
const welcomeText = document.querySelector('h1');
if (welcomeText) {
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        welcomeText.style.transform = `translate(${x * 20 - 10}px, ${y * 20 - 10}px)`;
        welcomeText.style.textShadow = `${x * 10}px ${y * 10}px 10px rgba(0, 255, 0, 0.5)`;
    });
}
// Add typing effect to the welcome text
function typeWriter(element, text, i = 0) {
    if (i < text.length) {
        element.innerHTML = text.substring(0, i + 1) + '<span class="cursor">|</span>';
        setTimeout(() => typeWriter(element, text, i + 1), 100);
    }
    else {
        element.innerHTML = text + '<span class="cursor">|</span>';
    }
}
if (welcomeText) {
    const originalText = welcomeText.textContent || '';
    welcomeText.textContent = '';
    setTimeout(() => {
        typeWriter(welcomeText, originalText);
    }, 500);
}
// Swipe functionality for Imagegram with enhanced animations
document.querySelectorAll('.image-slider').forEach((slider) => {
    const htmlSlider = slider;
    let isDown = false;
    let startX;
    let scrollLeft;
    htmlSlider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - htmlSlider.offsetLeft;
        scrollLeft = htmlSlider.scrollLeft;
        htmlSlider.style.cursor = 'grabbing';
    });
    htmlSlider.addEventListener('mouseleave', () => {
        isDown = false;
        htmlSlider.style.cursor = 'grab';
    });
    htmlSlider.addEventListener('mouseup', () => {
        isDown = false;
        htmlSlider.style.cursor = 'grab';
    });
    htmlSlider.addEventListener('mousemove', (e) => {
        if (!isDown)
            return;
        e.preventDefault();
        const x = e.pageX - htmlSlider.offsetLeft;
        const walk = (x - startX) * 2;
        htmlSlider.scrollLeft = scrollLeft - walk;
    });
    htmlSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
        scrollLeft = htmlSlider.scrollLeft;
    });
    htmlSlider.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 2;
        htmlSlider.scrollLeft = scrollLeft - walk;
    });
    // Add hover effect to slider images
    const sliderImages = htmlSlider.querySelectorAll('img');
    sliderImages.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05)';
            img.style.transition = 'transform 0.3s ease';
        });
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
});
// Centering the image slider content
document.querySelectorAll('.image-slider').forEach((slider) => {
    const htmlSlider = slider;
    const centerContent = () => {
        const sliderWidth = htmlSlider.offsetWidth;
        const scrollWidth = htmlSlider.scrollWidth;
        const centerOffset = (scrollWidth - sliderWidth) / 2;
        htmlSlider.scrollLeft = centerOffset;
    };
    // Center the content on load
    window.addEventListener('load', centerContent);
    // Re-center on window resize
    window.addEventListener('resize', centerContent);
});
// Add scroll reveal animations
function revealOnScroll() {
    const elements = document.querySelectorAll('.project, .skill-item, .timeline-item, .education-item');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
// Add particle effect to the background
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    document.body.appendChild(particleContainer);
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        // Random size
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        // Random animation duration
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particleContainer.appendChild(particle);
    }
}
createParticles();
// Handle window resize for matrix canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops.length = Math.floor(canvas.width / 20);
    drops.fill(1);
});
