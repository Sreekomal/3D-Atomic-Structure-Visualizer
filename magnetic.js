// Ensure script runs after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Get Elements
    const lInput = document.getElementById("lInput");
    const mlInput = document.getElementById("mlInput");
    const generateBtn = document.getElementById("generateBtn");
    const mlValuesDisplay = document.getElementById("mlValues");

    // Three.js Setup
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
    const nucleusMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff4500, emissiveIntensity: 0.8 });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    scene.add(nucleus);

    // Electron Group
    const electronGroup = new THREE.Group();
    scene.add(electronGroup);

    // Camera Position for Bird’s-Eye View
    camera.position.set(2, 3, 3); // Move camera above and slightly forward
    camera.lookAt(0, 0, 0); // Ensure it looks at the nucleus


    // Speed of Electron Movement
    let speedFactor = 0.02;

    // Function to Update mₗ Values Based on l
    function updateMLValues() {
        mlInput.innerHTML = ""; // Clear previous options
        let l = parseInt(lInput.value);
        let mlValues = [];

        for (let ml = -l; ml <= l; ml++) {
            mlValues.push(ml);
            let option = document.createElement("option");
            option.value = ml;
            option.textContent = `mₗ = ${ml}`;
            mlInput.appendChild(option);
        }

        mlValuesDisplay.textContent = `mₗ Values: ${mlValues.join(", ")}`;
    }

    // Function to Create Electrons Based on mₗ
    function createOrbitals(l, ml) {
        // Clear previous electrons
        while (electronGroup.children.length > 0) {
            electronGroup.remove(electronGroup.children[0]);
        }

        const electronGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const electronMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const electron = new THREE.Mesh(electronGeometry, electronMaterial);
        
        // Store properties
        electron.orbitalPhase = 0;
        electron.magneticNumber = ml;

        electronGroup.add(electron);
    }

    // Function to Update Electron Motion
    function updateElectronMotion(time) {
        let t = time * speedFactor;
        let l = parseInt(lInput.value);
        let ml = parseInt(mlInput.value);
    
        electronGroup.children.forEach((electron) => {
            let phase = electron.orbitalPhase;
    
            if (l === 0) {
                // s-Orbital (Spherical)
                electron.position.x = Math.cos(t + phase) * 1;
                electron.position.y = Math.sin(t + phase) * 1;
                electron.position.z = Math.cos(t + phase) * 1;
            } else if (l === 1) {
                // p-Orbitals (Dumbbell motion with oscillation)
                if (ml === -1) {
                    // ✅ p_x Orbital (Dumbbell along X-axis)
                    electron.position.x = Math.cos(t + phase) * 1.5;
                    electron.position.y = Math.sin(2 * (t + phase)) * 0.5;
                    electron.position.z = 0;
                } else if (ml === 0) {
                    // ✅ p_z Orbital (Dumbbell along Z-axis) — FIXED!
                    electron.position.x = 0;
                    electron.position.y = Math.sin(2 * (t + phase)) * 0.5; // Small Y oscillation
                    electron.position.z = Math.cos(t + phase) * 1.5;
                } else if (ml === 1) {
                    // ✅ p_y Orbital (Dumbbell along Y-axis) — FIXED!
                    electron.position.x = Math.sin(2 * (t + phase)) * 0.5;
                    electron.position.y = 0;
                    electron.position.z = Math.cos(t + phase) * 1.5;
                }
            }
        });
    }
    

    // Event Listener for l Selection
    lInput.addEventListener("change", updateMLValues);

    // Event Listener for Generation
    generateBtn.addEventListener("click", () => {
        let l = parseInt(lInput.value);
        let ml = parseInt(mlInput.value);
        createOrbitals(l, ml);
    });

    // Animation Loop
    function animate(time) {
        updateElectronMotion(time);
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    updateMLValues(); // Initialize mₗ options
    createOrbitals(0, 0); // Default to s-orbital

    animate(0);
});
