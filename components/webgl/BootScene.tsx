'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Bounds, Center } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette, Glitch } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { CanvasTexture, MeshBasicMaterial, Mesh, Vector2, SRGBColorSpace } from 'three';

export type BootState = {
  phase: 'boot' | 'power' | 'log' | 'enter' | 'exit';
  count: number;
  visibleLines: number;
};

export const BOOT_LINES: string[] = [
  'AR/OS 1.0',
  '> cpu ......... ok',
  '> mem ......... ok',
  '> disk ........ ok',
  '> net ......... ok',
  'USER  A. RADIVOJEVIC',
  'READY',
];

// ---- The CRT screen, drawn to a 2D canvas and mapped onto the screen mesh ----

const CW = 640;
const CH = 480;

function drawScreen(ctx: CanvasRenderingContext2D, boot: BootState) {
  // CRT off-black with a hint of warmth.
  ctx.fillStyle = '#070502';
  ctx.fillRect(0, 0, CW, CH);

  const amber = '#F0BC57';

  if (boot.phase === 'power') {
    // Power-on: a bright band across the tube.
    ctx.fillStyle = 'rgba(240,188,87,0.85)';
    ctx.fillRect(0, CH / 2 - 46, CW, 92);
  } else if (boot.phase === 'log' || boot.phase === 'enter' || boot.phase === 'exit') {
    ctx.fillStyle = amber;
    ctx.font = '28px "JetBrains Mono", ui-monospace, monospace';
    ctx.textBaseline = 'top';
    const padX = 54;
    let y = 84;
    const lines = BOOT_LINES.slice(0, boot.visibleLines);
    lines.forEach((l, i) => {
      ctx.fillText(l, padX, y);
      if (i === lines.length - 1 && l === 'READY') {
        const w = ctx.measureText('READY ').width;
        ctx.fillRect(padX + w, y + 2, 16, 26);
      }
      y += 40;
    });
  }

  // Scanlines.
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  for (let y = 0; y < CH; y += 3) ctx.fillRect(0, y, CW, 1);

  // Screen vignette.
  const g = ctx.createRadialGradient(CW / 2, CH / 2, CH * 0.15, CW / 2, CH / 2, CH * 0.78);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CW, CH);
}

function AppleII({ boot }: { boot: BootState }) {
  const { scene: cachedScene } = useGLTF('/models/appleii.glb');

  // `useGLTF` is `useLoader` under the hood, so this scene is a single object
  // cached globally by URL and shared by every mount. We reassign the screen
  // mesh's material below, which would mutate that shared model: on a remount
  // (switching locale re-mounts the layout) the model still carried the
  // PREVIOUS boot's material, whose canvas held the finished log — so the new
  // boot painted a screen full of "READY" text before its own effects ran.
  // Cloning gives each mount its own meshes to reassign. Geometries and
  // materials are shared by reference, which is what we want — we only swap
  // the reference on our copy, never mutate the cached original.
  const scene = useMemo(() => cachedScene.clone(true), [cachedScene]);

  const { canvas, ctx, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = CW;
    c.height = CH;
    const context = c.getContext('2d')!;
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    // This screen mesh flips V; flipY corrects it (text upright, not mirrored).
    tex.flipY = true;
    return { canvas: c, ctx: context, texture: tex };
  }, []);

  const screenMat = useRef<MeshBasicMaterial | null>(null);
  const enterT = useRef(0);

  // Swap the screen mesh's material for our glowing canvas.
  useEffect(() => {
    const mat = new MeshBasicMaterial({ map: texture, toneMapped: false });
    screenMat.current = mat;
    scene.traverse((o) => {
      const m = o as Mesh;
      const name = (m.material && !Array.isArray(m.material) && m.material.name) || '';
      if (m.isMesh && (name === 'monitor_screen_mat' || o.name.toLowerCase().includes('screen'))) {
        m.material = mat;
      }
    });
  }, [scene, texture]);

  // Redraw whenever the boot state changes.
  useEffect(() => {
    drawScreen(ctx, boot);
    texture.needsUpdate = true;
  }, [ctx, texture, boot]);

  useFrame((_, delta) => {
    const inEnter = boot.phase === 'enter';
    if (inEnter) enterT.current = Math.min(enterT.current + delta / 1.1, 1);
    const e = enterT.current;

    // Screen: subtle flicker while booting; a gentle flare as it glitches out.
    // The machine stays put — no zoom — the glitch alone carries the "enter".
    if (screenMat.current) {
      if (inEnter) {
        const b = 1 + e * e * 1.4;
        screenMat.current.color.setRGB(b, b, b);
      } else {
        const lit = boot.phase === 'power' || boot.phase === 'log';
        const b = lit ? 0.92 + Math.random() * 0.08 : 1;
        screenMat.current.color.setRGB(b, b, b);
      }
    }
  });

  return (
    <Bounds fit clip observe margin={1.1}>
      <Center>
        <primitive object={scene} />
      </Center>
    </Bounds>
  );
}

export function BootScene({ boot }: { boot: BootState }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 8], fov: 30 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={['#080604']} />

      <ambientLight intensity={0.07} />
      <directionalLight position={[6, 5, 5]} intensity={1.5} color="#ffdca8" />
      <directionalLight position={[-6, 2, -3]} intensity={0.55} color="#5f74d6" />
      <directionalLight position={[0, 1, 5]} intensity={0.2} color="#ffe6bd" />

      <Suspense fallback={null}>
        <AppleII boot={boot} />
      </Suspense>

      <EffectComposer>
        <Bloom intensity={0.7} luminanceThreshold={0.6} luminanceSmoothing={0.25} mipmapBlur />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(0.001, 0.001)}
          radialModulation={false}
          modulationOffset={0}
        />
        <Noise opacity={0.04} />
        <Vignette offset={0.2} darkness={0.95} />
        <Glitch
          active={boot.phase === 'enter'}
          mode={GlitchMode.CONSTANT_MILD}
          delay={new Vector2(0, 0)}
          duration={new Vector2(0.3, 0.6)}
          strength={new Vector2(0.2, 0.55)}
        />
      </EffectComposer>
    </Canvas>
  );
}

useGLTF.preload('/models/appleii.glb');
