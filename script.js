// Initialize Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.5);
document.getElementById("three-container").appendChild(renderer.domElement);

// Add Lighting
const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x444444)); // Soft ambient light

// Create Quantum Nucleus (Glowing Sphere)
const nucleusGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const nucleusMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xFFFFFF, 
  emissive: 0xFFFFFF, 
  emissiveIntensity: 1.0 
});
const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
scene.add(nucleus);
// Function to Determine Electron Position Based on Orbital Type
function getOrbitalPosition(n, l, m, radius) {
  let x = 0, y = 0, z = 0;

  if (l === 0) {
    // s-orbital (Spherical, Random Spread)
    let theta = Math.random() * Math.PI * 2;
    let phi = Math.acos(2 * Math.random() - 1);
    x = radius * Math.sin(phi) * Math.cos(theta);
    y = radius * Math.sin(phi) * Math.sin(theta);
    z = radius * Math.cos(phi);
  } 
  else if (l === 1) {
    // p-orbitals (Dumbbell Along Axes)
    if (m === -1) x = radius;
    if (m === 0) y = radius;
    if (m === 1) z = radius;
  } 
  else if (l === 2) {
    // d-orbitals (Diagonals & Planes)
    if (m === -2) { x = radius; y = radius; }
    if (m === -1) { x = radius; z = radius; }
    if (m === 0) { y = radius; z = radius; }
    if (m === 1) { x = -radius; y = radius; }
    if (m === 2) { x = -radius; z = radius; }
  } 
  else if (l === 3) {
    // f-orbitals (More Complex Spread)
    let factor = 1.5;
    if (m === -3) { x = factor * radius; y = factor * radius; z = 0; }
    if (m === -2) { x = factor * radius; z = factor * radius; y = 0; }
    if (m === -1) { y = factor * radius; z = factor * radius; x = 0; }
    if (m === 0) { x = -factor * radius; y = factor * radius; z = 0; }
    if (m === 1) { x = -factor * radius; z = factor * radius; y = 0; }
    if (m === 2) { y = -factor * radius; z = factor * radius; x = 0; }
    if (m === 3) { x = -factor * radius; y = -factor * radius; z = 0; }
  }

  return { x, y, z };
}

// Function to Create Electron with Correct Orbital Orientation
function createElectron(radius, color, axis, quantumNumbers) {
  let geometry = new THREE.SphereGeometry(0.1, 16, 16);
  let material = new THREE.MeshStandardMaterial({
    color: color,
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0.1,
    roughness: 0.4,
    metalness: 0.2,
  });

  let mesh = new THREE.Mesh(geometry, material);

  // Electron positioning logic
  let x = 0, y = 0, z = 0;

  if (quantumNumbers.l === 0) {
    // s-orbital (Spherical, Random Spread)
    let theta = Math.random() * Math.PI * 2;
    let phi = Math.acos(2 * Math.random() - 1);
    x = radius * Math.sin(phi) * Math.cos(theta);
    y = radius * Math.sin(phi) * Math.sin(theta);
    z = radius * Math.cos(phi);
  } 
  else if (quantumNumbers.l === 1) {
    // p-orbitals (Dumbbell Along Axes)
    if (quantumNumbers.m === -1) x = radius;
    if (quantumNumbers.m === 0) y = radius;
    if (quantumNumbers.m === 1) z = radius;
  } 
  else if (quantumNumbers.l === 2) {
    // d-orbitals (Diagonal Planes)
    if (quantumNumbers.m === -2) { x = radius; y = radius; }
    if (quantumNumbers.m === -1) { x = radius; z = radius; }
    if (quantumNumbers.m === 0) { y = radius; z = radius; }
    if (quantumNumbers.m === 1) { x = -radius; y = radius; }
    if (quantumNumbers.m === 2) { x = -radius; z = radius; }
  }

  mesh.position.set(x, y, z);
  scene.add(mesh);

  return {
    mesh: mesh,
    radius: radius,
    axis: axis,
    quantumNumbers: quantumNumbers,
    angle: Math.random() * Math.PI * 2, // Keep random initial angle
  };
}


// Electron Storage
let electrons = [];

function generateElectrons() {
  const atomicNumber = parseInt(document.getElementById("atomicNumber").value);
  const ionCharge = parseInt(document.getElementById("ionCharge").value) || 0;
  const electronCount = atomicNumber - ionCharge;

  if (electronCount <= 0) {
    document.getElementById("output").innerHTML = `<p>Error: Invalid ionization</p>`;
    return;
  }

  // Clear previous electrons
  electrons.forEach((e) => scene.remove(e.mesh));
  electrons = [];

  let output = `<h3>Quantum Numbers:</h3>`;
  let assignedElectrons = 0;

  // Extended Aufbau Order Shells
  const shells = [
    { n: 1, lMax: 0, capacity: 2 },
    { n: 2, lMax: 1, capacity: 8 },
    { n: 3, lMax: 1, capacity: 8 },
    { n: 4, lMax: 2, capacity: 18 },
    { n: 5, lMax: 2, capacity: 18 },
    { n: 6, lMax: 3, capacity: 32 },
    { n: 7, lMax: 3, capacity: 32 },
    { n: 8, lMax: 2, capacity: 18 },
  ];

  let orbitalIndex = 0;
  const baseRadius = 0.4;

  for (let shell of shells) {
    for (let l = 0; l <= shell.lMax; l++) {
      for (let m = -l; m <= l; m++) {
        for (let s of [0.5, -0.5]) {
          if (assignedElectrons >= electronCount) break;

          let radius = baseRadius * (Math.floor(orbitalIndex / 3) + 1);
          let axis = ["xy", "yz", "xz"][orbitalIndex % 3];
          let angle = Math.random() * Math.PI * 2;

          let electronColor = s === 0.5 ? 0x00ff00 : 0xff0000;
          let electron = createElectron(radius, electronColor, axis, {
            n: shell.n,
            l: l,
            m: m,
            s: s,
          });
          electron.angle = angle;
          electrons.push(electron);

          output += `<p class="quantum-number" data-index="${assignedElectrons}">e${assignedElectrons + 1}: n=${shell.n}, l=${l}, m=${m}, s=${s}</p>`;
          assignedElectrons++;
          orbitalIndex++;
        }
      }
    }

  }
   // Electron Configuration (Aufbau Rule)
   let configArray = [];
   let remainingElectrons = electronCount;
   for (let shell of shells) {
     for (let l = 0; l <= shell.lMax; l++) {
       let orbitalLabel = `${shell.n}${["s", "p", "d", "f"][l]}`;
       let maxElectronsHere = 2 * (2 * l + 1);
       let electronsInOrbital = Math.min(remainingElectrons, maxElectronsHere);
       if (electronsInOrbital > 0) {
         configArray.push(`${orbitalLabel}${electronsInOrbital}`);
         remainingElectrons -= electronsInOrbital;
       }
     }
   }
   config = configArray.join(" ");
 // Display Data
document.getElementById("quantumNumbers").innerHTML = output;
document.getElementById("configDisplay").innerHTML = `<h3>Electron Configuration:</h3><p>${config.trim()}</p>`;

// Attach click events to quantum numbers after rendering
attachQuantumNumberClickEvents();


  // Attach click events to quantum numbers after rendering
  attachQuantumNumberClickEvents();
}

