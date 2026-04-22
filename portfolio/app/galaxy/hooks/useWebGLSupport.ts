"use client";

import { useSyncExternalStore } from "react";

const detect = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    return !!gl;
  } catch {
    return false;
  }
};

let cached: boolean | null = null;

const getSnapshot = (): boolean | null => {
  if (cached === null) cached = detect();
  return cached;
};

const getServerSnapshot = (): null => null;

const subscribe = (cb: () => void) => {
  // WebGL support is static — no subscription needed
  void cb;
  return () => {};
};

export function useWebGLSupport(): boolean | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
