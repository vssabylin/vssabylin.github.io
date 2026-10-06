(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const links = [...document.querySelectorAll('[data-nav-slide]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scrollToElement = element => element?.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' });
  const loadProof = detail => {
    detail.querySelectorAll('video[data-src]').forEach(video => {
      if (!video.hasAttribute('src')) { video.src = video.dataset.src; video.load(); }
    });
  };
  const openEvidence = (id, target) => {
    const detail = document.getElementById(id);
    if (!detail) return;
    detail.open = true;
    loadProof(detail);
    requestAnimationFrame(() => scrollToElement(target ? document.getElementById(target) : detail));
  };
  document.querySelectorAll('details.evidence').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) loadProof(detail);
      else detail.querySelectorAll('video').forEach(video => video.pause());
      document.querySelectorAll(`[data-open-evidence="${detail.id}"]`).forEach(button => button.setAttribute('aria-expanded', String(detail.open)));
    });
  });
  document.querySelectorAll('[data-open-evidence]').forEach(button => {
    button.setAttribute('aria-controls', button.dataset.openEvidence);
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => openEvidence(button.dataset.openEvidence, button.dataset.evidenceTarget));
  });
  document.querySelectorAll('[data-close-evidence]').forEach(button => button.addEventListener('click', () => {
    const detail = document.getElementById(button.dataset.closeEvidence);
    const summary = detail.querySelector('summary');
    detail.open = false;
    summary.focus({ preventScroll: true });
    scrollToElement(detail.closest('.slide'));
  }));
  document.querySelectorAll('[data-panel]').forEach(button => button.addEventListener('click', () => {
    const body = button.closest('.evidence-body');
    body.querySelectorAll('[data-panel]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
    body.querySelectorAll('.evidence-panel').forEach(panel => { panel.hidden = panel.id !== button.dataset.panel; });
  }));
  let scheduled = false;
  let lastActive = '';
  const updateNav = () => {
    scheduled = false;
    const threshold = innerHeight * .36;
    const active = slides.filter(slide => slide.getBoundingClientRect().top <= threshold).at(-1) || slides[0];
    if (active.id === lastActive) return;
    lastActive = active.id;
    links.forEach(link => link.setAttribute('aria-current', String(link.dataset.navSlide === active.dataset.slide)));
    document.querySelector('.reading-progress i').style.width = `${Number(active.dataset.slide) * 10}%`;
    const nav = document.querySelector('.slide-nav');
    const item = links.find(link => link.dataset.navSlide === active.dataset.slide);
    if (nav.scrollWidth > nav.clientWidth && item) nav.scrollTo({ left: item.offsetLeft - nav.clientWidth / 2 + item.offsetWidth / 2, behavior: 'instant' });
  };
  links.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const destination = document.getElementById(`slide-${link.dataset.navSlide}`);
    history.pushState(null, '', `#${destination.id}`);
    destination.scrollIntoView({ behavior: 'instant', block: 'start' });
    document.querySelectorAll('.model-card video').forEach(video => video.pause());
    updateNav();
  }));
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateNav); } }, { passive: true });
  addEventListener('resize', updateNav);
  const aliases = {
    'sharp-start': 1, 'strategy': 2, 'beachhead': 2, 'land-expand': 3, 'asset': 3, 'outreach': 3,
    'product': 4, 'product-pov': 4, 'models': 5, 'model-lab': 5, 'economics': 6,
    'competitors': 7, 'intelligence': 7, 'intelligence-synthesis': 7, 'commercial': 8,
    'agency-credits': 8, 'infrastructure': 9, 'objections': 9, 'surprise': 10, 'expert-check': 10
  };
  const route = () => {
    const hash = decodeURIComponent(location.hash.slice(1));
    const original = document.getElementById(hash);
    const parent = original?.closest('details');
    if (parent) { openEvidence(parent.id, hash); return; }
    if (aliases[hash]) scrollToElement(document.getElementById(`slide-${aliases[hash]}`));
    updateNav();
  };
  addEventListener('hashchange', route);
  route();
})();
