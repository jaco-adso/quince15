const slides = document.querySelectorAll('.slide');
  const barsBox = document.getElementById('bars');
  const hint = document.getElementById('hint');
  const musicButton = document.getElementById('music-toggle');
  const invitationAudio = document.getElementById('invitation-audio');
  const locationLink = document.getElementById('location-link');
  const rsvpLink = document.getElementById('rsvp-link');
  const countdownParts = [...document.querySelectorAll('[data-countdown-part]')];
  const countdownTarget = new Date(2026, 10, 15, 19, 0, 0).getTime();
  let cur = 0;

  function updateCountdown() {
    const totalSeconds = Math.max(0, Math.floor((countdownTarget - Date.now()) / 1000));
    const values = [
      Math.floor(totalSeconds / 86400),
      Math.floor(totalSeconds / 3600) % 24,
      Math.floor(totalSeconds / 60) % 60,
      totalSeconds % 60
    ];

    countdownParts.forEach((part, index) => {
      part.textContent = String(values[index]).padStart(2, '0');
    });
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  slides.forEach(() => {
    const b = document.createElement('div');
    b.className = 'bar';
    b.innerHTML = '<i></i>';
    barsBox.appendChild(b);
  });
  const bars = barsBox.querySelectorAll('.bar');

  function show(n) {
    cur = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, i) => s.classList.toggle('active', i === cur));
    slides.forEach((slide, index) => {
      const video = slide.querySelector('video');
      if (!video) return;
      if (index === cur) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    bars.forEach((b, i) => b.classList.toggle('done', i <= cur));
    musicButton.hidden = cur !== 1;
    locationLink.hidden = cur !== 4;
    rsvpLink.hidden = cur !== slides.length - 1;
  }
  const next = () => show(cur + 1);
  const prev = () => show(cur - 1);

  document.getElementById('next').addEventListener('click', next);
  document.getElementById('prev').addEventListener('click', prev);
  musicButton.addEventListener('click', async () => {
    if (!invitationAudio.paused) {
      invitationAudio.pause();
      return;
    }

    try {
      await invitationAudio.play();
    } catch (error) {
      musicButton.classList.remove('is-playing');
      musicButton.setAttribute('aria-label', 'Reproducir canción');
      musicButton.setAttribute('aria-pressed', 'false');
    }
  });
  invitationAudio.addEventListener('play', () => {
    musicButton.classList.add('is-playing');
    musicButton.setAttribute('aria-label', 'Pausar canción');
    musicButton.setAttribute('aria-pressed', 'true');
  });
  invitationAudio.addEventListener('pause', () => {
    musicButton.classList.remove('is-playing');
    musicButton.setAttribute('aria-label', 'Reproducir canción');
    musicButton.setAttribute('aria-pressed', 'false');
  });
  invitationAudio.addEventListener('ended', () => { invitationAudio.currentTime = 0; });
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  let startX = null;
  const story = document.getElementById('story');
  story.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive: true});
  story.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    startX = null;
  });

  show(0);
  window.setTimeout(() => { hint.style.opacity = 0; }, 3000);
