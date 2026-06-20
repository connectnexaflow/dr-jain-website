/* ============================================================
   VARDHMAN HOMEOPATHY — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     1. NAVBAR — scroll shadow + active link highlight
  ---------------------------------------------------------- */
  const nav = document.getElementById('mainNav');

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Highlight nav link matching current section
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#navbarNav .nav-link');

  const observerOptions = { root: null, rootMargin: '-40% 0px -55% 0px', threshold: 0 };
  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(function (section) { sectionObserver.observe(section); });


  /* ----------------------------------------------------------
     2. HERO CAROUSEL — fix overlap + auto-play
  ---------------------------------------------------------- */

  // Fix: Bootstrap needs carousel-items hidden by default.
  // .hero-slide uses display:flex which breaks Bootstrap's hide/show.
  // We override here so only the active slide is flex.
  function fixCarouselDisplay() {
    document.querySelectorAll('.carousel-item.hero-slide').forEach(function (item) {
      item.style.display = item.classList.contains('active') ? 'flex' : 'none';
    });
  }

  fixCarouselDisplay();

  const heroCarouselEl = document.getElementById('heroCarousel');
  if (heroCarouselEl) {
    const heroCarousel = new bootstrap.Carousel(heroCarouselEl, {
      interval: 5000,
      ride: 'carousel',
      pause: 'hover',
      wrap: true
    });

    // Re-apply display fix on every slide transition
    heroCarouselEl.addEventListener('slide.bs.carousel', function (e) {
      const items = heroCarouselEl.querySelectorAll('.carousel-item.hero-slide');
      items.forEach(function (item, i) {
        item.style.display = (i === e.to) ? 'flex' : 'none';
      });
    });
  }


  /* ----------------------------------------------------------
     3. TESTIMONIAL CAROUSEL
  ---------------------------------------------------------- */
  const testimonialCarouselEl = document.getElementById('testimonialCarousel');
  if (testimonialCarouselEl) {
    new bootstrap.Carousel(testimonialCarouselEl, {
      interval: 6000,
      ride: 'carousel',
      pause: 'hover',
      wrap: true
    });
  }


  /* ----------------------------------------------------------
     4. SCROLL-REVEAL — fade up cards & sections on enter
  ---------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.treatment-card, .testimonial-card, .about-text-content, .about-image-block, .hours-item'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(function (el) {
      el.classList.add('reveal-ready');
      revealObserver.observe(el);
    });
  } else {
    // Fallback for old browsers — just show everything
    revealTargets.forEach(function (el) { el.classList.add('revealed'); });
  }


  /* ----------------------------------------------------------
     5. SMOOTH SCROLL for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });

        // Close mobile navbar if open
        const collapse = document.getElementById('navbarNav');
        if (collapse && collapse.classList.contains('show')) {
          new bootstrap.Collapse(collapse).hide();
        }
      }
    });
  });


  /* ----------------------------------------------------------
     6. FOOTER YEAR
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ----------------------------------------------------------
     7. PHONE LINK — click-to-call tracking (console log)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      console.log('Call initiated:', this.href);
      // Replace with your analytics event if needed:
      // gtag('event', 'phone_call', { value: this.href });
    });
  });

});


function bookOnWhatsApp() {
  // Set min date on picker every time (safety net)
  const dateInput = document.getElementById('bk-date');
  if (dateInput) {
    dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
  }

  // Get all values FIRST before any validation
  const fname     = document.getElementById('bk-fname').value.trim();
  const lname     = document.getElementById('bk-lname').value.trim();
  const date      = document.getElementById('bk-date').value;
  const time      = document.getElementById('bk-time').value;
  const treatment = document.getElementById('bk-treatment').value;

  // Validate all fields first
  if (!fname || !lname) {
    alert('Please enter your first and last name.');
    return;
  }
  if (!date) {
    alert('Please select a preferred date.');
    return;
  }
  if (!time) {
    alert('Please select a preferred time slot.');
    return;
  }
  if (!treatment) {
    alert('Please select a treatment.');
    return;
  }

  // Block past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(date);
  if (selected < today) {
    alert('Please select a future date.');
    return;
  }

  // Block past time slots if booking for today
  const now = new Date();
  const isToday = selected.toDateString() === now.toDateString();
  if (isToday) {
    const slotStartHour = {
      '11:00 AM – 12:00 PM': 11,
      '12:00 PM – 1:00 PM':  12,
      '1:00 PM – 2:00 PM':   13,
      '5:30 PM – 6:30 PM':   17,
      '6:30 PM – 7:30 PM':   18,
      '7:30 PM – 8:30 PM':   19,
    };
    const slotHour = slotStartHour[time];
    if (slotHour !== undefined && now.getHours() >= slotHour) {
      alert('This time slot has already passed for today. Please choose a later slot or a future date.');
      return;
    }
  }

  // Format date: 2025-06-15 → 15 Jun 2025
  const d = new Date(date);
  const formatted = d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });

  const msg =
    `Hello Dr. Abhishek Jain,%0A%0A` +
    `I would like to book an appointment.%0A%0A` +
    `*Name:* ${fname} ${lname}%0A` +
    `*Date:* ${formatted}%0A` +
    `*Time:* ${time}%0A` +
    `*Treatment:* ${treatment}%0A%0A` +
    `Please confirm my appointment. Thank you.`;

  window.open(`https://wa.me/919935224400?text=${msg}`, '_blank');
}

// Animated stat counters — triggers when scrolled into view
const statCounts = document.querySelectorAll('.stat-count');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const target = +entry.target.dataset.target;
      const suffix = target === 98 ? '%' : '+';
      const duration = 1800;
      const step = Math.ceil(target / (duration / 16));
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        entry.target.textContent = current.toLocaleString('en-IN') + suffix;
      }, 16);
    }
  });
}, { threshold: 0.4 });

statCounts.forEach(el => statObserver.observe(el));
/* ============================================================
   REQUIRED CSS ADDITIONS — paste into your <style> block
   (replaces the conflicting display:flex on .hero-slide)
   ============================================================

.hero-slide {
  min-height: 620px;
  align-items: center;        <-- REMOVED display:flex from here
  position: relative;
  overflow: hidden;
}
.carousel-item.hero-slide.active {
  display: flex;              <-- ADDED: only active slide is flex
}

.reveal-ready {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.reveal-ready.revealed {
  opacity: 1;
  transform: translateY(0);
}

============================================================ */
