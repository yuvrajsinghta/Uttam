/* ================================================================
   SHIKHAR — MAIN JAVASCRIPT
   Apple-smooth interactions & animations
   ================================================================ */

'use strict';

/* ---- NAVBAR ---- */
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (nav) {
  const updateNav = () => {
    if (window.scrollY > 60) nav.classList.add('solid');
    else nav.classList.remove('solid');
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---- SCROLL REVEAL ---- */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));
}

/* ---- COUNTER ANIMATION ---- */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
      const duration = 1800;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = easeOutCubic(progress) * target;
        el.textContent = prefix + value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countObs.observe(el));
}

/* ---- FILTER CHIPS ---- */
document.querySelectorAll('.filter-group').forEach(group => {
  group.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', function () {
      group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;
      const cards = document.querySelectorAll('.trek-card[data-tags]');
      cards.forEach(card => {
        const tags = card.dataset.tags || '';
        const show = filter === 'all' || tags.split(' ').includes(filter);
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (show) {
          card.style.opacity = '1';
          card.style.transform = '';
          card.style.pointerEvents = '';
        } else {
          card.style.opacity = '0.25';
          card.style.transform = 'scale(0.97)';
          card.style.pointerEvents = 'none';
        }
      });
    });
  });
});

/* ---- DATE PICKER (Booking card) ---- */
document.querySelectorAll('.date-item').forEach(item => {
  item.addEventListener('click', function () {
    this.closest('.date-list')?.querySelectorAll('.date-item').forEach(d => d.classList.remove('active'));
    this.classList.add('active');
  });
});

/* ---- TESTIMONIAL SLIDER ---- */
class Slider {
  constructor(el) {
    this.wrap = el;
    this.track = el.querySelector('.slider-track');
    this.slides = el.querySelectorAll('.slide');
    this.dots = el.querySelectorAll('.slider-dot');
    this.prevBtn = el.querySelector('.slider-prev');
    this.nextBtn = el.querySelector('.slider-next');
    this.current = 0;
    this.total = this.slides.length;
    this.autoTimer = null;

    this.prevBtn?.addEventListener('click', () => this.go(this.current - 1));
    this.nextBtn?.addEventListener('click', () => this.go(this.current + 1));
    this.dots.forEach((dot, i) => dot.addEventListener('click', () => this.go(i)));

    // Touch support
    let startX = 0;
    this.track.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
    this.track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) this.go(this.current + (diff > 0 ? 1 : -1));
    });

    this.startAuto();
  }

  go(index) {
    this.current = ((index % this.total) + this.total) % this.total;
    this.track.style.transform = `translateX(-${this.current * 100}%)`;
    this.dots.forEach((d, i) => d.classList.toggle('active', i === this.current));
    this.resetAuto();
  }

  startAuto() { this.autoTimer = setInterval(() => this.go(this.current + 1), 5500); }
  resetAuto() { clearInterval(this.autoTimer); this.startAuto(); }
}

document.querySelectorAll('.slider-wrap').forEach(el => new Slider(el));

/* ---- PARALLAX HERO ---- */
const heroSection = document.querySelector('.hero');
if (heroSection && window.innerWidth > 768) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const heroBg = heroSection.querySelector('.hero-bg');
    const heroContent = heroSection.querySelector('.hero-content');
    if (heroBg) heroBg.style.transform = `translateY(${y * 0.35}px)`;
    if (heroContent) heroContent.style.transform = `translateY(${y * 0.15}px)`;
  }, { passive: true });
}

/* ---- GALLERY LIGHTBOX ---- */
const galleryItems = document.querySelectorAll('.gallery-item');
if (galleryItems.length) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <div class="lightbox-inner">
      <div class="lightbox-media"></div>
      <div class="lightbox-caption"></div>
      <button class="lightbox-close">✕</button>
      <button class="lightbox-prev">←</button>
      <button class="lightbox-next">→</button>
    </div>`;
  document.body.appendChild(lb);

  const lbMedia = lb.querySelector('.lightbox-media');
  const lbCaption = lb.querySelector('.lightbox-caption');
  let currentIdx = 0;
  const items = Array.from(galleryItems);

  const openLb = (idx) => {
    currentIdx = idx;
    const item = items[idx];
    const bg = item.querySelector('[class*="bg-"]')?.className.split(' ').find(c => c.startsWith('bg-'));
    const label = item.querySelector('.gallery-caption')?.textContent || '';
    lbMedia.className = 'lightbox-media ' + (bg || '');
    lbCaption.textContent = label;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };

  items.forEach((item, i) => item.addEventListener('click', () => openLb(i)));
  lb.querySelector('.lightbox-close').addEventListener('click', closeLb);
  lb.querySelector('.lightbox-backdrop').addEventListener('click', closeLb);
  lb.querySelector('.lightbox-prev').addEventListener('click', () => openLb((currentIdx - 1 + items.length) % items.length));
  lb.querySelector('.lightbox-next').addEventListener('click', () => openLb((currentIdx + 1) % items.length));
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') openLb((currentIdx - 1 + items.length) % items.length);
    if (e.key === 'ArrowRight') openLb((currentIdx + 1) % items.length);
  });
}

/* ---- CONTACT FORM ---- */
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('[type=submit]');
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#166534';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
        this.reset();
      }, 3000);
    }, 1200);
  });
}

/* ---- NEWSLETTER FORM ---- */
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    btn.textContent = '✓ Subscribed!';
    btn.style.background = '#166534';
    btn.style.color = 'white';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
      btn.style.color = '';
      this.reset();
    }, 3000);
  });
});

/* ---- SMOOTH ANCHOR SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ---- ACTIVE NAV LINK ---- */
const currentFile = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link[href], .mobile-menu a[href]').forEach(link => {
  if (link.getAttribute('href') === currentFile) link.classList.add('active');
});
