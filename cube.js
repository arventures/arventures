// ─── 3D Skills Cube (Three.js ES module) ────────────────────────────────────
import * as THREE from './assets/three.module.js';

// ── Code snippets for the animated background ─────────────────────────────────
const CODE_SNIPPETS = [
  // Go
  'func main() {', 'type T struct {', 'go func() {', 'defer wg.Done()',
  'ctx, cancel :=', 'err != nil {', 'ch <- result', ':= make(chan)',
  // SQL
  'SELECT * FROM', 'JOIN ON id =', 'WHERE created_at', 'GROUP BY user',
  'INSERT INTO', 'BEGIN TRANSACTION',
  // Cloud / DevOps
  'docker build -t', 'kubectl apply -f', 'terraform plan', 'helm upgrade',
  'nginx.conf', 'ENV NODE_ENV=', 'EXPOSE 8080', 'RUN apt-get -y',
  // JS / TS
  'const x = () =>', 'useEffect([], [])', 'async/await', 'Promise.all()',
  'export default', 'import React from', '.then(res =>', 'useState(null)',
  // Infra
  'redis.Set(ctx,)', 'pub.Publish(ch)', 'rabbitmq.Dial()', 'grpc.Dial(addr)',
  'npm install', 'git commit -m', 'ssh ubuntu@',
];

// ── Spawn floating code-text in the given host element ────────────────────────
function spawnCodeFragments(host) {
  const pool = document.createElement('div');
  pool.className = 'cube-code-bg';
  host.appendChild(pool);

  CODE_SNIPPETS.forEach((text) => {
    const el  = document.createElement('span');
    el.className = 'cube-code-frag';
    el.textContent = text;

    const x   = 4 + Math.random() * 88;      // % left
    const y   = 4 + Math.random() * 88;      // % top
    const sz  = 10 + Math.random() * 5;      // px font-size
    const dur = 20 + Math.random() * 22;     // animation duration s
    const del = -(Math.random() * dur);      // stagger

    el.style.cssText = `left:${x}%;top:${y}%;font-size:${sz}px;animation-duration:${dur}s;animation-delay:${del}s;`;
    pool.appendChild(el);
  });

  // ── Large "zoomed" fragments that sit in the cube's center area ──────────────
  // These simulate the magnification lens effect — text appears bigger and
  // hazier floating right behind/through the cube.
  const ZOOM_FRAGS = [
    'func()', '{  }', '=>', 'nil', 'err', 'ctx', '[]T', 'go',
  ];

  ZOOM_FRAGS.forEach((text) => {
    const el = document.createElement('span');
    el.className = 'cube-code-frag cube-code-zoom';
    el.textContent = text;

    // Randomise within the central 60% of the container
    const x  = 20 + Math.random() * 45;
    const y  = 15 + Math.random() * 65;
    const sz = 28 + Math.random() * 28;      // big: 28–56px
    const dur = 25 + Math.random() * 20;
    const del = -(Math.random() * dur);

    el.style.cssText = `left:${x}%;top:${y}%;font-size:${sz}px;animation-duration:${dur}s;animation-delay:${del}s;`;
    pool.appendChild(el);
  });
}

