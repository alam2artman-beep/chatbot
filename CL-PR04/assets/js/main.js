// ============================================================
// Mohammad Fazli Portfolio - Main Script
// ============================================================

(function() {
  'use strict';

  // ============================================================
  // LANGUAGE SWITCHER & TYPING EFFECT
  // ============================================================
  const langBtns = document.querySelectorAll('.lang-btn');
  const html = document.documentElement;
  const typingEl = document.getElementById('typingText');

  let currentLang = localStorage.getItem('lang') || 'fa';
  let typingTimeout = null;
  let currentSubIndex = 0;

  const subtitles = {
    fa: [
      'کارشناس شبکه و زیرساخت',
      'متخصص Cisco & MikroTik',
      'مدیریت VMware & Veeam',
      'فایروال FortiGate'
    ],
    en: [
      'Network & Infrastructure Engineer',
      'Cisco & MikroTik Specialist',
      'VMware & Veeam Administrator',
      'FortiGate Firewall Expert'
    ]
  };

  function setLanguage(lang) {
    currentLang = lang;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');

    document.querySelectorAll('[data-lang]').forEach(el => {
      el.style.display = el.dataset.lang === lang ? '' : 'none';
    });

    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.langBtn === lang);
    });

    startTypingEffect();
  }

  function startTypingEffect() {
    if (typingTimeout) clearTimeout(typingTimeout);
    currentSubIndex = 0;
    typeText();
  }

  function typeText() {
    const texts = subtitles[currentLang];
    const text = texts[currentSubIndex];
    let charIndex = 0;

    typingEl.innerHTML = '<span class="caret"></span>';

    function addChar() {
      if (charIndex < text.length) {
        typingEl.innerHTML = text.substring(0, charIndex + 1) + '<span class="caret"></span>';
        charIndex++;
        typingTimeout = setTimeout(addChar, 80);
      } else {
        typingTimeout = setTimeout(eraseText, 2000);
      }
    }

    function eraseText() {
      if (charIndex > 0) {
        charIndex--;
        typingEl.innerHTML = text.substring(0, charIndex) + '<span class="caret"></span>';
        typingTimeout = setTimeout(eraseText, 50);
      } else {
        currentSubIndex = (currentSubIndex + 1) % texts.length;
        typingTimeout = setTimeout(typeText, 500);
      }
    }

    addChar();
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.langBtn;
      if (lang !== currentLang) {
        setLanguage(lang);
        localStorage.setItem('lang', lang);
      }
    });
  });

  // Initialize with saved/default language
  setLanguage(currentLang);

  // ============================================================
  // NAV SCROLL BEHAVIOR
  // ============================================================
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // ============================================================
  // MOBILE MENU TOGGLE
  // ============================================================
  const navBurger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.getElementById('navLinks');

  navBurger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    navBurger.classList.toggle('open');
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !navBurger.contains(e.target) && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      navBurger.classList.remove('open');
    }
  });

  // ============================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================
  function scrollToTarget(target) {
    // Nav height must be read from the element: --nav-h is a clamp()
    // expression, so parseInt() on the custom property returns NaN.
    const navH = nav ? nav.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.pageYOffset - navH;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth'
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // Close the mobile overlay first so the scroll is visible
      if (mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        navBurger.classList.remove('open');
      }

      scrollToTarget(target);
    });
  });

  // ============================================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');

        // Trigger counter animation if this element contains counters
        const counters = entry.target.querySelectorAll('.counter .num[data-count]');
        if (counters.length > 0) {
          counters.forEach(counter => {
            if (!counter.dataset.animated) {
              animateCounter(counter);
            }
          });
        }

        // Trigger skill bar animation if this element contains skill fills
        const skillFills = entry.target.querySelectorAll('.skill-fill[data-width]');
        if (skillFills.length > 0) {
          skillFills.forEach(fill => {
            if (!fill.dataset.animated) {
              setTimeout(() => {
                fill.style.width = fill.dataset.width + '%';
                fill.dataset.animated = 'true';
              }, 100);
            }
          });
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================================
  // COUNTER ANIMATION
  // ============================================================
  function animateCounter(counter) {
    const target = parseInt(counter.dataset.count);
    const duration = 1800;
    const increment = target / (duration / 16);
    let current = 0;

    counter.dataset.animated = 'true';

    function updateCounter() {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + (target === 3 ? '+' : '');
      }
    }

    updateCounter();
  }

  // ============================================================
  // CONTACT FORM SUBMISSION
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const formNoteEn = document.getElementById('formNoteEn');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = currentLang === 'fa'
      ? '<span>در حال ارسال...</span>'
      : '<span>Sending...</span>';

    // Simulate form submission (client-side only - no backend configured)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success message
    const note = currentLang === 'fa' ? formNote : formNoteEn;
    note.textContent = currentLang === 'fa'
      ? 'پیام شما با موفقیت ارسال شد. به زودی پاسخ خواهم داد.'
      : 'Your message was sent successfully. I will respond shortly.';
    note.className = 'form-note ok';
    note.style.display = 'block';

    // Reset form
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;

    // Hide message after 5 seconds
    setTimeout(() => {
      note.style.display = 'none';
    }, 5000);

    // NOTE: In production, replace the simulation above with actual form submission:
    // const formData = new FormData(contactForm);
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   body: formData
    // });
    // Handle response accordingly
  });

  // ============================================================
  // PRELOAD CRITICAL FONTS (optional performance boost)
  // ============================================================
  if ('fonts' in document) {
    Promise.all([
      document.fonts.load('400 1em Vazirmatn'),
      document.fonts.load('700 1em Vazirmatn'),
      document.fonts.load('400 1em "Bebas Neue"')
    ]).then(() => {
      document.body.classList.add('fonts-loaded');
    });
  }

  // ============================================================
  // PERFORMANCE: Reduce motion for users who prefer it
  // ============================================================
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('in');
    });
  }

})();
