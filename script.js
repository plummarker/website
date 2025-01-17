// Initialize AOS with optimized settings
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: false, // Changed to false to allow re-animation
    offset: 50,
    disable: 'mobile',
    startEvent: 'load'
  });

  initBackgroundAnimations();

  // Defer particle animation start
  setTimeout(() => {
    startParticles();
  }, 1000);

  initializeNavigation();
  initializeNumberAnimations();
});

// Initialize background animations
function initBackgroundAnimations() {
  const backgroundContainer = document.createElement('div');
  backgroundContainer.className = 'background-animations';
  document.body.appendChild(backgroundContainer);

  // Add gradient wave
  const gradientWave = document.createElement('div');
  gradientWave.className = 'gradient-wave';
  backgroundContainer.appendChild(gradientWave);

  // Add floating shapes
  const shapes = ['diamond', 'circle', 'square'];
  const numShapes = 15;

  for (let i = 0; i < numShapes; i++) {
    const shape = document.createElement('div');
    shape.className = `floating-shape ${shapes[i % shapes.length]}`;
    shape.style.left = `${Math.random() * 100}vw`;
    shape.style.top = `${Math.random() * 100}vh`;
    shape.style.animationDelay = `${Math.random() * 20}s`;
    backgroundContainer.appendChild(shape);
  }
}

// Enhance existing particle system
function createParticle() {
  const particles = document.querySelector('.minecraft-particles');
  if (!particles) return;
  
  const particle = document.createElement('div');
  particle.classList.add('particle');
  
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;
  const hue = Math.random() * 360;
  
  particle.style.cssText = `
    left: ${startX}px;
    top: ${startY}px;
    background: hsla(${hue}, 70%, 50%, 0.6);
    transform-origin: center;
    animation-delay: ${Math.random() * 2}s;
  `;
  
  particles.appendChild(particle);
  
  // Remove particle after animation
  setTimeout(() => particle.remove(), 2000);
}

// Update particle creation frequency
function startParticles() {
  // Create particles more frequently
  setInterval(createParticle, 400);
  // Create initial batch of particles
  for (let i = 0; i < 20; i++) {
    createParticle();
  }
}

// Initialize navigation functionality
function initializeNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');
  const body = document.body;

  if (!navToggle || !navMenu || !navOverlay) return;

  const toggleNav = () => body.classList.toggle('nav-open');
  navToggle.addEventListener('click', toggleNav);
  navOverlay.addEventListener('click', toggleNav);

  // Page navigation
  const navLinks = document.querySelectorAll('.nav-menu a');
  const pageSections = document.querySelectorAll('.page-section');

  function showPage(pageId) {
    pageSections.forEach(section => {
      if (section.id === pageId) {
        section.classList.add('active');
        // Initialize AOS animations for newly visible section
        const aosElements = section.querySelectorAll('[data-aos]');
        aosElements.forEach(element => {
          element.classList.remove('aos-animate');
          element.setAttribute('data-aos-delay', '0');
        });
        // Refresh AOS for newly visible elements
        setTimeout(() => {
          AOS.refresh();
          aosElements.forEach(element => {
            element.classList.add('aos-animate');
          });
        }, 100);
      } else {
        section.classList.remove('active');
        // Reset animations for hidden sections
        const aosElements = section.querySelectorAll('[data-aos]');
        aosElements.forEach(element => {
          element.classList.remove('aos-animate');
        });
      }
    });
    
    body.classList.remove('nav-open');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = link.getAttribute('href').substring(1);
      showPage(pageId);
    });
  });

  // Show home page initially with animations
  showPage('home');
}

// Initialize number animations
function initializeNumberAnimations() {
  function animateValue(element, start, end, duration) {
    if (!element) return;
    
    const step = (timestamp) => {
      if (!element.startTimestamp) element.startTimestamp = timestamp;
      const progress = Math.min((timestamp - element.startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      element.textContent = currentValue.toLocaleString() + "+";  // Add "+" symbol
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const finalValue = parseInt(element.getAttribute('data-count'));
        if (!element.hasAnimated) {
          element.hasAnimated = true;
          animateValue(element, 0, finalValue, 2000);
        }
        observer.unobserve(element);
      }
    });
  }, {
    threshold: 0.5
  });

  document.querySelectorAll('.achievement-number').forEach(element => {
    observer.observe(element);
  });
}