/**
 * 3D WIZARD - Interactive Application Logic
 * Precision 3D Printing & Prototyping Platform
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroSlicerCanvas();
  initGallery();
  initOrderCalculator();
  initFAQ();
  initCopyButtons();
});

/* ==========================================================================
   1. Navigation & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // Sticky Navbar Blur On Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Drawer Toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile drawer when clicking any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // Active Link Highlighting with IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = { rootMargin: '-20% 0px -70% 0px' };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));
}

/* ==========================================================================
   2. Interactive 3D Slicer / Canvas Hero Widget
   ========================================================================== */
function initHeroSlicerCanvas() {
  const canvas = document.getElementById('slicerCanvas');
  const viewport = document.getElementById('slicerViewport');
  const layerSlider = document.getElementById('layerSlider');
  const layerDisplay = document.getElementById('currentLayerDisplay');
  const coordsDisplay = document.getElementById('slicerCoords');
  const btnWireframe = document.getElementById('btnSlicerWireframe');
  const btnSolid = document.getElementById('btnSlicerSolid');
  const btnReset = document.getElementById('btnSlicerReset');

  if (!canvas || !viewport) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let dpr = window.devicePixelRatio || 1;

  // Render State
  let rotX = 0.45;
  let rotY = 0.65;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let maxLayers = 240;
  let currentLayer = 180;
  let renderMode = 'layers'; // 'layers' or 'solid'

  function resizeCanvas() {
    const rect = viewport.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    drawScene();
  }

  window.addEventListener('resize', resizeCanvas);

  // Generate 3D Model Vertices / Slices (Parametric Planetary Cog / Ring)
  const totalSlices = 48; // 3D geometry slice levels
  const sliceRadiusData = [];

  for (let i = 0; i < totalSlices; i++) {
    const t = i / totalSlices;
    // Layer shape variations (flanges, teeth, steps)
    let radius = 68;
    if (t < 0.15) radius = 80;
    else if (t > 0.35 && t < 0.65) radius = 92;
    else if (t > 0.85) radius = 75;

    const points = [];
    const numPoints = 32;
    const teeth = 12;

    for (let j = 0; j < numPoints; j++) {
      const angle = (j / numPoints) * Math.PI * 2;
      const toothAmp = (t > 0.25 && t < 0.75) ? Math.sin(angle * teeth) * 12 : 0;
      const r = radius + toothAmp;
      points.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        y: (t - 0.5) * 120 // Vertical height
      });
    }

    sliceRadiusData.push({
      height: (t - 0.5) * 120,
      points: points,
      level: t
    });
  }

  // 3D Projection Helper
  function project(p) {
    // Rotate Y
    const x1 = p.x * Math.cos(rotY) + p.z * Math.sin(rotY);
    const z1 = -p.x * Math.sin(rotY) + p.z * Math.cos(rotY);
    
    // Rotate X
    const y2 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
    const z2 = p.y * Math.sin(rotX) + z1 * Math.cos(rotX);

    // Perspective factor
    const fov = 320;
    const distance = 300;
    const scale = fov / (distance + z2);

    return {
      x: width / 2 + x1 * scale,
      y: height / 2 + y2 * scale,
      scale: scale,
      z: z2
    };
  }

  function drawScene() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Build Plate Grid (3D Lattice)
    const gridSize = 140;
    const gridDivs = 8;
    const step = (gridSize * 2) / gridDivs;
    const baseHeight = 62; // bottom plane

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';

    for (let i = -gridSize; i <= gridSize; i += step) {
      const p1 = project({ x: i, y: baseHeight, z: -gridSize });
      const p2 = project({ x: i, y: baseHeight, z: gridSize });
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      const p3 = project({ x: -gridSize, y: baseHeight, z: i });
      const p4 = project({ x: gridSize, y: baseHeight, z: i });
      ctx.beginPath();
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.stroke();
    }

    // Build Plate Border Glow
    const c1 = project({ x: -gridSize, y: baseHeight, z: -gridSize });
    const c2 = project({ x: gridSize, y: baseHeight, z: -gridSize });
    const c3 = project({ x: gridSize, y: baseHeight, z: gridSize });
    const c4 = project({ x: -gridSize, y: baseHeight, z: gridSize });

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
    ctx.beginPath();
    ctx.moveTo(c1.x, c1.y);
    ctx.lineTo(c2.x, c2.y);
    ctx.lineTo(c3.x, c3.y);
    ctx.lineTo(c4.x, c4.y);
    ctx.closePath();
    ctx.stroke();

    // 2. Render 3D Model Slices
    const visibleRatio = currentLayer / maxLayers;
    const visibleSlices = Math.floor(sliceRadiusData.length * visibleRatio);

    if (renderMode === 'solid') {
      // Solid Mesh Shading
      for (let s = 0; s < visibleSlices - 1; s++) {
        const sliceA = sliceRadiusData[s];
        const sliceB = sliceRadiusData[s + 1];

        for (let j = 0; j < sliceA.points.length; j++) {
          const nextJ = (j + 1) % sliceA.points.length;
          const pA1 = project(sliceA.points[j]);
          const pA2 = project(sliceA.points[nextJ]);
          const pB2 = project(sliceB.points[nextJ]);
          const pB1 = project(sliceB.points[j]);

          // Simple surface normal lighting
          const grad = ctx.createLinearGradient(pA1.x, pA1.y, pB2.x, pB2.y);
          const intensity = 0.3 + 0.4 * Math.sin(rotY + (j / sliceA.points.length) * Math.PI * 2);
          grad.addColorStop(0, `rgba(32, 42, 54, ${intensity})`);
          grad.addColorStop(1, `rgba(18, 24, 32, ${intensity})`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(pA1.x, pA1.y);
          ctx.lineTo(pA2.x, pA2.y);
          ctx.lineTo(pB2.x, pB2.y);
          ctx.lineTo(pB1.x, pB1.y);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 107, 26, 0.15)';
          ctx.stroke();
        }
      }
    } else {
      // Layer Lines Toolpath Slicing Mode
      for (let s = 0; s < visibleSlices; s++) {
        const slice = sliceRadiusData[s];
        const isTopSlice = (s === visibleSlices - 1);

        ctx.beginPath();
        for (let j = 0; j < slice.points.length; j++) {
          const pt = project(slice.points[j]);
          if (j === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();

        if (isTopSlice) {
          // Current Extruding Top Layer - Neon Glowing Toolpath
          ctx.strokeStyle = '#FF6B1A';
          ctx.lineWidth = 2.4;
          ctx.shadowColor = '#FF6B1A';
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.shadowBlur = 0; // reset

          // Inner Concentric Fill Ring
          ctx.beginPath();
          for (let j = 0; j < slice.points.length; j++) {
            const innerPt = {
              x: slice.points[j].x * 0.7,
              y: slice.points[j].y,
              z: slice.points[j].z * 0.7
            };
            const pt = project(innerPt);
            if (j === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.closePath();
          ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
          ctx.lineWidth = 1.6;
          ctx.stroke();

          // Active Extrusion Nozzle Marker
          const nozzlePt = project(slice.points[0]);
          ctx.fillStyle = '#00E5FF';
          ctx.beginPath();
          ctx.arc(nozzlePt.x, nozzlePt.y, 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Body Layer Lines
          const alpha = 0.2 + (s / visibleSlices) * 0.6;
          ctx.strokeStyle = `rgba(255, 107, 26, ${alpha * 0.5})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      }
    }

    // Update Coordinate Readout
    if (coordsDisplay) {
      const xPos = (184.2 + Math.sin(rotY) * 12).toFixed(1);
      const yPos = (184.2 + Math.cos(rotX) * 12).toFixed(1);
      const zPos = ((currentLayer / maxLayers) * 64.0).toFixed(1);
      coordsDisplay.textContent = `X: ${xPos}mm   Y: ${yPos}mm   Z: ${zPos}mm`;
    }
  }

  // Interactive Drag & Orbit Listeners
  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    rotY += deltaX * 0.01;
    rotX += deltaY * 0.01;
    // Clamp vertical tilt
    rotX = Math.max(-0.2, Math.min(1.2, rotX));
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    drawScene();
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch Support
  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMouseX;
    const deltaY = e.touches[0].clientY - lastMouseY;
    rotY += deltaX * 0.01;
    rotX += deltaY * 0.01;
    rotX = Math.max(-0.2, Math.min(1.2, rotX));
    lastMouseX = e.touches[0].clientX;
    lastMouseY = e.touches[0].clientY;
    drawScene();
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });

  // Layer Slider Input
  if (layerSlider) {
    layerSlider.addEventListener('input', (e) => {
      currentLayer = parseInt(e.target.value, 10);
      if (layerDisplay) layerDisplay.textContent = currentLayer;
      
      const timeEst = document.getElementById('slicerTimeEst');
      if (timeEst) {
        const mins = Math.round((currentLayer / maxLayers) * 258);
        const hrs = Math.floor(mins / 60);
        const remMins = mins % 60;
        timeEst.textContent = `${hrs}h ${remMins < 10 ? '0' : ''}${remMins}m`;
      }
      drawScene();
    });
  }

  // Toggle Buttons
  if (btnWireframe && btnSolid) {
    btnWireframe.addEventListener('click', () => {
      renderMode = 'layers';
      btnWireframe.classList.add('active');
      btnSolid.classList.remove('active');
      drawScene();
    });

    btnSolid.addEventListener('click', () => {
      renderMode = 'solid';
      btnSolid.classList.add('active');
      btnWireframe.classList.remove('active');
      drawScene();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      rotX = 0.45;
      rotY = 0.65;
      currentLayer = 180;
      if (layerSlider) layerSlider.value = 180;
      if (layerDisplay) layerDisplay.textContent = 180;
      drawScene();
      showToast('Camera reset to default build-plate angle');
    });
  }

  // Initial draw
  resizeCanvas();
}

/* ==========================================================================
   3. Portfolio / Gallery Filter & Modal
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.gallery-card');
  const inspectModal = document.getElementById('inspectModal');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Portfolio Item Data Map for Inspect Modal
  const portfolioDetails = {
    "1": {
      title: "High-Torque Cycloidal Drive",
      material: "Carbon Fiber PETG (PETG-CF)",
      category: "Mechanical & Robotics",
      image: "assets/images/mechanical-gear.svg",
      description: "Custom precision planetary and cycloidal reduction gearbox machined for high-torque robotic limb actuators. Printed with continuous perimeter reinforcement and high-temp chamber annealing.",
      specs: [
        { label: "Layer Resolution", value: "0.12 mm (120µm)" },
        { label: "Infill Geometry", value: "60% Gyroid High-Shear" },
        { label: "Print Duration", value: "11 hours 45 mins" },
        { label: "Measured Tolerance", value: "±0.04 mm" },
        { label: "Material Tensile", value: "68 MPa" },
        { label: "Nozzle Hardness", value: "0.4mm Hardened Tool Steel" }
      ]
    },
    "2": {
      title: "8K Resin Archmage Figurine",
      material: "8K UV-Photopolymer Precision Resin",
      category: "Miniatures & Display",
      image: "assets/images/miniature-dragon.svg",
      description: "Master display model featuring micro-textures on fabric folds and faceted jewelry components. Produced on our calibrated mono LCD 8K vats with customized anti-aliasing.",
      specs: [
        { label: "Layer Resolution", value: "0.03 mm (30µm)" },
        { label: "XY Pixel Size", value: "28 µm" },
        { label: "UV Exposure", value: "2.1 sec / layer" },
        { label: "Post Curing", value: "Sonic IPA + 405nm UV Chamber (8m)" },
        { label: "Feature Clarity", value: "Down to 0.1mm" }
      ]
    },
    "3": {
      title: "Aerodynamic Drone Arm & Duct",
      material: "PA12-CF Nylon Carbon",
      category: "Functional Prototypes",
      image: "assets/images/prototype-drone.svg",
      description: "Weight-optimized generative quadcopter motor duct with integrated M3 brass heat-set inserts. Rigid enough to withstand 40G acceleration impacts without delamination.",
      specs: [
        { label: "Layer Resolution", value: "0.16 mm" },
        { label: "Weight", value: "34.2 grams" },
        { label: "Heat Deflection (HDT)", value: "165°C" },
        { label: "Reinforcement", value: "15% Chopped Carbon Fiber" },
        { label: "Inserts", value: "4x M3 Ultrasonic Brass" }
      ]
    },
    "4": {
      title: "Parametric Voronoi Luminaire",
      material: "Matte Obsidian PLA",
      category: "Art & Parametric",
      image: "assets/images/art-voronoi-lamp.svg",
      description: "Generative mathematical lampshade printed in continuous spiral vase mode. The organic pore apertures cast complex geometric shadows on surrounding surfaces.",
      specs: [
        { label: "Layer Resolution", value: "0.20 mm" },
        { label: "Extrusion Width", value: "0.65 mm Single Wall" },
        { label: "Print Duration", value: "6 hours 12 mins" },
        { label: "Finish", value: "Matte Anti-Reflective" }
      ]
    },
    "5": {
      title: "IP67 Sensor Enclosure & Gasket",
      material: "PETG + TPU 95A Co-Fabrication",
      category: "Functional Prototypes",
      image: "assets/images/prototype-enclosure.svg",
      description: "Weatherproof field electronics housing. The rigid PETG clamshell features screw bosses, snap-fits, and a precision-fitted elastomeric TPU gasket for IP67 ingress protection.",
      specs: [
        { label: "Body Polymer", value: "PETG Impact Resistant" },
        { label: "Gasket Material", value: "TPU 95A Flexible" },
        { label: "Ingress Rating", value: "IP67 Sealed" },
        { label: "Wall Thickness", value: "3.2 mm (4 Perimeters)" }
      ]
    },
    "6": {
      title: "Generative Topology Bracket",
      material: "PEI / ULTEM 9085 Flame-Retardant",
      category: "Mechanical & Aerospace",
      image: "assets/images/mechanical-bracket.svg",
      description: "Finite-Element Analysis optimized structural bracket. Generative lattice voids remove 62% of dead mass while supporting 2.4kN continuous shear force.",
      specs: [
        { label: "Layer Resolution", value: "0.16 mm" },
        { label: "Load Capacity", value: "2.4 kN Shear Rating" },
        { label: "Weight Reduction", value: "-62% Mass Optimization" },
        { label: "Continuous Service Temp", value: "153°C" },
        { label: "Flame Rating", value: "UL94 V-0 Certified" }
      ]
    }
  };

  // Open Modal Handler
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const data = portfolioDetails[id];
      if (!data) return;

      modalBody.innerHTML = `
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: start; margin-bottom: 1.5rem;">
          <div style="flex: 1; min-width: 260px; height: 220px; background: #0c0f14; border: 1px solid var(--border-card); border-radius: var(--radius-md); overflow: hidden;">
            <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="flex: 1.2; min-width: 260px;">
            <span class="mono-tag" style="color: var(--accent-orange); margin-bottom: 0.3rem; display: block;">${data.category}</span>
            <h3 style="font-size: 1.45rem; margin-bottom: 0.5rem;">${data.title}</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 1rem;">${data.description}</p>
            <span class="mat-tag" style="background: var(--bg-secondary); border: 1px solid var(--border-subtle);">${data.material}</span>
          </div>
        </div>

        <h4 style="font-size: 1rem; margin-bottom: 0.75rem; border-top: 1px solid var(--border-subtle); padding-top: 1.2rem;">Engineering Specifications</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-bottom: 2rem;">
          ${data.specs.map(s => `
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); font-size: 0.78rem;">
              <div style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">${s.label}</div>
              <strong style="color: var(--text-primary);">${s.value}</strong>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; gap: 1rem;">
          <a href="#order" class="btn btn-primary" onclick="document.getElementById('inspectModal').classList.remove('open');" style="flex: 1;">
            Order Similar Custom Part
          </a>
        </div>
      `;

      inspectModal.classList.add('open');
      inspectModal.setAttribute('aria-hidden', 'false');
    });
  });

  // Close Modal
  if (modalCloseBtn && inspectModal) {
    modalCloseBtn.addEventListener('click', () => {
      inspectModal.classList.remove('open');
      inspectModal.setAttribute('aria-hidden', 'true');
    });

    inspectModal.addEventListener('click', (e) => {
      if (e.target === inspectModal) {
        inspectModal.classList.remove('open');
        inspectModal.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

/* ==========================================================================
   4. Instant Upload & Dynamic Quote Calculator
   ========================================================================== */
function initOrderCalculator() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const activeFileBanner = document.getElementById('activeFileBanner');
  const displayFileName = document.getElementById('displayFileName');
  const displayFileStats = document.getElementById('displayFileStats');
  const btnRemoveFile = document.getElementById('btnRemoveFile');
  const sampleBtns = document.querySelectorAll('.sample-btn');

  // Form Controls
  const materialSelect = document.getElementById('materialSelect');
  const layerSelect = document.getElementById('layerSelect');
  const infillSlider = document.getElementById('infillSlider');
  const infillValDisplay = document.getElementById('infillValDisplay');
  const colorSwatches = document.querySelectorAll('.color-swatch-btn');
  const selectedColorDisplay = document.getElementById('selectedColorDisplay');
  const qtyInput = document.getElementById('qtyInput');
  const finishSelect = document.getElementById('finishSelect');
  const rushExpedited = document.getElementById('rushExpedited');
  const orderForm = document.getElementById('orderForm');

  // Sidebar Breakdown Outputs
  const summaryMeshName = document.getElementById('summaryMeshName');
  const summaryBounds = document.getElementById('summaryBounds');
  const summaryWeight = document.getElementById('summaryWeight');
  const summaryDuration = document.getElementById('summaryDuration');
  const calcMatLabel = document.getElementById('calcMatLabel');
  const priceMat = document.getElementById('priceMat');
  const priceMachine = document.getElementById('priceMachine');
  const priceFinish = document.getElementById('priceFinish');
  const rushFeeRow = document.getElementById('rushFeeRow');
  const priceRush = document.getElementById('priceRush');
  const priceTotal = document.getElementById('priceTotal');

  // Success Modal Elements
  const orderSuccessModal = document.getElementById('orderSuccessModal');
  const successModalCloseBtn = document.getElementById('successModalCloseBtn');
  const btnDoneOrder = document.getElementById('btnDoneOrder');
  const ticketNumberDisplay = document.getElementById('ticketNumberDisplay');
  const ticketClientDisplay = document.getElementById('ticketClientDisplay');
  const ticketLeadTimeDisplay = document.getElementById('ticketLeadTimeDisplay');
  const ticketTotalDisplay = document.getElementById('ticketTotalDisplay');

  // Current Model Geometry State
  let currentMesh = {
    name: "Planetary_Gear_v2.stl",
    volumeCm3: 42.6,
    bounds: "65 x 65 x 24 mm",
    vertices: 18420
  };

  // Sample Presets Dictionary
  const samplePresets = {
    gear: {
      name: "Planetary_Gear_v2.stl",
      volumeCm3: 42.6,
      bounds: "65 x 65 x 24 mm",
      vertices: 18420
    },
    drone: {
      name: "Aerodynamic_Drone_Arm.step",
      volumeCm3: 28.5,
      bounds: "140 x 45 x 30 mm",
      vertices: 24300
    },
    vase: {
      name: "Parametric_Voronoi_Luminaire.stl",
      volumeCm3: 56.2,
      bounds: "95 x 95 x 160 mm",
      vertices: 38100
    }
  };

  function updateFileBanner() {
    if (displayFileName && displayFileStats) {
      displayFileName.textContent = currentMesh.name;
      const estGrams = (currentMesh.volumeCm3 * 1.25 * (parseInt(infillSlider.value, 10) / 100 + 0.3)).toFixed(1);
      displayFileStats.textContent = `Volume: ${currentMesh.volumeCm3} cm³ • Vertices: ${currentMesh.vertices.toLocaleString()} • Est. ${estGrams}g`;
      if (activeFileBanner) activeFileBanner.style.display = 'flex';
      if (summaryMeshName) summaryMeshName.textContent = currentMesh.name;
      if (summaryBounds) summaryBounds.textContent = currentMesh.bounds;
    }
  }

  // Calculate Real-Time Pricing
  function calculateQuote() {
    const selectedMatOpt = materialSelect.options[materialSelect.selectedIndex];
    const matRatePerGram = parseFloat(selectedMatOpt.dataset.rate || 9.50);
    const matDensity = parseFloat(selectedMatOpt.dataset.density || 1.25);
    const matName = selectedMatOpt.text.split(' ')[0];

    const selectedLayerOpt = layerSelect.options[layerSelect.selectedIndex];
    const layerMult = parseFloat(selectedLayerOpt.dataset.mult || 1.0);

    const infillPercent = parseInt(infillSlider.value, 10);
    const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);

    const finishCostPerUnit = parseFloat(finishSelect.options[finishSelect.selectedIndex].dataset.cost || 0);
    const isRush = rushExpedited.checked;

    // Weight Calculation: Base Shell (30% solid) + Internal Infill fraction
    const effectiveInfill = 0.3 + (infillPercent / 100) * 0.7;
    const singlePartWeight = currentMesh.volumeCm3 * matDensity * effectiveInfill;
    const totalWeight = singlePartWeight * qty;

    // Machine Time: volume * layer complexity
    const singlePartMins = Math.round((currentMesh.volumeCm3 * 4.2 * layerMult) + 40);
    const totalMins = singlePartMins * qty;
    const totalHrs = (totalMins / 60).toFixed(1);

    // Costs in INR (₹)
    const rawMaterialCost = totalWeight * matRatePerGram;
    const baseMachineSetupCost = (250.0 + (totalMins / 60) * 120.0);
    const finishTotalCost = finishCostPerUnit * qty;

    let subtotal = rawMaterialCost + baseMachineSetupCost + finishTotalCost;

    // Volume discount: >= 5 parts -> 10% off, >= 20 parts -> 20% off
    if (qty >= 20) {
      subtotal *= 0.8;
    } else if (qty >= 5) {
      subtotal *= 0.9;
    }

    const rushFee = isRush ? subtotal * 0.25 : 0;
    const total = subtotal + rushFee;

    // Update UI Elements
    if (summaryWeight) summaryWeight.textContent = `${singlePartWeight.toFixed(1)}g (Total: ${totalWeight.toFixed(1)}g)`;
    if (summaryDuration) summaryDuration.textContent = `~${Math.floor(singlePartMins / 60)}h ${singlePartMins % 60}m (Total: ${totalHrs}h)`;
    if (calcMatLabel) calcMatLabel.textContent = matName;
    if (priceMat) priceMat.textContent = `₹${rawMaterialCost.toFixed(2)}`;
    if (priceMachine) priceMachine.textContent = `₹${baseMachineSetupCost.toFixed(2)}`;
    if (priceFinish) priceFinish.textContent = `₹${finishTotalCost.toFixed(2)}`;

    if (rushFeeRow && priceRush) {
      if (isRush) {
        rushFeeRow.style.display = 'flex';
        priceRush.textContent = `+₹${rushFee.toFixed(2)}`;
      } else {
        rushFeeRow.style.display = 'none';
      }
    }

    if (priceTotal) priceTotal.textContent = `₹${total.toFixed(2)}`;
  }

  // Event Listeners for Dynamic Form
  materialSelect.addEventListener('change', calculateQuote);
  layerSelect.addEventListener('change', calculateQuote);
  qtyInput.addEventListener('input', calculateQuote);
  finishSelect.addEventListener('change', calculateQuote);
  rushExpedited.addEventListener('change', calculateQuote);

  infillSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    infillValDisplay.textContent = `${val}%`;
    updateFileBanner();
    calculateQuote();
  });

  // Color Swatches
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const colorName = swatch.dataset.color;
      selectedColorDisplay.textContent = colorName;
    });
  });

  // Preset Sample Meshes
  sampleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const meshKey = btn.dataset.mesh;
      if (samplePresets[meshKey]) {
        currentMesh = { ...samplePresets[meshKey] };
        updateFileBanner();
        calculateQuote();
        showToast(`Loaded sample mesh: ${currentMesh.name}`);
      }
    });
  });

  // File Upload Handling
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }

  function handleFileSelect(file) {
    const validExts = ['.stl', '.obj', '.step', '.stp', '.3mf'];
    const fileName = file.name.toLowerCase();
    const hasValidExt = validExts.some(ext => fileName.endsWith(ext));

    if (!hasValidExt) {
      showToast('Please upload a valid 3D file (.STL, .OBJ, .STEP, or .3MF)');
      return;
    }

    // Estimate volume from file size
    const estVol = Math.max(15, Math.min(220, (file.size / 1024 / 50).toFixed(1)));
    currentMesh = {
      name: file.name,
      volumeCm3: parseFloat(estVol),
      bounds: `${(estVol * 1.5).toFixed(0)} x ${(estVol * 1.2).toFixed(0)} x ${(estVol * 0.8).toFixed(0)} mm`,
      vertices: Math.round(file.size / 60)
    };

    updateFileBanner();
    calculateQuote();
    showToast(`File "${file.name}" analyzed successfully!`);
  }

  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', () => {
      currentMesh = { ...samplePresets.gear };
      updateFileBanner();
      calculateQuote();
      if (fileInput) fileInput.value = '';
      showToast('Reset to default model preview');
    });
  }

  // Order Form Submission Handling
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');

      if (!nameInput.value.trim() || !emailInput.value.trim()) {
        showToast('Please enter your name and email address.');
        return;
      }

      // Generate simulated Ticket ID
      const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
      const ticketId = `#3DW-${randomTicketNum}`;

      if (ticketNumberDisplay) ticketNumberDisplay.textContent = ticketId;
      if (ticketClientDisplay) ticketClientDisplay.textContent = `${nameInput.value} (${emailInput.value})`;
      if (ticketLeadTimeDisplay) ticketLeadTimeDisplay.textContent = rushExpedited.checked ? "24 Hours (Rush Queue)" : "24–48 Hours";
      if (ticketTotalDisplay) ticketTotalDisplay.textContent = priceTotal.textContent;

      if (orderSuccessModal) {
        orderSuccessModal.classList.add('open');
        orderSuccessModal.setAttribute('aria-hidden', 'false');
      }
    });
  }

  // Success Modal Close
  if (successModalCloseBtn && orderSuccessModal) {
    successModalCloseBtn.addEventListener('click', () => {
      orderSuccessModal.classList.remove('open');
      orderSuccessModal.setAttribute('aria-hidden', 'true');
    });
  }
  if (btnDoneOrder && orderSuccessModal) {
    btnDoneOrder.addEventListener('click', () => {
      orderSuccessModal.classList.remove('open');
      orderSuccessModal.setAttribute('aria-hidden', 'true');
      showToast('Order confirmed. We have sent a copy to your email.');
    });
  }

  // Initial Calculation
  updateFileBanner();
  calculateQuote();
}

/* ==========================================================================
   5. FAQ Accordion
   ========================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close other items
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   6. Copy to Clipboard Utility
   ========================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: "${textToCopy}"`);
        }).catch(() => {
          showToast(`Copied: ${textToCopy}`);
        });
      }
    });
  });
}

/* ==========================================================================
   7. Micro Toast Notifications
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B1A" stroke-width="2" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}
