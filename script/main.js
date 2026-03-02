// ===== Birthday Page for Carole =====

// ===== Confetti Canvas =====
function initConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let running = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const colors = ["#ff6b9d", "#ffa5c3", "#ffd700", "#ff1493", "#c44569", "#ffb347", "#ff69b4"];

  function createBurst(count) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        w: 6 + Math.random() * 6,
        h: 12 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: 1.5 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
      });
    }
    if (!running) { running = true; animate(); }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((p) => p.opacity > 0);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      if (p.y > canvas.height) p.opacity -= 0.05;
      p.opacity = Math.max(0, p.opacity);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      running = false;
    }
  }

  return { burst: createBurst };
}

// ===== Floating Emojis Background =====
function initFloatingEmojis() {
  const container = document.getElementById("floating-emojis");
  const emojis = ["💖", "🎂", "✨", "🥂", "🎈", "🎉", "💕", "🌹", "🎁", "⭐"];

  function spawnEmoji() {
    const el = document.createElement("span");
    el.className = "floating-emoji";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + "%";
    el.style.fontSize = (1.2 + Math.random() * 1.5) + "rem";
    el.style.animationDuration = (8 + Math.random() * 8) + "s";
    el.style.animationDelay = Math.random() * 2 + "s";
    container.appendChild(el);

    setTimeout(() => el.remove(), 18000);
  }

  // Initial batch
  for (let i = 0; i < 12; i++) {
    setTimeout(spawnEmoji, i * 400);
  }
  // Continuous
  setInterval(spawnEmoji, 1500);
}

// ===== Photo Carousel =====
function initCarousel() {
  const track = document.getElementById("gallery-track");
  const slides = track.querySelectorAll(".gallery-slide");
  const dotsContainer = document.getElementById("carousel-dots");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  let current = 0;
  let autoTimer;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Go to image " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = ((index % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll(".carousel-dot").forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });
    resetAuto();
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  // Swipe support
  let touchStartX = 0;
  track.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  });

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  }
  resetAuto();
}

// ===== Scroll Reveal =====
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

// ===== Intro Overlay =====
function initIntro(confetti) {
  const overlay = document.getElementById("intro-overlay");
  const mainContent = document.getElementById("main-content");

  function open() {
    overlay.classList.add("hidden");
    mainContent.classList.add("visible");
    confetti.burst(120);

    // Second burst after a moment
    setTimeout(() => confetti.burst(60), 1500);
  }

  overlay.addEventListener("click", open);
  overlay.addEventListener("touchstart", open, { passive: true });
}

// ===== Initialize Everything =====
document.addEventListener("DOMContentLoaded", () => {
  const confetti = initConfetti();
  initIntro(confetti);
  initFloatingEmojis();
  initCarousel();
  initScrollReveal();
});
