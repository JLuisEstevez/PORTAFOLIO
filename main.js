/**
 * main.js
 * Micro-interacciones del portafolio. Sin dependencias externas.
 * Todo el JS es progresivo: si algo falla, el sitio sigue siendo
 * navegable porque no depende de este archivo para renderizar contenido.
 */


/**
 * Añade un estado visual al header cuando la página se desplaza,
 * para reforzar la separación del contenido sin depender solo del blur.
 * Usa un pequeño umbral (12px) para evitar parpadeos con el bounce
 * scroll de algunos navegadores.
 */
function initHeaderScrollState() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const THRESHOLD = 12;
  let ticking = false;

  const updateState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateState);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateState();
}

/**
 * Escribe el año actual en el footer, para no dejar un "© 2024" fijo
 * envejeciendo en el código.
 */
function initCurrentYear() {
  const yearEl = document.querySelector("[data-year]");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScrollState(); //
  initCurrentYear();       //
  initThemeSwitcher();     //[cite: 3]
  initTypewriter();        // <-- Añade esta línea
});

/**
 * Controlador de Sistema de Diseño / Paleta viva
 * Aplica el tema seleccionado al elemento <html> y guarda la preferencia en localStorage.
 */
function initThemeSwitcher() {
  const buttons = document.querySelectorAll("[data-set-theme]");
  if (!buttons.length) return;

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

/**
 * Efecto máquina de escribir (Typewriter) en la primera carga
 */
function initTypewriter() {
  const target = document.querySelector("[data-typewriter]");
  const cursor = document.querySelector(".typewriter-cursor");
  if (!target) return;

  const fullText = target.getAttribute("data-typewriter");
  target.textContent = ""; // Inicia vacío
  let index = 0;

  // Pequeño retardo de entrada (300ms) para que coordine con la carga inicial
  setTimeout(() => {
    function typeChar() {
      if (index < fullText.length) {
        target.textContent += fullText.charAt(index);
        index++;
        
        // Ritmo orgánico con leves variaciones entre caracteres (60ms a 105ms)
        const randomSpeed = Math.floor(Math.random() * 45) + 60;
        setTimeout(typeChar, randomSpeed);
      } else {
        // Al terminar, le indica al cursor que empiece su ciclo final
        if (cursor) {
          cursor.classList.add("is-finished");
        }
      }
    }
    typeChar();
  }, 300);
}








document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas-arte-codigo');
  const footer = document.querySelector('.footer-interactivo');
  
  // Si no encuentra el canvas o el footer, detenemos el código para que no de error
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
});