let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const progressFills = document.querySelectorAll('.progress-fill');
const totalSlides = slides.length;
let storyTimer;
const slideDuration = 5000; // 5 seconds per slide (except interactive ones)
let typingTimer = null;

function initProgress() {
    progressFills.forEach((fill, index) => {
        if (index < currentSlide) {
            fill.parentElement.classList.add('viewed');
            fill.style.width = '100%';
        } else {
            fill.parentElement.classList.remove('active', 'viewed');
            fill.style.width = '0%';
        }
    });
}

function showSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    // Reset No button
    if (noButton) {
        noButton.style.position = '';
        noButton.style.left = '';
        noButton.style.top = '';
    }

    // Clear previous timer and animations
    clearTimeout(storyTimer);
    clearTimeout(typingTimer);

    // Update active slide
    slides.forEach((s, i) => {
        s.classList.remove('active', 'prev');
        if (i === currentSlide && i !== index) {
            s.classList.add('prev');
        }
    });

    currentSlide = index;
    slides[currentSlide].classList.add('active');

    // Update progress bars
    progressFills.forEach((fill, i) => {
        fill.parentElement.classList.remove('active', 'viewed');
        if (i < currentSlide) {
            fill.parentElement.classList.add('viewed');
            fill.style.width = '100%';
        } else if (i === currentSlide) {
            fill.parentElement.classList.add('active');
            startProgress(fill, currentSlide);
        } else {
            fill.style.width = '0%';
        }
    });

    // Auto next slide logic
    // Slide 2 is index 1 (The Question) - STOP TIMER
    // Slide 7 is index 6 (The Message) - STOP TIMER so user can read
    const isInteractiveSlide = (index === 1 || index === 6);

    if (index < totalSlides - 1 && !isInteractiveSlide) {
        storyTimer = setTimeout(nextSlide, slideDuration);
    } else if (index === totalSlides - 1) {
        triggerFinalUX();
    }
}

function startProgress(fill, index) {
    let start = null;
    const isInteractive = (index === 1 || index === 6);

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;

        // On interactive slides, progress bar stays full or stops? 
        // Let's make it hit 100% and stay there.
        let percent;
        if (isInteractive) {
            percent = 100;
        } else {
            percent = Math.min((progress / slideDuration) * 100, 100);
        }

        if (currentSlide === index) {
            fill.style.width = percent + '%';
            if (!isInteractive && progress < slideDuration) {
                window.requestAnimationFrame(step);
            }
        }
    }
    window.requestAnimationFrame(step);
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

function triggerFinalUX() {
    console.log("End of Story.");
}

// Typing Effect for Message
function startTyping() {
    // Clear any existing typing timer to prevent overlap/double typing
    if (typingTimer) clearTimeout(typingTimer);

    const text = `Happy Valentine’s Day, my love 💞
I still can’t believe how someone who came into my life so quietly became the most special part of my days. In such a short time, you’ve made me feel happier, calmer, and more myself. Being with you feels easy and real, and that means a lot to me.
I love the way you think, the way you care, and the way you make even normal moments feel a little brighter. Thank you for choosing me and for being patient, kind, and so genuinely you.
I’m really grateful you’re my girlfriend.
Happy Valentine’s Day… I’m so happy it’s you. 💞`;
    const element = document.getElementById('typing-text');
    if (!element) return;

    let i = 0;
    element.innerHTML = "";

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            typingTimer = setTimeout(type, 50);
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

// Runaway "No" Button Logic (Proximity Evasion)
const noButton = document.getElementById('noButton');
const setupNoButton = () => {
    if (!noButton) return;

    const moveButton = () => {
        const padding = 60;
        const x = padding + Math.random() * (window.innerWidth - noButton.offsetWidth - padding * 2);
        const y = padding + Math.random() * (window.innerHeight - noButton.offsetHeight - padding * 2);
        noButton.style.position = 'fixed';
        noButton.style.left = x + 'px';
        noButton.style.top = y + 'px';
        noButton.style.zIndex = '1000';
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

        if (distance < 120) moveButton();
    });

    noButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveButton();
    });

    noButton.addEventListener('click', (e) => {
        e.preventDefault();
        moveButton();
    });
};

document.addEventListener('DOMContentLoaded', () => {
    showSlide(0);
    setupNoButton();

    document.querySelector('.tap-left').addEventListener('click', prevSlide);
    document.querySelector('.tap-right').addEventListener('click', nextSlide);

    const slide7 = document.getElementById('slide7');
    if (slide7) {
        messageObserver.observe(slide7, { attributes: true, attributeFilter: ['class'] });
    }

    // Hook up YES button for blast effect
    const yesBtn = document.querySelector('#slide2 .btn'); // The YES button
    if (yesBtn) {
        // Remove the inline onclick to handle it here, or just add a listener that runs first
        // The inline onclick="nextSlide()" runs. We want to add an effect THEN go next? 
        // Or just fire effect and let nextSlide happen.
        // Let's attach the effect listener.
        yesBtn.addEventListener('click', (e) => {
            createBlast(e.clientX, e.clientY);
            // Optional: delay next slide slightly to see effect? 
            // The current inline onclick is immediate. 
            // We can leave it as is, the effect will explode as the slide transitions out.
            // Actually, maybe we want to see it for a split second.
            // But 'nextSlide' changes the active class immediately. 
            // Let's try it as is first. The particles are fixed/absolute on body?
        });
    }
});

/* -----------------------------------------------------------
   BLAST / FLOWER EFFECT
----------------------------------------------------------- */
function createBlast(x, y) {
    const particleCount = 40;
    const colors = ['#ff4d6d', '#ffb3c1', '#ffffff', '#ff8fa3', '#c9184a'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        document.body.appendChild(particle);

        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5; // 5 to 15px

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // Physics variables
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 6 + 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let posX = x;
        let posY = y;
        let opacity = 1;

        // Animate
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
            // Gravity
            // vy += 0.2; 

            opacity = 1 - (elapsed / duration);

            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${opacity})`; // shrinkage

            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }
}
