(function () {
  if (!window.matchMedia("(pointer: fine)").matches)
    return;

  function getCursorSpeed() {
    const params = new URLSearchParams(window.location.search);
    const value = parseFloat(params.get("cursorSpeed"));
    return isFinite(value) ? value : 20.0; // default to 5.0 if not set or invalid
  }
  const cursorSpeed = getCursorSpeed();

  // Inject CSS
  const style = document.createElement("style");
  style.textContent = `
    body, a, button, input[type="submit"], input[type="button"], label, [role="button"] {
      cursor: none !important;
    }
    .custom-cursor {
      position: fixed;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.3);
      mix-blend-mode: normal;
      z-index: 9999;
      transform: translate(-50%, -50%);
      will-change: transform;
    }
  `;
  document.head.appendChild(style);

  // Create cursor div
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  // Load GSAP
  const gsapScript = document.createElement("script");
  gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
  gsapScript.onload = () => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let posX = mouseX;
    let posY = mouseY;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Cursor animations and dynamic elements
    gsap.ticker.add((_time, dtMs) => {
      const dt = dtMs / 1000;
      const p = 1 - Math.exp (-cursorSpeed * dt);
      posX += (mouseX - posX) * p;
      posY += (mouseY - posY) * p;
      gsap.set(cursor, { x: posX, y: posY });
    });

    const clickableSelectors = 'a, button, input[type="submit"], input[type="button"], label, [role="button"]';
    document.querySelectorAll(clickableSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
          duration: 1,
          scale: 2,
          background: 'rgba(0, 0, 0, 0.6)',
          ease: 'power2.out'
        });

        if (el._breathTween) el._breathTween.kill();

        el._breathTween = gsap.to(el, {
          scale: 1.05,
          duration: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
          duration: 1,
          scale: 1,
          background: 'rgba(0, 0, 0, 0.3)',
          ease: 'power2.out'
        });

        if (el._breathTween) {
          el._breathTween.kill();
          el._breathTween = null;
        }

        gsap.to(el, {
          scale: 1,
          duration: 1.5,
          ease: "sine.out",
          clearProps: "all"
        });
      });
    });

    const expandSelectors = 'img, .image-block';
    document.querySelectorAll(expandSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(el, {
          scale: 1.04,
          duration: 2,
          ease: "power1.inOut",
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          scale: 1,
          duration: 2,
          ease: "power1.inOut",
          clearProps: "all"
        });
      });
    });
  };
  document.head.appendChild(gsapScript);

  // Lenis smooth scrolling
  const lenisScript = document.createElement("script");
  lenisScript.src = "https://unpkg.com/lenis@1.3.4/dist/lenis.min.js";
  lenisScript.onload = () => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: true,
      gestureOrientation: 'vertical'
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  };
  document.head.appendChild(lenisScript);
})();
