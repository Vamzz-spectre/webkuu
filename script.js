// ===== DOM ELEMENTS =====
const preloader = document.getElementById('preloader');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.querySelector('.nav-links');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const typingText = document.getElementById('typingText');
const contactForm = document.getElementById('contactForm');
const categoryBtns = document.querySelectorAll('.category-btn');
const skillCards = document.querySelectorAll('.skill-card');
const filterBtns = document.querySelectorAll('.filter-btn');

// ===== MOBILE DETECTION =====
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// ===== TOUCH SUPPORT =====
document.addEventListener('touchstart', function() {}, true);

// ===== FIX VIEWPORT ON MOBILE =====
function fixViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        if (isMobile()) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
        }
    }
}

// ===== THEME MANAGEMENT =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use saved theme or system preference
    const theme = savedTheme === 'system' ? (prefersDark ? 'dark' : 'light') : savedTheme;
    
    document.documentElement.setAttribute('data-theme', theme);
    
    if (theme === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    showToast(`Theme changed to ${newTheme} mode`, 'info');
}

// ===== PRELOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.style.overflow = 'auto';
    }, 10);
});

// Prevent scroll during loading
document.body.style.overflow = 'hidden';

// ===== TYPING EFFECT (Optimized for Mobile) =====
const roles = [
    "Full Stack Developer",
    "Bot Creator",
    "UI/UX Designer",
    "Problem Solver",
    "Tech Enthusiast"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isPaused = false;

function typeRole() {
    if (isPaused) return;
    
    const currentRole = roles[roleIndex];
    
    if (!isDeleting && charIndex <= currentRole.length) {
        typingText.textContent = currentRole.substring(0, charIndex);
        charIndex++;
        setTimeout(typeRole, isMobile() ? 80 : 100);
    } else if (isDeleting && charIndex >= 0) {
        typingText.textContent = currentRole.substring(0, charIndex);
        charIndex--;
        setTimeout(typeRole, isMobile() ? 40 : 50);
    } else {
        isDeleting = !isDeleting;
        
        if (!isDeleting) {
            roleIndex = (roleIndex + 1) % roles.length;
        }
        
        setTimeout(typeRole, isDeleting ? 800 : 400);
    }
}

// ===== NAVIGATION (Mobile Optimized) =====
function initNavigation() {
    // Mobile menu toggle with better touch support
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinksContainer.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.innerHTML = navLinksContainer.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Close mobile menu when clicking on link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                navLinksContainer.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = 'auto';
                
                // Smooth scroll to section
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinksContainer.classList.contains('active') && 
            !navLinksContainer.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navLinksContainer.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Active link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    function setActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}` || (href === '#home' && !current)) {
                link.classList.add('active');
            }
        });
    }
    
    // Throttle scroll event for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
                setActiveLink();
                
                // Back to top button
                if (window.scrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            }, 50);
        }
    });
}

// ===== BACK TO TOP (Mobile Optimized) =====
function initBackToTop() {
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== SKILLS FILTERING (Touch Friendly) =====
function initSkillsFilter() {
    categoryBtns.forEach(btn => {
        // Add touch support
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            filterSkills(btn);
        });
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            filterSkills(btn);
        });
    });
    
    function filterSkills(btn) {
        // Remove active class from all buttons
        categoryBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-category');
        
        // Filter skill cards with animation
        skillCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Scroll skills into view on mobile
        if (window.innerWidth <= 768) {
            document.getElementById('skills').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// ===== PROJECTS FILTERING =====
function initProjectsFilter() {
    const projects = [
        {
            title: "Money Tracker",
            category: "web",
            description: "Website Pencatat Uang Anda Dengan Berbagai Fitur Menarik.",
            tags: ["Html5", "Css","JavaScript""],
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            demo: "catat-pengeluaranmu-seven.vercel.app",
            code: " https://github.com/Vamzz-spectre/Web-tracker"
        },
        {
            title: "WhatsApp Business Bot",
            category: "bot",
            description: "AI-powered WhatsApp bot for customer service automation",
            tags: ["Node.js", "Baileys", "MongoDB", "AI"],
            image: "https://images.unsplash.com/photo-1611605698323-7a5c8f8b6b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            demo: "#",
            code: "#"
        },
        {
            title: "REST API Service",
            category: "api",
            description: "Scalable REST API with authentication and documentation",
            tags: ["Express", "JWT", "Swagger", "Redis"],
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            demo: "#",
            code: "#"
        },
        {
            title: "Mobile Task Manager",
            category: "mobile",
            description: "Cross-platform task management app with real-time sync",
            tags: ["React Native", "Firebase", "Redux", "Push Notifications"],
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            demo: "#",
            code: "#"
        },
        {
            title: "Admin Dashboard",
            category: "web",
            description: "Analytics dashboard with charts, tables, and user management",
            tags: ["Vue.js", "Chart.js", "Bootstrap", "API"],
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            demo: "#",
            code: "#"
        },
        {
            title: "Telegram Bot Store",
            category: "bot",
            description: "Marketplace for Telegram bots with payment integration",
            tags: ["Python", "Telegram API", "Stripe", "PostgreSQL"],
            image: "https://images.unsplash.com/photo-1611605698323-7a5c8f8b6b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            demo: "#",
            code: "#"
        }
    ];
    
    const projectsGrid = document.querySelector('.projects-grid');
    
    // Render projects
    function renderProjects(filter = 'all') {
        projectsGrid.innerHTML = '';
        
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(project => project.category === filter);
        
        filteredProjects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.style.animationDelay = `${index * 100}ms`;
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                    <div class="project-overlay">
                        <a href="${project.demo}" class="btn btn-primary" target="_blank">View Demo</a>
                    </div>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.demo}" class="project-link" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                        <a href="${project.code}" class="project-link" target="_blank">
                            <i class="fab fa-github"></i> Source Code
                        </a>
                    </div>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });
    }
    
    // Initialize with all projects
    renderProjects();
    
    // Add filter functionality with touch support
    filterBtns.forEach(btn => {
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            filterProjects(btn);
        });
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            filterProjects(btn);
        });
    });
    
    function filterProjects(btn) {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        renderProjects(filter);
    }
}

// ===== FORM HANDLING (Mobile Optimized) =====
function initContactForm() {
    // Add inputmode attributes for better mobile keyboard
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    if (nameInput) nameInput.setAttribute('inputmode', 'text');
    if (emailInput) emailInput.setAttribute('inputmode', 'email');
    if (subjectInput) subjectInput.setAttribute('inputmode', 'text');
    if (messageInput) messageInput.setAttribute('inputmode', 'text');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            subject: subjectInput.value,
            message: messageInput.value
        };
        
        // Simple validation
        if (!formData.name || !formData.email || !formData.message) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        if (!isValidEmail(formData.email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success
            showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
        } catch (error) {
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== TOAST NOTIFICATIONS (Mobile Friendly) =====
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => {
        toast.remove();
    });
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove after 4 seconds
    const autoRemove = setTimeout(() => {
        hideToast(toast);
    }, 4000);
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        hideToast(toast);
    });
    
    // Also close on tap for mobile
    toast.addEventListener('touchstart', () => {
        clearTimeout(autoRemove);
        hideToast(toast);
    });
    
    // Function to hide toast
    function hideToast(toastElement) {
        toastElement.classList.remove('show');
        setTimeout(() => {
            if (toastElement.parentElement) {
                toastElement.parentElement.removeChild(toastElement);
            }
        }, 300);
    }
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        default: return 'info-circle';
    }
}

// ===== DOWNLOAD CV (Mobile Optimized) =====
function downloadCV() {
    showToast('Preparing CV download...', 'info');
    
    // Create a dummy PDF download
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'Fahmi_Nur_Fitrianto_CV.pdf';
        link.click();
        
        showToast('CV download started!', 'success');
    }, 1000);
}

// ===== ANIMATIONS ON SCROLL (Performance Optimized) =====
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.skill-card, .project-card, .summary-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== MOBILE-SPECIFIC FIXES =====
function applyMobileFixes() {
    if (!isMobile()) return;
    
    // Fix 100vh issue on mobile
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    
    // Prevent zoom on input focus
    document.addEventListener('focusin', (e) => {
        if (e.target.matches('input, textarea, select')) {
            setTimeout(() => {
                e.target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        }
    });
    
    // Add touch feedback for buttons
    document.querySelectorAll('.btn, .nav-link, .category-btn, .filter-btn').forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        
        btn.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    fixViewport();
    applyMobileFixes();
    initTheme();
    initNavigation();
    initBackToTop();
    initSkillsFilter();
    initProjectsFilter();
    initContactForm();
    initAnimations();
    
    // Start typing effect
    typeRole();
    
    // Event listeners
    themeToggle.addEventListener('click', toggleTheme);
    
    // Add touch support for theme toggle
    themeToggle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        toggleTheme();
    });
    
    // Show initial toast
    setTimeout(() => {
        showToast('Welcome to my portfolio! 🚀', 'info');
    }, 1500);
    
    // Update copyright year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// ===== WINDOW RESIZE HANDLER =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            navLinksContainer.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';
        }
    }, 250);
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
window.addEventListener('scroll', debounce(() => {
    // Performance-intensive operations
}, 16)); // ~60fps

// ===== SERVICE WORKER FOR PWA =====
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// ===== OFFLINE DETECTION =====
window.addEventListener('online', () => {
    showToast('You are back online!', 'success');
});

window.addEventListener('offline', () => {
    showToast('You are offline. Some features may not work.', 'error');
});

// ===== LOADING OPTIMIZATION =====
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== ADDITIONAL MOBILE FEATURES =====
// Add swipe support for mobile filters
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
    const skillsCategories = document.querySelector('.skills-categories');
    if (skillsCategories) {
        skillsCategories.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        skillsCategories.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        });
    }
}

function handleSwipeGesture() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - previous filter
            scrollFilter('left');
        } else {
            // Swipe left - next filter
            scrollFilter('right');
        }
    }
}

function scrollFilter(direction) {
    const container = document.querySelector('.skills-categories');
    const scrollAmount = 200;
    
    if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
    } else {
        container.scrollLeft += scrollAmount;
    }
}

// Initialize swipe support on mobile
if (isMobile()) {
    handleSwipe();
}
