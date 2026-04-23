export const GALAXY_END = 0.08;

// Each system "dwell" gets 4x the scroll weight of inter-system travel
const DWELL_W = 4;
const TRAVEL_W = 1;

interface Seg {
  start: number;
  end: number;
  isDwell: boolean;
  sysIdx: number;
}

const { segs, total } = (() => {
  const N = 5;
  const s: Seg[] = [];
  let c = 0;
  for (let i = 0; i < N; i++) {
    s.push({ start: c, end: c + DWELL_W, isDwell: true, sysIdx: i });
    c += DWELL_W;
    if (i < N - 1) {
      s.push({ start: c, end: c + TRAVEL_W, isDwell: false, sysIdx: i });
      c += TRAVEL_W;
    }
  }
  return { segs: s, total: c };
})();

export const SCROLL_SEGS: readonly Seg[] = segs;
export const SCROLL_TOTAL: number = total;

/** Which system index the camera is closest to at progress p (0..1) */
export function systemIndexAt(p: number): number {
  if (p <= GALAXY_END) return 0;
  const w = ((p - GALAXY_END) / (1 - GALAXY_END)) * total;
  for (const s of segs) {
    if (w <= s.end) return s.sysIdx;
  }
  return 4;
}

/** Scroll progress (0..1) targeting the center of the dwell zone for system at index i */
export function progressForSystem(i: number): number {
  let c = 0;
  for (let k = 0; k < i; k++) c += DWELL_W + TRAVEL_W;
  const center = c + DWELL_W / 2;
  return GALAXY_END + (center / total) * (1 - GALAXY_END);
}
