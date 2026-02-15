const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav a');
const navLinks = document.querySelectorAll('.nav-links a');

let lastScroll = 0;
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  lastScroll = window.scrollY;
});

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

const sections = document.querySelectorAll('section[id]');
function updateActiveLink() {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}
window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

function staggerReveal(containerSelector, childSelector) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll(childSelector);
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.08}s`;
          child.classList.add('visible');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(containerSelector).forEach(el => observer.observe(el));
}

staggerReveal('.skills-grid', '.skill-card');
staggerReveal('.project-grid', '.project-card');
staggerReveal('.timeline', '.timeline-item');


const heroContent = document.querySelector('.hero');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const items = heroContent.querySelectorAll('.reveal');
  items.forEach(item => {
    item.style.transform = `translateY(${scrolled * 0.25}px)`;
    item.style.opacity = Math.max(0, 1 - scrolled / 800);
  });
});


document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
  });
});


document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});


function openEmail(e) {
  e.preventDefault();
  const user = 'mail';
  const domain = 'ar.ventures';
  window.location.href = 'mailto:' + user + '@' + domain;
}

window.addEventListener('DOMContentLoaded', () => {
  const heroReveals = document.querySelectorAll('.hero .reveal');
  setTimeout(() => {
    heroReveals.forEach(el => el.classList.add('visible'));
  }, 200);
});
