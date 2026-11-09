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

  slides.forEach((slide) => {
    slide.classList.remove('opacity-100', 'scale-100');
    slide.classList.add('opacity-0', 'scale-95');
  });
  dots.forEach((dot) => {
    dot.classList.remove('bg-brandRed-500', 'w-3.5', 'h-3.5');
    dot.classList.add('bg-white/60', 'w-3', 'h-3');
  });

  slides[index].classList.remove('opacity-0', 'scale-95');
  slides[index].classList.add('opacity-100', 'scale-100');

  dots[index].classList.remove('bg-white/60', 'w-3', 'h-3');
  dots[index].classList.add('bg-brandRed-500', 'w-3.5', 'h-3.5');

  currentSlide = index;
}

function nextSlide() {
  const next = (currentSlide + 1) % slides.length;
  showSlide(next);
}

function goToSlide(index) {
  showSlide(index);
  clearInterval(slideInterval);
  startSlideShow();
}

function startSlideShow() {
  slideInterval = setInterval(nextSlide, 5000);
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
const WHATSAPP_NUMERO = "526442496184"; // Número de la Fundación (formato internacional sin '+')

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

    if (!servicio || !apPaterno || !apMaterno || !nombre || !curp || !edad || !domicilio || !telefono) {
      if (citaError) {
        citaError.textContent = "Por favor completa todos los campos.";
        citaError.classList.remove('hidden');
      }
      return;
    }

    const curpRegex = /^[A-Z]{4}\d{6}[A-Z]{6}[A-Z0-9]\d$/;
    if (!curpRegex.test(curp)) {
      if (citaError) {
        citaError.textContent = "El CURP ingresado no tiene un formato válido (18 caracteres).";
        citaError.classList.remove('hidden');
      }
      return;
    }

    const telefonoRegex = /^\d{10}$/;
    if (!telefonoRegex.test(telefono)) {
      if (citaError) {
        citaError.textContent = "El teléfono debe contener exactamente 10 dígitos.";
        citaError.classList.remove('hidden');
      }
      return;
    }

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

function copyTextFallback(text) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  tempInput.setAttribute('readonly', '');
  tempInput.style.position = 'fixed';
  tempInput.style.opacity = '0';
  document.body.appendChild(tempInput);
  tempInput.select();

  try {
    return document.execCommand('copy');
  } finally {
    tempInput.remove();
  }
}

async function copyCLABE() {
  const clabeText = '014767220005533717';
  const status = document.getElementById('copyToast');

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(clabeText);
    } else if (!copyTextFallback(clabeText)) {
      throw new Error('El navegador no permitió copiar al portapapeles.');
    }

    if (status) status.textContent = '¡CLABE copiada al portapapeles!';
  } catch (error) {
    if (status) status.textContent = 'No se pudo copiar. Selecciona la CLABE y cópiala manualmente.';
    console.error('No se pudo copiar la CLABE.', error);
  }
}

const donationCard = document.getElementById('donationCard');
const donationCardCanvas = document.getElementById('donationCardCanvas');
let donationRotationX = 0;
let donationRotationY = 0;
let donationCardMesh = null;
let donationCardRenderer = null;
let donationCardTargetY = 0;

function renderDonationCardRotation() {
  if (!donationCard) return;

  const isFlipped = donationCardMesh
    ? Math.cos(donationCardMesh.rotation.y) < 0
    : Math.cos(donationRotationY * Math.PI / 180) < 0;
  donationCard.setAttribute('aria-pressed', String(isFlipped));

  const stage = donationCard.closest('.donation-card-stage');
  if (stage) {
    const yaw = donationCardMesh ? donationCardMesh.rotation.y : donationRotationY * Math.PI / 180;
    const pitch = donationCardMesh ? donationCardMesh.rotation.x : donationRotationX * Math.PI / 180;
    const edgeOn = Math.abs(Math.cos(yaw));
    stage.style.setProperty('--shadow-x', `${Math.sin(yaw) * 18}px`);
    stage.style.setProperty('--shadow-y', `${8 + Math.abs(pitch) * 10}px`);
    stage.style.setProperty('--shadow-scale', `${0.62 + edgeOn * 0.38}`);
    stage.style.setProperty('--shadow-opacity', `${0.18 + edgeOn * 0.2}`);
  }

  if (!donationCardMesh) {
    const normalizedYaw = ((donationRotationY % 360) + 360) % 360;
    const displayedYaw = isFlipped
      ? normalizedYaw - 180
      : normalizedYaw > 270 ? normalizedYaw - 360 : normalizedYaw;
    donationCard.style.setProperty('--card-rotate-x', `${donationRotationX}deg`);
    donationCard.style.setProperty('--card-rotate-y', `${displayedYaw}deg`);
    donationCard.classList.toggle('is-flipped', isFlipped);
  }
}

