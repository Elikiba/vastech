// ======================
// DOM ELEMENTS
// ======================
const elements = {
    mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
    navMenu: document.querySelector('.nav-menu'),
    menuItems: document.querySelectorAll('.nav-menu > li'),
    topBar: document.querySelector('.top-bar'),
    currentYear: document.getElementById('currentYear'),
    newsletterModal: document.getElementById('newsletterModal'),
    newsletterForm: document.querySelector('.newsletter-form'),
    closeNewsletter: document.querySelector('.close-newsletter'),
    scrollToTopBtn: document.querySelector('.scroll-to-top'),
    progressCircleFill: document.querySelector('.progress-circle-fill'),
    statsSection: document.querySelector('.stats'),
    statNumbers: document.querySelectorAll('.stat-number')
  };
  
  // ======================
  // MOBILE MENU
  // ======================
  const mobileMenu = {
    init: () => {
      elements.mobileMenuBtn.addEventListener('click', mobileMenu.toggleMenu);
      
      elements.menuItems.forEach(item => {
        item.addEventListener('click', () => {
          item.classList.toggle('active');
        });
      });

       // Close menu when clicking anywhere outside
    document.addEventListener('click', (e) => {
      const isMenuButton = e.target === elements.mobileMenuBtn || elements.mobileMenuBtn.contains(e.target);
      const isInsideMenu = elements.navMenu.contains(e.target);
      
      if (!isMenuButton && !isInsideMenu && elements.navMenu.classList.contains('active')) {
        mobileMenu.toggleMenu();
      }
    });
  },
  
    toggleMenu: () => {
      elements.navMenu.classList.toggle('active');
       // Toggle hamburger icon
    const icon = elements.mobileMenuBtn.querySelector('i');
    if (elements.navMenu.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
    }
  };
  
  // ======================
  // TOP BAR SCROLL EFFECT
  // ======================
  const topBarScroll = {
    init: () => {
      window.addEventListener('scroll', topBarScroll.handleScroll);
    },
  
    handleScroll: () => {
      if (window.scrollY > 50) {
        elements.topBar.classList.add('scrolled');
      } else {
        elements.topBar.classList.remove('scrolled');
      }
    }
  };
  
  // ======================
  // COPYRIGHT YEAR
  // ======================
  const copyright = {
    init: () => {
      elements.currentYear.textContent = new Date().getFullYear();
    }
  };
  
  // ======================
  // SCROLL EFFECTS
  // ======================
  const scrollEffects = {
    init: () => {
      if (elements.scrollToTopBtn && elements.progressCircleFill) {
        elements.scrollToTopBtn.classList.add('visible');
        window.addEventListener('scroll', scrollEffects.updateScrollProgress);
        elements.scrollToTopBtn.addEventListener('click', scrollEffects.scrollToTop);
      }
  
      scrollEffects.setupIntersectionObserver();
    },
  
    updateScrollProgress: () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollProgress = (scrollTop / scrollHeight) * 100;
      const offset = 126 - (126 * scrollProgress / 100);
      elements.progressCircleFill.style.strokeDashoffset = offset;
    },
  
    scrollToTop: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
  
    setupIntersectionObserver: () => {
      const sections = document.querySelectorAll('section');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });
  
      sections.forEach(section => {
        observer.observe(section);
      });
    }
  };

  
//    // ======================
//   // PRELOADER
//   // ======================
// function initPreloader() {
//     const preloader = document.querySelector('.preloader');
//     if (!preloader) return;
    
//     document.body.style.overflow = 'hidden';
    
//     window.addEventListener('load', function() {
//         setTimeout(() => {
//             preloader.style.opacity = '0';
//             preloader.style.visibility = 'hidden';
//             document.body.style.overflow = '';
            
//             setTimeout(() => preloader.remove(), 1000);
//         }, 500);
//     });
    
