// Create Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(400, 400);
document.getElementById("three-container").appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x444444));

// Create Nucleus
const nucleusGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const nucleusMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  emissive: 0xff4500,
  emissiveIntensity: 0.8,
});
const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
scene.add(nucleus);

// Electron Group
const electronGroup = new THREE.Group();
scene.add(electronGroup);

// Camera Position
camera.position.z = 3;

// Orbital Data
let orbitType = "s"; // Default
let speedFactor = 0.02; // Smoother movement
let electronCount = 2;

// Function to Create Electrons
function createElectrons(count) {
  // Clear existing electrons correctly
  while (electronGroup.children.length > 0) {
    electronGroup.remove(electronGroup.children[0]);
  }

  for (let i = 0; i < count; i++) {
    const electronGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const electronMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    electron.orbitalPhase = (Math.PI * 2 * i) / count; // Space electrons evenly
    electronGroup.add(electron);
  }
}

// Function to Update Electron Motion
function updateElectronMotion(time) {
  let t = time * speedFactor;
  electronGroup.children.forEach((electron, i) => {
    let phase = electron.orbitalPhase;

    if (orbitType === "s") {
      // S-Orbital (Spherical movement)
      electron.position.x = Math.cos(t + phase) * 1;
      electron.position.y = Math.sin(t + phase) * 1;
    } else if (orbitType === "p") {
      // P-Orbital (Dumbbell shape)
      electron.position.x = Math.cos(t + phase) * 1.5;
      electron.position.y = Math.sin(2 * (t + phase)) * 0.5;
      electron.position.z = Math.sin(t + phase) * 1.5;
    } else if (orbitType === "d") {
        // D-Orbital (Two Dumbbells, Four Lobes)
        electron.position.x = Math.cos(t + phase) * 1.5;
        electron.position.y = Math.sin(2 * (t + phase)) * 0.5;
        electron.position.z = Math.sin(t + phase) * 1.5;
        // Second dumbbell (rotated)
        if (i % 2 === 0) {
        electron.position.x = Math.sin(2 * (t + phase)) * 0.5;
        electron.position.y = Math.sin(t + phase) * 1.5;
        electron.position.z = Math.cos(t + phase) * 1.5;
        }
    } else if (orbitType === "f") {
        // F-Orbital (Three Dumbbells, Six Lobes)
        electron.position.x = Math.sin(2 * (t + phase)) * 0.5;
        electron.position.y = Math.cos(t + phase) * 1.5;
        electron.position.z = Math.sin(t + phase) * 1.5;
        // Second dumbbell (rotated differently)
        if (i % 3 === 0) {
        electron.position.x = Math.sin(t + phase) * 1.5;
        electron.position.y = Math.sin(2 * (t + phase)) * 0.5;
        electron.position.z = Math.cos(t + phase) * 1.5;
        }
        // Third dumbbell
        if (i % 3 === 1) {
          electron.position.x = Math.sin(2 * (t + phase)) * 0.5;
          electron.position.y = 0;
          electron.position.z = Math.cos(t + phase) * 1.5;
        }
    }
    
  });
}

// Handle Input for Orbital Selection
document.getElementById("orbitSelectBtn").addEventListener("click", function () {
  let input = document.getElementById("orbitalInput").value.toLowerCase();
  if (input === "s") {
    orbitType = "s";
    electronCount = 2;
  } else if (input === "p") {
    orbitType = "p";
    electronCount = 6;
  } else if (input === "d") {
    orbitType = "d";
    electronCount = 10;
  } else if (input === "f") {
    orbitType = "f";
    electronCount = 14;
  } else {
    alert("Enter a valid orbital type: s, p, d, or f");
    return;
  }
  createElectrons(electronCount); // Update electrons
});

// Animation Loop
function animate(time) {
  updateElectronMotion(time);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
createElectrons(electronCount);
animate(0);

// Speed Control Event Listener
document.getElementById("speedControl").addEventListener("input", function (event) {
  speedFactor = parseFloat(event.target.value);
});