// Attach Click Events for Quantum Numbers
function attachQuantumNumberClickEvents() {
  document.querySelectorAll(".quantum-number").forEach((element) => {
    element.addEventListener("click", function () {
      let index = parseInt(this.dataset.index);

      electrons.forEach((e, i) => {
        if (i === index) {
          // Make the selected electron BRIGHT & VISIBLE
          e.mesh.material.emissive.set(0xffff00); // Bright yellow
          e.mesh.material.emissiveIntensity = 5.0; // Very strong glow
          e.mesh.material.opacity = 1; // Fully visible
          e.mesh.material.transparent = false; // No transparency
        } else {
          // Make other electrons NEARLY INVISIBLE
          e.mesh.material.emissive.set(0x000000); // No glow
          e.mesh.material.emissiveIntensity = 0.01; // Almost no light
          e.mesh.material.opacity = 0.05; // Almost fully transparent
          e.mesh.material.transparent = true; // Enable transparency
        }
      });

      // Highlight selected quantum number in UI
      document.querySelectorAll(".quantum-number").forEach((el) => el.classList.remove("selected"));
      this.classList.add("selected");
    });
  });
}




// Position Camera
camera.position.z = 15;

// Animate Electrons to Move in 3D Space
// Animate Electrons to Move in 3D Space
// Animate Electrons to Move in 3D Space in Orbits
// Animate Electrons to Move in 3D Orbital Patterns
function animate() {
  requestAnimationFrame(animate);

  electrons.forEach((e) => {
    let speed = 0.02; // Adjust speed for all orbits

    if (e.quantumNumbers.l === 0) {
      // s-orbital (spherical, now properly revolving around the nucleus)
      let orbitRadius = e.radius; 
      e.mesh.position.x = Math.cos(e.angle) * orbitRadius;
      e.mesh.position.y = Math.sin(e.angle) * orbitRadius;
      e.mesh.position.z = Math.cos(e.angle * 1.5) * orbitRadius; 
    } 
    else if (e.quantumNumbers.l === 1) {
      // p-orbitals (dumbbell along axes)
      if (e.axis === "xy") {
        e.mesh.position.x = Math.cos(e.angle) * e.radius;
        e.mesh.position.y = Math.sin(e.angle) * e.radius;
      } else if (e.axis === "yz") {
        e.mesh.position.y = Math.cos(e.angle) * e.radius;
        e.mesh.position.z = Math.sin(e.angle) * e.radius;
      } else if (e.axis === "xz") {
        e.mesh.position.x = Math.cos(e.angle) * e.radius;
        e.mesh.position.z = Math.sin(e.angle) * e.radius;
      }
    } 
    else if (e.quantumNumbers.l === 2) {
      // d-orbitals (double dumbbell)
      if (e.quantumNumbers.m % 2 === 0) {
        e.mesh.position.x = Math.cos(e.angle) * e.radius * 1.5;
        e.mesh.position.y = Math.sin(2 * e.angle) * e.radius * 0.5;
        e.mesh.position.z = Math.sin(e.angle) * e.radius * 1.5;
      } else {
        e.mesh.position.x = Math.sin(2 * e.angle) * e.radius * 0.5;
        e.mesh.position.y = Math.sin(e.angle) * e.radius * 1.5;
        e.mesh.position.z = Math.cos(e.angle) * e.radius * 1.5;
      }
    } 
    else if (e.quantumNumbers.l === 3) {
      // f-orbitals (chaotic 3D movement)
      let phase = e.quantumNumbers.m * 0.5;
      e.mesh.position.x = Math.sin(e.angle + phase) * e.radius * 1.5;
      e.mesh.position.y = Math.cos(2 * (e.angle + phase)) * e.radius;
      e.mesh.position.z = Math.sin(3 * (e.angle + phase)) * e.radius * 1.2;
    }

    e.angle += speed; // Increase angle for smooth motion
  });

  renderer.render(scene, camera);
}

animate();



// Attach Event Listener to Button
document.getElementById("calculateBtn").addEventListener("click", generateElectrons);
// Function to open quantum number info page
function openQuantumInfo(type) {
  window.open(type + ".html", "_blank");
}
