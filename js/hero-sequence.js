/* ======================================================
   GOLDEN BOWL — Hero Image Sequence Player
   Scroll-driven cinematic frame animation
   ====================================================== */

(function () {
  'use strict';

  const FRAME_COUNT = 80;
  const FRAME_PATH = 'Create_a_cinematic_1080p_202602222345_';
  const FRAME_EXT = '.jpg';

  const canvas = document.getElementById('hero-sequence-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const heroSection = document.querySelector('.hero-section');
  const overlayContent = document.getElementById('hero-overlay-content');
  const scrollIndicator = document.getElementById('hero-scroll-indicator');
  const cinematicOverlay = document.querySelector('.hero-cinematic-overlay');
  const grainOverlay = document.querySelector('.hero-grain');

  // ---- Image preloading ----
  const images = [];
  let loadedCount = 0;
  let firstFrameLoaded = false;

  function padNumber(num) {
    return String(num).padStart(3, '0');
  }

  function preloadImages() {
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `${FRAME_PATH}${padNumber(i)}${FRAME_EXT}`;
      img.onload = () => {
        loadedCount++;
        if (i === 0 && !firstFrameLoaded) {
          firstFrameLoaded = true;
          resizeCanvas();
          drawFrame(0);
        }
      };
      images[i] = img;
    }
  }

  // ---- Canvas sizing ----
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawCurrentFrame();
  }

  // ---- Draw a specific frame ----
  let currentFrame = 0;

  function drawFrame(index) {
    const img = images[index];
    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover fit (like object-fit: cover)
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function drawCurrentFrame() {
    drawFrame(currentFrame);
  }

  // ---- Scroll handler ----
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateSequence();
      ticking = false;
    });
  }

  function updateSequence() {
    if (!heroSection) return;

    const scrollTop = window.scrollY;
    const heroTop = heroSection.offsetTop;
    const heroHeight = heroSection.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Scroll range within the hero section
    const scrollRange = heroHeight - viewportHeight;
    const progress = Math.max(0, Math.min(1, (scrollTop - heroTop) / scrollRange));

    // Map progress to frame index
    const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));

    if (frameIndex !== currentFrame) {
      currentFrame = frameIndex;
      drawFrame(currentFrame);
    }

    // ---- Visibility management for fixed elements ----
    const heroEnd = heroTop + heroHeight;
    const isPastHero = scrollTop > heroEnd - viewportHeight * 0.9;

    // Fade out overlay content as user scrolls deeper
    const contentFadeStart = 0.3;
    const contentFadeEnd = 0.7;
    let contentOpacity = 1;
    if (progress > contentFadeStart) {
      contentOpacity = 1 - Math.min(1, (progress - contentFadeStart) / (contentFadeEnd - contentFadeStart));
    }

    if (overlayContent) {
      overlayContent.style.opacity = contentOpacity;
      overlayContent.style.pointerEvents = contentOpacity < 0.1 ? 'none' : '';
    }

    // Fade out scroll indicator early
    if (scrollIndicator) {
      const indicatorOpacity = Math.max(0, 1 - progress * 5);
      scrollIndicator.style.opacity = indicatorOpacity;
    }

    // Hide all fixed hero elements when past hero section
    if (isPastHero) {
      canvas.style.visibility = 'hidden';
      if (overlayContent) overlayContent.style.visibility = 'hidden';
      if (scrollIndicator) scrollIndicator.style.visibility = 'hidden';
      if (cinematicOverlay) cinematicOverlay.style.visibility = 'hidden';
      if (grainOverlay) grainOverlay.style.visibility = 'hidden';
    } else {
      canvas.style.visibility = 'visible';
      if (overlayContent) overlayContent.style.visibility = 'visible';
      if (scrollIndicator) scrollIndicator.style.visibility = 'visible';
      if (cinematicOverlay) cinematicOverlay.style.visibility = 'visible';
      if (grainOverlay) grainOverlay.style.visibility = 'visible';
    }
  }

  // ---- Initialise ----
  preloadImages();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  // Initial state
  resizeCanvas();
  updateSequence();
})();
