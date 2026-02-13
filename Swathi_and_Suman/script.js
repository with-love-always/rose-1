// ===================================
// Confession Message
// ===================================
const confessionMessage = `Happy Valentine's Day, my love ❤️ Even if we're not officially celebrating it together this year, in my heart you are already my forever Valentine. Ever since 06.06.2020, the day our love story began, my world has never been the same. That day wasn't just a proposal — it was the moment my heart chose you, completely and without fear. Every time I think of you, my heart feels softer, calmer, and so full of love. You came into my life so quietly, yet you changed it in the most beautiful way.

I imagine next year's Valentine's Day with you — standing beside you, holding your hand, looking into your eyes, and finally celebrating our love as a real couple. From 06.06.2020 to forever, every feeling I have for you has only grown deeper and stronger. Until that day comes, I'll keep loving you silently, purely, and endlessly. You are not just someone I care about… you are the person my heart chose on that special day, and will keep choosing every single day of my life. I can't wait for the moment I get to call you mine in every possible way. 💞✨`;

// ===================================
// Text Variations for Each Section
// ===================================
const textVariations = {
    greenLight: [
        "Every signal turned green<br>the moment you smiled.",
        "No red lights between us —<br>only the quiet permission of love.",
        "The universe whispered 'go'<br>when I found you."
    ],
    cruising: [
        "We move like a song<br>the world was waiting to hear.",
        "Side by side,<br>even silence feels like music.",
        "With you,<br>every mile feels like a memory in the making."
    ],
    gps: [
        "I was lost —<br>until my heart learned your direction.",
        "No more rerouting.<br>I've arrived where I belong.",
        "The map redraws itself<br>whenever it leads to you."
    ]
};

let currentIndices = {
    greenLight: 0,
    cruising: 0,
    gps: 0
};

// ===================================
// Particle System
// ===================================
function createParticle() {
    const particles = document.getElementById('particles');
    const particle = document.createElement('div');
    particle.className = 'particle';

    const symbols = ['❤️', '💕', '✨', '💖', '🌟', '💫'];
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';

    particles.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 10000);
}

function initParticles() {
    setInterval(createParticle, 800);
}

// ===================================
// Chapter Navigation State
// ===================================
const chapters = ['landing', 'greenLight', 'timeline', 'cruising', 'gps', 'photo', 'confession'];
let currentChapter = 0;

function updateChapterIndicator() {
    // Chapter indicator removed for cleaner mobile UI
}

function navigateToChapter(chapterIndex) {
    if (chapterIndex < 0 || chapterIndex >= chapters.length) return;

    // Hide current chapter
    const currentSection = document.getElementById(chapters[currentChapter]);
    if (currentSection) {
        currentSection.classList.remove('active');
    }

    // Update current chapter
    currentChapter = chapterIndex;

    // Show new chapter
    const newSection = document.getElementById(chapters[currentChapter]);
    if (newSection) {
        newSection.classList.add('active');

        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Update chapter indicator
    updateChapterIndicator();

    // Trigger chapter-specific animations
    triggerChapterAnimations(chapters[currentChapter]);
}

function setupChapterNavigation() {
    // Setup Next Chapter buttons
    document.querySelectorAll('.next-chapter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextChapterId = btn.getAttribute('data-next');
            const nextIndex = chapters.indexOf(nextChapterId);
            if (nextIndex !== -1) {
                navigateToChapter(nextIndex);
            }
        });
    });

    // Initialize first chapter
    navigateToChapter(0);
}

function triggerChapterAnimations(chapterId) {
    switch (chapterId) {
        case 'greenLight':
            // Trigger traffic light sequence
            sequenceTrafficLights();
            break;
        case 'gps':
            // Trigger GPS route animation (heart-shaped path)
            const routePath = document.getElementById('routePath');
            if (routePath) {
                routePath.style.strokeDashoffset = '600';
                setTimeout(() => {
                    routePath.style.transition = 'stroke-dashoffset 3s ease-in-out';
                    routePath.style.strokeDashoffset = '0';

                    setTimeout(() => {
                        const gpsStatus = document.getElementById('gpsStatus');
                        if (gpsStatus) {
                            gpsStatus.textContent = 'Arrived at Destination ❤️';
                            gpsStatus.style.color = '#10B981';
                        }
                    }, 3000);
                }, 100);
            }
            break;
        case 'confession':
            // Trigger typewriter confession animation
            typewriterConfession();
            break;
        case 'timeline':
            // Setup scroll-based timeline animations
            setupTimelineScrollAnimations();
            break;
    }
}

