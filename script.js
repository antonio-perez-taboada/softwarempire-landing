// ================================
// CONTENT PROTECTION
// ================================
(function() {
  // Show custom notification
  const showProtectionNotification = (message) => {
    // Check if notification already exists
    let notification = document.querySelector('.protection-notification');

    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'protection-notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00d4ff, #8b5cf6);
        color: #0a0a12;
        padding: 16px 24px;
        border-radius: 8px;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 4px 24px rgba(0, 212, 255, 0.5);
        animation: slideInRight 0.3s ease-out;
        pointer-events: none;
      `;
      document.body.appendChild(notification);

      // Add animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    notification.textContent = message;
    notification.style.animation = 'slideInRight 0.3s ease-out';

    // Remove after 2 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  };

  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showProtectionNotification('🔒 Contenido protegido');
    return false;
  });

  // Disable specific keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (DevTools shortcuts)
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
      return false;
    }

    // Disable Ctrl+S (Save page)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      return false;
    }

    // Disable Ctrl+P (Print) - optional, comment out if you want to allow printing
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      return false;
    }
  });

  // Disable text selection via keyboard (Ctrl+A)
  document.addEventListener('keydown', (e) => {
    // Allow Ctrl+A only in input fields, textareas, and editable elements
    const allowedElements = ['INPUT', 'TEXTAREA'];
    const isEditable = e.target.isContentEditable;

    if (e.ctrlKey && e.key === 'a' && !allowedElements.includes(e.target.tagName) && !isEditable) {
      e.preventDefault();
      return false;
    }
  });

  // Prevent dragging images
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });

  // Detect DevTools opening (basic detection)
  const detectDevTools = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    if (widthThreshold || heightThreshold) {
      // DevTools might be open - you could add custom behavior here
      // For now, we just detect it silently
      console.clear();
    }
  };

  // Check periodically
  setInterval(detectDevTools, 1000);

  // Disable copy event on specific elements
  document.addEventListener('copy', (e) => {
    const allowedElements = ['INPUT', 'TEXTAREA'];
    const allowedClasses = ['footer-link', 'pricing-price', 'form-input', 'form-textarea'];

    const isAllowedElement = allowedElements.includes(e.target.tagName);
    const isAllowedClass = allowedClasses.some(className => e.target.classList.contains(className));

    if (!isAllowedElement && !isAllowedClass) {
      e.preventDefault();
      return false;
    }
  });
})();

// ================================
// DARK READER BLOCKER
// ================================
(function() {
  // Detect and remove Dark Reader elements
  const removeDarkReaderElements = () => {
    // Remove Dark Reader injected styles
    const darkReaderStyles = document.querySelectorAll('style[class*="darkreader"], style[id*="dark-reader"]');
    darkReaderStyles.forEach(style => style.remove());

    // Remove Dark Reader meta tags injected dynamically
    const darkReaderMeta = document.querySelectorAll('meta[name*="darkreader"]');
    darkReaderMeta.forEach(meta => {
      if (meta.getAttribute('name') !== 'darkreader' || meta.getAttribute('content') !== 'NO-DARKREADER-PLUGIN') {
        meta.remove();
      }
    });

    // Remove data attributes added by Dark Reader
    document.querySelectorAll('[data-darkreader-inline-bgcolor], [data-darkreader-inline-color]').forEach(el => {
      el.removeAttribute('data-darkreader-inline-bgcolor');
      el.removeAttribute('data-darkreader-inline-color');
      el.removeAttribute('data-darkreader-inline-border');
      el.removeAttribute('data-darkreader-inline-boxshadow');
    });
  };

  // Run immediately
  removeDarkReaderElements();

  // Watch for DOM changes and remove Dark Reader injections
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'STYLE' &&
              (node.className?.includes('darkreader') || node.id?.includes('dark-reader'))) {
            node.remove();
          }
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-darkreader-inline-bgcolor', 'data-darkreader-inline-color']
  });

  // Prevent Dark Reader from running by checking for its presence
  setInterval(removeDarkReaderElements, 500);
})();

// ================================
// MOBILE MENU TOGGLE
// ================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu .nav-link');

if (mobileMenuToggle && mobileMenuOverlay) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking overlay
  mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
      mobileMenuToggle.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
      mobileMenuToggle.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ================================
// COUNTER ANIMATION
// ================================
const animateCounter = (element) => {
  const target = parseInt(element.dataset.target);
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
};

// Trigger counters when hero section is visible
const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px'
};

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = document.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        if (counter.textContent === '0') {
          animateCounter(counter);
        }
      });
      heroObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroObserver.observe(heroSection);
}

// ================================
// SMOOTH SCROLL
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      const navHeight = document.querySelector('.nav').offsetHeight;
      const targetPosition = target.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ================================
// PARALLAX EFFECT ON SCROLL
// ================================
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Parallax for cube
  const cube = document.querySelector('.cube');
  if (cube) {
    const parallaxSpeed = scrollY * 0.5;
    cube.style.transform = `rotateX(${parallaxSpeed}deg) rotateY(${parallaxSpeed}deg)`;
  }

  // Nav background opacity
  const nav = document.querySelector('.nav');
  if (nav) {
    const opacity = Math.min(scrollY / 300, 1);
    nav.style.background = `rgba(0, 0, 0, ${0.8 + (opacity * 0.2)})`;
  }

  lastScrollY = scrollY;
});

// ================================
// SERVICE CARDS TILT EFFECT (Desktop only)
// ================================
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// ================================
// PORTFOLIO ITEMS HOVER EFFECT (Desktop only)
// ================================
if (!isTouchDevice) {
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  portfolioItems.forEach(item => {
    const image = item.querySelector('.image-placeholder');

    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const moveX = (x / rect.width - 0.5) * 20;
      const moveY = (y / rect.height - 0.5) * 20;

      if (image) {
        image.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
      }
    });

    item.addEventListener('mouseleave', () => {
      if (image) {
        image.style.transform = 'scale(1) translate(0, 0)';
      }
    });
  });
}

// Touch interaction for portfolio (mobile)
if (isTouchDevice) {
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  portfolioItems.forEach(item => {
    item.addEventListener('touchstart', () => {
      const overlay = item.querySelector('.portfolio-overlay');
      if (overlay) {
        overlay.style.opacity = '1';
      }
    });

    item.addEventListener('touchend', () => {
      setTimeout(() => {
        const overlay = item.querySelector('.portfolio-overlay');
        if (overlay) {
          overlay.style.opacity = '0';
        }
      }, 1500);
    });
  });
}

// ================================
// PRICING CARDS PULSE ON HOVER
// ================================
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    const priceAmount = card.querySelector('.price-amount');
    if (priceAmount) {
      priceAmount.style.animation = 'none';
      setTimeout(() => {
        priceAmount.style.animation = 'pulse 0.5s ease-in-out';
      }, 10);
    }
  });
});

// ================================
// FORM VALIDATION & SUBMIT
// ================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector('.btn-primary');
    const originalText = submitButton.querySelector('.btn-text').textContent;

    // Animate button
    submitButton.querySelector('.btn-text').textContent = 'Enviando...';
    submitButton.style.opacity = '0.7';
    submitButton.style.pointerEvents = 'none';

    // Simulate form submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Success state
    submitButton.querySelector('.btn-text').textContent = '¡Enviado! ✓';
    submitButton.style.background = 'linear-gradient(135deg, #00ffcc, #00cc99)';

    setTimeout(() => {
      submitButton.querySelector('.btn-text').textContent = originalText;
      submitButton.style.opacity = '1';
      submitButton.style.pointerEvents = 'auto';
      submitButton.style.background = '';
      contactForm.reset();
    }, 3000);
  });

  // Input focus effects
  const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');

  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', () => {
      input.style.transform = 'scale(1)';
    });
  });
}

// ================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ================================
const scrollAnimationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
);

// Observe all animated elements
const animatedElements = document.querySelectorAll(
  '.service-card, .portfolio-item, .pricing-card, .section-header'
);

animatedElements.forEach(el => {
  scrollAnimationObserver.observe(el);
});

// ================================
// CURSOR GLOW EFFECT (Desktop only, non-touch)
// ================================
const createCursorGlow = () => {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 255, 204, 0.15), transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
};

// Only add cursor glow on desktop non-touch devices
if (!isTouchDevice && window.innerWidth > 1024) {
  createCursorGlow();
}

// ================================
// BUTTON RIPPLE EFFECT
// ================================
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
    `;

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ================================
// GRADIENT TITLE ANIMATION
// ================================
const titleGradient = document.querySelector('.title-gradient');

if (titleGradient) {
  let hue = 0;

  setInterval(() => {
    hue = (hue + 1) % 360;
    const color1 = `hsl(${hue}, 100%, 50%)`;
    const color2 = `hsl(${(hue + 60) % 360}, 100%, 50%)`;
    titleGradient.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
    titleGradient.style.webkitBackgroundClip = 'text';
    titleGradient.style.backgroundClip = 'text';
  }, 50);
}

// ================================
// NAVBAR HIDE ON SCROLL DOWN
// ================================
let lastScroll = 0;
const navbar = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll > lastScroll && currentScroll > 100) {
    // Scrolling down
    navbar.style.transform = 'translateY(-100%)';
  } else {
    // Scrolling up
    navbar.style.transform = 'translateY(0)';
  }

  lastScroll = currentScroll;
});

