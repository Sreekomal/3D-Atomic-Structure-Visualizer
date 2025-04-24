// Create Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Get container div and set canvas inside it
const container = document.getElementById("three-container");
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add Lighting
const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x444444));

// Create Nucleus
const nucleusGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const nucleusMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
scene.add(nucleus);

// Move Camera Back for Visibility
camera.position.z = 5;

// Function to create electron orbit at level 'n'
function createElectronOrbit(n) {
    let radius = 0.8 + n * 0.5;
// Increase distance from nucleus
    let electronGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    let electronMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    let electron = new THREE.Mesh(electronGeometry, electronMaterial);
    electron.position.set(radius, 0, 0);
    scene.add(electron);

    return { electron, radius, angle: 0 };
}

// Handle User Input for n
document.addEventListener("DOMContentLoaded", function () {
    let input = document.getElementById("nInput");
    let button = document.getElementById("showElectronBtn");

    let electronObject = null;

    button.addEventListener("click", function () {
        let n = parseInt(input.value);
        if (isNaN(n) || n < 1 || n > 7) {
            alert("Enter a valid n (1-7)!");
            return;
        }

        if (electronObject) scene.remove(electronObject.electron);

        electronObject = createElectronOrbit(n);
    });

    function animate() {
        requestAnimationFrame(animate);
        if (electronObject) {
            electronObject.electron.position.x = Math.cos(electronObject.angle) * electronObject.radius;
            electronObject.electron.position.y = Math.sin(electronObject.angle) * electronObject.radius;
            electronObject.angle += 0.02;
        }
        renderer.render(scene, camera);
    }

    animate(); // Start animation immediately
});