// ===================================
// Timeline Scroll Animations (Mobile)
// ===================================
function setupTimelineScrollAnimations() {
    const timelineSection = document.querySelector('.timeline-section');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (!timelineSection || timelineItems.length === 0) return;

    // Reset all items to hidden
    timelineItems.forEach(item => {
        item.classList.remove('visible');
    });

    // Create intersection observer for scroll-based reveal
    const observerOptions = {
        root: timelineSection,
        threshold: 0.3,
        rootMargin: '-50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe each timeline item
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
}

// ===================================
// Text Cycling
// ===================================
function setupTextCycling(elementId, sectionKey) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.parentElement.addEventListener('click', () => {
        currentIndices[sectionKey] = (currentIndices[sectionKey] + 1) % textVariations[sectionKey].length;

        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        setTimeout(() => {
            element.innerHTML = textVariations[sectionKey][currentIndices[sectionKey]];
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 300);
    });

    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
}

// ===================================
// Typewriter Effect
// ===================================
function typewriterEffect(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ===================================
// GPS Route Animation
// ===================================
function animateRoute() {
    const routePath = document.getElementById('routePath');
    const gpsStatus = document.getElementById('gpsStatus');

    if (!routePath) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                routePath.style.transition = 'stroke-dashoffset 3s ease-in-out';
                routePath.style.strokeDashoffset = '0';

                setTimeout(() => {
                    gpsStatus.textContent = 'Arrived at Destination ❤️';
                    gpsStatus.style.color = '#10B981';
                }, 3000);

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.gps-section'));
}

// ===================================
// Typewriter Confession Effect
// ===================================
function typewriterConfession() {
    const confessionElement = document.getElementById('confessionText');
    if (!confessionElement) return;

    // Check if already typed (trim to ignore whitespace)
    if (confessionElement.textContent.trim().length > 0) return;

    // Full confession text
    const fullText = confessionMessage;
    let charIndex = 0;

    confessionElement.textContent = '';
    confessionElement.style.whiteSpace = 'pre-wrap';

    function typeChar() {
        if (charIndex < fullText.length) {
            confessionElement.textContent += fullText.charAt(charIndex);
            charIndex++;

            // Variable speed: slower for better readability
            let delay = 50; // Base speed (was 30ms)
            if (fullText.charAt(charIndex - 1) === ' ') {
                delay = 20; // Spaces (was 10ms)
            } else if (['.', '!', '?', '…'].includes(fullText.charAt(charIndex - 1))) {
                delay = 400; // Long pause at sentence end (was 200ms)
            } else if ([',', ';', ':'].includes(fullText.charAt(charIndex - 1))) {
                delay = 150; // Medium pause (was 100ms)
            }

            setTimeout(typeChar, delay);
        }
    }

    // Start typing after a brief delay
    setTimeout(typeChar, 500);
}

// ===================================
// Smooth Scroll (Legacy - kept for compatibility)
// ===================================
function setupSmoothScroll() {
    // No longer needed with chapter navigation
}

// ===================================
// Subtitle Toggle
// ===================================
function setupSubtitleToggle() {
    const subtitle = document.getElementById('subtitle');
    const alternatives = [
        "Will you walk this journey with me?",
        "Of all the places in the world,<br>my heart keeps choosing you."
    ];
    let currentSubtitle = 0;

    if (subtitle) {
        subtitle.addEventListener('click', () => {
            currentSubtitle = (currentSubtitle + 1) % alternatives.length;
            subtitle.style.opacity = '0';

            setTimeout(() => {
                subtitle.innerHTML = alternatives[currentSubtitle];
                subtitle.style.opacity = '1';
            }, 300);
        });

        subtitle.style.transition = 'opacity 0.3s ease';
    }
}

// ===================================
// Initialize Everything
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize chapter navigation (FIRST!)
    setupChapterNavigation();

    // Initialize particles
    initParticles();

    // Initialize scroll animations
    // initScrollAnimations(); // Removed as timeline animations are now chapter-triggered

    // Setup text cycling for each section
    setupTextCycling('greenLightText', 'greenLight');
    setupTextCycling('cruisingText', 'cruising');
    setupTextCycling('gpsText', 'gps');

    // Setup subtitle toggle
    setupSubtitleToggle();
});

// ===================================
// Traffic Light Sequence
// ===================================
function sequenceTrafficLights() {
    const lights = {
        red: document.querySelector('.light.red'),
        yellow: document.querySelector('.light.yellow'),
        green: document.querySelector('.light.green')
    };

    // Reset all lights
    Object.values(lights).forEach(light => {
        if (light) light.classList.remove('active');
    });

    // 1. Red Light (0s - 0.5s)
    if (lights.red) lights.red.classList.add('active');

    // 2. Yellow Light (0.5s - 1.0s)
    setTimeout(() => {
        if (lights.red) lights.red.classList.remove('active');
        if (lights.yellow) lights.yellow.classList.add('active');
    }, 500);

    // 3. Green Light (1.0s onwards)
    setTimeout(() => {
        if (lights.yellow) lights.yellow.classList.remove('active');
        if (lights.green) lights.green.classList.add('active');
    }, 1000);
}

// ===================================
// Traffic Light Sequence
// ===================================
function sequenceTrafficLights() {
    const lights = {
        red: document.querySelector('.light.red'),
        yellow: document.querySelector('.light.yellow'),
        green: document.querySelector('.light.green')
    };

    // Reset all lights
    Object.values(lights).forEach(light => {
        if (light) light.classList.remove('active');
    });

    // 1. Red Light (0s - 0.5s)
    if (lights.red) lights.red.classList.add('active');

    // 2. Yellow Light (0.5s - 1.0s)
    setTimeout(() => {
        if (lights.red) lights.red.classList.remove('active');
        if (lights.yellow) lights.yellow.classList.add('active');
    }, 500);

    // 3. Green Light (1.0s onwards)
    setTimeout(() => {
        if (lights.yellow) lights.yellow.classList.remove('active');
        if (lights.green) lights.green.classList.add('active');
    }, 1000);
}

// ===================================
// Additional Sparkle Effect for Final Section
// ===================================
function createSparkle() {
    const finalSection = document.querySelector('.final-destination');
    if (!finalSection) return;

    const sparkle = document.createElement('div');
    sparkle.style.position = 'absolute';
    sparkle.style.width = '4px';
    sparkle.style.height = '4px';
    sparkle.style.background = '#FFC0CB';
    sparkle.style.borderRadius = '50%';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.animation = 'sparkleAnim 1.5s ease-out forwards';

    finalSection.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1500);
}

// Add sparkle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleAnim {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        50% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Create sparkles periodically in final section
setInterval(() => {
    if (window.scrollY > document.documentElement.scrollHeight - window.innerHeight - 500) {
        createSparkle();
    }
}, 300);
