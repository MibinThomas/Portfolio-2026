import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

import './WebGLBackground.css';

// The GLSL Shader for the liquid displacement effect
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D tex1;
  uniform sampler2D tex2;
  uniform sampler2D disp;
  uniform float progress;
  uniform float intensity;
  
  uniform vec2 uResolution;
  uniform vec2 uImageRes;
  
  varying vec2 vUv;

  void main() {
    // Calculate background-size: cover UVs safely
    float screenRatio = max(uResolution.x / max(uResolution.y, 0.001), 0.001);
    float imageRatio = max(uImageRes.x / max(uImageRes.y, 0.001), 0.001);
    vec2 ratio = vec2(
      min(screenRatio / imageRatio, 1.0),
      min((1.0/screenRatio) / (1.0/imageRatio), 1.0)
    );
    vec2 coverUv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 dispVec = texture2D(disp, coverUv);
    
    // Distort UVs based on displacement map and progress
    vec2 distortedUv1 = coverUv + dispVec.rg * progress * intensity;
    vec2 distortedUv2 = coverUv - dispVec.rg * (1.0 - progress) * intensity;
    
    vec4 t1 = texture2D(tex1, distortedUv1);
    vec4 t2 = texture2D(tex2, distortedUv2);
    
    // Mix the two distorted textures
    gl_FragColor = mix(t1, t2, progress);
  }
`;

interface WebGLBackgroundProps {
  images: string[];
  activeIndex: number;
}

export function WebGLBackground({ images, activeIndex }: WebGLBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const texturesRef = useRef<THREE.Texture[]>([]);
  const currentIndexRef = useRef(activeIndex);

  // Setup Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Textures
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    const dispTexture = loader.load('https://raw.githubusercontent.com/robin-dela/hover-effect/master/images/heightMap.png');
    dispTexture.wrapS = dispTexture.wrapT = THREE.RepeatWrapping;

    texturesRef.current = images.map(src => {
        const tex = loader.load(src);
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        return tex;
    });

    // Material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        tex1: { value: texturesRef.current[activeIndex] },
        tex2: { value: texturesRef.current[activeIndex] },
        disp: { value: dispTexture },
        progress: { value: 0 },
        intensity: { value: 0.6 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uImageRes: { value: new THREE.Vector2(1920, 1080) }
      },
      transparent: true
    });
    materialRef.current = material;

    // Plane
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation Loop
    let animationFrameId: number;
    const render = () => {
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // Resize Handler
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      renderer.setSize(newWidth, newHeight);
      material.uniforms.uResolution.value.set(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Handle active index changes (Swipe)
  useEffect(() => {
    if (activeIndex !== currentIndexRef.current && materialRef.current && texturesRef.current.length > 0) {
      const mat = materialRef.current;
      const nextIndex = activeIndex;
      
      mat.uniforms.tex1.value = texturesRef.current[currentIndexRef.current];
      mat.uniforms.tex2.value = texturesRef.current[nextIndex];
      mat.uniforms.progress.value = 0;
      
      gsap.to(mat.uniforms.progress, {
        value: 1,
        duration: 1.2,
        ease: 'power2.inOut',
        onComplete: () => {
          mat.uniforms.tex1.value = texturesRef.current[nextIndex];
          mat.uniforms.progress.value = 0;
          currentIndexRef.current = nextIndex;
        }
      });
    }
  }, [activeIndex]);

  return (
    <div className="webgl-background">
      <div ref={mountRef} style={{ width: '100%', height: '100%' }}></div>
      <div className="webgl-overlay"></div>
    </div>
  );
}