//     // Fallback
//     setTimeout(() => {
//         preloader.style.opacity = '0';
//         preloader.style.visibility = 'hidden';
//         document.body.style.overflow = '';
//         setTimeout(() => preloader.remove(), 1000);
//     }, 4000);
// }
  
  // ======================
  // NEWSLETTER MODAL
  // ======================
  const newsletter = {
    init: () => {
      if (!elements.newsletterModal || !elements.newsletterForm) return;
  
      // Show modal after delay
      setTimeout(() => {
        if (!sessionStorage.getItem('newsletterShown')) {
          newsletter.showModal();
          sessionStorage.setItem('newsletterShown', 'true');
        }
      }, 30000);
  
      // Close handler
      elements.closeNewsletter.addEventListener('click', newsletter.hideModal);
  
      // Form submission handler
      elements.newsletterForm.addEventListener('submit', newsletter.handleSubmit);
    },
  
    showModal: () => {
      elements.newsletterModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        elements.newsletterModal.style.opacity = '1';
      }, 10);
    },
  
    hideModal: () => {
      elements.newsletterModal.style.opacity = '0';
      setTimeout(() => {
        elements.newsletterModal.style.display = 'none';
        document.body.style.overflow = '';
      }, 300);
    },
  
    handleSubmit: async (e) => {
      e.preventDefault();
      const emailInput = e.target.querySelector('input[type="email"]');
      
      if (newsletter.validateEmail(emailInput)) {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
  
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const toast = utils.createSuccessToast('Thanks for subscribing!');
          utils.showSuccessToast(toast);
          e.target.reset();
          
          // Auto-close after 4 seconds
          setTimeout(() => {
            newsletter.hideModal();
          }, 4000);
          
        } catch (error) {
          console.error("Error saving subscriber:", error);
          const toast = utils.createSuccessToast('Subscription failed. Please try again.');
          utils.showSuccessToast(toast);
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Subscribe';
        }
      }
    },
  
    validateEmail: (input) => {
      const email = input.value.trim();
      if (!email) {
        utils.showError(input, 'Email is required');
        return false;
      }
      if (!utils.validateEmail(email)) {
        utils.showError(input, 'Please enter a valid email');
        return false;
      }
      utils.clearError(input);
      return true;
    }
  };
  
  // ======================
  // STATS ANIMATION
  // ======================
  const statsAnimation = {
    init: () => {
      if (elements.statsSection && elements.statNumbers.length > 0) {
        window.addEventListener('scroll', statsAnimation.checkScroll);
        statsAnimation.checkScroll(); // Check on page load
      }
    },
  
    checkScroll: () => {
      const sectionTop = elements.statsSection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (sectionTop < windowHeight - 100) {
        statsAnimation.startCounting();
        window.removeEventListener('scroll', statsAnimation.checkScroll);
      }
    },

    
  startCounting: () => {
    elements.statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const suffix = stat.textContent.match(/[^0-9.]+$/) ? stat.textContent.match(/[^0-9.]+$/)[0] : '';
      const isDecimal = target % 1 !== 0;
      const increment = target / 100; // Adjust speed as needed
      let current = 0;

      const updateNumber = () => {
        current += increment;
        if (current < target) {
          stat.textContent = isDecimal 
            ? current.toFixed(1) + suffix
            : Math.floor(current) + suffix;
          requestAnimationFrame(updateNumber);
        } else {
          stat.textContent = isDecimal 
            ? target.toFixed(1) + suffix
            : target + suffix;
        }
      };
  
        updateNumber();
      });
    }
  };
  
  // ======================
  // UTILITY FUNCTIONS
  // ======================
  const utils = {
    validateEmail: (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
  
    showError: (input, message) => {
      const errorElement = input.nextElementSibling || document.createElement('small');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      errorElement.style.color = 'red';
      if (!input.nextElementSibling) {
        input.insertAdjacentElement('afterend', errorElement);
      }
      input.style.borderColor = 'red';
    },
  
    clearError: (input) => {
      const errorElement = input.nextElementSibling;
      if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
      }
      input.style.borderColor = '';
    },
  
    createSuccessToast: (message) => {
      const toast = document.createElement('div');
      toast.className = 'success-toast';
      toast.textContent = message;
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.backgroundColor = 'var(--primary-color)';
      toast.style.color = 'white';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '5px';
      toast.style.zIndex = '1000';
      return toast;
    },
  
    showSuccessToast: (toast) => {
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  };
  
  // ======================
  // INITIALIZE ALL MODULES
  // ======================
  document.addEventListener('DOMContentLoaded', () => {
    mobileMenu.init();
    topBarScroll.init();
    copyright.init();
    scrollEffects.init();
    newsletter.init();
    statsAnimation.init();
  });