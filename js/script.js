// ===================================================
// Fundación Samantha - Lógica de interacción del sitio
// ===================================================

// Configuración del Menú de Celulares
const toggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('hidden');
  });

  // Cerrar menú al hacer clic en un enlace de navegación
  document.querySelectorAll('#navLinks a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.add('hidden');
    });
  });
}

// Control de Enlaces Activos en base al Scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section, header');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const id = section.getAttribute('id');
    if (id && section.offsetTop <= scrollPos && (section.offsetTop + section.offsetHeight) > scrollPos) {
      document.querySelectorAll('.nav-link').forEach(a => {
        a.classList.remove('text-brandRed-500', 'font-bold');
        if (a.getAttribute('href') === `#${id}`) {
          a.classList.add('text-brandRed-500', 'font-bold');
        }
      });
    }
  });
});

// Variables globales para el carrusel de diapositivas
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slide-dot');
let slideInterval;

// Función principal para alternar las diapositivas
function showSlide(index) {
  if (!slides.length || !dots.length) return;

  // Reiniciamos todas las diapositivas
  slides.forEach((slide) => {
    slide.classList.remove('opacity-100', 'scale-100');
    slide.classList.add('opacity-0', 'scale-95');
  });
  // Deseleccionamos los indicadores
  dots.forEach((dot) => {
    dot.classList.remove('bg-brandRed-500', 'w-3.5', 'h-3.5');
    dot.classList.add('bg-white/60', 'w-3', 'h-3');
  });

  // Activamos la diapositiva en el índice actual
  slides[index].classList.remove('opacity-0', 'scale-95');
  slides[index].classList.add('opacity-100', 'scale-100');

  dots[index].classList.remove('bg-white/60', 'w-3', 'h-3');
  dots[index].classList.add('bg-brandRed-500', 'w-3.5', 'h-3.5');

  currentSlide = index;
}

// Avanza la diapositiva secuencialmente
function nextSlide() {
  let next = (currentSlide + 1) % slides.length;
  showSlide(next);
}

// Salta a una diapositiva concreta al pulsar sobre su indicador
function goToSlide(index) {
  showSlide(index);
  clearInterval(slideInterval);
  startSlideShow();
}

// Inicia el temporizador de 5 segundos para la reproducción automática
function startSlideShow() {
  slideInterval = setInterval(nextSlide, 5000);
}

// Widgets interactivos para la calculadora de donativos
let selectedAmount = 50;

function updateDonation(amount, description) {
  selectedAmount = amount;
  const impactText = document.getElementById('impactText');
  if (impactText) impactText.textContent = `"${description}"`;

  // Actualizar visualmente los botones de donación
  document.querySelectorAll('.donation-btn').forEach(btn => {
    const btnAmount = parseInt(btn.getAttribute('data-amount'), 10);
    if (btnAmount === amount) {
      btn.className = "donation-btn py-3 px-2 rounded-xl text-center font-bold text-xs sm:text-sm bg-brandRed-500 text-white transition-colors focus:ring-2 focus:ring-brandRed-500";
    } else {
      btn.className = "donation-btn py-3 px-2 rounded-xl text-center font-bold text-xs sm:text-sm bg-white/10 hover:bg-brandRed-500 transition-colors focus:ring-2 focus:ring-brandRed-500";
    }
  });
}

// Gestión del cuadro modal de simulación
function triggerDonation() {
  const modal = document.getElementById('successModal');
  const modalText = document.getElementById('modalText');
  if (modalText) {
    modalText.textContent = `Has seleccionado donar $${selectedAmount} USD. Tu aporte ayudará directamente a financiar la salud de muchas personas.`;
  }
  if (modal) modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) modal.classList.add('hidden');
}

