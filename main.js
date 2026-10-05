// scripts principales del portafolio
// todo es modular por si algo falla, no se caiga el resto de la pag

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initYear();
  initTheme();
  initCmdMenu();
  initTypewriter();
  initCertModal(); // el modal de los diplomas que no abria
  initCanvasEffect(); // el efecto de particulas del footer
});

// le pone la clase al header cuando haces scroll para q se vea el blur
function initHeaderScroll() {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  
  const THRESHOLD = 12;
  let ticking = false;

  const updateState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateState);
      ticking = true;
    }
  }, { passive: true });

  updateState();
}

// pone el año actual automatico pa q no quede viejo el footer
function initYear() {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// logica pal cambio de tema (oscuro, dia, crema) con localStorage
function initTheme() {
  const buttons = document.querySelectorAll("[data-set-theme]");
  if (!buttons.length) return;
  
  // si ya habia elegido uno antes, lo carga
  const savedTheme = localStorage.getItem("portfolio-theme") || "industrial";
  applyTheme(savedTheme);

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-set-theme");
      applyTheme(theme);
      localStorage.setItem("portfolio-theme", theme);
    });
  });

  function applyTheme(themeName) {
    document.documentElement.setAttribute("data-theme", themeName);
    buttons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-set-theme") === themeName);
    });
  }
}

// la paleta de comandos magica (cmd+k)
function initCmdMenu() {
  const menu = document.getElementById("cmd-menu");
  const input = document.getElementById("cmd-input");
  const list = document.getElementById("cmd-list");
  if (!menu || !input || !list) return;

  const openMenu = () => {
    menu.removeAttribute("hidden");
    input.value = "";
    input.focus();
    document.body.style.overflow = "hidden"; // bloquea el scroll de fondo
  };

  const closeMenu = () => {
    menu.setAttribute("hidden", "");
    document.body.style.overflow = "";
  };

  // atajo de teclado global
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      menu.hasAttribute("hidden") ? openMenu() : closeMenu();
    } else if (e.key === "Escape" && !menu.hasAttribute("hidden")) {
      closeMenu();
    }
  });

  // pa cerrar haciendo click fuera
  document.querySelectorAll("[data-cmd-close]").forEach((el) => {
    el.addEventListener("click", closeMenu);
  });

  // delegacion de eventos a los botones del menu
  list.addEventListener("click", (e) => {
    const item = e.target.closest(".cmd-menu__item");
    if (!item) return;
    const action = item.getAttribute("data-action");

    if (action === "navigate") {
      const targetSelector = item.getAttribute("data-target");
      const target = document.querySelector(targetSelector);
      closeMenu();
      if (target) target.scrollIntoView({ behavior: "smooth" });
    } else if (action === "theme") {
      const theme = item.getAttribute("data-theme");
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("portfolio-theme", theme);
      document.querySelectorAll("[data-set-theme]").forEach((btn) => {
        btn.classList.toggle("is-active", btn.getAttribute("data-set-theme") === theme);
      });
      closeMenu();
    } else if (action === "copy-email") {
      navigator.clipboard.writeText("joteztestudio@gmail.com").then(() => {
        const badge = document.getElementById("cmd-copy-badge");
        if (badge) badge.textContent = "¡Copiado!";
        setTimeout(() => {
          if (badge) badge.textContent = "Copiar";
          closeMenu();
        }, 700);
      });
    } else if (action === "link") {
      const url = item.getAttribute("data-url");
      closeMenu();
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    }
  });
}

// efectito de la maquina de escribir del titulo
function initTypewriter() {
  const target = document.querySelector("[data-typewriter]");
  const cursor = document.querySelector(".typewriter-cursor");
  if (!target) return;

  const fullText = target.getAttribute("data-typewriter");
  target.textContent = "";
  let index = 0;

  setTimeout(() => {
    function typeChar() {
      if (index < fullText.length) {
        target.textContent += fullText.charAt(index);
        index++;
        // velcoidad random pa q parezca mas natural (entre 60 y 105ms)
        const randomSpeed = Math.floor(Math.random() * 45) + 60;
        setTimeout(typeChar, randomSpeed);
      } else {
        if (cursor) cursor.classList.add("is-finished");
      }
    }
    typeChar();
  }, 250);
}

// logica para q abra la foto de los diplomas en un lightbox
function initCertModal() {
  const modal = document.getElementById("certModal");
  const imgEl = document.getElementById("certImage");
  // pilla todos los botones q tengan data-cert-image
  const certBtns = document.querySelectorAll("button[data-cert-image]");
  
  if (!modal || !imgEl || certBtns.length === 0) return;

  const closeMenu = () => {
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // devuelve el scroll
    
    // limpia la img medio seg despues pa q la animacion de salida no parpadee
    setTimeout(() => {
      imgEl.src = "";
    }, 300);
  };

  // le metemos el evento a cada boton del html
  certBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-cert-image");
      if (src) {
        imgEl.src = src;
        modal.classList.add("is-active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // cerrar modal con la X o dando click al fondo oscuro
  const closeBtn = modal.querySelector(".cert-modal__close");
  const backdrop = modal.querySelector(".cert-modal__backdrop");
  
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  if (backdrop) backdrop.addEventListener("click", closeMenu);
  
  // por si le dan a la tecla escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-active")) {
      closeMenu();
    }
  });
}

// particulas del footer q tenias antes 
function initCanvasEffect() {
  const canvas = document.getElementById('canvas-arte-codigo');
  const footer = document.querySelector('.footer-interactivo');
  
  if (!canvas || !footer) return; 

  const ctx = canvas.getContext('2d');

  function redimensionarCanvas() {
    canvas.width = footer.offsetWidth;
    canvas.height = footer.offsetHeight;
  }
  window.addEventListener('resize', redimensionarCanvas);
  redimensionarCanvas();

  const particulas = [];
  const colores = ['#ff5500', '#ff7733', '#cc4400', '#ff9966'];
  const simbolosCodigo = ['{', '}', '< />', ';', '=>'];

  class Particula {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.esCodigo = Math.random() > 0.85; 
      this.simbolo = simbolosCodigo[Math.floor(Math.random() * simbolosCodigo.length)];
      this.size = Math.random() * 15 + 5;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.color = colores[Math.floor(Math.random() * colores.length)];
      this.opacidad = 1;
    }

    actualizar() {
      this.x += this.speedX;
      this.y -= Math.abs(this.speedY); 
      this.opacidad -= 0.02; 
      if (this.size > 0.2) this.size -= 0.1;
    }

    dibujar() {
      ctx.globalAlpha = Math.max(0, this.opacidad);
      ctx.fillStyle = this.color;

      if (this.esCodigo) {
        ctx.font = `${this.size * 1.5}px monospace`;
        ctx.fillText(this.simbolo, this.x, this.y);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  footer.addEventListener('mousemove', (e) => {
    const rect = footer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    for (let i = 0; i < 3; i++) {
      particulas.push(new Particula(x, y));
    }
  });

  function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particulas.length; i++) {
      particulas[i].actualizar();
      particulas[i].dibujar();
      
      if (particulas[i].opacidad <= 0) {
        particulas.splice(i, 1);
        i--;
      }
    }
    requestAnimationFrame(animar);
  }
  animar();
}