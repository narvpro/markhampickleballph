// ============================================
// Markham Pickleball PH — Site Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ----- Mobile nav toggle -----
  const navToggle = document.getElementById('navToggle');
  const mainNav   = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile nav when any link is clicked
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // ----- Active nav link on scroll (IntersectionObserver) -----
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks  = document.querySelectorAll('.main-nav a');

  const highlightNav = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        highlightNav(entry.target.id);
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));

  // ----- Header shadow on scroll -----
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 16px rgba(0,0,0,0.08)'
      : 'none';
    backToTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ----- Scroll-reveal animations -----
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Add reveal class to animatable elements
  const animatables = [
    '.card', '.event-card', '.team-card', '.gallery-item',
    '.info-item', '.contact-card', '.schedule-card',
    '.coaching-form', '.contact-form', '.coaching-info',
    '.section-head', '.join-card', '.hero-stats'
  ].join(', ');

  document.querySelectorAll(animatables).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    revealObserver.observe(el);
  });

  // ----- Announcement filters -----
  const filterButtons = document.querySelectorAll('.filter-btn');
  const eventCards    = document.querySelectorAll('.event-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      eventCards.forEach(card => {
        const match = filter === 'all' || card.dataset.type === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  // ----- Form helpers -----
  function showStatus(statusEl, message, type) {
    statusEl.textContent = message;
    statusEl.className = `form-status ${type}`;
    // Clear after 8 seconds
    setTimeout(() => { statusEl.textContent = ''; statusEl.className = 'form-status'; }, 8000);
  }

  function serializeForm(form) {
    return Object.fromEntries(new FormData(form));
  }

  // ----- Coaching request form -----
  const coachingForm = document.getElementById('coachingForm');
  const formStatus   = document.getElementById('formStatus');

  coachingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!coachingForm.checkValidity()) { coachingForm.reportValidity(); return; }

    const data = serializeForm(coachingForm);

    // To send emails, replace the block below with a fetch() call to
    // Formspree (https://formspree.io) or EmailJS, e.g.:
    //   fetch('https://formspree.io/f/YOUR_ID', {
    //     method: 'POST', headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    //   });
    console.log('Coaching request:', data);

    showStatus(formStatus,
      `Salamat, ${data.fullName}! Your coaching request has been received. We'll contact you shortly to confirm your session. 🏓`,
      'success');
    coachingForm.reset();
  });

  // ----- Contact form -----
  const contactForm       = document.getElementById('contactForm');
  const contactFormStatus = document.getElementById('contactFormStatus');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }

    const data = serializeForm(contactForm);

    // Same note: wire to Formspree/EmailJS to actually receive emails.
    console.log('Contact message:', data);

    showStatus(contactFormStatus,
      `Thanks, ${data.cName}! Your message has been received. We'll get back to you soon. 🙏`,
      'success');
    contactForm.reset();
  });

  // ----- Footer year -----
  document.getElementById('year').textContent = new Date().getFullYear();

});