function flipDonationCard() {
  if (!donationCard) return;
  const isFlipped = donationCardMesh
    ? Math.cos(donationCardMesh.rotation.y) < 0
    : Math.cos(donationRotationY * Math.PI / 180) < 0;

  if (donationCardMesh) {
    donationCardTargetY = donationCardMesh.rotation.y + (isFlipped ? -Math.PI : Math.PI);
  } else {
    donationRotationY = isFlipped ? 0 : 180;
  }
  renderDonationCardRotation();
}

function drawDonationCardTextures() {
  const width = 1024;
  const height = 648;
  const frontCanvas = document.createElement('canvas');
  const backCanvas = document.createElement('canvas');
  frontCanvas.width = backCanvas.width = width;
  frontCanvas.height = backCanvas.height = height;

  const front = frontCanvas.getContext('2d');
  const back = backCanvas.getContext('2d');
  if (!front || !back) throw new Error('No se pudieron crear las texturas de la tarjeta.');

  const frontGradient = front.createLinearGradient(0, 0, width, height);
  frontGradient.addColorStop(0, '#ed0000');
  frontGradient.addColorStop(.52, '#e60000');
  frontGradient.addColorStop(1, '#c90000');
  front.fillStyle = frontGradient;
  front.fillRect(0, 0, width, height);

  front.fillStyle = 'rgba(110, 0, 0, .18)';
  front.beginPath();
  front.moveTo(620, height);
  front.lineTo(width, height);
  front.lineTo(width, 360);
  front.lineTo(850, 360);
  front.lineTo(850, 500);
  front.lineTo(620, 500);
  front.closePath();
  front.fill();

  front.save();
  front.translate(90, 88);
  front.scale(.9, .9);
  front.fillStyle = '#dedede';
  front.beginPath();
  front.moveTo(25, 2);
  front.bezierCurveTo(30, 26, 4, 39, 3, 62);
  front.bezierCurveTo(1, 82, 20, 98, 43, 101);
  front.bezierCurveTo(29, 82, 35, 67, 51, 49);
  front.bezierCurveTo(67, 30, 61, 13, 57, 0);
  front.bezierCurveTo(53, 24, 35, 37, 25, 2);
  front.fill();
  front.font = '600 60px Montserrat, Arial, sans-serif';
  front.fillText('Santander', 92, 82);
  front.restore();

  front.fillStyle = '#fff';
  front.font = '700 38px Montserrat, Arial, sans-serif';
  front.textAlign = 'right';
  front.fillText('Débito', 950, 120);
  front.textAlign = 'left';

  const chipGradient = front.createLinearGradient(90, 225, 250, 365);
  chipGradient.addColorStop(0, '#fff0bd');
  chipGradient.addColorStop(.5, '#d7bd77');
  chipGradient.addColorStop(1, '#f8e6a8');
  front.fillStyle = chipGradient;
  front.strokeStyle = '#866d39';
  front.lineWidth = 5;
  front.beginPath();
  front.moveTo(108, 225);
  front.lineTo(232, 225);
  front.quadraticCurveTo(250, 225, 250, 243);
  front.lineTo(250, 332);
  front.quadraticCurveTo(250, 350, 232, 350);
  front.lineTo(108, 350);
  front.quadraticCurveTo(90, 350, 90, 332);
  front.lineTo(90, 243);
  front.quadraticCurveTo(90, 225, 108, 225);
  front.fill();
  front.stroke();
  front.strokeStyle = 'rgba(100, 75, 35, .7)';
  front.lineWidth = 3;
  front.beginPath();
  front.moveTo(145, 227); front.lineTo(145, 348);
  front.moveTo(195, 227); front.lineTo(195, 348);
  front.moveTo(92, 285); front.lineTo(248, 285);
  front.stroke();

  front.strokeStyle = '#f2dddd';
  front.lineWidth = 10;
  front.lineCap = 'round';
  for (let i = 1; i <= 3; i++) {
    front.beginPath();
    front.arc(300, 286, i * 27, -Math.PI / 3, Math.PI / 3);
    front.stroke();
  }

  front.fillStyle = 'rgba(255,255,255,.82)';
  front.font = '500 34px Montserrat, Arial, sans-serif';
  front.fillText('Santander México', 90, 430);
  front.fillStyle = '#fff';
  front.font = '600 54px monospace';
  front.shadowColor = 'rgba(70,0,0,.4)';
  front.shadowBlur = 5;
  front.shadowOffsetY = 3;
  front.fillText('0147 6722 0005 5337 17', 90, 510);
  front.shadowColor = 'transparent';
  front.shadowBlur = 0;
  front.shadowOffsetY = 0;
  front.font = '700 25px Montserrat, Arial, sans-serif';
  front.fillText('FUNDACION SAMANTHA CAROLINA QUINTERO ARMENTA IAP', 90, 580, 720);

  front.fillStyle = '#eb001b';
  front.beginPath();
  front.arc(850, 520, 58, 0, Math.PI * 2);
  front.fill();
  front.fillStyle = '#f79e1b';
  front.beginPath();
  front.arc(920, 520, 58, 0, Math.PI * 2);
  front.fill();
  front.fillStyle = '#fff';
  front.font = '600 20px Arial, sans-serif';
  front.textAlign = 'center';
  front.fillText('mastercard', 885, 602);
  front.textAlign = 'left';

  const backGradient = back.createLinearGradient(0, 0, width, height);
  backGradient.addColorStop(0, '#e00000');
  backGradient.addColorStop(.6, '#c90000');
  backGradient.addColorStop(1, '#a90000');
  back.fillStyle = backGradient;
  back.fillRect(0, 0, width, height);
  back.fillStyle = '#b90000';
  back.fillRect(0, 0, width, 105);
  back.fillStyle = 'rgba(255,255,255,.9)';
  back.font = '700 25px Montserrat, Arial, sans-serif';
  back.fillText('SANTANDER MÉXICO', 58, 65);
  back.textAlign = 'right';
  back.fillText('CUENTA PARA DONATIVOS', 966, 65);
  back.textAlign = 'left';

  const stripeGradient = back.createLinearGradient(0, 110, 0, 285);
  stripeGradient.addColorStop(0, '#e8e3e4');
  stripeGradient.addColorStop(.5, '#c7bfc1');
  stripeGradient.addColorStop(1, '#eee9ea');
  back.fillStyle = stripeGradient;
  back.fillRect(0, 108, width, 175);
  back.strokeStyle = 'rgba(255,255,255,.22)';
  back.lineWidth = 2;
  for (let y = 116; y < 280; y += 12) {
    back.beginPath();
    back.moveTo(0, y);
    back.lineTo(width, y);
    back.stroke();
  }

  back.fillStyle = 'rgba(255,255,255,.9)';
  back.font = '700 26px Montserrat, Arial, sans-serif';
  back.fillText('CLABE INTERBANCARIA · SPEI', 88, 350);
  back.fillStyle = '#fff8f8';
  back.fillRect(88, 380, 848, 105);
  back.strokeStyle = 'rgba(100,35,35,.25)';
  back.lineWidth = 2;
  for (let x = 95; x < 930; x += 22) {
    back.beginPath();
    back.moveTo(x, 482);
    back.lineTo(x + 75, 382);
    back.stroke();
  }
  back.fillStyle = '#542626';
  back.font = '700 51px monospace';
  back.fillText('0147 6722 0005 5337 17', 112, 448);
  back.fillStyle = 'rgba(255,255,255,.72)';
  back.font = '700 23px Montserrat, Arial, sans-serif';
  back.fillText('TITULAR DE LA CUENTA', 88, 535);
  back.fillStyle = '#fff';
  back.font = '700 25px Montserrat, Arial, sans-serif';
  back.fillText('FUNDACION SAMANTHA CAROLINA QUINTERO ARMENTA IAP', 88, 585, 845);
  back.textAlign = 'right';
  back.font = '600 21px Montserrat, Arial, sans-serif';
  back.fillText('Santander México', 950, 620);
  back.textAlign = 'left';

  return { frontCanvas, backCanvas };
}

