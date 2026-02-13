let currentSlide = 1;
const totalSlides = 8;

function nextSlide() {
    if (currentSlide < totalSlides) {
        // Reset "No" button if it moved
        const noBtn = document.getElementById('noButton');
        if (noBtn) {
            noBtn.style.position = '';
            noBtn.style.left = '';
            noBtn.style.top = '';
        }

        document.getElementById(`slide${currentSlide}`).classList.add('prev');
        document.getElementById(`slide${currentSlide}`).classList.remove('active');
        currentSlide++;
        document.getElementById(`slide${currentSlide}`).classList.add('active');
    }
}

// Typing Effect for Message
function startTyping() {
    const text = "There's something magical about you that makes my heart smile every time. Your laugh, your touch, the way you light up my world—I'm so grateful you're mine. I love you endlessly.";
    const element = document.getElementById('typing-text');
    if (!element) return;

    let i = 0;
    element.innerHTML = "";

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }
    type();
}

// Observer for Slide 7
const messageObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'slide7' && mutation.target.classList.contains('active')) {
            startTyping();
        }
    });
});

function goToStart() {
    // Non-looping for better UX
    console.log("UX: Staying at finale.");
}

// Create Floating Elements
function createFloatingElements() {
    const bgElements = document.getElementById('bgElements');
    if (!bgElements) return;

    const elements = ['♥', '☁', '❤', '☁', '♡'];

    for (let i = 0; i < 20; i++) {
        const el = document.createElement('div');
        el.className = 'heart';
        el.innerHTML = elements[Math.floor(Math.random() * elements.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.animationDuration = (Math.random() * 5 + 5) + 's';
        el.style.animationDelay = Math.random() * 10 + 's';
        el.style.fontSize = (Math.random() * 20 + 20) + 'px';
        bgElements.appendChild(el);
    }
}

// Runaway "No" Button Logic (Proximity Evasion)
const noButton = document.getElementById('noButton');
if (noButton) {
    const moveButton = (e) => {
        const padding = 60;
        const x = padding + Math.random() * (window.innerWidth - noButton.offsetWidth - padding * 2);
        const y = padding + Math.random() * (window.innerHeight - noButton.offsetHeight - padding * 2);

        noButton.style.position = 'fixed';
        noButton.style.left = `${x}px`;
        noButton.style.top = `${y}px`;
        noButton.style.zIndex = '9999';
    };

    document.addEventListener('mousemove', (e) => {
        if (!noButton.closest('.slide').classList.contains('active')) return;

        const rect = noButton.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
            Math.pow(e.clientX - buttonCenterX, 2) +
            Math.pow(e.clientY - buttonCenterY, 2)
        );

        if (distance < 120) {
            moveButton();
        }
    });

    noButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveButton();
    });

    noButton.addEventListener('click', (e) => {
        e.preventDefault();
        moveButton();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createFloatingElements();
    if (slide7) {
        messageObserver.observe(slide7, { attributes: true, attributeFilter: ['class'] });
    }

    // Hook up YES button for blast effect in Slide 2
    const yesBtn = document.querySelector('#slide2 .btn');
    if (yesBtn) {
        yesBtn.addEventListener('click', (e) => {
            createBlast(e.clientX, e.clientY);
        });
    }
});

/* -----------------------------------------------------------
   BLAST / FLOWER EFFECT
----------------------------------------------------------- */
function createBlast(x, y) {
    const particleCount = 40;
    const colors = ['#E6E6FA', '#ffffff', '#ffd1dc', '#ffb6c1']; // Cloud9 Theme Colors

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        document.body.appendChild(particle);

        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 6 + 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let posX = x;
        let posY = y;
        let opacity = 1;

        const duration = 1000 + Math.random() * 500;
        const start = Date.now();

        function animate() {
            const elapsed = Date.now() - start;
            if (elapsed > duration) {
                particle.remove();
                return;
            }
            posX += vx;
            posY += vy;
            opacity = 1 - (elapsed / duration);

            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${opacity})`;

            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }
}
