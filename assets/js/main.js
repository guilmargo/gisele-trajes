/* =============================================
   GISELE TRAJES — JavaScript Principal
   ============================================= */

// ---- MENU MOBILE ----
function toggleMenu() {
  const nav = document.getElementById('mobileNav');
  nav.classList.toggle('open');
}

// Fechar ao clicar fora
document.addEventListener('click', function(e) {
  const nav = document.getElementById('mobileNav');
  const toggle = document.querySelector('.menu-toggle');
  if (nav && nav.classList.contains('open')) {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
    }
  }
});

// ---- HEADER SCROLL ----
window.addEventListener('scroll', function() {
  const header = document.querySelector('.site-header');
  if (header) {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  }
});

// ---- FILTRO DE TRAJES ----
function filterCategory(cat) {
  // Atualizar botões
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Mostrar/ocultar seções
  document.querySelectorAll('.gallery-section').forEach(section => {
    if (cat === 'all') {
      section.style.display = 'block';
    } else {
      section.style.display = section.dataset.category === cat ? 'block' : 'none';
    }
  });

  // Scroll suave para a seção
  if (cat !== 'all') {
    const target = document.getElementById(cat);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }
}

// ---- FORMULÁRIO DE CONTATO ----
function submitForm(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  // Aqui você pode integrar com um serviço de email (Formspree, EmailJS, etc.)
  // Por agora, simula o envio
  form.style.display = 'none';
  success.style.display = 'block';

  // Para integrar com Formspree: altere o action do form para https://formspree.io/f/SEU_ID
  // e remova o onsubmit="submitForm(event)"
}

// ---- LAZY LOADING DE IMAGENS ----
// O atributo loading="lazy" é nativo, mas adicionamos um fallback
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        imageObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ---- ANIMAÇÕES DE ENTRADA ----
if ('IntersectionObserver' in window) {
  const animElements = document.querySelectorAll(
    '.category-card, .testimonial-card, .gallery-item, .contact-item, .stat, .highlight-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${i * 0.05}s`;
        entry.target.classList.add('fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ---- CARREGAR IMAGENS DO REPOSITÓRIO DE IMAGENS ----
/*
  COMO USAR O REPOSITÓRIO SEPARADO DE IMAGENS:
  
  1. Crie um segundo repositório no GitHub chamado, por ex: "gisele-trajes-imagens"
  2. Ative o GitHub Pages nele (Settings > Pages)
  3. Adicione suas imagens lá semanalmente
  4. Altere a variável IMAGE_REPO_URL abaixo para a URL do seu repositório
  5. As imagens serão carregadas automaticamente

  Formato esperado do arquivo images.json no repositório de imagens:
  {
    "destaques": [
      { "src": "novas/vestido1.jpg", "alt": "Vestido X", "label": "Novo" },
      { "src": "novas/vestido2.jpg", "alt": "Vestido Y", "label": "Novo" }
    ]
  }
*/

const IMAGE_REPO_URL = 'https://SEU_USUARIO.github.io/gisele-trajes-imagens';

async function loadWeeklyImages() {
  try {
    const response = await fetch(`${IMAGE_REPO_URL}/images.json`);
    if (!response.ok) return;
    const data = await response.json();

    if (data.destaques && data.destaques.length > 0) {
      const grid = document.getElementById('highlightsGrid');
      if (!grid) return;

      grid.innerHTML = data.destaques.map(img => `
        <div class="highlight-card">
          <div class="highlight-img">
            <img src="${IMAGE_REPO_URL}/${img.src}" alt="${img.alt}" loading="lazy">
          </div>
          <p class="highlight-label">${img.label || 'Novo'}</p>
        </div>
      `).join('');
    }
  } catch (err) {
    // Mantém as imagens padrão caso o repositório não esteja configurado
    console.log('Repositório de imagens não configurado ainda. Usando imagens locais.');
  }
}

// Carrega imagens da semana se estiver na home
if (document.getElementById('highlightsGrid')) {
  loadWeeklyImages();
}
