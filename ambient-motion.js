(() => {
  document.querySelectorAll('.sharp-start-scene, .product-art').forEach(scene => {
  const video = scene?.querySelector('.ambient-video');
  const toggle = scene?.querySelector('.ambient-toggle');
  if (!video || !toggle) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = reduced.matches;
  let visible = false;
  let unavailable = false;
  const shouldPlay = () => visible && !document.hidden && !userPaused && !unavailable;
  const paintToggle = () => {
    toggle.textContent = video.paused ? 'Play motion' : 'Pause motion';
    toggle.setAttribute('aria-pressed', String(!video.paused));
  };
  async function update() {
    if (!shouldPlay()) {
      video.pause();
      paintToggle();
      return;
    }
    if (!video.getAttribute('src')) {
      video.src = video.dataset.src;
      video.muted = true;
    }
    try {
      await video.play();
      if (!shouldPlay()) video.pause();
    } catch {
      // The still remains available if the browser requires a play gesture.
    }
    paintToggle();
  }
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    update();
  }, { threshold: 0.1 }).observe(scene);
  video.addEventListener('loadeddata', () => video.parentElement.classList.add('has-motion'));
  video.addEventListener('play', paintToggle);
  video.addEventListener('pause', paintToggle);
  video.addEventListener('error', () => {
    unavailable = true;
    video.parentElement.classList.remove('has-motion');
    toggle.hidden = true;
  });
  toggle.addEventListener('click', () => {
    userPaused = !video.paused;
    update();
  });
  reduced.addEventListener('change', () => {
    userPaused = reduced.matches;
    update();
  });
  document.addEventListener('visibilitychange', update);
  toggle.hidden = false;
  paintToggle();
  });
})();