function createRoundedDonationCardGeometry(THREE) {
  const width = 3.6;
  const height = width / 1.586;
  const radius = .22;
  const shape = new THREE.Shape();
  const left = -width / 2;
  const bottom = -height / 2;
  shape.moveTo(left + radius, bottom);
  shape.lineTo(left + width - radius, bottom);
  shape.quadraticCurveTo(left + width, bottom, left + width, bottom + radius);
  shape.lineTo(left + width, bottom + height - radius);
  shape.quadraticCurveTo(left + width, bottom + height, left + width - radius, bottom + height);
  shape.lineTo(left + radius, bottom + height);
  shape.quadraticCurveTo(left, bottom + height, left, bottom + height - radius);
  shape.lineTo(left, bottom + radius);
  shape.quadraticCurveTo(left, bottom, left + radius, bottom);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: .075,
    bevelEnabled: true,
    bevelThickness: .012,
    bevelSize: .012,
    bevelSegments: 4,
    curveSegments: 12
  });
  geometry.center();
  geometry.computeVertexNormals();

  const position = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const uv = geometry.attributes.uv;
  const index = geometry.index;
  const front = [];
  const back = [];
  const sides = [];
  const triangleCount = index ? index.count / 3 : position.count / 3;

  for (let triangle = 0; triangle < triangleCount; triangle++) {
    const a = index ? index.getX(triangle * 3) : triangle * 3;
    const b = index ? index.getX(triangle * 3 + 1) : triangle * 3 + 1;
    const c = index ? index.getX(triangle * 3 + 2) : triangle * 3 + 2;
    const avgZ = (normal.getZ(a) + normal.getZ(b) + normal.getZ(c)) / 3;
    const target = avgZ > .4 ? front : avgZ < -.4 ? back : sides;
    target.push(a, b, c);
  }

  geometry.setIndex([...front, ...back, ...sides]);
  geometry.clearGroups();
  geometry.addGroup(0, front.length, 0);
  geometry.addGroup(front.length, back.length, 1);
  geometry.addGroup(front.length + back.length, sides.length, 2);

  for (let vertex = 0; vertex < position.count; vertex++) {
    const x = position.getX(vertex);
    const y = position.getY(vertex);
    const zNormal = normal.getZ(vertex);
    if (zNormal < -.4) {
      uv.setXY(vertex, (width / 2 - x) / width, (y + height / 2) / height);
    } else {
      uv.setXY(vertex, (x + width / 2) / width, (y + height / 2) / height);
    }
  }
  uv.needsUpdate = true;
  return geometry;
}

