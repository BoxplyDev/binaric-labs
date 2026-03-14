'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

// ─── Singularity (black hole core) ───────────────────────────────────────────
function Singularity() {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      void main() {
        vec2 center = vUv - 0.5;
        float dist = length(center);
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        // Pure black core with subtle edge glow
        float edge = smoothstep(0.38, 0.5, dist);
        vec3 color = mix(vec3(0.0), vec3(0.04, 0.04, 0.05), edge);
        gl_FragColor = vec4(color, alpha * (1.0 - edge * 0.4));
      }
    `,
    transparent: true,
    depthWrite: false,
  }), []);

  useFrame(({ clock }) => {
    material.uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[2.2, 2.2]} />
    </mesh>
  );
}

// ─── Accretion Disk ───────────────────────────────────────────────────────────
function AccretionDisk() {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1,0)), f.x),
          mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
          f.y
        );
      }

      void main() {
        vec2 uv = vUv - 0.5;
        float angle = atan(uv.y, uv.x);
        float radius = length(uv);

        // Ring shape
        float innerR = 0.18;
        float outerR = 0.5;
        float ring = smoothstep(innerR, innerR + 0.04, radius) *
                     (1.0 - smoothstep(outerR - 0.06, outerR, radius));

        // Swirling noise
        float swirl = angle + radius * 8.0 - time * 1.2;
        float n = noise(vec2(swirl * 0.8, radius * 6.0 + time * 0.4));
        n = n * 0.6 + noise(vec2(swirl * 2.0, radius * 12.0 - time * 0.7)) * 0.4;

        // Doppler-like brightness: one side hotter
        float doppler = 0.5 + 0.5 * cos(angle - time * 0.5);

        // Color: deep orange-white core fading to dim red
        float heat = (1.0 - (radius - innerR) / (outerR - innerR)) * doppler;
        vec3 hotColor  = vec3(1.0, 0.85, 0.55);   // bright warm white-orange
        vec3 midColor  = vec3(0.7, 0.25, 0.04);   // orange
        vec3 coolColor = vec3(0.12, 0.03, 0.01);  // near-black red

        vec3 col = mix(coolColor, midColor, smoothstep(0.0, 0.5, heat));
        col = mix(col, hotColor, smoothstep(0.5, 1.0, heat) * n);

        float alpha = ring * (0.55 + n * 0.45) * (0.7 + doppler * 0.3);
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame(({ clock }) => {
    material.uniforms.time.value = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI * 0.18, 0, 0]} material={material}>
      <planeGeometry args={[6, 6, 1, 1]} />
    </mesh>
  );
}

// ─── Gravitational Lensing Rings ──────────────────────────────────────────────
function LensingRings() {
  const rings = useMemo(() => [
    { radius: 1.35, width: 0.012, speed: 0.3,  opacity: 0.35 },
    { radius: 1.7,  width: 0.008, speed: -0.2, opacity: 0.2  },
    { radius: 2.2,  width: 0.005, speed: 0.15, opacity: 0.12 },
    { radius: 2.8,  width: 0.003, speed: -0.1, opacity: 0.07 },
  ], []);

  const refs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    refs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.rotation.z = clock.getElapsedTime() * rings[i].speed;
      }
    });
  });

  return (
    <>
      {rings.map((ring, i) => (
        <mesh
          key={i}
          ref={el => { if (el) refs.current[i] = el; }}
          rotation={[Math.PI * 0.15, 0, 0]}
        >
          <ringGeometry args={[ring.radius, ring.radius + ring.width, 128]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={ring.opacity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

// ─── Orbital Particle Stream ──────────────────────────────────────────────────
function OrbitalParticles() {
  const count = 2200;

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const sizes     = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute in a thin disk around the black hole
      const angle  = Math.random() * Math.PI * 2;
      const radius = 1.1 + Math.random() * 3.5;
      const tilt   = (Math.random() - 0.5) * 0.25 * (1 / radius); // thinner at edge

      positions[i * 3]     = Math.cos(angle) * radius;
      positions[i * 3 + 1] = tilt;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Color: hot near core, cool at edge
      const heat = Math.max(0, 1 - (radius - 1.1) / 3.0);
      colors[i * 3]     = 0.6 + heat * 0.4;
      colors[i * 3 + 1] = 0.2 + heat * 0.4;
      colors[i * 3 + 2] = 0.05 + heat * 0.1;

      sizes[i] = 0.5 + Math.random() * 1.5 * heat;
    }
    return { positions, colors, sizes };
  }, []);

  const geomRef = useRef<THREE.BufferGeometry>(null);
  const matRef  = useRef<THREE.PointsMaterial>(null);

  useFrame(({ clock }) => {
    if (!geomRef.current) return;
    const t = clock.getElapsedTime();
    const pos = geomRef.current.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const x = pos[i * 3];
      const z = pos[i * 3 + 2];
      const radius = Math.sqrt(x * x + z * z);
      // Keplerian: closer particles orbit faster
      const angularSpeed = 0.15 / Math.sqrt(radius) * 0.5;
      const angle = Math.atan2(z, x) + angularSpeed;

      pos[i * 3]     = Math.cos(angle) * radius;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    geomRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <points rotation={[Math.PI * 0.18, 0, 0]}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]}    />
        <bufferAttribute attach="attributes-size"     args={[sizes, 1]}     />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.012}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Relativistic Jets ────────────────────────────────────────────────────────
function Jets() {
  const count = 300;

  const { positions, opacities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const opacities = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const spread = (1 - t) * 0.08;
      const sign = i < count / 2 ? 1 : -1;
      positions[i * 3]     = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = sign * (0.4 + t * 3.5);
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      opacities[i] = (1 - t) * 0.6;
    }
    return { positions, opacities };
  }, []);

  const geomRef = useRef<THREE.BufferGeometry>(null);

  useFrame(({ clock }) => {
    if (!geomRef.current) return;
    const t = clock.getElapsedTime() * 0.8;
    const pos = geomRef.current.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += 0.012 * (i < count / 2 ? 1 : -1);
      const limit = i < count / 2 ? 4.0 : -4.0;
      const reset = i < count / 2 ? 0.4 : -0.4;
      if (Math.abs(pos[i * 3 + 1]) > Math.abs(limit)) {
        pos[i * 3 + 1] = reset;
      }
    }
    geomRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#aaddff"
        size={0.018}
        transparent
        opacity={0.25}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Camera Drift + Mouse Pull ────────────────────────────────────────────────
function CameraRig() {
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef(new THREE.Vector3(0, 0, 6));

  useMemo(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Slow orbital drift
    const drift = 0.06;
    target.current.x = THREE.MathUtils.lerp(target.current.x, mouse.current.x * 0.8, 0.02);
    target.current.y = THREE.MathUtils.lerp(target.current.y, -mouse.current.y * 0.5, 0.02);
    target.current.z = 6 + Math.sin(t * 0.15) * 0.3;

    camera.position.lerp(target.current, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <CameraRig />
      <Stars radius={400} depth={80} count={6000} factor={3} fade speed={0.4} />
      <OrbitalParticles />
      <AccretionDisk />
      <LensingRings />
      <Singularity />
      <Jets />
    </>
  );
}

export default function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#000000' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
