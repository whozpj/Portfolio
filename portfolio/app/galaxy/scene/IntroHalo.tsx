"use client";

import { Html } from "@react-three/drei";

interface Props {
  center: [number, number, number];
  bio?: string;
}

export default function IntroHalo({ center, bio }: Props) {
  return (
    <group position={center}>
      {/* Name + title above the star */}
      <Html
        center
        distanceFactor={18}
        position={[0, 2.4, 0]}
        style={{ pointerEvents: "none", userSelect: "none", textAlign: "center", whiteSpace: "nowrap" }}
      >
        <div style={{ color: "rgba(255,255,255,0.95)", fontFamily: "ui-monospace, monospace", fontSize: "18px", letterSpacing: "0.45em", textTransform: "uppercase", fontWeight: 300 }}>
          Prithvi Raj
        </div>
        <div style={{ color: "rgba(255,255,255,0.55)", fontFamily: "ui-monospace, monospace", fontSize: "9px", letterSpacing: "0.3em", marginTop: "10px", textTransform: "uppercase" }}>
          Software Engineer · Applied AI
        </div>
      </Html>

      {/* Bio card below star */}
      {bio ? (
        <Html
          center
          distanceFactor={18}
          position={[0, -2.6, 0]}
          style={{ pointerEvents: "none", userSelect: "none", textAlign: "center", width: "320px" }}
        >
          <div style={{ color: "rgba(255,255,255,0.55)", fontFamily: "ui-monospace, monospace", fontSize: "9px", letterSpacing: "0.12em", lineHeight: "2.2", textTransform: "uppercase" }}>
            {bio}
          </div>
        </Html>
      ) : null}

      {/* Floating ambient tags */}
      <Html center distanceFactor={18} position={[4.2, 0.8, 0]} style={{ pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontFamily: "ui-monospace, monospace", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          CS · UVA
        </div>
      </Html>

      <Html center distanceFactor={18} position={[-4.4, 0.4, 0.5]} style={{ pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
        <div style={{ color: "rgba(255,255,255,0.45)", fontFamily: "ui-monospace, monospace", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          Open to Internships · 2026
        </div>
      </Html>

      <Html center distanceFactor={18} position={[3.5, -1.2, -0.8]} style={{ pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontFamily: "ui-monospace, monospace", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          ManTech · Candlefish
        </div>
      </Html>

      <Html center distanceFactor={18} position={[-3.2, -0.8, 1]} style={{ pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
        <div style={{ color: "rgba(255,255,255,0.38)", fontFamily: "ui-monospace, monospace", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          Python · TypeScript · AI
        </div>
      </Html>
    </group>
  );
}
