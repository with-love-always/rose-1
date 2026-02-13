// ========================================
// GLOBAL VARIABLES
// ========================================
let currentSlide = 1;
const totalSlides = 8;
let particles = [];
let speedValue = 0;

// ========================================
// SLIDE NAVIGATION
// ========================================
function nextSlide() {
    if (currentSlide < totalSlides) {
        // Remove active from current slide
        const current = document.getElementById(`slide${currentSlide}`);
        current.classList.remove('active');
        
        // Update slide counter
        currentSlide++;
        
        // Add active to next slide with custom animation
        const next = document.getElementById(`slide${currentSlide}`);
        next.classList.add('active');
        
        // Update speedometer
        updateSpeedometer(currentSlide * 12);
        
        // Trigger special effects for certain slides
        if (currentSlide === 7) {
            startTyping();
        }
        
        // Add ripple effect to button
        createRipple(event);
    }
}

// ========================================
// PARTICLE SYSTEM
// ========================================
function createParticles() {
    const particleContainer = document.querySelector('.particles');
    const particleCount = window.innerWidth < 768 ? 20 : 40;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const startX = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.2;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, ${opacity});
            border-radius: 50%;
            left: ${startX}%;
            top: -10px;
            animation: particleFloat ${duration}s linear ${delay}s infinite;
            box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, ${opacity});
            pointer-events: none;
        `;
        
        particleContainer.appendChild(particle);
        particles.push(particle);
    }
    
    // Add particle animation to stylesheet
    if (!document.getElementById('particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translateY(0) translateX(0) scale(1);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px) scale(0.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// RAIN ENHANCEMENT
// ========================================
function enhanceRain() {
    const rainContainer = document.querySelector('.rain');
    const rainCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < rainCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        
        const left = Math.random() * 100;
        const duration = Math.random() * 0.5 + 0.5;
        const delay = Math.random() * 2;
        const opacity = Math.random() * 0.3 + 0.2;
        
        drop.style.cssText = `
            position: absolute;
            width: 1px;
            height: ${Math.random() * 20 + 10}px;
            background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, ${opacity}));
            left: ${left}%;
            top: -20px;
            animation: rainFall ${duration}s linear ${delay}s infinite;
            filter: blur(${Math.random() * 0.5}px);
        `;
        
        rainContainer.appendChild(drop);
    }
    
    // Add rain animation
    if (!document.getElementById('rain-animation')) {
        const style = document.createElement('style');
        style.id = 'rain-animation';
        style.textContent = `
            @keyframes rainFall {
                0% { transform: translateY(0); }
                100% { transform: translateY(100vh); }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// SPEEDOMETER ANIMATION
// ========================================
function updateSpeedometer(targetSpeed) {
    const speedValueEl = document.querySelector('.speed-value');
    const speedNeedle = document.querySelector('.speed-needle');
    
    // Animate speed value
    const startSpeed = speedValue;
    const duration = 1000;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        speedValue = Math.floor(startSpeed + (targetSpeed - startSpeed) * easeOutCubic);
        speedValueEl.textContent = speedValue;
        
        // Rotate needle (-90deg to 90deg range)
        const rotation = -90 + (speedValue / 100) * 180;
        speedNeedle.style.transform = `rotate(${rotation}deg)`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// ========================================
// BUTTON RIPPLE EFFECT
// ========================================
function createRipple(event) {
    if (!event || !event.target) return;
    
    const button = event.target.closest('.btn');
    if (!button) return;
    
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
        z-index: 0;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
    
    // Add ripple animation if not exists
    if (!document.getElementById('ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes rippleEffect {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add ripple to all buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
});

// ========================================
// PROXIMITY LOGIC FOR "BRAKE" BUTTON
// ========================================
const noButton = document.getElementById('noButton');
if (noButton) {
    const moveButton = () => {
        const padding = 50;
        const maxX = window.innerWidth - noButton.offsetWidth - padding * 2;
        const maxY = window.innerHeight - noButton.offsetHeight - padding * 2;
        
        const x = padding + Math.random() * maxX;
        const y = padding + Math.random() * maxY;
        
        noButton.style.position = 'fixed';
        noButton.style.left = x + 'px';
        noButton.style.top = y + 'px';
        noButton.style.zIndex = '9999';
        noButton.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    };

    // Mouse proximity detection
    document.addEventListener('mousemove', (e) => {
        if (!noButton.closest('.slide').classList.contains('active')) return;
        
        const rect = noButton.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        
        if (distance < 100) {
            moveButton();
        }
    });

    // Touch handling for mobile
    noButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveButton();
    });
}

// ========================================
// TYPING EFFECT FOR SLIDE 7
// ========================================
const typeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'slide7' && mutation.target.classList.contains('active')) {
            startTyping();
        }
    });
});

