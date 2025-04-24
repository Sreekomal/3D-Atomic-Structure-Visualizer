// Create Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(400, 400);
document.getElementById("three-container").appendChild(renderer.domElement);

// Adjust Camera Position
camera.position.z = 2; // Move camera back to see the electron

// Add Lighting
const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x444444));

// Create Electron
const electronGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const electronMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const electron = new THREE.Mesh(electronGeometry, electronMaterial);
scene.add(electron);

// Create a Thin Ring around Electron
const ringGeometry = new THREE.TorusGeometry(0.2, 0.02, 16, 100);
const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
scene.add(ring);

// Group Electron and Ring Together
const electronGroup = new THREE.Group();
electronGroup.add(electron);
electronGroup.add(ring);
scene.add(electronGroup);

// Initial Spin Direction
let spinDirection = 1; // 1 for +½ (⬆️) and -1 for -½ (⬇️)

// Button Click to Toggle Spin
document.getElementById("toggleSpinBtn").addEventListener("click", function () {
    spinDirection *= -1;
    document.getElementById("spinState").innerText = spinDirection === 1 
        ? "Current Spin: +½ (⬆️)" 
        : "Current Spin: -½ (⬇️)";
});

// Animate Electron Spin
function animate() {
    requestAnimationFrame(animate);
    electronGroup.rotation.y += 0.05 * spinDirection; // Rotate based on spin state
    renderer.render(scene, camera);
}

animate();
