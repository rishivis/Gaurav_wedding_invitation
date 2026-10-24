/**
 * ============================================================================
 * ROYAL INDIAN WEDDING INVITATION — MULTI-SONG PLAYER, DOORS, PETALS & MAP
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Lock body scroll initially while Royal Haveli Doors are closed
  document.body.classList.add("doors-locked");

  const doorOverlay = document.getElementById("door-overlay");
  const openDoorsBtn = document.getElementById("open-doors-btn");
  const celebrateBtn = document.getElementById("celebrate-shower-btn");

  /* ==========================================================================
     1. MULTI-SONG PLAYLIST MUSIC PLAYER
     ========================================================================== */
  const playlist = [
    { title: "Bhootni Ke Singh Is Kinng", src: "audio/Bhootni Ke Singh Is Kinng 320 Kbps.mp3" },
    { title: "chote Chote Bhaiyon Ke Bade Bhaiya Hum Saath Saath Hain", src: "audio/Chote Chote Bhaiyon Ke Bade Bhaiya Hum Saath Saath Hain 320 Kbps.mp3" },
    { title: "Vaaroon Forever Mirzapur", src: "audio/Vaaroon Forever Mirzapur 320 Kbps.mp3" }
  ];

  let currentTrackIndex = 0;
  const audioElement = new Audio(playlist[currentTrackIndex].src);
  audioElement.loop = false;

  const playPauseBtn = document.getElementById("play-pause-btn");
  const playerIcon = document.getElementById("player-icon");
  const trackTitle = document.getElementById("track-title");
  const prevTrackBtn = document.getElementById("prev-track-btn");
  const nextTrackBtn = document.getElementById("next-track-btn");

  function loadTrack(index) {
    currentTrackIndex = index;
    audioElement.src = playlist[currentTrackIndex].src;
    if (trackTitle) {
      trackTitle.textContent = playlist[currentTrackIndex].title;
    }
  }

  function playMusic() {
    audioElement.play().then(() => {
      if (playerIcon) playerIcon.textContent = "⏸";
    }).catch(err => console.log("Audio play blocked by browser:", err));
  }

  function pauseMusic() {
    audioElement.pause();
    if (playerIcon) playerIcon.textContent = "▶";
  }

  function togglePlayPause() {
    if (audioElement.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", togglePlayPause);
  }

  if (prevTrackBtn) {
    prevTrackBtn.addEventListener("click", () => {
      let newIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      loadTrack(newIndex);
      playMusic();
    });
  }

  if (nextTrackBtn) {
    nextTrackBtn.addEventListener("click", () => {
      let newIndex = (currentTrackIndex + 1) % playlist.length;
      loadTrack(newIndex);
      playMusic();
    });
  }

  // Auto-advance to next song when current song finishes
  audioElement.addEventListener("ended", () => {
    let newIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(newIndex);
    playMusic();
  });

  function initAndPlayPlaylist() {
    loadTrack(0);
    playMusic();
  }

  /* ==========================================================================
     2. OPENING THE 3D ROYAL DOORS
     ========================================================================== */
  if (openDoorsBtn) {
    openDoorsBtn.addEventListener("click", () => {
      // 1. Trigger 3D door opening animation
      doorOverlay.classList.add("opening");
      doorOverlay.classList.add("opened");

      // 2. Start Multi-Song Music Playlist
      initAndPlayPlaylist();

      // 3. Burst extra marigold & rose petals
      spawnPetalBurst(65);

      // 4. Unlock scrolling after doors swing open
      setTimeout(() => {
        document.body.classList.remove("doors-locked");
      }, 1100);
    });
  }

  /* ==========================================================================
     3. MARIGOLD & ROSE PETALS SHOWER CANVAS
     ========================================================================== */
  const canvas = document.getElementById("petals-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let petals = [];

  function resizeCanvas() {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const petalPalette = [
    "#FFB300", // Marigold Gold
    "#FF6F00", // Deep Saffron
    "#D50000", // Crimson Rose
    "#FFD54F", // Bright Haldi Yellow
    "#C2185B"  // Gulabi Pink
  ];

  function createPetal(isBurst = false) {
    return {
      x: Math.random() * (canvas ? canvas.width : window.innerWidth),
      y: isBurst ? Math.random() * ((canvas ? canvas.height : window.innerHeight) * 0.4) : -20,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 1.6 + 0.8,
      speedX: (Math.random() - 0.5) * 1.4,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.04,
      color: petalPalette[Math.floor(Math.random() * petalPalette.length)],
      opacity: Math.random() * 0.45 + 0.5
    };
  }

  // Initial ambient petals
  for (let i = 0; i < 36; i++) {
    const p = createPetal(true);
    p.y = Math.random() * (canvas ? canvas.height : window.innerHeight);
    petals.push(p);
  }

  function spawnPetalBurst(count = 50) {
    for (let i = 0; i < count; i++) {
      petals.push(createPetal(false));
    }
  }

  function animatePetals() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.angle) * 0.4;
      p.angle += p.spin;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      // Draw organic flower petal shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size, -p.size, p.size * 1.4, p.size, 0, p.size * 1.3);
      ctx.bezierCurveTo(-p.size * 1.4, p.size, -p.size, -p.size, 0, 0);
      ctx.fill();
      ctx.restore();

      if (p.y > canvas.height + 25) {
        if (petals.length > 38) {
          petals.splice(i, 1);
        } else {
          p.y = -15;
          p.x = Math.random() * canvas.width;
        }
      }
    }
    requestAnimationFrame(animatePetals);
  }
  animatePetals();

  if (celebrateBtn) {
    celebrateBtn.addEventListener("click", () => {
      spawnPetalBurst(80);
    });
  }

  /* ==========================================================================
     4. SCROLL REVEAL OBSERVER
     ========================================================================== */
  const revealElements = document.querySelectorAll(".reveal-up");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.14 }
  );
  revealElements.forEach((el) => observer.observe(el));

  /* ==========================================================================
     5. COPY ADDRESS & FAMILY BLESSINGS RSVP WALL
     ========================================================================== */
  const copyAddressBtn = document.getElementById("copy-address-btn");
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener("click", () => {
      const addrElem = document.getElementById("display-map-address");
      if (addrElem) {
        const addr = addrElem.textContent.trim();
        navigator.clipboard.writeText(addr).then(() => {
          const originalText = copyAddressBtn.textContent;
          copyAddressBtn.textContent = "✅ Address Copied!";
          setTimeout(() => {
            copyAddressBtn.textContent = originalText;
          }, 2200);
        });
      }
    });
  }

  const rsvpForm = document.getElementById("rsvp-form");
  const blessingsWall = document.getElementById("blessings-wall");

  if (rsvpForm && blessingsWall) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const familyNameInput = document.getElementById("rsvp-name");
      const guestsSelect = document.getElementById("rsvp-guests");
      const sideSelect = document.getElementById("rsvp-side");
      const messageInput = document.getElementById("rsvp-message");

      if (!familyNameInput || !messageInput) return;

      const familyName = familyNameInput.value.trim();
      const guests = guestsSelect ? guestsSelect.value : "";
      const side = sideSelect ? sideSelect.value : "";
      const message = messageInput.value.trim();

      if (!familyName || !message) return;

      const pill = document.createElement("div");
      pill.className = "blessing-pill";
      pill.innerHTML = `<strong>🎊 ${familyName} (${guests} • ${side}):</strong> “${message}”`;
      blessingsWall.prepend(pill);

      rsvpForm.reset();
      spawnPetalBurst(60);
    });
  }
});