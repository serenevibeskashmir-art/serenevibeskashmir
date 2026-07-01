document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initTestimonialSlider();
  initScrollAnimations();
  initForms();
  initQuotePicks();
  initDestinationCards();
  initPackageEnquire();
  registerServiceWorker();
});

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.warn('Service worker registration failed:', err);
    });
  });
}

function initHeader() {
  const header = document.getElementById('header');
  const onScroll = () => { header.classList.toggle('scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
}

function initTestimonialSlider() {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');
  const testimonials = track.querySelectorAll('.testimonial');
  let current = 0;
  let autoplay;

  testimonials.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.slider-dot');

  function goTo(index) {
    current = (index + testimonials.length) % testimonials.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  function startAutoplay() { autoplay = setInterval(() => goTo(current + 1), 7000); }
  function stopAutoplay() { clearInterval(autoplay); }

  track.parentElement.addEventListener('mouseenter', stopAutoplay);
  track.parentElement.addEventListener('mouseleave', startAutoplay);
  startAutoplay();
}

function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.section-header, .destination-card, .package-card, .about-content, .about-images, .contact-info, .contact-form, .trust-item, .season-card, .social-tile'
  );
  targets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );
  targets.forEach(el => observer.observe(el));
}

function showNote(elementId, message) {
  const note = document.getElementById(elementId);
  note.textContent = message;
  note.className = 'form-note success';
  setTimeout(() => {
    note.textContent = '';
    note.className = 'form-note';
  }, 5000);
}

function initQuotePicks() {
  const picks = document.querySelectorAll('.quote-pick');
  const destSelect = document.getElementById('destination');
  if (!picks.length || !destSelect) return;

  picks.forEach(pick => {
    pick.addEventListener('click', () => {
      picks.forEach(p => p.classList.remove('active'));
      pick.classList.add('active');
      destSelect.value = pick.dataset.dest || '';
    });
  });

  destSelect.addEventListener('change', () => {
    const matching = [...picks].find(p => p.dataset.dest === destSelect.value);
    picks.forEach(p => p.classList.toggle('active', p === matching));
    if (!matching) {
      picks.forEach(p => p.classList.remove('active'));
    }
  });
}

function initForms() {
  const searchForm = document.getElementById('searchForm');
  const contactForm = document.getElementById('contactForm');

  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const dest = document.getElementById('destination').selectedOptions[0]?.text;
    if (!dest || dest === 'Select destination') {
      showNote('searchNote', 'Please select a destination to check availability.');
      return;
    }
    const travelers = document.getElementById('travelers').value;
    showNote('searchNote', `Thank you. We are checking availability for ${dest} (${travelers} guest(s)). Redirecting to enquiry formâ€¦`);
    setTimeout(() => {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      const message = document.getElementById('message');
      if (!message.value) {
        message.value = `I would like to check availability for ${dest}. Number of guests: ${travelers}.`;
      }
    }, 1200);
  });

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    showNote('formNote', 'Your enquiry has been received. A travel consultant will contact you within one business day.');
    contactForm.reset();
  });
}

function initDestinationCards() {
  document.querySelectorAll('.destination-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.destination || card.querySelector('h3')?.textContent;
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('tripInterest').value = 'custom';

      const message = document.getElementById('message');
      if (!name) return;

      let inquiry = `I am interested in a trip to ${name}, Kashmir. Please share available packages and pricing.`;
      const spots = card.querySelectorAll('.destination-spots li');
      if (spots.length) {
        const highlights = [...spots].map(li => li.textContent).join(', ');
        inquiry = `I am interested in a Srinagar itinerary covering ${highlights}. Please share available packages and pricing.`;
      }
      if (!message.value) { message.value = inquiry; }
    });
  });
}

function initPackageEnquire() {
  const packageMap = {
    'Valley Discovery': 'valley',
    'Grand Kashmir Circuit': 'circuit',
    'Heritage & Houseboat': 'heritage'
  };
  document.querySelectorAll('[data-package]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const pkg = btn.dataset.package;
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('tripInterest').value = packageMap[pkg] || 'custom';
      const message = document.getElementById('message');
      if (!message.value) {
        message.value = `I would like to enquire about the ${pkg} package. Please share full itinerary details and quotation.`;
      }
    });
  });
}
