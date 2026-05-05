import * as THREE from "three";

// ---------- SCENE SETUP ----------
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// ---------- LIGHTS ----------
const ambientLight = new THREE.AmbientLight(0x404080, 2);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xc084fc, 1.5, 10);
pointLight.position.set(2, 1, 3);
scene.add(pointLight);

// ---------- STARS (Particles) ----------
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 1000;
const starsPositions = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i += 3) {
  starsPositions[i] = (Math.random() - 0.5) * 20;
  starsPositions[i + 1] = (Math.random() - 0.5) * 20;
  starsPositions[i + 2] = (Math.random() - 0.5) * 10; // depth
}
starsGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(starsPositions, 3),
);
const starsMaterial = new THREE.PointsMaterial({ color: 0xc084fc, size: 0.02 });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// ---------- CENTRAL OBJECT (Rotating Torus Knot) ----------
const geometry = new THREE.TorusKnotGeometry(0.8, 0.25, 128, 16);
const material = new THREE.MeshStandardMaterial({
  color: 0xc084fc,
  emissive: 0x4a1e8a,
  roughness: 0.3,
  metalness: 0.5,
  wireframe: false,
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Additional floating shapes (small spheres)
const smallSpheres = [];
for (let i = 0; i < 5; i++) {
  const sphereGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0x331144,
    roughness: 0.4,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.position.set(
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 2,
  );
  scene.add(sphere);
  smallSpheres.push({
    mesh: sphere,
    speed: 0.005 + Math.random() * 0.01,
    angle: Math.random() * Math.PI * 2,
    radius: 2 + Math.random() * 2,
  });
}

// ---------- MOUSE INTERACTION ----------
const mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// ---------- RESIZE HANDLER ----------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- ANIMATION LOOP ----------
function animate() {
  requestAnimationFrame(animate);

  // Rotate main object
  torusKnot.rotation.x += 0.002;
  torusKnot.rotation.y += 0.005;

  // Rotate stars slowly
  stars.rotation.y += 0.0002;

  // Move small spheres in circular orbits
  smallSpheres.forEach((item) => {
    item.angle += item.speed;
    item.mesh.position.x = Math.cos(item.angle) * item.radius;
    item.mesh.position.z = Math.sin(item.angle) * item.radius;
    item.mesh.position.y += Math.sin(item.angle * 2) * 0.01;
  });

  // Mouse parallax – move camera slightly
  camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
  camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.05;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
animate();

// ---------- TYPEWRITER EFFECT ----------
const typewriter = document.getElementById("typewriter");
const phrases = [
  'sniff(true) { bork("awesome"); }',
  'zoom(forever) { bork("infinite fun"); }',
  'boop greet() { bork("Hi!"); }',
];
let phraseIndex = 0,
  charIndex = 0,
  isDeleting = false;
function typeLoop() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typewriter.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriter.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }
  let speed = isDeleting ? 40 : 80;
  if (!isDeleting && charIndex === current.length) {
    speed = 1500;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 500;
  }
  setTimeout(typeLoop, speed);
}
typeLoop();

// ---------- SCROLL REVEAL ----------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.2 },
);
document
  .querySelectorAll(".fade-section")
  .forEach((el) => observer.observe(el));
