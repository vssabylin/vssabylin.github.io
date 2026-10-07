/* Motion is optional. Nothing waits for an animation to become readable. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('entered');
      observer.unobserve(entry.target);
    }
  }, {threshold: .15});
  document.querySelectorAll('[data-reveal]').forEach(node => observer.observe(node));
  reduce.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      document.querySelectorAll('.entered').forEach(node => node.classList.remove('entered'));
    }
  });
})();
