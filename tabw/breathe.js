(function () {
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

    gsap.ticker.add(() => {
      posX += (mouseX - posX) * 0.15;
      posY += (mouseY - posY) * 0.15;
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

    const expandSelectors = 'img';
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
})();