function initializeDonationCard3D() {
  if (!donationCardCanvas || typeof THREE === 'undefined') return;

  try {
    const { frontCanvas, backCanvas } = drawDonationCardTextures();
    const textureFront = new THREE.CanvasTexture(frontCanvas);
    const textureBack = new THREE.CanvasTexture(backCanvas);
    textureFront.colorSpace = THREE.SRGBColorSpace || undefined;
    textureBack.colorSpace = THREE.SRGBColorSpace || undefined;
    if ('encoding' in textureFront && THREE.sRGBEncoding) {
      textureFront.encoding = THREE.sRGBEncoding;
      textureBack.encoding = THREE.sRGBEncoding;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1.586, .1, 100);
    camera.position.set(0, 0, 4.65);

    donationCardRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    donationCardRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    donationCardRenderer.shadowMap.enabled = true;
    donationCardRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if ('outputColorSpace' in donationCardRenderer && THREE.SRGBColorSpace) {
      donationCardRenderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      donationCardRenderer.outputEncoding = THREE.sRGBEncoding;
    }
    donationCardCanvas.replaceChildren(donationCardRenderer.domElement);
    donationCard.classList.add('has-webgl');

    const geometry = createRoundedDonationCardGeometry(THREE);
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xc90000,
      metalness: .28,
      roughness: .3
    });
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: textureFront,
      roughness: .24,
      metalness: .08,
      clearcoat: .8,
      clearcoatRoughness: .16
    });
    const backMaterial = new THREE.MeshPhysicalMaterial({
      map: textureBack,
      roughness: .3,
      metalness: .04,
      clearcoat: .5,
      clearcoatRoughness: .22
    });

    donationCardMesh = new THREE.Mesh(geometry, [frontMaterial, backMaterial, edgeMaterial]);
    donationCardMesh.rotation.set(-.08, .08, 0);
    donationCardTargetY = donationCardMesh.rotation.y;
    donationCardMesh.castShadow = true;
    scene.add(donationCardMesh);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x4c0b0b, 2));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(-3, 4, 6);
    scene.add(keyLight);

    const redFill = new THREE.DirectionalLight(0xffb0a0, .75);
    redFill.position.set(4, -2, 3);
    scene.add(redFill);

    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 128;
    const shadowContext = shadowCanvas.getContext('2d');
    if (shadowContext) {
      const gradient = shadowContext.createRadialGradient(128, 64, 5, 128, 64, 64);
      gradient.addColorStop(0, 'rgba(20, 15, 20, .42)');
      gradient.addColorStop(.55, 'rgba(20, 15, 20, .18)');
      gradient.addColorStop(1, 'rgba(20, 15, 20, 0)');
      shadowContext.fillStyle = gradient;
      shadowContext.fillRect(0, 0, 256, 128);
      const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(4.5, 1.2),
        new THREE.MeshBasicMaterial({
          map: new THREE.CanvasTexture(shadowCanvas),
          transparent: true,
          depthWrite: false
        })
      );
      shadowPlane.position.set(0, -1.15, -.2);
      shadowPlane.renderOrder = -1;
      scene.add(shadowPlane);
    }

    const resize = () => {
      const { width, height } = donationCardCanvas.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      donationCardRenderer.setSize(width, height, false);
    };
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(donationCardCanvas);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();

    let animationFrame;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      if (!cardIsDragging) {
        donationCardMesh.rotation.y += (donationCardTargetY - donationCardMesh.rotation.y) * .12;
      }
      donationCardRenderer.render(scene, camera);
      renderDonationCardRotation();
    };
    animate();

    donationCardRenderer.domElement.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      cancelAnimationFrame(animationFrame);
      donationCard.classList.remove('has-webgl');
      donationCardMesh = null;
      console.error('Se perdió el contexto WebGL de la tarjeta 3D.');
    });
  } catch (error) {
    donationCard.classList.remove('has-webgl');
    donationCardMesh = null;
    console.error('No se pudo iniciar la tarjeta 3D; se mantiene el diseño alternativo.', error);
  }
}