const slide7 = document.getElementById('slide7');
if (slide7) {
    typeObserver.observe(slide7, { attributes: true, attributeFilter: ['class'] });
}

function startTyping() {
    const text = "Now Playing: 'Us'\n\nEvery road I take leads back to you. I don't want to navigate this life with anyone else.";
    const el = document.getElementById('typing-text');
    
    if (!el) return;
    
    el.textContent = '';
    let i = 0;
    let cursorVisible = true;
    
    // Cursor blink
    const cursorInterval = setInterval(() => {
        cursorVisible = !cursorVisible;
        if (i >= text.length) {
            el.textContent = text + (cursorVisible ? '█' : '');
        }
    }, 500);
    
    function type() {
        if (i < text.length) {
            el.textContent = text.substring(0, i + 1) + '█';
            i++;
            setTimeout(type, 50);
        } else {
            // Keep cursor blinking after typing is done
            setTimeout(() => clearInterval(cursorInterval), 5000);
        }
    }
    
    type();
}

// ========================================
// PARALLAX EFFECT ON MOUSE MOVE
// ========================================
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    
    // Apply subtle parallax to city layers
    const layer1 = document.querySelector('.layer-1');
    const layer2 = document.querySelector('.layer-2');
    const layer3 = document.querySelector('.layer-3');
    
    if (layer1) layer1.style.transform = `translateX(${mouseX * 10}px)`;
    if (layer2) layer2.style.transform = `translateX(${mouseX * 20}px)`;
    if (layer3) layer3.style.transform = `translateX(${mouseX * 30}px)`;
});

// ========================================
// KEYBOARD NAVIGATION
// ========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
    }
});

// ========================================
// TOUCH SWIPE NAVIGATION
// ========================================
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - go to next slide
            nextSlide();
        }
        // Swiped right - could go to previous slide if implemented
    }
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
// Reduce animations on low-end devices
function checkPerformance() {
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    if (isMobile || isLowEnd) {
        // Reduce particle count
        document.querySelectorAll('.particle').forEach((p, i) => {
            if (i % 2 === 0) p.remove();
        });
        
        // Simplify some animations
        document.documentElement.style.setProperty('--animation-complexity', 'reduced');
    }
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================
window.addEventListener('DOMContentLoaded', () => {
    // Create visual effects
    createParticles();
    enhanceRain();
    
    // Initialize speedometer
    updateSpeedometer(0);
    
    // Check device performance
    checkPerformance();
    
    // Add entrance animation to first slide
    setTimeout(() => {
        const firstSlide = document.getElementById('slide1');
        if (firstSlide) {
            firstSlide.style.animation = 'slideInFromLeft 1s ease-out';
        }
    }, 100);
    
    console.log('🚗 Midnight Drive initialized - Ready to roll!');
});

// ========================================
// WINDOW RESIZE HANDLER
// ========================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reinitialize particles on resize
        const particleContainer = document.querySelector('.particles');
        particleContainer.innerHTML = '';
        particles = [];
        createParticles();
        
        // Reinitialize rain
        const rainContainer = document.querySelector('.rain');
        const existingDrops = rainContainer.querySelectorAll('.raindrop');
        existingDrops.forEach(drop => drop.remove());
        enhanceRain();
    }, 250);
});

// ========================================
// VISIBILITY CHANGE - PAUSE ANIMATIONS
// ========================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause heavy animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});
