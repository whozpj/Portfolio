import * as THREE from "three";

let _glow: THREE.CanvasTexture | null = null;

/** Radial gradient texture — additive-blended sprite halo around emissive bodies */
export function getGlowTexture(): THREE.CanvasTexture {
  if (_glow) return _glow;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.45)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  _glow = new THREE.CanvasTexture(canvas);
  return _glow;
}
