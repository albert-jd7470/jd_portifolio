/* ============================================================
   Albert JD Portfolio — Main JavaScript
   Particles | Scroll Reveal | Cursor | Counter | Skill Bars
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     CURSOR GLOW
  ---------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorDot  = document.getElementById('cursor-dot');

  let mx = -999, my = -999;
  let gx = -999, gy = -999;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });

  // Smooth glow follow
  function animateCursor() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    cursorGlow.style.left = gx + 'px';
    cursorGlow.style.top  = gy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* ----------------------------------------------------------
     PARTICLES CANVAS — Yellow Theme
  ---------------------------------------------------------- */
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.r  = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.4 + 0.05;
      // Yellow/amber tones
      const hue = 38 + Math.random() * 20;  // 38–58 deg = yellow-amber
      const sat = 90 + Math.random() * 10;
      const lit = 55 + Math.random() * 20;
      this.color = `hsla(${hue}, ${sat}%, ${lit}%, ${this.alpha})`;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(251, 191, 36, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ----------------------------------------------------------
     NAVBAR SCROLL EFFECT
  ---------------------------------------------------------- */
  const navbar  = document.getElementById('navbar');
  const backTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);
    backTop.classList.toggle('visible', scrollY > 400);
    updateActiveNav();
  });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
     ACTIVE NAV LINK
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      const top    = sec.offsetTop;
      const height = sec.offsetHeight;
      const id     = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  /* ----------------------------------------------------------
     HAMBURGER MENU
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  /* ----------------------------------------------------------
     SCROLL REVEAL — Intersection Observer
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     SKILL BAR ANIMATION
  ---------------------------------------------------------- */
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.width = width + '%';
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(f => skillObserver.observe(f));

  /* ----------------------------------------------------------
     COUNTER ANIMATION
  ---------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const end = parseInt(el.getAttribute('data-count'));
        const dur = 1500;
        const step = Math.ceil(dur / end);
        let cur = 0;
        const timer = setInterval(() => {
          cur++;
          el.textContent = cur;
          if (cur >= end) {
            el.textContent = end;
            clearInterval(timer);
          }
        }, step);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ----------------------------------------------------------
     CONTACT FORM — Simple UX Feedback
  ---------------------------------------------------------- */
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;
      
      // Construct the WhatsApp message
      const text = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`;
      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/916235637470?text=${encodedText}`;
      
      const btnSpan = submitBtn.querySelector('span');
      const btnIcon = submitBtn.querySelector('i');

      submitBtn.disabled = true;
      btnSpan.textContent = 'Redirecting...';
      btnIcon.className = 'uil uil-spinner-alt';
      submitBtn.style.background = 'rgba(124,58,237,0.5)';

      setTimeout(() => {
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
        
        btnSpan.textContent = 'Sent Successfully!';
        btnIcon.className = 'uil uil-check-circle';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
        form.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          btnSpan.textContent = 'Send Message';
          btnIcon.className = 'uil uil-message';
          submitBtn.style.background = '';
        }, 3000);
      }, 500);
    });
  }

  /* ----------------------------------------------------------
     TILT EFFECT on Cards
  ---------------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.project-card, .skill-card, .timeline-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = (y - cy) / cy * -6;
      const rotY = (x - cx) / cx * 6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ----------------------------------------------------------
     TYPING GLITCH EFFECT on Hero Name
  ---------------------------------------------------------- */
  const nameText = document.querySelector('.name-text');
  if (nameText) {
    const original = nameText.textContent;
    const chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&';
    let   revealed = 0;
    let   interval;

    function startGlitch() {
      interval = setInterval(() => {
        nameText.textContent = original
          .split('')
          .map((ch, i) => {
            if (i < revealed) return ch;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        revealed++;
        if (revealed > original.length) {
          clearInterval(interval);
          nameText.textContent = original;
        }
      }, 40);
    }

    // Trigger after page load
    setTimeout(startGlitch, 600);
  }

  /* ----------------------------------------------------------
     LOCALIZATION
  ---------------------------------------------------------- */
  const langSwitcher = document.getElementById('lang-switcher');
  const savedLang = localStorage.getItem('siteLang') || 'en';

  function setLanguage(lang) {
    if (!translations[lang]) return;
    
    // Update texts
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang][key]) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });

    // Handle RTL
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', lang);
    }
    
    // Persist
    localStorage.setItem('siteLang', lang);
    if(langSwitcher) langSwitcher.value = lang;
  }

  if (langSwitcher) {
    langSwitcher.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }

  // Initialize
  setLanguage(savedLang);

})();
