/* ======================================================
   GOLDEN BOWL — Main JavaScript
   Loading, Navigation, Scroll Animations, Form
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Loading Screen ----
  const loader = document.getElementById('loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.add('page-loaded');
    }, 2200);
  });
  // Fallback: hide after 4s
  setTimeout(() => { loader.classList.add('hidden'); document.body.classList.add('page-loaded'); }, 4000);

  // ---- Smooth Scrolling for Nav ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      e.preventDefault();
      const el = document.querySelector(id);
      if (el) {
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // Close mobile menu
      mobileMenu.classList.remove('open');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- Header Scroll Effect ----
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Sticky header
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile Menu ----
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    mobileToggle.classList.toggle('active');
    mobileToggle.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  // ---- Intersection Observer for Scroll Animations ----
  const animatedElements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animatedElements.forEach(el => observer.observe(el));

  // ---- Reservation Form ----
  const resForm = document.getElementById('reservation-form');
  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('res-name').value;
      const btn = resForm.querySelector('button[type="submit"] span');
      const origText = btn.textContent;
      btn.textContent = 'Confirmed! ✓';
      resForm.querySelector('button[type="submit"]').style.background =
        'linear-gradient(135deg, #2e7d32, #1b5e20)';

      setTimeout(() => {
        alert(`Thank you, ${name}! Your reservation has been confirmed. We look forward to welcoming you at Golden Bowl.`);
        resForm.reset();
        btn.textContent = origText;
        resForm.querySelector('button[type="submit"]').style.background = '';
      }, 1500);
    });
  }

  // ---- Set Minimum Date for Reservation ----
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
});
