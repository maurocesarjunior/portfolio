/* ============================================
   ANIMATIONS.JS — Scroll reveal e efeitos
   ============================================ */

'use strict';

/* ============================================
   SCROLL REVEAL — Intersection Observer
   ============================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ============================================
   HERO TEXT — Entrada animada linha a linha
   ============================================ */
function initHeroEntrance() {
  const heading = document.querySelector('.hero__heading');
  if (!heading) return;

  // Divide o texto em palavras para animar
  const text  = heading.textContent.trim();
  const words = text.split(' ');

  heading.innerHTML = words
    .map(
      (word, i) =>
        `<span class="word-wrap"><span class="word" style="animation-delay:${i * 60}ms">${word}</span></span>`
    )
    .join(' ');

  // Injeta estilo de animação
  if (!document.getElementById('hero-anim-style')) {
    const style = document.createElement('style');
    style.id = 'hero-anim-style';
    style.textContent = `
      .word-wrap {
        display: inline-block;
        overflow: hidden;
        vertical-align: bottom;
      }
      .word {
        display: inline-block;
        transform: translateY(100%);
        animation: wordReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @keyframes wordReveal {
        to { transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ============================================
   COUNTER — Anima números ao entrar em view
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-count-suffix') || '';
        const duration = 1200;
        const start    = performance.now();

        const step = (now) => {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}

/* ============================================
   STAGGER — Animação em cascata para listas
   ============================================ */
function initStagger() {
  const groups = document.querySelectorAll('[data-stagger]');
  if (!groups.length) return;

  groups.forEach((group) => {
    const children = group.children;
    [...children].forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initHeroEntrance();
  initStagger();
  initScrollReveal();
  initCounters();
});