let cardIsDragging = false;
if (donationCard) {
  let activePointerId = null;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let dragged = false;

  donationCard.addEventListener('pointerdown', event => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;

    activePointerId = event.pointerId;
    startX = lastX = event.clientX;
    startY = lastY = event.clientY;
    dragged = false;
    cardIsDragging = true;
    donationCard.classList.add('is-dragging');
    donationCard.setPointerCapture(event.pointerId);
  });

  donationCard.addEventListener('pointermove', event => {
    if (event.pointerId !== activePointerId) return;

    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;
    if (Math.abs(event.clientX - startX) + Math.abs(event.clientY - startY) > 6) {
      dragged = true;
    }

    if (dragged) {
      if (donationCardMesh) {
        donationCardMesh.rotation.y += deltaX * .012;
        donationCardMesh.rotation.x = Math.max(-.8, Math.min(.8, donationCardMesh.rotation.x + deltaY * .01));
        donationCardTargetY = donationCardMesh.rotation.y;
      } else {
        donationRotationY += deltaX * .7;
        donationRotationX = Math.max(-35, Math.min(35, donationRotationX - deltaY * .7));
      }
      renderDonationCardRotation();
    }

    lastX = event.clientX;
    lastY = event.clientY;
  });

  const finishCardDrag = event => {
    if (event.pointerId !== activePointerId) return;
    activePointerId = null;
    cardIsDragging = false;
    donationCard.classList.remove('is-dragging');
  };

  donationCard.addEventListener('pointerup', finishCardDrag);
  donationCard.addEventListener('pointercancel', finishCardDrag);

  donationCard.addEventListener('click', event => {
    if (dragged) {
      event.preventDefault();
      dragged = false;
      return;
    }

    flipDonationCard();
  });
}

// Iniciamos la reproducción del carrusel al cargar la página
window.onload = function () {
  startSlideShow();
  initializeDonationCard3D();
};
