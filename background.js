// Interactive 3D Background Animation (Spline-inspired)
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Camera position
camera.position.z = 50;

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 2000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = (Math.random() - 0.5) * 100;
    positions[i + 2] = (Math.random() - 0.5) * 100;

    // Color variation between blue and purple
    const colorChoice = Math.random();
    if (colorChoice > 0.5) {
        colors[i] = 0.0; // R
        colors[i + 1] = 0.83; // G (cyan)
        colors[i + 2] = 1.0; // B
    } else {
        colors[i] = 0.48; // R (purple)
        colors[i + 1] = 0.18; // G
        colors[i + 2] = 0.97; // B
    }
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Add geometric shapes
const shapes = [];

// Torus Knot
const torusKnotGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const torusKnotMaterial = new THREE.MeshPhongMaterial({
    color: 0x00d4ff,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
torusKnot.position.set(-20, 10, -30);
scene.add(torusKnot);
shapes.push(torusKnot);

// Icosahedron
const icoGeometry = new THREE.IcosahedronGeometry(8, 0);
const icoMaterial = new THREE.MeshPhongMaterial({
    color: 0x7b2ff7,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
icosahedron.position.set(25, -15, -25);
scene.add(icosahedron);
shapes.push(icosahedron);

// Octahedron
const octaGeometry = new THREE.OctahedronGeometry(6, 0);
const octaMaterial = new THREE.MeshPhongMaterial({
    color: 0xff006e,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
octahedron.position.set(0, 20, -40);
scene.add(octahedron);
shapes.push(octahedron);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x00d4ff, 1, 100);
pointLight1.position.set(25, 25, 25);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x7b2ff7, 1, 100);
pointLight2.position.set(-25, -25, 25);
scene.add(pointLight2);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Scroll effect
let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Smooth mouse follow
    targetX += (mouseX * 10 - targetX) * 0.05;
    targetY += (mouseY * 10 - targetY) * 0.05;

    // Rotate particles
    particles.rotation.y += 0.001;
    particles.rotation.x = targetY * 0.05;
    particles.rotation.z = targetX * 0.05;

    // Animate shapes
    shapes.forEach((shape, index) => {
        shape.rotation.x += 0.005 * (index + 1);
        shape.rotation.y += 0.003 * (index + 1);
        shape.rotation.z += 0.002 * (index + 1);

        // Float effect
        shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
    });

    // Camera movement based on mouse
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Scroll effect - move camera
    camera.position.z = 50 + scrollY * 0.05;

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Add interactive click effect
canvas.addEventListener('click', (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Create a temporary burst of particles
    const burstGeometry = new THREE.BufferGeometry();
    const burstCount = 50;
    const burstPositions = new Float32Array(burstCount * 3);
    const burstColors = new Float32Array(burstCount * 3);

    for (let i = 0; i < burstCount * 3; i += 3) {
        burstPositions[i] = x * 50;
        burstPositions[i + 1] = y * 50;
        burstPositions[i + 2] = 0;

        burstColors[i] = 0.0;
        burstColors[i + 1] = 0.83;
        burstColors[i + 2] = 1.0;
    }

    burstGeometry.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3));
    burstGeometry.setAttribute('color', new THREE.BufferAttribute(burstColors, 3));

    const burstMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });

    const burst = new THREE.Points(burstGeometry, burstMaterial);
    scene.add(burst);

    // Animate and remove burst
    let opacity = 1;
    const burstInterval = setInterval(() => {
        opacity -= 0.05;
        burst.material.opacity = opacity;
        burst.scale.set(burst.scale.x + 0.1, burst.scale.y + 0.1, burst.scale.z + 0.1);

        if (opacity <= 0) {
            scene.remove(burst);
            clearInterval(burstInterval);
        }
    }, 30);
});
