/* =============================================================================
 *  scene.js  —  WebGL hero
 *    · GPU particle nebula (additive, noise-driven drift)
 *    · central distorted "signal" orb with fresnel rim glow
 *    · UnrealBloom for the neon bloom
 *    · mouse parallax + scroll-reactive camera
 *  Skipped entirely when the user prefers reduced motion (see main.js).
 * ========================================================================== */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* ------------------------------------------------------------------ GLSL */
const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
        i.z+vec4(0.0,i1.z,i2.z,1.0))
      + i.y+vec4(0.0,i1.y,i2.y,1.0))
      + i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

/* ------------------------------------------------------------------ init */
export function initWebGL({ canvas }) {
  if (!canvas) return noop();

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch (e) {
    console.warn('[webgl] not available — using CSS fallback', e);
    return noop();
  }

  const isSmall = Math.min(window.innerWidth, window.innerHeight) < 720;
  const DPR = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2);

  renderer.setPixelRatio(DPR);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearAlpha(0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060a, 0.055);

  const CAM_Z = isSmall ? 11.5 : 9; // sit back further on phones -> smaller orb
  const camera = new THREE.PerspectiveCamera(
    52,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, CAM_Z);

  const group = new THREE.Group();
  scene.add(group);

  /* ---------- palette ---------- */
  const COL_A = new THREE.Color('#2f6bff'); // electric blue
  const COL_B = new THREE.Color('#5db9ff'); // sky blue
  const COL_C = new THREE.Color('#8a9bff'); // periwinkle

  /* ---------- particle field ----------
   * Calm, mostly-dim galaxy with a hollow centre so it never sits directly
   * behind the headline. A few rare bright motes carry the neon. */
  const COUNT = isSmall ? 3200 : 7000;
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const scale = new Float32Array(COUNT);
  const seed = new Float32Array(COUNT);
  const col = new Float32Array(COUNT * 3);
  const tmp = new THREE.Color();
  const WHITE = new THREE.Color('#ffffff');
  const rand = Math.random;

  for (let i = 0; i < COUNT; i++) {
    const halo = rand() < 0.22; // sparse far ring vs. main disc
    const r = halo
      ? 9 + rand() * 6
      : 2.8 + Math.pow(rand(), 0.7) * 6.5; // hollow inner core
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const flat = 0.4; // squash Y -> disc
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.cos(phi) * flat + (rand() - 0.5) * 1.2;
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    // heavy-tailed small: most tiny, few large
    scale[i] = Math.pow(rand(), 3.0) * 2.2 + 0.12;
    seed[i] = rand() * 100;

    const h = rand();
    if (h < 0.66) tmp.copy(COL_A);
    else if (h < 0.9) tmp.copy(COL_B);
    else tmp.copy(COL_C);
    tmp.lerp(WHITE, rand() * 0.1);
    // most particles dim; rare bright ones
    const bright = 0.1 + Math.pow(rand(), 2.4) * 1.0;
    col[i * 3] = tmp.r * bright;
    col[i * 3 + 1] = tmp.g * bright;
    col[i * 3 + 2] = tmp.b * bright;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
  pGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  pGeo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));

  const pMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: DPR },
      uSize: { value: isSmall ? 15 : 19 },
      uMouse: { value: new THREE.Vector3() },
      uFade: { value: 1 },
    },
    vertexShader: /* glsl */ `
      ${SIMPLEX}
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uSize;
      uniform vec3 uMouse;
      attribute float aScale;
      attribute float aSeed;
      attribute vec3 aColor;
      varying vec3 vColor;
      varying float vAlpha;
      void main(){
        vColor = aColor;
        vec3 p = position;
        float t = uTime * 0.1 + aSeed;
        vec3 flow = vec3(
          snoise(p * 0.16 + t),
          snoise(p * 0.16 + t + 31.4),
          snoise(p * 0.16 + t + 91.7)
        );
        p += flow * 0.4;

        // gentle swirl around Y
        float ang = uTime * 0.035;
        float s = sin(ang), c = cos(ang);
        p.xz = mat2(c, -s, s, c) * p.xz;

        // subtle push away from the pointer
        vec3 toMouse = p - uMouse;
        float d = length(toMouse);
        p += normalize(toMouse) * smoothstep(3.0, 0.0, d) * 0.45;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -mv.z);
        vAlpha = smoothstep(17.0, 3.0, -mv.z) * 0.55;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uFade;
      varying vec3 vColor;
      varying float vAlpha;
      void main(){
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float glow = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor, glow * glow * vAlpha * uFade);
      }`,
  });

  const points = new THREE.Points(pGeo, pMat);
  group.add(points);

  /* ---------- distorted signal orb ---------- */
  const orbGeo = new THREE.IcosahedronGeometry(isSmall ? 0.98 : 1.15, isSmall ? 28 : 48);
  const orbMat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uFade: { value: 1 },
      uColorA: { value: COL_A.clone() },
      uColorB: { value: COL_B.clone() },
      uColorC: { value: COL_C.clone() },
    },
    vertexShader: /* glsl */ `
      ${SIMPLEX}
      uniform float uTime;
      varying float vNoise;
      varying vec3 vNormalW;
      varying vec3 vViewDir;
      void main(){
        float t = uTime * 0.35;
        float n = snoise(normal * 1.6 + t) * 0.5
                + snoise(normal * 3.4 - t * 0.6) * 0.25;
        vNoise = n;
        vec3 displaced = position + normal * n * 0.42;

        vec4 wp = modelMatrix * vec4(displaced, 1.0);
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vViewDir = normalize(cameraPosition - wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uColorC;
      uniform float uTime;
      uniform float uFade;
      varying float vNoise;
      varying vec3 vNormalW;
      varying vec3 vViewDir;
      void main(){
        float fres = pow(1.0 - clamp(dot(vNormalW, vViewDir), 0.0, 1.0), 2.4);
        vec3 base = mix(uColorB * 0.10, uColorA * 0.35, smoothstep(-0.4, 0.6, vNoise));
        base = mix(base, uColorC * 0.4, smoothstep(0.2, 0.9, vNoise));
        vec3 rim = mix(uColorA, uColorB, 0.5 + 0.5 * sin(uTime * 0.5 + vNoise * 3.0));
        vec3 color = base + rim * fres * 2.4;
        float alpha = clamp(fres * 1.4 + 0.06, 0.0, 1.0) * uFade;
        gl_FragColor = vec4(color, alpha);
      }`,
  });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  group.add(orb);

  // faint wireframe shell around the orb
  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(isSmall ? 1.5 : 1.7, 3),
    new THREE.MeshBasicMaterial({
      color: 0x5db9ff,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    })
  );
  group.add(shell);

  /* ---------- postprocessing ---------- */
  const BLOOM_BASE = isSmall ? 0.28 : 0.4;
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(DPR);
  composer.setSize(window.innerWidth, window.innerHeight);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    BLOOM_BASE, // strength
    0.65, // radius
    0.3 // threshold — only the bright motes bloom
  );
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  /* ---------- interaction state ---------- */
  const pointer = new THREE.Vector2(0, 0);
  const pointerTarget = new THREE.Vector2(0, 0);
  const mouseWorld = new THREE.Vector3();
  let scrollN = 0;

  const onMove = (e) => {
    const x = (e.touches ? e.touches[0].clientX : e.clientX) / window.innerWidth;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) / window.innerHeight;
    pointerTarget.set(x * 2 - 1, -(y * 2 - 1));
  };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: true });

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollN = max > 0 ? window.scrollY / max : 0;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- resize ---------- */
  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
    bloom.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  /* ---------- loop ---------- */
  const clock = new THREE.Clock();
  let running = false;
  let rafId = 0;
  let visible = true;
  let cleared = false; // have we blanked the canvas after the hero?

  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    if (visible && running) tick();
  });

  function tick() {
    if (!running || !visible) return;
    rafId = requestAnimationFrame(tick);

    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    pointer.lerp(pointerTarget, 0.06);
    mouseWorld.set(pointer.x * 5, pointer.y * 3, 0);
    pMat.uniforms.uMouse.value.lerp(mouseWorld, 0.1);

    pMat.uniforms.uTime.value = t;
    orbMat.uniforms.uTime.value = t;

    // The scene belongs to the hero only. Fade it right out over the first
    // ~18% of the page and then stop rendering entirely so it never sits
    // behind another section (the CSS .webgl-fallback gradient stays as bed).
    const fade = THREE.MathUtils.clamp(1 - scrollN * 5.5, 0, 1);

    if (fade <= 0.002) {
      if (!cleared) {
        renderer.setRenderTarget(null);
        renderer.clear();
        cleared = true;
      }
      return;
    }
    cleared = false;

    // camera parallax
    camera.position.x += (pointer.x * 1.1 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 0.7 - camera.position.y) * 0.04;
    camera.position.z = CAM_Z + scrollN * 6;
    camera.lookAt(0, scrollN * -2, 0);

    // group + orb motion
    group.rotation.y += dt * 0.05;
    orb.rotation.y -= dt * 0.12;
    orb.rotation.z += dt * 0.04;
    orb.scale.setScalar(1 + Math.sin(t * 0.8) * 0.03);
    shell.rotation.y -= dt * 0.03;
    shell.rotation.x += dt * 0.02;

    pMat.uniforms.uFade.value = fade;
    orbMat.uniforms.uFade.value = fade * fade;
    shell.material.opacity = 0.07 * fade;
    bloom.strength = BLOOM_BASE * fade;

    composer.render();
  }

  return {
    start() {
      if (running) return;
      running = true;
      clock.start();
      tick();
    },
    stop() {
      running = false;
      cancelAnimationFrame(rafId);
    },
    dispose() {
      this.stop();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      pGeo.dispose();
      pMat.dispose();
      orbGeo.dispose();
      orbMat.dispose();
      composer.dispose();
      renderer.dispose();
    },
  };
}

function noop() {
  return { start() {}, stop() {}, dispose() {} };
}
