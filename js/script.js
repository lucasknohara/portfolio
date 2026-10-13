(function () {
  const body = document.body;
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const themeToggle = document.getElementById('theme-toggle');
  const roleValue = document.getElementById('role-value');
  const copyEmailButton = document.getElementById('copy-email');
  const copyFeedback = document.getElementById('copy-feedback');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
      mainNav.classList.toggle('is-open', !isOpen);
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const isLight = body.classList.toggle('light-theme');
      const icon = themeToggle.querySelector('.theme-icon');
      if (icon) icon.textContent = isLight ? '🌑' : '☀️';
      themeToggle.setAttribute('aria-label', isLight ? 'Ativar tema escuro' : 'Ativar tema claro');
      document.querySelector('meta[name="theme-color"]').setAttribute('content', isLight ? '#f4f5ef' : '#0b0d0c');
    });
  }

  if (roleValue) {
    const roles = ['Back-end com Node.js', 'APIs REST e regras de negócio', 'Desenvolvimento Full Stack'];
    let roleIndex = 0;
    window.setInterval(function () {
      roleIndex = (roleIndex + 1) % roles.length;
      roleValue.classList.add('role-changing');
      roleValue.style.opacity = '0';
      window.setTimeout(function () {
        roleValue.textContent = roles[roleIndex];
        roleValue.style.opacity = '1';
        roleValue.classList.remove('role-changing');
      }, 180);
    }, 3200);
  }

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealElements.forEach(function (element) { revealObserver.observe(element); });
  } else {
    revealElements.forEach(function (element) { element.classList.add('is-visible'); });
  }

  const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
  const sections = navLinks.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  if (copyEmailButton) {
    copyEmailButton.addEventListener('click', async function () {
      const email = copyEmailButton.getAttribute('data-email');
      try {
        await navigator.clipboard.writeText(email);
        copyFeedback.textContent = 'E-mail copiado: ' + email;
      } catch (error) {
        copyFeedback.textContent = 'Copie este endereço: ' + email;
      }
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const glow = document.querySelector('.cursor-glow');
  if (glow && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    body.classList.add('has-pointer');
    window.addEventListener('pointermove', function (event) {
      glow.style.left = event.clientX + 'px';
      glow.style.top = event.clientY + 'px';
    }, { passive: true });
  }

  const canvas = document.getElementById('ambient-canvas');
  const context = canvas ? canvas.getContext('2d') : null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canvas && context && !reduceMotion) {
    let particles = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    const particleCount = window.innerWidth < 700 ? 24 : 42;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles = Array.from({ length: particleCount }, function () {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.4 + 0.4,
          speedX: (Math.random() - 0.5) * 0.22,
          speedY: (Math.random() - 0.5) * 0.22
        };
      });
    }

    function drawParticles() {
      context.clearRect(0, 0, width, height);
      const lightTheme = body.classList.contains('light-theme');
      const particleColor = lightTheme ? '30, 55, 20' : '198, 243, 106';
      particles.forEach(function (particle, index) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.x < -5) particle.x = width + 5;
        if (particle.x > width + 5) particle.x = -5;
        if (particle.y < -5) particle.y = height + 5;
        if (particle.y > height + 5) particle.y = -5;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(' + particleColor + ', .46)';
        context.fill();

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
          const next = particles[nextIndex];
          const dx = particle.x - next.x;
          const dy = particle.y - next.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 105) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(next.x, next.y);
            context.strokeStyle = 'rgba(' + particleColor + ', ' + (0.075 * (1 - distance / 105)) + ')';
            context.lineWidth = 0.6;
            context.stroke();
          }
        }
      });
      animationFrame = window.requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    drawParticles();
    window.addEventListener('resize', function () {
      window.cancelAnimationFrame(animationFrame);
      resizeCanvas();
      drawParticles();
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
      } else {
        window.cancelAnimationFrame(animationFrame);
        drawParticles();
      }
    });
  }
})();