function openCitaModal() {
  const modal = document.getElementById('citaModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeCitaModal() {
  const modal = document.getElementById('citaModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Eventos para cerrar el modal al presionar ESC o dar clic en el fondo
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeCitaModal();
});

const citaModalEl = document.getElementById('citaModal');
if (citaModalEl) {
  citaModalEl.addEventListener('click', function (e) {
    if (e.target === citaModalEl) {
      closeCitaModal();
    }
  });
}

// Envío del formulario de citas por WhatsApp
const WHATSAPP_NUMERO = "526442137043"; // Número de la Fundación (formato internacional sin '+')

const citaForm = document.getElementById('citaForm');
if (citaForm) {
  citaForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const citaError = document.getElementById('citaError');
    if (citaError) citaError.classList.add('hidden');

    const servicio = document.getElementById('citaServicio').value.trim();
    const apPaterno = document.getElementById('citaApPaterno').value.trim();
    const apMaterno = document.getElementById('citaApMaterno').value.trim();
    const nombre = document.getElementById('citaNombre').value.trim();
    const curp = document.getElementById('citaCURP').value.trim().toUpperCase();
    const edad = document.getElementById('citaEdad').value.trim();
    const domicilio = document.getElementById('citaDomicilio').value.trim();
    const telefono = document.getElementById('citaTelefono').value.trim();

    // Validación de campos requeridos
    if (!servicio || !apPaterno || !apMaterno || !nombre || !curp || !edad || !domicilio || !telefono) {
      if (citaError) {
        citaError.textContent = "Por favor completa todos los campos.";
        citaError.classList.remove('hidden');
      }
      return;
    }

    // Validación de formato de CURP (18 caracteres)
    const curpRegex = /^[A-Z]{4}\d{6}[A-Z]{6}[A-Z0-9]\d$/;
    if (!curpRegex.test(curp)) {
      if (citaError) {
        citaError.textContent = "El CURP ingresado no tiene un formato válido (18 caracteres).";
        citaError.classList.remove('hidden');
      }
      return;
    }

    // Validación de teléfono (10 dígitos)
    const telefonoRegex = /^\d{10}$/;
    if (!telefonoRegex.test(telefono)) {
      if (citaError) {
        citaError.textContent = "El teléfono debe contener exactamente 10 dígitos.";
        citaError.classList.remove('hidden');
      }
      return;
    }

    // Construcción del mensaje prellenado
    const mensaje =
      `Hola, quiero apartar una cita en Fundación Samantha:\n\n` +
      `*Servicio:* ${servicio}\n` +
      `*Apellido Paterno:* ${apPaterno}\n` +
      `*Apellido Materno:* ${apMaterno}\n` +
      `*Nombre:* ${nombre}\n` +
      `*CURP:* ${curp}\n` +
      `*Edad:* ${edad}\n` +
      `*Domicilio:* ${domicilio}\n` +
      `*Teléfono:* ${telefono}`;

    const urlWhatsapp = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, '_blank');

    citaForm.reset();
    closeCitaModal();
  });
}

// Copiar CLABE al portapapeles
function copyCLABE() {
  const clabeText = "012180001234567890";
  const tempInput = document.createElement("input");
  tempInput.value = clabeText;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  const toast = document.getElementById("copyToast");
  if (toast) {
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 3000);
  }
}

// Three.js High-Definition 3D Card Engine
let bbvaScene, bbvaCamera, bbvaRenderer, bbvaCardMesh, bbvaControls;
let isBBVARotating = true;
let targetBBVARotationY = 0;

function renderFallbackCard(container) {
  container.innerHTML = `
    <div class="w-full h-full p-6 rounded-2xl bg-gradient-to-br from-[#ec0000] via-[#cc0000] to-[#880000] text-white flex flex-col justify-between shadow-xl border border-red-400/30 relative overflow-hidden">
      <div class="flex justify-between items-center z-10">
        <span class="font-extrabold text-2xl tracking-wider text-white flex items-center gap-2">
          <i class="fas fa-fire text-white"></i> Santander
        </span>
        <span class="text-xs font-semibold text-white/90">debit</span>
      </div>
      <div class="my-2 z-10">
        <div class="w-10 h-7 bg-amber-400 rounded-md border border-amber-600 mb-2"></div>
        <p class="font-mono text-sm sm:text-base font-bold tracking-widest text-white drop-shadow">0121 8000 1234 5678 90</p>
        <p class="text-[10px] text-white/80 mt-1">CLABE INTERBANCARIA (SPEI)</p>
      </div>
      <div class="flex justify-between items-end z-10">
        <p class="font-bold text-xs uppercase tracking-wider text-white">FUNDACIÓN SAMANTHA A.C.</p>
        <div class="flex -space-x-2">
          <div class="w-6 h-6 rounded-full bg-[#eb001b]"></div>
          <div class="w-6 h-6 rounded-full bg-[#ff5f00] opacity-90"></div>
        </div>
      </div>
    </div>
  `;
}

