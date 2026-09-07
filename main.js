/* ==========================================================================
   PORTFOLIO WEBSITE - INTERACTIVE JAVASCRIPT (main.js)
   Theme Switcher, Mobile Nav, Toast, Modals, Filters, & Form Handlers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  highlightActiveNav();
  initCounterAnimations();
  initProjectFilters();
  initContactForm();
  initBackToTop();
});

/* --- Theme Management (Dark / Light Frosted Glass) --- */
function initTheme() {
  const themeSwitch = document.getElementById('themeSwitch');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

  applyTheme(savedTheme);

  if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(currentTheme);
      localStorage.setItem('portfolio-theme', currentTheme);
      showToast(
        currentTheme === 'light' ? 'Mode Terang Diaktifkan' : 'Mode Gelap Diaktifkan',
        'Tema visual berhasil diperbarui.'
      );
    });
  }
}

function applyTheme(theme) {
  const themeSwitch = document.getElementById('themeSwitch');
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeSwitch) themeSwitch.classList.add('active');
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (themeSwitch) themeSwitch.classList.remove('active');
  }
}

/* --- Mobile Navigation Drawer Toggle --- */
function initMobileNav() {
  const navToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '☰';
      }
    });

    // Close when a link inside mobile menu is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '☰';
      });
    });
  }
}

/* --- Highlight Active Navigation Link --- */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === currentPath ||
      (currentPath === '' && href === 'index.html') ||
      (currentPath === 'dashboard.html' && (href === 'index.html' || href === 'dashboard.html'))
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- Counter Animations on Metric Cards --- */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'), 10);
        animateCounter(entry.target, target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target) {
  let start = 0;
  const duration = 1500;
  const stepTime = Math.abs(Math.floor(duration / target));

  const timer = setInterval(() => {
    start += 1;
    el.textContent = start;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, Math.max(stepTime, 20));
}

/* --- Project Filter Tabs --- */
function initProjectFilters() {
  const tabBtns = document.querySelectorAll('.tab-btn[data-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!tabBtns.length || !projectCards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --- Project Detail Modal Handler --- */
window.openProjectModal = function(title, category, desc, techList, demoUrl, githubUrl, imgUrl) {
  const overlay = document.getElementById('projectModal');
  if (!overlay) return;

  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalCategory').textContent = category;
  document.getElementById('modalDesc').textContent = desc;
  document.getElementById('modalImg').src = imgUrl;

  const techContainer = document.getElementById('modalTechs');
  techContainer.innerHTML = '';
  techList.split(',').forEach(t => {
    const span = document.createElement('span');
    span.className = 'tech-tag';
    span.textContent = t.trim();
    techContainer.appendChild(span);
  });

  const demoBtn = document.getElementById('modalDemoBtn');
  if (demoBtn) demoBtn.href = demoUrl || '#';

  const gitBtn = document.getElementById('modalGitBtn');
  if (gitBtn) gitBtn.href = githubUrl || '#';

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeProjectModal = function() {
  const overlay = document.getElementById('projectModal');
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
};

/* --- Interactive Contact Form --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showToast('Form Belum Lengkap', 'Mohon isi semua kolom yang diperlukan.');
      return;
    }

    // Simulate sending state with button feedback
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Mengirim Pesan...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      showToast(
        'Pesan Berhasil Terkirim!',
        `Terima kasih ${nameInput.value}. Saya akan segera merespons email Anda.`
      );
    }, 1200);
  });
}

/* --- Toast Notification Helper --- */
window.showToast = function(title, message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">✨</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <p class="toast-desc">${message}</p>
    </div>
    <button class="toast-close" aria-label="Tutup Toast">&times;</button>
    <div class="toast-bar"></div>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => removeToast(toast));

  // Auto remove after 4.2 seconds
  setTimeout(() => removeToast(toast), 4200);
};

function removeToast(toast) {
  toast.classList.remove('show');
  setTimeout(() => {
    if (toast.parentElement) toast.parentElement.removeChild(toast);
  }, 350);
}

/* --- Clipboard Copy Helper --- */
window.copyToClipboard = function(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Tersalin ke Clipboard!', `${label || text} berhasil disalin.`);
  }).catch(() => {
    showToast('Info', text);
  });
};

/* --- Back to Top --- */
function initBackToTop() {
  const backBtn = document.getElementById('backToTopBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
