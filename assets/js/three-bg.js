/* Three.js particle-network hero background.
   Reacts to mouse movement, throttled on mobile for performance. */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  const targetFPS = isMobile ? 30 : 60;
  const frameInterval = 1000 / targetFPS;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = isMobile ? 60 : 46;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const PARTICLE_COUNT = isMobile ? 90 : 220;
  const RANGE = 60;

  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * RANGE * 2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * RANGE;
    positions[i * 3 + 2] = (Math.random() - 0.5) * RANGE;
    velocities.push({
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02,
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x22d3ee,
    size: isMobile ? 1.4 : 1.1,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Connection lines between nearby particles
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.18 });
  const lineGeometry = new THREE.BufferGeometry();
  const maxLines = isMobile ? 60 : 200;
  const linePositions = new Float32Array(maxLines * 2 * 3);
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  const LINK_DIST = isMobile ? 12 : 14;

  function updateLines() {
    let idx = 0;
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT && idx < maxLines; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT && idx < maxLines; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < LINK_DIST) {
          linePositions[idx * 6] = pos[i * 3];
          linePositions[idx * 6 + 1] = pos[i * 3 + 1];
          linePositions[idx * 6 + 2] = pos[i * 3 + 2];
          linePositions[idx * 6 + 3] = pos[j * 3];
          linePositions[idx * 6 + 4] = pos[j * 3 + 1];
          linePositions[idx * 6 + 5] = pos[j * 3 + 2];
          idx++;
        }
      }
    }
    // zero out unused segments
    for (; idx < maxLines; idx++) {
      linePositions[idx * 6] = 0; linePositions[idx * 6 + 1] = 0; linePositions[idx * 6 + 2] = 0;
      linePositions[idx * 6 + 3] = 0; linePositions[idx * 6 + 4] = 0; linePositions[idx * 6 + 5] = 0;
    }
    lineGeometry.attributes.position.needsUpdate = true;
  }

  let mouseX = 0, mouseY = 0, targetRotX = 0, targetRotY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let lastFrame = 0;
  let visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  function animate(now) {
    requestAnimationFrame(animate);
    if (!visible) return;
    if (now - lastFrame < frameInterval) return;
    lastFrame = now;

    const pos = geometry.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;
      if (Math.abs(pos[i * 3]) > RANGE) velocities[i].x *= -1;
      if (Math.abs(pos[i * 3 + 1]) > RANGE / 1.5) velocities[i].y *= -1;
      if (Math.abs(pos[i * 3 + 2]) > RANGE) velocities[i].z *= -1;
    }
    geometry.attributes.position.needsUpdate = true;
    updateLines();

    if (!prefersReducedMotion) {
      targetRotX += (mouseY * 0.15 - targetRotX) * 0.03;
      targetRotY += (mouseX * 0.15 - targetRotY) * 0.03;
      points.rotation.x = targetRotX;
      points.rotation.y = targetRotY;
      lines.rotation.x = targetRotX;
      lines.rotation.y = targetRotY;
    }
    points.rotation.y += 0.0006;
    lines.rotation.y += 0.0006;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
})();