function initBBVA3DCard() {
  const container = document.getElementById('bbva-3d-canvas');
  if (!container) return;

  if (typeof THREE === 'undefined') {
    renderFallbackCard(container);
    return;
  }

  try {
    const initialW = container.clientWidth || 350;
    const initialH = container.clientHeight || 220;

    // Create Canvases for Front, Back and Bump Map
    const canvasF = document.createElement('canvas');
    canvasF.width = 1024;
    canvasF.height = 648;
    const ctxF = canvasF.getContext('2d');

    const canvasB = document.createElement('canvas');
    canvasB.width = 1024;
    canvasB.height = 648;
    const ctxB = canvasB.getContext('2d');

    const canvasBump = document.createElement('canvas');
    canvasBump.width = 1024;
    canvasBump.height = 648;
    const ctxBump = canvasBump.getContext('2d');

    // Helper for rounded rects on canvas
    function drawRoundRect(ctx, x, y, width, height, radius, fill, stroke) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    }

    // Draw EMV Chip
    function drawChip(ctx, x, y, w, h) {
      ctx.save();
      const chipGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      chipGrad.addColorStop(0, "#fef08a");
      chipGrad.addColorStop(0.5, "#eab308");
      chipGrad.addColorStop(1, "#ca8a04");

      ctx.fillStyle = chipGrad;
      drawRoundRect(ctx, x, y, w, h, 14, true, false);

      ctx.strokeStyle = "#854d0e";
      ctx.lineWidth = 1.5;
      drawRoundRect(ctx, x, y, w, h, 14, false, true);

      ctx.strokeStyle = "rgba(113, 63, 18, 0.6)";
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(x, y + h * 0.5);
      ctx.lineTo(x + w, y + h * 0.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + w * 0.33, y);
      ctx.lineTo(x + w * 0.33, y + h);
      ctx.moveTo(x + w * 0.66, y);
      ctx.lineTo(x + w * 0.66, y + h);
      ctx.stroke();

      drawRoundRect(ctx, x + w * 0.22, y + h * 0.22, w * 0.56, h * 0.56, 6, false, true);
      ctx.restore();
    }

    // Draw Santander Front Texture
    function drawSantanderFront() {
      const grad = ctxF.createLinearGradient(0, 0, 1024, 648);
      grad.addColorStop(0, '#e60000');
      grad.addColorStop(0.5, '#cc0000');
      grad.addColorStop(1, '#990000');
      ctxF.fillStyle = grad;
      ctxF.fillRect(0, 0, 1024, 648);

      ctxF.fillStyle = 'rgba(150, 0, 0, 0.45)';
      ctxF.beginPath();
      ctxF.moveTo(520, 648);
      ctxF.lineTo(1024, 648);
      ctxF.lineTo(1024, 260);
      ctxF.lineTo(760, 260);
      ctxF.lineTo(760, 420);
      ctxF.lineTo(520, 420);
      ctxF.closePath();
      ctxF.fill();

      ctxF.fillStyle = 'rgba(120, 0, 0, 0.55)';
      ctxF.beginPath();
      ctxF.moveTo(680, 648);
      ctxF.lineTo(1024, 648);
      ctxF.lineTo(1024, 380);
      ctxF.lineTo(840, 380);
      ctxF.lineTo(840, 500);
      ctxF.lineTo(680, 500);
      ctxF.closePath();
      ctxF.fill();

      ctxF.fillStyle = 'rgba(90, 0, 0, 0.6)';
      ctxF.beginPath();
      ctxF.moveTo(820, 648);
      ctxF.lineTo(1024, 648);
      ctxF.lineTo(1024, 480);
      ctxF.lineTo(820, 480);
      ctxF.closePath();
      ctxF.fill();

      // Santander Flame Logo
      ctxF.save();
      ctxF.fillStyle = '#ffffff';
      ctxF.beginPath();
      ctxF.moveTo(95, 115);
      ctxF.bezierCurveTo(70, 115, 50, 95, 50, 75);
      ctxF.bezierCurveTo(50, 50, 75, 40, 82, 25);
      ctxF.bezierCurveTo(86, 18, 85, 10, 80, 5);
      ctxF.bezierCurveTo(95, 12, 100, 25, 96, 35);
      ctxF.bezierCurveTo(92, 45, 82, 52, 85, 68);
      ctxF.bezierCurveTo(87, 75, 95, 78, 102, 72);
      ctxF.bezierCurveTo(112, 63, 110, 48, 105, 38);
      ctxF.bezierCurveTo(120, 50, 125, 70, 118, 88);
      ctxF.bezierCurveTo(114, 102, 105, 115, 95, 115);
      ctxF.fill();

      ctxF.beginPath();
      ctxF.moveTo(70, 78);
      ctxF.bezierCurveTo(62, 78, 58, 70, 60, 62);
      ctxF.bezierCurveTo(62, 54, 70, 48, 72, 40);
      ctxF.bezierCurveTo(76, 48, 74, 58, 68, 64);
      ctxF.bezierCurveTo(65, 67, 65, 74, 70, 78);
      ctxF.fill();

      ctxF.font = 'bold 54px Montserrat, sans-serif, Arial';
      ctxF.fillText('Santander', 140, 95);
      ctxF.restore();

      // "debit" text top right
      ctxF.fillStyle = '#ffffff';
      ctxF.font = '40px Montserrat, sans-serif, Arial';
      ctxF.fillText('debit', 860, 95);

      // EMV Chip
      drawChip(ctxF, 80, 195, 115, 85);

      // Contactless Wave Icon
      ctxF.strokeStyle = '#ffffff';
      ctxF.lineWidth = 4.5;
      ctxF.lineCap = 'round';
      for (let i = 1; i <= 3; i++) {
        ctxF.beginPath();
        ctxF.arc(225, 237, i * 14, -Math.PI / 3.2, Math.PI / 3.2);
        ctxF.stroke();
      }

      // Card Number
      ctxF.fillStyle = '#f1f5f9';
      ctxF.font = 'bold 48px monospace';
      ctxF.shadowColor = 'rgba(0,0,0,0.7)';
      ctxF.shadowOffsetX = 2;
      ctxF.shadowOffsetY = 2;
      ctxF.shadowBlur = 4;
      ctxF.fillText('0121 8000 1234 5678 90', 80, 380);

      // Expiry
      ctxF.font = 'bold 14px Montserrat, sans-serif, Arial';
      ctxF.fillText('VALID', 400, 440);
      ctxF.fillText('THRU', 400, 456);

      ctxF.font = 'bold 30px monospace';
      ctxF.fillText('12/30', 465, 452);

      // Cardholder Name
      ctxF.font = 'bold 34px Montserrat, sans-serif, Arial';
      ctxF.fillText('FUNDACIÓN SAMANTHA A.C.', 80, 540);

      // Reset Shadow
      ctxF.shadowColor = 'transparent';
      ctxF.shadowOffsetX = 0;
      ctxF.shadowOffsetY = 0;
      ctxF.shadowBlur = 0;

      // Mastercard Logo
      ctxF.save();
      ctxF.fillStyle = '#eb001b';
      ctxF.beginPath();
      ctxF.arc(855, 515, 42, 0, Math.PI * 2);
      ctxF.fill();

      ctxF.fillStyle = '#f79e1b';
      ctxF.beginPath();
      ctxF.arc(915, 515, 42, 0, Math.PI * 2);
      ctxF.fill();

      ctxF.fillStyle = '#ff5f00';
      ctxF.beginPath();
      ctxF.arc(855, 515, 42, 0, Math.PI * 2);
      ctxF.clip();
      ctxF.beginPath();
      ctxF.arc(915, 515, 42, 0, Math.PI * 2);
      ctxF.fill();

      ctxF.restore();

      ctxF.fillStyle = '#ffffff';
      ctxF.font = '600 18px Montserrat, sans-serif, Arial';
      ctxF.textAlign = 'center';
      ctxF.fillText('mastercard.', 885, 578);
      ctxF.textAlign = 'left';
    }

    // Draw Santander Back Texture
    function drawSantanderBack() {
      const grad = ctxB.createLinearGradient(0, 0, 1024, 648);
      grad.addColorStop(0, '#b30000');
      grad.addColorStop(1, '#800000');
      ctxB.fillStyle = grad;
      ctxB.fillRect(0, 0, 1024, 648);

      ctxB.fillStyle = '#1a1a1a';
      ctxB.fillRect(0, 60, 1024, 110);

      ctxB.fillStyle = '#f8fafc';
      ctxB.fillRect(80, 240, 600, 70);

      ctxB.strokeStyle = '#cbd5e1';
      ctxB.lineWidth = 2;
      for (let i = 90; i < 670; i += 22) {
        ctxB.beginPath();
        ctxB.moveTo(i, 240);
        ctxB.lineTo(i - 15, 310);
        ctxB.stroke();
      }

      ctxB.fillStyle = '#ffffff';
      ctxB.fillRect(720, 240, 120, 70);

      ctxB.fillStyle = '#0f172a';
      ctxB.font = 'bold 32px monospace';
      ctxB.fillText('888', 755, 285);

      ctxB.fillStyle = '#fecdd3';
      ctxB.font = 'bold 18px Montserrat, sans-serif, Arial';
      ctxB.fillText('FIRMA AUTORIZADA', 80, 225);
      ctxB.fillText('CVV', 720, 225);

      ctxB.fillStyle = '#ffffff';
      ctxB.font = '18px Montserrat, sans-serif, Arial';
      ctxB.fillText('Esta tarjeta pertenece a Fundación Samantha A.C.', 80, 380);
      ctxB.fillText('Banco Destino: Santander México', 80, 420);
      ctxB.fillText('Atención telefónica: +52 644 173 5806', 80, 460);
    }

    function drawBBVABump() {
      ctxBump.fillStyle = "#808080";
      ctxBump.fillRect(0, 0, 1024, 648);

      ctxBump.fillStyle = "#ffffff";
      ctxBump.font = 'bold 46px monospace';
      ctxBump.fillText('0121 8000 1234 5678 90', 80, 380);

      ctxBump.font = 'bold 34px Montserrat, sans-serif, Arial';
      ctxBump.fillText('FUNDACIÓN SAMANTHA A.C.', 80, 540);
    }

    drawSantanderFront();
    drawSantanderBack();
    drawBBVABump();

    const textureFront = new THREE.CanvasTexture(canvasF);
    const textureBack = new THREE.CanvasTexture(canvasB);
    const textureBump = new THREE.CanvasTexture(canvasBump);

    bbvaScene = new THREE.Scene();
    bbvaCamera = new THREE.PerspectiveCamera(40, initialW / initialH, 0.1, 100);
    bbvaCamera.position.set(0, 0, 4.8);

    bbvaRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    bbvaRenderer.setSize(initialW, initialH);
    bbvaRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    bbvaRenderer.shadowMap.enabled = true;
    bbvaRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(bbvaRenderer.domElement);

    if (typeof THREE.OrbitControls !== 'undefined') {
      bbvaControls = new THREE.OrbitControls(bbvaCamera, bbvaRenderer.domElement);
      bbvaControls.enableDamping = true;
      bbvaControls.dampingFactor = 0.05;
      bbvaControls.enableZoom = false;
      bbvaControls.enablePan = false;
    }

    const width = 3.6;
    const height = 2.28;
    const depth = 0.06;
    const radius = 0.18;

    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    const extrudeSettings = {
      steps: 1,
      depth: depth,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 3
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.computeVertexNormals();

    const posAttr = geometry.attributes.position;
    const normalAttr = geometry.attributes.normal;
    const uvs = geometry.attributes.uv;
    const indexAttr = geometry.index;

    geometry.clearGroups();

    const frontIndices = [];
    const backIndices = [];
    const edgeIndices = [];
    const numTriangles = indexAttr ? indexAttr.count / 3 : posAttr.count / 3;

    for (let i = 0; i < numTriangles; i++) {
      let a = indexAttr ? indexAttr.getX(i * 3) : i * 3;
      let b = indexAttr ? indexAttr.getX(i * 3 + 1) : i * 3 + 1;
      let c = indexAttr ? indexAttr.getX(i * 3 + 2) : i * 3 + 2;

      const avgNz = (normalAttr.getZ(a) + normalAttr.getZ(b) + normalAttr.getZ(c)) / 3;

      if (avgNz > 0.4) {
        frontIndices.push(a, b, c);
      } else if (avgNz < -0.4) {
        backIndices.push(a, b, c);
      } else {
        edgeIndices.push(a, b, c);
      }
    }

    geometry.setIndex([...frontIndices, ...backIndices, ...edgeIndices]);
    geometry.addGroup(0, frontIndices.length, 0);
    geometry.addGroup(frontIndices.length, backIndices.length, 1);
    geometry.addGroup(frontIndices.length + backIndices.length, edgeIndices.length, 2);

    for (let i = 0; i < posAttr.count; i++) {
      const px = posAttr.getX(i);
      const py = posAttr.getY(i);
      const nz = normalAttr.getZ(i);

      if (nz < -0.4) {
        const u = (width / 2 - px) / width;
        const v = (py + height / 2) / height;
        uvs.setXY(i, u, v);
      } else {
        const u = (px + width / 2) / width;
        const v = (py + height / 2) / height;
        uvs.setXY(i, u, v);
      }
    }
    uvs.needsUpdate = true;

    const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0xcc0000, metalness: 0.3, roughness: 0.3 });
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: textureFront,
      bumpMap: textureBump,
      bumpScale: 0.025,
      roughness: 0.2,
      metalness: 0.15,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1
    });
    const backMaterial = new THREE.MeshPhysicalMaterial({
      map: textureBack,
      roughness: 0.25,
      metalness: 0.1,
      clearcoat: 0.3
    });

    bbvaCardMesh = new THREE.Mesh(geometry, [frontMaterial, backMaterial, edgeMaterial]);
    bbvaCardMesh.castShadow = true;
    bbvaScene.add(bbvaCardMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    bbvaScene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 5, 5);
    bbvaScene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    fillLight.position.set(-5, -3, -3);
    bbvaScene.add(fillLight);

    container.addEventListener('pointerdown', () => { isBBVARotating = false; });

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (bbvaCardMesh) {
        if (isBBVARotating) {
          bbvaCardMesh.rotation.y = Math.sin(elapsedTime * 0.8) * 0.35;
          bbvaCardMesh.rotation.x = Math.cos(elapsedTime * 0.6) * 0.12;
        } else if (!bbvaControls) {
          bbvaCardMesh.rotation.y += (targetBBVARotationY - bbvaCardMesh.rotation.y) * 0.08;
        }
        bbvaCardMesh.position.y = Math.sin(elapsedTime * 1.5) * 0.06;
      }

      if (bbvaControls) bbvaControls.update();
      if (bbvaRenderer && bbvaScene && bbvaCamera) {
        bbvaRenderer.render(bbvaScene, bbvaCamera);
      }
    }
    animate();

    // Responsive Resizer
    const resizeCanvas = () => {
      if (!container || !bbvaRenderer || !bbvaCamera) return;
      const w = container.clientWidth || 350;
      const h = container.clientHeight || 220;
      bbvaCamera.aspect = w / h;
      bbvaCamera.updateProjectionMatrix();
      bbvaRenderer.setSize(w, h);
    };

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => resizeCanvas());
      ro.observe(container);
    } else {
      window.addEventListener('resize', resizeCanvas);
    }

  } catch (err) {
    console.warn("WebGL initialization failed, loading fallback card.", err);
    renderFallbackCard(container);
  }
}

function flipBBVACard() {
  isBBVARotating = false;
  if (bbvaCardMesh) {
    targetBBVARotationY = (bbvaCardMesh.rotation.y % (Math.PI * 2)) > Math.PI / 2 ? 0 : Math.PI;
    bbvaCardMesh.rotation.y += Math.PI;
  }
}

// Iniciamos la animación y la tarjeta 3D al completarse la carga de la página
window.onload = function() {
  startSlideShow();
  setTimeout(initBBVA3DCard, 50);
};