// ================================
// SECTION REVEAL ON SCROLL
// ================================
const sections = document.querySelectorAll('section');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInView 0.8s ease-out forwards';
      }
    });
  },
  {
    threshold: 0.15
  }
);

sections.forEach(section => {
  sectionObserver.observe(section);
});

// ================================
// LAZY LOAD OPTIMIZATION
// ================================
if ('IntersectionObserver' in window) {
  const lazyElements = document.querySelectorAll('[data-lazy]');

  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        element.classList.add('loaded');
        lazyObserver.unobserve(element);
      }
    });
  });

  lazyElements.forEach(el => lazyObserver.observe(el));
}

// ================================
// PERFORMANCE MONITORING
// ================================
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd -
                     window.performance.timing.navigationStart;
    console.log(`⚡ Page loaded in ${loadTime}ms`);
  });
}

// ================================
// EASTER EGG: KONAMI CODE
// ================================
let konamiCode = [];
const konamiSequence = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join('') === konamiSequence.join('')) {
    document.body.style.animation = 'rainbow 2s linear infinite';

    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      document.body.style.animation = '';
    }, 5000);
  }
});

// ================================
// CONSOLE MESSAGE
// ================================
console.log(
  '%c🚀 SOFTWARE EMPIRE',
  'font-size: 40px; font-weight: bold; background: linear-gradient(135deg, #00d4ff, #8b5cf6); -webkit-background-clip: text; color: transparent;'
);
console.log(
  '%c¿Buscas desarrolladores? Escríbenos a hola@softwarempire.com',
  'font-size: 14px; color: #00d4ff;'
);