// ── Main cube init ─────────────────────────────────────────────────────────────
function initSkillsCube() {
  const container = document.getElementById('skills-cube');
  if (!container) return;

  // Inject floating code background into the scroll-animation-container
  const bgHost = document.querySelector('.scroll-animation-container');
  if (bgHost) requestAnimationFrame(() => spawnCodeFragments(bgHost));

  // ── Scene ──────────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();

  const w = container.clientWidth  || 460;
  const h = container.clientHeight || 520;
  const SCALE = 1.3; // oversized canvas to avoid rotation clipping

  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 1000);
  camera.position.set(0, 0, 5.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w * SCALE, h * SCALE);
  renderer.setClearColor(0x000000, 0);

  const canvas = renderer.domElement;
  canvas.style.cssText = `
    position:absolute;
    left:${-((SCALE - 1) / 2) * 100}%;
    top:${-((SCALE - 1) / 2) * 100}%;
    width:${SCALE * 100}%;
    height:${SCALE * 100}%;
    pointer-events:none;
  `;
  container.appendChild(canvas);

  // ── Geometry ────────────────────────────────────────────────────────────────
  // Slightly smaller cube (1.9 instead of 2.2)
  const GEO_SIZE = 1.9;
  const geometry = new THREE.BoxGeometry(GEO_SIZE, GEO_SIZE, GEO_SIZE);

  // Group that gets rotated (so phantom and face mesh rotate together)
  const cubeGroup = new THREE.Group();
  scene.add(cubeGroup);

  // ── Phantom mesh — invisible but writes to depth buffer ──────────────────────
  // This causes the back-facing wireframe edges to be occluded by the cube's
  // front faces, giving a proper "solid" hidden-line appearance.
  const phantomMat = new THREE.MeshBasicMaterial({
    colorWrite: false,   // don't draw colour to screen
    depthWrite: true,    // DO write to depth so back edges are hidden
    side: THREE.FrontSide,
  });
  const phantomMesh = new THREE.Mesh(geometry, phantomMat);
  phantomMesh.renderOrder = 0;
  cubeGroup.add(phantomMesh);

  // ── Visible semi-transparent faces ──────────────────────────────────────────
  const faceMaterial = new THREE.MeshPhongMaterial({
    color:     0x667eea,
    emissive:  0x3344bb,
    transparent: true,
    opacity:   0.10,
    depthWrite: false,   // transparent faces don't clobber depth
    side:      THREE.FrontSide,
  });
  const faceMesh = new THREE.Mesh(geometry, faceMaterial);
  faceMesh.renderOrder = 1;
  cubeGroup.add(faceMesh);

  // ── Outer wireframe edges ────────────────────────────────────────────────────
  const edgesGeo = new THREE.EdgesGeometry(geometry);
  const edgeMat  = new THREE.LineBasicMaterial({
    color: 0xaab8ff,
    depthTest: true,    // respect the depth buffer written by the phantom mesh
  });
  const wireframe = new THREE.LineSegments(edgesGeo, edgeMat);
  wireframe.renderOrder = 2;
  cubeGroup.add(wireframe);

  // ── Inner wireframe (extra depth cue) ───────────────────────────────────────
  const INNER = GEO_SIZE * 0.52;
  const innerGeo   = new THREE.BoxGeometry(INNER, INNER, INNER);
  const innerEdges = new THREE.EdgesGeometry(innerGeo);
  const innerMat   = new THREE.LineBasicMaterial({
    color: 0xd0b4ff, transparent: true, opacity: 0.55, depthTest: true,
  });
  const innerWire = new THREE.LineSegments(innerEdges, innerMat);
  innerWire.renderOrder = 2;
  cubeGroup.add(innerWire);

  // ── Lights ──────────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));

  const dirLight = new THREE.DirectionalLight(0x8899ff, 4.0);
  dirLight.position.set(3, 4, 5);
  scene.add(dirLight);

  const rimLight = new THREE.DirectionalLight(0xcc99ff, 2.5);
  rimLight.position.set(-4, -2, -3);
  scene.add(rimLight);

  const pointLight = new THREE.PointLight(0x667eea, 3.0, 12);
  pointLight.position.set(0, 0, 4);
  scene.add(pointLight);

  // ── Scroll-reactive rotation ─────────────────────────────────────────────────
  let scrollRotation = 0;
  const skillsSection = document.getElementById('skills');

  function getScrollProgress() {
    if (!skillsSection) return 0;
    const rect     = skillsSection.getBoundingClientRect();
    const sectionH = skillsSection.offsetHeight;
    const progress = -rect.top / Math.max(1, sectionH - window.innerHeight);
    return Math.max(0, Math.min(1, progress));
  }

  window.addEventListener('scroll', () => {
    scrollRotation = getScrollProgress() * Math.PI * 0.7;
  }, { passive: true });

  // ── Animation loop ───────────────────────────────────────────────────────────
  const clock = new THREE.Clock();

  // Fixed tilt so the cube always shows 3 faces — feels natural and solid
  const TILT_X = 0.40; // ~23° upward tilt — constant

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Only spin around Y + small scroll nudge on X; no crazy Z rotation
    cubeGroup.rotation.x = TILT_X + scrollRotation * 0.25;
    cubeGroup.rotation.y = t * 0.28 + scrollRotation;
    cubeGroup.rotation.z = 0; // locked — no Z wobble

    // Inner cube counter-rotates only on Y (same axis family for consistency)
    innerWire.rotation.y = -t * 0.35;

    renderer.render(scene, camera);
  }
  animate();

  // ── Resize handler ───────────────────────────────────────────────────────────
  function onResize() {
    const nw = container.clientWidth  || 460;
    const nh = container.clientHeight || 520;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw * SCALE, nh * SCALE);
  }
  window.addEventListener('resize', onResize, { passive: true });
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSkillsCube);
} else {
  initSkillsCube();
}
