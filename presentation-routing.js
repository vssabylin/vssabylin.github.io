(() => {
  const sections = [...document.querySelectorAll('main .section')];
  function route() {
    const hash = location.hash.slice(1);
    if (hash === 'top') { window.scrollTo({top:0,behavior:'instant'}); return; }
    const target = document.getElementById(hash || 'strategy');
    const part = target?.closest('.section') || document.getElementById('strategy');
    sections.forEach(section => section.classList.toggle('active', section === part));
    document.querySelectorAll('[data-section]').forEach(link => {
      if (link.dataset.section === part.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (target) {
      for (let parent = target; parent && parent !== part; parent = parent.parentElement) {
        if (parent.tagName === 'DETAILS') parent.open = true;
      }
      requestAnimationFrame(() => target.scrollIntoView({block:'start',behavior:'instant'}));
    }
  }
  window.addEventListener('hashchange', route);
  route();
})();
